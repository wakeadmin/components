import { adjustClientRect, type ClientRect, getClientRect, moveItemInArray } from '../../utils';
import { type DragRef } from '../dragRef';
import { DragDropRegistry } from '../event';
import { Delta, Orientation } from '../type';

export interface DragDropListStrategy<T> {
  start(items: readonly T[]): void;
  sort(
    item: T,
    pointerX: number,
    pointerY: number,
    pointerDelta: Delta
  ): { previousIndex: number; currentIndex: number } | null;
  enter(item: T, pointerX: number, pointerY: number, index?: number): void;
  reset(): void;
  getItemIndex(item: T): number;
  withItems(items: T[]): void;
  updateOnScroll(top: number, left: number): void;
}

interface CachedItemPosition<T extends DragRef> {
  source: T;
  offset: number;
  clientRect: ClientRect;
}

export class DefaultDragDropListStrategy<T extends DragRef> implements DragDropListStrategy<T> {
  private registry = DragDropRegistry;

  private previousSwapItem: { source: T; delta: Delta['x']; overlap: boolean } = {} as any;
  private itemsPosition: CachedItemPosition<T>[] = [];

  private startedDrag: T[] = [];
  orientation: Orientation = 'vertical';

  constructor(public rootElement: HTMLElement) {}

  start(items: readonly T[]): void {
    this.startedDrag = [...items];
    this.cacheItemsPositions();
  }

  sort(
    item: T,
    pointerX: number,
    pointerY: number,
    pointerDelta: Delta
  ): { previousIndex: number; currentIndex: number } | null {
    const newIndex = this.getIndexFromPosition(item, pointerX, pointerY, pointerDelta);
    if (newIndex === -1 && this.itemsPosition.length > 0) {
      return null;
    }

    const isHorizontal = this.orientation === 'horizontal';
    const currentIndex = this.itemsPosition.findIndex(({ source }) => source === item);
    const currentPosition = this.itemsPosition[currentIndex].clientRect;
    const newPosition = this.itemsPosition[newIndex].clientRect;
    const delta = newIndex > currentIndex ? -1 : 1;

    const itemOffset = this.getItemOffset(currentPosition, newPosition, delta);

    const siblingOffset = this.getSiblingOffset(currentIndex, this.itemsPosition, delta);

    const oldOrder = [...this.itemsPosition];

    moveItemInArray(this.itemsPosition, currentIndex, newIndex);

    this.itemsPosition.forEach((sibling, index) => {
      if (oldOrder[index] === sibling) {
        return;
      }

      const isDraggedItem = sibling.source === item;
      const offset = isDraggedItem ? itemOffset : siblingOffset;

      const elementOffset = isDraggedItem ? item.getPlaceholderEle() : sibling.source.getVisibleElement();

      sibling.offset += offset;

      if (isHorizontal) {
        elementOffset.style.transform = `translate3d(${~~sibling.offset}px, 0, 0)`;
        adjustClientRect(sibling.clientRect, 0, offset);
      } else {
        elementOffset.style.transform = `translate3d(0, ${~~sibling.offset}px, 0)`;
        adjustClientRect(sibling.clientRect, offset, 0);
      }
    });

    this.previousSwapItem = {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      overlap: isInsideClientRect(newPosition, pointerX, pointerY),
      source: item,
      delta: isHorizontal ? pointerDelta.x : pointerDelta.y,
    };

    return { previousIndex: currentIndex, currentIndex: newIndex };
  }

  enter(item: T, pointerX: number, pointerY: number, index?: number | undefined): void {
    const newIndex = index == null || index < 0 ? this.getIndexFromPosition(item, pointerX, pointerY) : index;
    const currentIndex = this.startedDrag.indexOf(item);
    const placeholderElement = item.getPlaceholderEle();
    let newPositionReference: T | undefined = this.startedDrag[newIndex];

    // 两个一直 代表拖动的时候最终拖回了原来的位置
    // 基于下一个对象进行参考
    if (newPositionReference === item) {
      newPositionReference = this.startedDrag[newIndex + 1];
    }

    // 如果不存在 且新的索引位置不存在或者为 -1
    // 尝试将其判断为第一个子元素
    if (
      !newPositionReference &&
      (newIndex == null || newIndex === -1 || newIndex < this.startedDrag.length - 1) &&
      this.enterIsFirstChild(pointerX, pointerY)
    ) {
      newPositionReference = this.startedDrag[0];
    }

    // 防止存在重复的元素
    // 先删除原来的
    // 再进行添加
    if (currentIndex > -1) {
      this.itemsPosition.splice(currentIndex, 1);
    }

    // 这里使用dragEventRegistry来进行判断是否正在拖拽中
    // 原因参照 @see{dragRef#endDrag}

    // 这里直接添加 DOM 可能会跟 vue 里 reRender 的结果不一致
    // - 直接操作dom 不太确定 vue 的 VNode 是否会对其内部的内容重新进行一次编排
    if (newPositionReference && !this.registry.isDragging(newPositionReference)) {
      const element = newPositionReference.getVisibleElement();
      element.parentElement!.insertBefore(placeholderElement, element);
      this.startedDrag.splice(newIndex, 0, item);
    } else {
      this.rootElement.appendChild(placeholderElement);
      this.startedDrag.push(item);
    }

    placeholderElement.style.transform = '';

    this.cacheItemsPositions();
  }

  reset(): void {
    this.startedDrag.forEach(item => {
      const rootElement = item.getVisibleElement();

      if (rootElement) {
        // todo 记录下原来的transform 最后进行还原
        rootElement.style.transform = '';
      }
    });

    this.itemsPosition = [];
    this.startedDrag = [];
    this.previousSwapItem = {
      // @ts-expect-error
      source: null,
      delta: 0,
      overlap: false,
    };
  }

  getItemIndex(item: T): number {
    return this.itemsPosition.findIndex(instance => instance.source === item);
  }

  /**
   *
   * @param items
   *
   * @internal
   */
  withItems(items: T[]): void {
    this.startedDrag = [...items];
    this.cacheItemsPositions();
  }

  updateOnScroll(top: number, left: number): void {
    this.itemsPosition.forEach(item => {
      adjustClientRect(item.clientRect, top, left);
    });

    // 分开做 等位置缓存完之后再进行更新

    this.itemsPosition.forEach(item => {
      if (this.registry.isDragging(item.source)) {
        item.source.updatePositionOnResort();
      }
    });
  }

  private cacheItemsPositions(): void {
    const sortFn =
      this.orientation === 'horizontal'
        ? (a: CachedItemPosition<T>, b: CachedItemPosition<T>) => a.clientRect.left - b.clientRect.left
        : (a: CachedItemPosition<T>, b: CachedItemPosition<T>) => a.clientRect.top - b.clientRect.top;
    this.itemsPosition = this.startedDrag
      .map(item => {
        const element = item.getVisibleElement();
        return {
          source: item,
          clientRect: getClientRect(element),
          offset: 0,
        };
      })
      .sort(sortFn);
  }

  private getItemOffset(currentPosition: ClientRect, newPosition: ClientRect, delta: 1 | -1): number {
    const isHorizontal = this.orientation === 'horizontal';

    const offset = isHorizontal ? newPosition.left - currentPosition.left : newPosition.top - currentPosition.top;

    let extraOffset = 0;
    if (delta === -1) {
      extraOffset = isHorizontal
        ? newPosition.width - currentPosition.width
        : newPosition.height - currentPosition.height;
    }

    return offset + extraOffset;
  }

  private getSiblingOffset(
    currentIndex: number,
    siblings: CachedItemPosition<T>[],
    delta: Exclude<Delta['x'], 0>
  ): number {
    const isHorizontal = this.orientation === 'horizontal';
    const currentItemPosition = siblings[currentIndex].clientRect;
    const immediateItem = siblings[currentIndex + -1 * delta];
    let offset = currentItemPosition[isHorizontal ? 'width' : 'height'] * delta;

    if (immediateItem) {
      const start = isHorizontal ? 'left' : 'top';
      const end = isHorizontal ? 'right' : 'bottom';

      if (delta === -1) {
        offset -= immediateItem.clientRect[start] - currentItemPosition[end];
      } else {
        offset += currentItemPosition[start] - immediateItem.clientRect[end];
      }
    }

    return offset;
  }

  private getIndexFromPosition(item: T, x: number, y: number, delta?: Delta): number {
    const isHorizontal = this.orientation === 'horizontal';
    const index = this.itemsPosition.findIndex(({ source, clientRect }) => {
      // 不跟自己比较
      if (source === item) {
        return false;
      }
      if (delta) {
        const direction = isHorizontal ? delta.x : delta.y;

        // 执行更新后 如果方向没有变化的话 那么没必要进行操作
        if (
          source === this.previousSwapItem.source &&
          this.previousSwapItem.overlap &&
          direction === this.previousSwapItem.delta
        ) {
          return false;
        }
      }

      return isHorizontal
        ? x >= ~~clientRect.left && x < ~~clientRect.right
        : y >= ~~clientRect.top && y < ~~clientRect.bottom;
    });

    // todo 增加后续判断是否允许插入到该位置
    return index;
  }

  private enterIsFirstChild(x: number, y: number): boolean {
    if (this.itemsPosition.length === 0) {
      return false;
    }

    const isHorizontal = this.orientation === 'horizontal';

    // items 是基于位置进行排序的
    // startedDarg 基于index
    // 这里判断下位置信息是否一致 有可能存在 row-reverse 的样式
    const lastChild = this.itemsPosition.at(-1)!;
    const isReversed = lastChild.source === this.startedDrag[0];

    if (isReversed) {
      const lastChildPosition = lastChild.clientRect;
      return isHorizontal ? x >= lastChildPosition.right : y >= lastChildPosition.bottom;
    }
    const firstChildPosition = this.itemsPosition[0].clientRect;

    return isHorizontal ? x >= firstChildPosition.left : y >= firstChildPosition.top;
  }
}

function isInsideClientRect(clientRect: ClientRect, x: number, y: number) {
  const { top, bottom, left, right } = clientRect;
  return y >= top && y <= bottom && x >= left && x <= right;
}
