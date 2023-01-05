import { DragRef } from './dragRef';
import { ref } from '@wakeadmin/demi';
import { DragDropRegistry } from './event';
import { DragPositionTrack } from './positionTrack';
import { Noop } from '@wakeadmin/utils';
import { type GetParameterInSet, type ClientRect } from '../utils';
import { DefaultDragDropListStrategy, DragDropListStrategy } from './strategy/defaultStrategy';

import type { Delta, DragRefEvents, Orientation, Point } from './type';

type DropListEvents = Extract<keyof DragRefEvents, 'exited' | 'enter' | 'dropped'>;

const DropListDraggingClass = 'fat-drop-list__dragging';
export class DropListRef {
  disabled: boolean = false;

  // todo
  enterPredicate: (drag: DragRef, drop: DropListRef) => boolean = () => true;

  // todo
  sortPredicate: (index: number, drag: DragRef, drop: DropListRef) => boolean = () => true;

  private _dragging = ref(false);

  private items: Set<DragRef> = new Set();

  private registry = DragDropRegistry;

  private scrollElements: HTMLElement[] = [];
  // @ts-expect-error
  private rootClientRect!: ClientRect;

  private strategy: DragDropListStrategy<DragRef>;

  private positionTrack = new DragPositionTrack();
  private removeListenScrollEvent: () => void = Noop;

  private enterEvents = new Set<DragRefEvents['enter']>();
  private exitedEvents = new Set<DragRefEvents['exited']>();
  private droppedEvents = new Set<DragRefEvents['dropped']>();

  private unSortItems: Set<DragRef> = new Set();

  constructor(private rootElement: HTMLElement, strategy?: DragDropListStrategy<DragRef>) {
    this.registry.addDropContainer(this);
    this.strategy = strategy || new DefaultDragDropListStrategy<DragRef>(this.rootElement);
  }

  isDragging() {
    return this._dragging.value;
  }

  start(): void {
    this.startDrag();
  }

  isReceiving() {
    // todo
    return false;
  }

  getItemIndex(item: DragRef): number {
    if (this.isDragging()) {
      return this.strategy.getItemIndex(item);
    }
    return this.findItem(item);
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

  withRootElement(element: HTMLElement): void {
    this.rootElement = element;
    this.rootClientRect = null as any;
    this.scrollElements = [element];
    this.cacheParentPositions();
    this.strategy ||= new DefaultDragDropListStrategy(element);
  }

  reset() {
    this._dragging.value = false;
    this.rootElement.classList.remove(DropListDraggingClass);
    this.strategy.reset();
    this.positionTrack.clear();
    this.removeListenScrollEvent();
  }

  getContainerFromPosition(item: DragRef, x: number, y: number): DropListRef | undefined {
    // todo
    return this;
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
}
