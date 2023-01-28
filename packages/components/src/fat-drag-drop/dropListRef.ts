import { DragRef } from './dragRef';
import { ref } from '@wakeadmin/demi';
import { DragDropRegistry } from './event';
import { DragPositionTrack } from './positionTrack';
import { Noop } from '@wakeadmin/utils';
import { type GetParameterInSet, type ClientRect, isInsideClientRect, isPointerNearClientRect } from '../utils';
import { DefaultDragDropListStrategy, DragDropListStrategy } from './strategy/defaultStrategy';

import type { Delta, DragRefEvents, Orientation, Point } from './type';

type DropListEvents = Extract<keyof DragRefEvents, 'exited' | 'enter' | 'dropped'>;

/**
 * 判断鼠标是否靠近容器的宽容值
 */
export const DropSortThreshold = 0.112;

const DropListDraggingClass = 'fat-drop-list__dragging';
export class DropListRef {
  disabled: boolean = false;

  enterPredicate: (drag: DragRef, dropList: DropListRef) => boolean = () => true;

  // todo
  sortPredicate: (index: number, drag: DragRef, dropList: DropListRef) => boolean = () => true;

  private _dragging = ref(false);

  private items: Set<DragRef> = new Set();

  private registry = DragDropRegistry;

  private scrollElements: HTMLElement[] = [];
  private rootClientRect!: ClientRect;

  private strategy: DragDropListStrategy<DragRef>;

  private positionTrack = new DragPositionTrack();
  private removeListenScrollEvent: () => void = Noop;

  private enterEvents = new Set<DragRefEvents['enter']>();
  private exitedEvents = new Set<DragRefEvents['exited']>();
  private droppedEvents = new Set<DragRefEvents['dropped']>();

  private unSortItems: Set<DragRef> = new Set();
  private dropSortThreshold = DropSortThreshold;

  data: any[] = [];

  /**
   * 拖拽列表组
   *
   * **❗❗只读**
   *
   * **❗❗只读**
   *
   * **❗❗只读**
   *
   */
  private dropListGroup: Set<DropListRef> | null = null;
  private connectToList: DropListRef[] = [];
  private activeSiblings: Set<DropListRef> = new Set();
  private siblings: DropListRef[] = [];

  constructor(private rootElement: HTMLElement, strategy?: DragDropListStrategy<DragRef>) {
    this.registry.addDropContainer(this);
    this.strategy = strategy || new DefaultDragDropListStrategy<DragRef>(this.rootElement);
  }

  isDragging() {
    return this._dragging.value;
  }

  start(): void {
    this.startDrag();
    this.syncSiblings();
    this.cacheParentPositions();
    this.standingByReceiving();
  }

  standingByReceiving() {
    const draggedItem = this.strategy.getActiveItemsSnapshot().find(item => item.isDragging())!;
    this.siblings.forEach(instance => instance.startReceiving(this, draggedItem));
  }

  startReceiving(dropList: DropListRef, item: DragRef): void {
    const activeSiblings = this.activeSiblings;
    if (
      !activeSiblings.has(dropList) ||
      // 是否允许进入
      // 如果原本就是在这个列表里的 当然是要允许的
      this.enterPredicate(item, this) ||
      this.items.has(item)
    ) {
      activeSiblings.add(dropList);
      this.cacheParentPositions();
      this.listenScrollEvent();
    }
  }

  stopReceiving(sibling: DropListRef) {
    this.activeSiblings.delete(sibling);
  }

  isReceiving() {
    return this.activeSiblings.size > 0;
  }

  canReceive(item: DragRef, x: number, y: number): boolean {
    return !(
      !this.rootClientRect ||
      !isInsideClientRect(this.rootClientRect, x, y) ||
      !this.enterPredicate(item, this)
    );
  }

  getItemIndex(item: DragRef): number {
    if (this.isDragging()) {
      return this.strategy.getItemIndex(item);
    }
    return this.findItem(item);
  }

  getSiblings(): DropListRef[] {
    if (this.dropListGroup) {
      return [...this.dropListGroup].filter(instance => instance !== this).concat(this.connectToList);
    }
    return this.connectToList;
  }

  setDropSortThreshold(threshold: number): void {
    this.dropSortThreshold = threshold;
  }

  withItems(items: DragRef[]): void {
    const itemsSnap = [...this.items];
    this.items = new Set(items);

    if (this.isDragging()) {
      const draggedItems = itemsSnap.filter(item => item.isDragging());
      if (draggedItems.some(item => this.items.has(item))) {
        this.strategy.withItems([...items]);
      } else {
        this.reset();
      }
    }
  }

  withData(data: any[]): void {
    this.data = data;
  }

  withRootElement(element: HTMLElement): void {
    this.rootElement = element;
    this.rootClientRect = null as any;
    this.scrollElements = [element];
    this.cacheParentPositions();
    const orientation = (this.strategy as DefaultDragDropListStrategy<DragRef>).orientation;
    this.strategy = new DefaultDragDropListStrategy(element);
    this.setOrientation(orientation);
  }

  withConnectTo(list: DropListRef[]): void {
    this.connectToList = list;
  }

  withDropListGroup(group: Set<DropListRef>): void {
    this.dropListGroup = group;
  }

  reset() {
    this._dragging.value = false;
    this.rootElement.classList.remove(DropListDraggingClass);
    this.strategy.reset();
    this.positionTrack.clear();
    this.removeListenScrollEvent();
    this.siblings.forEach(item => item.stopReceiving(this));
  }

  getContainerFromPosition(item: DragRef, x: number, y: number): DropListRef | undefined {
    return this.siblings.find(sibling => sibling.canReceive(item, x, y));
  }

  exit(item: DragRef): void {
    this.reset();

    this.executerEvent(this.exitedEvents, {
      container: this,
      source: item,
    });
  }

  enter(item: DragRef, x: number, y: number, index?: number): void {
    this.startDrag();

    if (index == null) {
      index = this.findItem(item);
    }

    this.strategy.enter(item, x, y, index);
    this.cacheParentPositions();

    this.executerEvent(this.enterEvents, {
      container: this,
      source: item,
      index,
    });
  }

  sortItem(item: DragRef, x: number, y: number, delta: Delta) {
    if (!this.rootClientRect || !isPointerNearClientRect(this.rootClientRect, this.dropSortThreshold, x, y)) {
      return;
    }
    this.strategy.sort(item, x, y, delta);
  }

  setOrientation(orientation: Orientation): void {
    (this.strategy as DefaultDragDropListStrategy<DragRef>).orientation = orientation;
  }

  addItem(dragRef: DragRef): void {
    this.unSortItems.add(dragRef);

    if (this.isDragging()) {
      this.syncItems();
    }
  }

  removeItem(dragRef: DragRef): void {
    this.unSortItems.delete(dragRef);

    if (this.isDragging()) {
      this.syncItems();
    }
  }

  drop(
    item: DragRef,
    currentIndex: number,
    previousIndex: number,
    previousContainer: DropListRef,
    distance: Point,
    dropPoint: Point,
    event: MouseEvent | TouchEvent = {} as any
  ): void {
    this.reset();
    this.executerEvent(this.droppedEvents, {
      item,
      currentIndex,
      previousIndex,
      container: this,
      previousContainer,
      distance,
      dropPoint,
      event,
    });
  }

  destroy() {
    this.unSortItems.clear();
    this.positionTrack.clear();
    this.enterEvents.clear();
    this.exitedEvents.clear();
    this.droppedEvents.clear();
  }

  forwardSubscribeToEmit<K extends DropListEvents>(
    emits: (key: K, ...args: Parameters<DragRefEvents[K]>) => void
  ): () => void {
    const subscriptions: (() => void)[] = [];
    subscriptions.push(this.subscribe('enter', (...args) => emits('enter' as K, ...(args as any))));
    subscriptions.push(this.subscribe('dropped', (...args) => emits('dropped' as K, ...(args as any))));
    subscriptions.push(this.subscribe('exited', (...args) => emits('exited' as K, ...(args as any))));

    return () => {
      subscriptions.forEach(fn => fn());
    };
  }

  getScrollableParents(): readonly HTMLElement[] {
    return this.scrollElements;
  }

  subscribe<K extends DropListEvents>(eventName: K, handler: DragRefEvents[K]) {
    const setMap: Record<DropListEvents, Set<any>> = {
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

  private syncItems(): void {
    this.withItems(this.getSortedItems());
  }

  private getSortedItems(): DragRef[] {
    return [...this.unSortItems].sort((a: DragRef, b: DragRef) =>
      // eslint-disable-next-line no-bitwise
      a.getVisibleElement().compareDocumentPosition(b.getVisibleElement()) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );
  }

  private findItem(value: DragRef): number {
    let index = 0;
    for (const item of this.items) {
      if (item === value) {
        return index;
      }
      index++;
    }

    return -1;
  }

  private executerEvent<S extends Set<(...args: any) => void>>(events: S, ...params: GetParameterInSet<S>) {
    for (const handler of events) {
      handler.apply(null, params);
    }
  }

  private startDrag(): void {
    this.rootElement.classList.add(DropListDraggingClass);
    this.syncItems();
    this._dragging.value = true;
    this.strategy.start([...this.items]);
    this.reListenScrollEvent();
  }

  private reListenScrollEvent() {
    this.removeListenScrollEvent();

    this.listenScrollEvent();
  }

  private listenScrollEvent() {
    this.removeListenScrollEvent = this.registry.subscribe('scroll', event => {
      if (this.isDragging()) {
        const position = this.positionTrack.handleScroll(event);
        if (position) {
          this.strategy.updateOnScroll(position.top, position.left);
        }
      } else if (this.isReceiving()) {
        this.cacheParentPositions();
      }
    });
  }

  private cacheParentPositions() {
    this.positionTrack.cache(this.scrollElements);

    this.rootClientRect = this.positionTrack.positions.get(this.rootElement)!.clientRect!;
  }

  private syncSiblings() {
    this.siblings = this.getSiblings();
  }
}
