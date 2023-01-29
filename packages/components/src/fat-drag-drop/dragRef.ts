import { ref } from '@wakeadmin/demi';
import { merge, Noop, throttle } from '@wakeadmin/utils';

import { MouseEventButton } from '../enum';
import {
  clamp,
  cloneElement,
  extendStyles,
  GetParameterInSet,
  Portal,
  toArray,
  type IPortal,
  type ClientRect,
} from '../utils';

import { type DropListRef } from './dropListRef';
import {
  activeEventListenerOptions,
  DragDropRegistry,
  isTouchEvent,
  passiveEventListenerOptions,
  ViewPortRegister,
} from './event';
import { DragPositionTrack } from './positionTrack';
import { getTransform, matchElementSize, toggleElementDragStyle, toggleElementDragVisibility } from './style';
import type { Delta, DragConfig, DragRefEvents, Point } from './type';

const MouseEventIgnoreTime = 664;

const DragImportantProperties = new Set(['position'] as const);

const defaultDragConfig = {
  dragStartDelay: 0,
  zIndex: 5312,
  dragStartThreshold: 6,
  pointerDirectionChangeThreshold: 6,
} satisfies DragConfig;

export class DragRef {
  private readonly dragConfig: DragConfig;

  private _disabled: boolean = false;

  private previewInstance?: IPortal<{}>;
  private previewElement: HTMLElement | null = null;
  private previewClientRect?: ClientRect;
  private placeholderElement: HTMLElement | null = null;
  private placeholderInstance?: IPortal<{}>;

  private dragBoundaryElement?: HTMLElement;
  private dragBoundaryClientRect?: ClientRect;
  private viewportDispose = Noop;

  private anchor?: Comment;

  /**
   * 触发元素
   */
  private handlerElement?: HTMLElement;

  /**
   * 是否监听过事件
   */
  private isListening: boolean = false;

  /**
   * 全局拖拽事件
   */
  private registry = DragDropRegistry;

  private dragPositionTrack = new DragPositionTrack();

  /**
   * 缓存元素是否位于拖拽样式
   */
  private elementEnable: boolean = null as any;

  private parentDragRef?: DragRef;

  private lastTouchEventTime: number = 0;

  private hasStartedDragging = ref(false);
  private hasMoved: boolean = true;

  private initialTransform?: string;
  private initialRootElementClientRect?: ClientRect;

  private pickUpPositionOnPage: Point = {
    x: 0,
    y: 0,
  };
  private pickupPositionOnElement: Point = { x: 0, y: 0 };

  private lastPointPosition: Point | null = null;
  private pointerDirectionDelta: Delta = { x: 0, y: 0 };
  private pointerPositionAtLastDirectionChange: Point = { x: 0, y: 0 };

  private dragStartTime: number = 0;
  private dropContainer?: DropListRef;
  /**
   * 拖拽中的位移信息
   */
  private activeTransform: Point = { x: 0, y: 0 };
  /**
   * 拖拽结束之后的位移信息
   *
   * @remark
   * 这个主要是针对自由拖拽
   */
  private passiveTransform: Point = { x: 0, y: 0 };

  // 不用eventBus来处理
  private moveEvents = new Set<DragRefEvents['move']>();
  private startedEvents = new Set<DragRefEvents['started']>();
  private releaseEvents = new Set<DragRefEvents['release']>();
  private endedEvents = new Set<DragRefEvents['ended']>();
  private exitedEvents = new Set<DragRefEvents['exited']>();
  private enterEvents = new Set<DragRefEvents['enter']>();
  private droppedEvents = new Set<DragRefEvents['dropped']>();

  private document: Document = document;
  private initialContainer?: DropListRef;
  private initialIndex!: number;

  /**
   * 拖拽进其他容器时传输的对象
   */
  private _data: any;

  private registrySubscription: (() => void)[] = [];

  constructor(
    private rootElement: HTMLElement,
    private context: any,
    private previewContainer: HTMLElement,
    private previewTemplate?: () => HTMLElement,
    private placeholderTemplate?: () => HTMLElement,
    _dragConfig?: Partial<DragConfig>
  ) {
    this.dragConfig = merge({ ...defaultDragConfig }, _dragConfig);
  }

  get disabled() {
    // parentDrag的禁用不应该影响内部子元素的处理
    // dropContainer的禁用则需要影响到其内部
    return this._disabled || (this.dropContainer && this.dropContainer.disabled);
  }

  get data() {
    return this._data;
  }

  withData(data: any): void {
    this._data = data;
  }

  getPreviewEle(): HTMLElement {
    this.previewElement ||= this.createPreviewElement();
    return this.previewElement;
  }

  getPlaceholderEle(): HTMLElement {
    this.placeholderElement ||= this.createPlaceholderElement();
    return this.placeholderElement;
  }

  disableDrag() {
    this._disabled = true;
  }

  enableDrag() {
    this._disabled = false;
  }

  destroy() {
    this.removeListener();
    this.removePreviewInstance();
    this.dragPositionTrack.clear();

    this.moveEvents.clear();
    this.startedEvents.clear();
    this.releaseEvents.clear();
    this.endedEvents.clear();
    this.exitedEvents.clear();
    this.enterEvents.clear();
    this.droppedEvents.clear();
  }

  withRootElement(element: HTMLElement): void {
    this.removeListener();
    this.rootElement = element;
    this.addListener();
    this.initialTransform = undefined;
  }

  isDragging(): boolean {
    return this.hasStartedDragging.value && this.registry.isDragging(this);
  }

  withHandlerElement(ele: HTMLElement): void {
    this.handlerElement = ele;
    toggleElementDragStyle(ele, this._disabled);
    this.toggleDragStyle();
  }

  withParentDragRef(parentDragRef: DragRef): void {
    this.parentDragRef = parentDragRef;
  }

  withDropContainer(dropContainer: DropListRef): void {
    this.dropContainer = dropContainer;
  }

  withDragBoundary(element?: HTMLElement): void {
    this.dragBoundaryElement = element;
    if (element) {
      this.viewportDispose = ViewPortRegister.subscribe(this.handlerBoundaryOnResize);
    } else {
      this.viewportDispose();
      this.dragBoundaryClientRect = undefined;
    }
  }

  forwardSubscribeToEmit<K extends keyof DragRefEvents>(
    emits: (key: K, ...args: Parameters<DragRefEvents[K]>) => void,
    eventNames?: K[]
  ): () => void {
    const subscriptions: (() => void)[] = [];

    const finalEventNames: (keyof DragRefEvents)[] = eventNames ?? [
      'dropped',
      'ended',
      'enter',
      'exited',
      'move',
      'release',
      'started',
    ];

    finalEventNames.forEach(key => {
      subscriptions.push(this.subscribe(key as K, (...args: any) => emits(key as K, ...args)));
    });

    return () => {
      subscriptions.forEach(fn => fn());
    };
  }

  subscribe<K extends keyof DragRefEvents>(eventName: K, handler: DragRefEvents[K]) {
    const setMap: Record<keyof DragRefEvents, Set<any>> = {
      ended: this.endedEvents,
      move: this.moveEvents,
      started: this.startedEvents,
      release: this.releaseEvents,
      exited: this.exitedEvents,
      enter: this.enterEvents,
      dropped: this.droppedEvents,
    };

    const eventSet = setMap[eventName];
    if (eventSet) {
      eventSet.add(handler);
      return () => eventSet.delete(handler);
    }

    return Noop;
  }

  /**
   * 当位于拖拽容器发生顺序变换时所执行的更新方法
   *
   * @internal
   */
  updatePositionOnResort() {
    const position = this.lastPointPosition;
    if (position) {
      this.updateActiveDropContainer(this.getPreviewPositionOnPage(position));
    }
  }

  getVisibleElement(): HTMLElement {
    if (this.isDragging()) {
      return this.placeholderElement!;
    }
    return this.rootElement;
  }

  private toggleDragStyle(): void {
    if (!this.rootElement) {
      return;
    }

    const enable = !this.isDragging();
    if (this.elementEnable === enable) {
      return;
    }

    this.elementEnable = enable;

    if (!this.dropContainer) {
      toggleElementDragStyle(this.rootElement, enable);
      if (enable) {
        this.rootElement.classList.remove('fat-drag-dragging');
      } else {
        this.rootElement.classList.add('fat-drag-dragging');
      }
    }
  }

  reset = () => {
    this.rootElement.style.transform = this.initialTransform || '';
    this.activeTransform = { x: 0, y: 0 };
    this.passiveTransform = { x: 0, y: 0 };
  };

  /**
   * 窗口大小变更之后 我们需要判断下拖拽对象是否还位于范围之内 并做一些处理
   */
  private handlerBoundaryOnResize = throttle(() => {
    let { x, y } = this.passiveTransform;
    if ((x === 0 && y === 0) || this.isDragging() || !this.dragBoundaryElement) {
      return;
    }

    // 这里直接取 缓存值可能不是最新的
    const rootElementClientRect = this.rootElement.getBoundingClientRect();
    const boundaryElementClientRect = this.dragBoundaryElement.getBoundingClientRect();

    if (
      (boundaryElementClientRect.width === 0 && boundaryElementClientRect.height === 0) ||
      (rootElementClientRect.width === 0 && rootElementClientRect.height === 0)
    ) {
      return;
    }

    const left = boundaryElementClientRect.left - rootElementClientRect.left;
    const right = rootElementClientRect.right - boundaryElementClientRect.right;
    const top = boundaryElementClientRect.top - rootElementClientRect.top;
    const bottom = rootElementClientRect.bottom - boundaryElementClientRect.bottom;

    if (boundaryElementClientRect.width > rootElementClientRect.width) {
      if (left > 0) {
        x += left;
      }
      if (right > 0) {
        x -= right;
      }
    } else {
      x = 0;
    }

    if (boundaryElementClientRect.height > rootElementClientRect.height) {
      if (top > 0) {
        y += top;
      }
      if (bottom > 0) {
        y -= bottom;
      }
    } else {
      y = 0;
    }

    if (x !== this.passiveTransform.x || y !== this.passiveTransform.y) {
      this.setDragPosition(x, y);
    }
  }, 10);

  private setDragPosition(x: number, y: number): void {
    this.activeTransform = { x: 0, y: 0 };
    this.passiveTransform = {
      x,
      y,
    };

    if (!this.dropContainer) {
      this.applyRootElementTransform(x, y);
    }
  }

  private removePreviewInstance() {
    if (this.previewInstance) {
      this.previewInstance.detach();
    }
    this.previewInstance = undefined;
  }

  private addListener(): void {
    if (this.isListening && this.rootElement) {
      return;
    }
    this.isListening = true;

    this.rootElement.addEventListener('mousedown', this.pointerDown, activeEventListenerOptions);
    this.rootElement.addEventListener('touchstart', this.pointerDown, passiveEventListenerOptions);
    this.rootElement.addEventListener('dragstart', this.dragStartHandler, activeEventListenerOptions);
  }

  private removeListener(): void {
    this.isListening = false;
    if (this.rootElement) {
      this.rootElement.removeEventListener('mousedown', this.pointerDown, activeEventListenerOptions);
      this.rootElement.removeEventListener('touchstart', this.pointerDown, passiveEventListenerOptions);
      this.rootElement.removeEventListener('dragstart', this.dragStartHandler, activeEventListenerOptions);
    }
  }

  private dragStartHandler = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
    }
  };

  private pointerDown = (event: MouseEvent | TouchEvent) => {
    if (this.handlerElement) {
      const target = event.target!;
      const enable = this.handlerElement === target || this.handlerElement.contains(target as Node);
      if (enable && !this.disabled) {
        this.initializeDrag(this.handlerElement, event);
      }
    } else if (!this.disabled) {
      this.initializeDrag(this.rootElement, event);
    }
  };

  // todo shadowDom 支持
  private initializeDrag(ele: HTMLElement, event: MouseEvent | TouchEvent): void {
    // 存在嵌套的情况下 那么不进行冒泡 防止触发多个事件
    if (this.parentDragRef) {
      event.stopPropagation();
    }

    const isDragging = this.isDragging();
    const isTouch = isTouchEvent(event);
    const isAuxiliaryMouseButton = !isTouch && (event as MouseEvent).button !== MouseEventButton.Main;

    const isSyntheticEvent =
      !isTouch && this.lastTouchEventTime && this.lastTouchEventTime + MouseEventIgnoreTime > Date.now();

    // 忽略掉元素默认的行为
    if (ele.draggable && event.type === 'mousedown') {
      event.preventDefault();
    }

    if (isDragging || isSyntheticEvent || isAuxiliaryMouseButton) {
      return;
    }

    this.hasStartedDragging.value = this.hasMoved = false;

    this.initialRootElementClientRect = this.rootElement.getBoundingClientRect();
    this.registrySubscription.push(this.registry.subscribe('mousemove', this.mouseMoveHandler));
    this.registrySubscription.push(this.registry.subscribe('pointUp', this.pointUpHandler));
    this.registrySubscription.push(this.registry.subscribe('scroll', this.scrollHandler));

    if (this.dragBoundaryElement) {
      this.dragBoundaryClientRect = this.dragBoundaryElement.getBoundingClientRect();
    }

    const position = this.getPointerPositionOnPage(event);

    this.pickupPositionOnElement = this.previewTemplate
      ? { x: 0, y: 0 }
      : this.getPointerPosition(this.initialRootElementClientRect, ele, event);

    this.pickUpPositionOnPage = this.lastPointPosition = position;

    this.pointerDirectionDelta = { x: 0, y: 0 };

    this.pointerPositionAtLastDirectionChange = { x: position.x, y: position.y };
    this.dragStartTime = Date.now();

    this.registry.startDrag(this, event);
  }

  private scrollHandler = (event: Event) => {
    const scrollPosition = this.dragPositionTrack.handleScroll(event);

    if (scrollPosition) {
      this.pickUpPositionOnPage.x += scrollPosition.left;
      this.pickUpPositionOnPage.y += scrollPosition.top;
      if (!this.dropContainer) {
        this.activeTransform.x -= scrollPosition.left;
        this.activeTransform.y -= scrollPosition.top;
        this.applyRootElementTransform(this.activeTransform.x, this.activeTransform.y);
      }
    }
  };

  private pointUpHandler = (event: TouchEvent | MouseEvent) => {
    this.endDrag(event);
  };

  private mouseMoveHandler = (event: TouchEvent | MouseEvent) => {
    const pointerPosition = this.getPointerPositionOnPage(event);

    if (!this.hasStartedDragging.value) {
      const distanceX = Math.abs(pointerPosition.x - this.pickUpPositionOnPage.x);
      const distanceY = Math.abs(pointerPosition.y - this.pickUpPositionOnPage.y);

      const isOverThreshold = distanceX + distanceY >= this.dragConfig.dragStartThreshold;
      if (isOverThreshold) {
        // 如果在指定延迟之前移动的话 那么直接结束该次拖拽行为
        const isDelayElapsed = Date.now() >= this.dragStartTime + this.dragConfig.dragStartDelay;
        if (!isDelayElapsed) {
          return this.endDrag(event);
        }

        const container = this.dropContainer;

        if (!container || (!container.isDragging() && !container.isReceiving())) {
          event.preventDefault();
          this.hasStartedDragging.value = true;
          this.startDrag(event);
        }
      }
      return;
    }
    event.preventDefault();

    const previewPosition = this.getPreviewPositionOnPage(pointerPosition);

    this.hasMoved = true;
    this.lastPointPosition = previewPosition;

    this.updatePointerDirectionDelta(previewPosition);

    if (this.dropContainer) {
      this.updateActiveDropContainer(previewPosition);
    } else {
      const activeTransform = this.activeTransform;
      activeTransform.x = previewPosition.x - this.pickUpPositionOnPage.x + this.passiveTransform.x;
      activeTransform.y = previewPosition.y - this.pickUpPositionOnPage.y + this.passiveTransform.y;
      this.applyRootElementTransform(activeTransform.x, activeTransform.y);
    }

    if (this.moveEvents.size > 0) {
      const payload = {
        source: this,
        pointerPosition,
        event,
        distance: this.getDragDistance(previewPosition),
      };
      this.executerEvent(this.moveEvents, payload);
    }
  };

  private startDrag(event: MouseEvent | TouchEvent) {
    if (isTouchEvent(event)) {
      this.lastTouchEventTime = Date.now();
    }

    this.toggleDragStyle();

    const dropContainer = this.dropContainer;

    if (dropContainer) {
      const element = this.rootElement;
      const parentElement = element.parentElement!;
      const placeholderElement = (this.placeholderElement = this.createPlaceholderElement());

      this.initialTransform = element.style.transform || '';

      /*      
      // 主要是针对指令的场景下的处理
      // 该模式我们需要将placeholder元素跟原来的元素进行一次替换
      // 为了保持css 的一些选择器 比如 last-child之类的 我们要将其移动到body里进行隐藏
      // 这里可能会导致一些问题 不太确定vue的VNode检测是否会有对应的引用 
      */

      // 垃圾 Vue 指令没办法获取当前工作上下文
      // 这里暂时先这样 问题也不大 设计上本身就是针对DOM而言
      // 不要太依赖 Vue 🤡

      // 创建一个注释元素 以便之后将元素重新还原回来
      const anchor = (this.anchor ||= document.createComment(''));
      parentElement.insertBefore(anchor, element);
      this.previewElement = this.createPreviewElement();

      toggleElementDragVisibility(element, false, DragImportantProperties);
      this.document.body.appendChild(parentElement.replaceChild(placeholderElement, element));

      this.previewContainer.appendChild(this.previewElement);

      dropContainer.start();
      this.initialContainer = dropContainer;
      this.initialIndex = dropContainer.getItemIndex(this);

      this.dragPositionTrack.cache(dropContainer.getScrollableParents());
    } else {
      this.dragPositionTrack.cache([]);
    }
    this.executerEvent(this.startedEvents, {
      source: this,
      event,
    });
  }

  private endDrag(event: TouchEvent | MouseEvent): void {
    // this.isDragging() => 代表是否发生最小位移
    // this.registry.isDragging(this) => 代表是否已经开始了拖拽行为
    // 两者不一样
    if (!this.registry.isDragging(this)) {
      return;
    }
    this.registrySubscription.forEach(fn => fn());
    this.registrySubscription = [];
    this.registry.stopDrag(this);
    this.toggleDragStyle();

    if (!this.hasStartedDragging.value) {
      return;
    }

    this.executerEvent(this.releaseEvents, { source: this, event });

    if (this.dropContainer) {
      this.waitPreviewAnimateToPlaceholder().then(() => {
        this.cleanupDragArtifacts(event);
        this.cleanPositionTrackCache();
      });
    } else {
      this.passiveTransform = {
        ...this.activeTransform,
      };

      const pointerPosition = this.getPointerPositionOnPage(event);

      this.executerEvent(this.endedEvents, {
        source: this,
        distance: this.getDragDistance(pointerPosition),
        dropPoint: pointerPosition,
        event,
      });

      this.cleanPositionTrackCache();
    }
  }

  private cleanupDragArtifacts(event: MouseEvent | TouchEvent) {
    toggleElementDragVisibility(this.rootElement, true, DragImportantProperties);

    this.anchor!.parentElement!.replaceChild(this.rootElement, this.anchor!);

    this.destroyPlaceHolder();
    this.destroyPreview();

    this.previewClientRect =
      this.dragBoundaryClientRect =
      this.initialRootElementClientRect =
      this.initialTransform =
        undefined;

    const container = this.dropContainer!;
    const currentIndex = container.getItemIndex(this);
    const pointerPosition = this.getPointerPositionOnPage(event);
    const distance = this.getDragDistance(pointerPosition);
    this.executerEvent(this.endedEvents, { source: this, distance, event, dropPoint: pointerPosition });
    this.executerEvent(this.droppedEvents, {
      item: this,
      previousContainer: this.initialContainer,
      previousIndex: this.initialIndex,
      currentIndex,
      event,
      dropPoint: pointerPosition,
      distance,
      container,
    });

    container.drop(this, currentIndex, this.initialIndex, this.initialContainer!, distance, pointerPosition, event);

    this.dropContainer = this.initialContainer;
    this.initialIndex = currentIndex;
  }

  private waitPreviewAnimateToPlaceholder(): Promise<void> {
    if (!this.hasMoved) {
      return Promise.resolve();
    }

    const placeholderRect = this.placeholderElement!.getBoundingClientRect();

    this.previewElement!.classList.add('fat-drag-animating');

    this.applyPreviewElementTransform(placeholderRect.left, placeholderRect.top);

    return new Promise<void>(resolve => {
      const handler = (event: TransitionEvent) => {
        if (event.target === this.previewElement && event.propertyName === 'transform') {
          this.previewElement!.removeEventListener('transitionend', handler);
        }
        resolve();

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        clearTimeout(timerId);
      };

      const timerId = setTimeout(() => {
        handler({ target: this.previewElement, propertyName: 'transform' } as any);
        // 这里暂时先写死过渡动画时间为 250ms 动态获取之后再说把
      }, 250 * 1.2);

      this.previewElement!.addEventListener('transitionend', handler);
    });
  }

  private applyPreviewElementTransform(x: number, y: number) {
    const transform = getTransform(x, y);
    this.previewElement!.style.transform = transform;
  }

  private cleanPositionTrackCache() {
    this.dragPositionTrack.clear();
  }

  private executerEvent<S extends Set<(...args: any) => void>>(events: S, ...params: GetParameterInSet<S>) {
    for (const handler of events) {
      handler.apply(null, params);
    }
  }

  // todo 处理初始情况下就存在 transform 样式的问题
  private applyRootElementTransform(x: number, y: number) {
    const transform = getTransform(x, y);
    this.rootElement.style.transform = transform;
  }

  private updateActiveDropContainer({ x, y }: Point) {
    if (!this.dropContainer) {
      return;
    }
    let targetContainer = this.initialContainer!.getContainerFromPosition(this, x, y);

    if (!targetContainer && this.dropContainer !== this.initialContainer) {
      targetContainer = this.initialContainer!;
    }

    if (targetContainer && targetContainer !== this.dropContainer) {
      this.executerEvent(this.exitedEvents, { source: this, container: this.dropContainer });
      this.dropContainer.exit(this);
      this.dropContainer = targetContainer;
      this.dropContainer.enter(this, x, y);
      this.executerEvent(this.enterEvents, {
        source: this,
        container: this.dropContainer,
        index: this.dropContainer.getItemIndex(this),
      });
    }

    if (this.isDragging()) {
      this.dropContainer.sortItem(this, x, y, this.pointerDirectionDelta);
      this.applyPreviewElementTransform(x - this.pickupPositionOnElement.x, y - this.pickupPositionOnElement.y);
    }
  }

  private updatePointerDirectionDelta(point: Point): Delta {
    const { x, y } = point;

    const delta = this.pointerDirectionDelta;

    const changeX = Math.abs(x - this.pointerPositionAtLastDirectionChange.x);
    const changeY = Math.abs(y - this.pointerPositionAtLastDirectionChange.y);

    if (changeX > this.dragConfig.pointerDirectionChangeThreshold) {
      delta.x = x > this.pointerPositionAtLastDirectionChange.x ? 1 : -1;
      this.pointerPositionAtLastDirectionChange.x = x;
    }

    if (changeY > this.dragConfig.pointerDirectionChangeThreshold) {
      delta.y = y > this.pointerPositionAtLastDirectionChange.y ? 1 : -1;
      this.pointerPositionAtLastDirectionChange.y = y;
    }

    return delta;
  }

  private getPointerPosition(
    clientRect: ClientRect,
    referenceElement: HTMLElement,
    event: MouseEvent | TouchEvent
  ): Point {
    const element = referenceElement === this.rootElement ? null : referenceElement;
    const rect = element ? element.getBoundingClientRect() : clientRect;
    const point = isTouchEvent(event) ? event.touches[0] : event;
    const scrollPosition = this.getScrollPosition();
    const x = point.pageX - rect.left - scrollPosition.x;
    const y = point.pageY - rect.top - scrollPosition.y;
    return {
      x: rect.left - clientRect.left + x,
      y: rect.top - clientRect.top + y,
    };
  }

  private getDragDistance(currentPosition: Point): Point {
    const position = this.pickUpPositionOnPage;
    if (position) {
      return { x: currentPosition.x - position.x, y: currentPosition.y - position.y };
    }
    return { x: 0, y: 0 };
  }

  private getPointerPositionOnPage(event: TouchEvent | MouseEvent): Point {
    const scrollPosition = this.getScrollPosition();
    const point = isTouchEvent(event) ? event.touches[0] : event;
    return {
      x: point.pageX - scrollPosition.x,
      y: point.pageY - scrollPosition.y,
    };
  }

  /**
   * 根据当前鼠标位置获取预览元素的位置
   * @param point
   */
  private getPreviewPositionOnPage(point: Point): Point {
    const dragContainerLock = this.parentDragRef ? this.parentDragRef.dragConfig.lockAxis : null;
    let { x, y } = point;

    const lockAxis = this.dragConfig.lockAxis;
    if (lockAxis === 'x' || dragContainerLock === 'x') {
      y = this.pickUpPositionOnPage.y;
    }
    if (lockAxis === 'y' || dragContainerLock === 'y') {
      x = this.pickUpPositionOnPage.x;
    }

    if (this.dragBoundaryClientRect) {
      const { width: previewWidth, height: previewHeight } = this.getPreviewRect();

      const maxX = this.dragBoundaryClientRect.right - previewWidth + this.pickupPositionOnElement.x;
      const minX = this.dragBoundaryClientRect.left + this.pickupPositionOnElement.x;
      const maxY = this.dragBoundaryClientRect.bottom - previewHeight + this.pickupPositionOnElement.y;
      const minY = this.dragBoundaryClientRect.top + this.pickupPositionOnElement.y;

      x = clamp(x, minX, maxX);
      y = clamp(y, minY, maxY);
    }

    return { x, y };
  }

  private getPreviewRect(): ClientRect {
    if (!this.previewClientRect || (!this.previewClientRect.width && !this.previewClientRect.height)) {
      this.previewClientRect = this.previewElement
        ? this.previewElement.getBoundingClientRect()
        : this.initialRootElementClientRect!;
    }

    return this.previewClientRect;
  }

  private getScrollPosition(): Point {
    const { left: x, top: y } =
      this.dragPositionTrack.positions.get(this.document)?.scrollPosition ||
      this.dragPositionTrack.getViewportScrollPosition();
    return { x, y };
  }

  private createPlaceholderElement(): HTMLElement {
    if (this.placeholderElement) {
      this.placeholderElement.remove();
    }
    if (this.placeholderInstance) {
      this.placeholderInstance.detach();
    }

    let element: HTMLElement;
    if (this.placeholderTemplate) {
      const portal = new Portal(this.placeholderTemplate, {
        context: this.context,
        target: null,
      });

      portal.attach();
      element = portal.host!;
    } else {
      element = cloneElement(this.rootElement);
    }

    element.style.pointerEvents = 'none';
    element.classList.add('fat-drag-placeholder');
    if (this.dragConfig.placeholderClass) {
      element.classList.add(...toArray(this.dragConfig.placeholderClass));
    }
    return element;
  }

  private destroyPlaceHolder(): void {
    if (this.placeholderInstance) {
      this.placeholderInstance.detach();
      this.placeholderInstance = undefined;
    } else {
      this.placeholderElement!.remove();
    }
    this.placeholderElement = null;
  }

  private createPreviewElement(): HTMLElement {
    if (this.previewElement) {
      this.previewElement.remove();
    }
    if (this.previewInstance) {
      this.previewInstance.detach();
    }

    let element: HTMLElement;
    if (this.previewTemplate) {
      const portal = new Portal<{}>(this.previewTemplate, {
        target: this.previewContainer,
        context: this.context,
      });

      portal.attach();
      this.previewInstance = portal;
      element = portal.host!;
    } else {
      element = cloneElement(this.rootElement);
      // 不是自定义预览的话 我们将原来的元素宽高赋给预览元素
      matchElementSize(element, this.initialRootElementClientRect!);
    }

    element.classList.add(...toArray(this.dragConfig.previewClass), 'fat-drag-preview');

    if (this.initialTransform) {
      element.style.transform = this.initialTransform;
    }

    extendStyles(element, {
      'pointer-events': 'none',
      margin: '0',
      position: 'fixed',
      top: '0',
      left: '0',
      'z-index': `${this.dragConfig.zIndex}`,
    });

    toggleElementDragStyle(element, false);
    return element;
  }

  private destroyPreview(): void {
    if (this.previewInstance) {
      this.previewInstance.detach();
      this.previewInstance = undefined;
    } else {
      this.previewElement!.remove();
    }
    this.previewElement = null;
  }
}
