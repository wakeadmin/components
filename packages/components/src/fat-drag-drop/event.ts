import type { DragRef } from './dragRef';
import type { DropListRef } from './dropListRef';

import { normalizePassiveListenerOptions } from '../utils/event';
import { getDocument } from '../utils';

type DragEventName = 'pointUp' | 'mousemove' | 'touchmove' | 'scroll';

export const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });

export const activeEventListenerOptions = normalizePassiveListenerOptions({ passive: false });

export const activeCapturingEventOptions = normalizePassiveListenerOptions({ passive: false, capture: true });

class DragDropGlobalEventManager<T extends { isDragging(): boolean }, C> {
  private document = getDocument();

  private dropContainerInstance = new Set<C>();

  private dragInstance = new Set<T>();
  private dragEventMap = new Map<DragEventName, Set<(event: MouseEvent | TouchEvent | Event) => void>>();
  private predicate = (item: T) => item.isDragging();

  constructor() {
    this.dragEventMap.set('pointUp', new Set());
    this.dragEventMap.set('mousemove', new Set());
    this.dragEventMap.set('touchmove', new Set());
    this.dragEventMap.set('scroll', new Set());
  }

  dispose() {
    this.dragEventMap.clear();
    this.removeListener();
  }

  addDropContainer(dropContainer: C): void {
    if (!this.dropContainerInstance.has(dropContainer)) {
      this.dropContainerInstance.add(dropContainer);
    }
  }

  removeDropContainer(dropContainer: C): void {
    this.dropContainerInstance.delete(dropContainer);
  }

  // eslint-disable-next-line consistent-return
  startDrag(instance: any, event: TouchEvent | MouseEvent) {
    if (this.dragInstance.has(instance)) {
      return undefined;
    }

    this.dragInstance.add(instance);
    if (this.dragInstance.size === 1) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      this.listenMoveEvent(isTouchEvent(event));
    }
  }

  stopDrag(instance: T): void {
    this.dragInstance.delete(instance);
    if (this.dragInstance.size === 0) {
      this.removeListener();
    }
  }

  isDragging(item: T) {
    return this.dragInstance.has(item);
  }

  private listenMoveEvent(isTouch: boolean) {
    this.document.addEventListener(isTouch ? 'touchend' : 'mouseup', this.pointUpHandler, true);
    this.document.addEventListener('selectstart', this.selectstartHandler, activeCapturingEventOptions);
    this.document.addEventListener('touchmove', this.touchMoveHandle, activeCapturingEventOptions);
    this.document.addEventListener('scroll', this.scrollHandler, true);
    if (!isTouch) {
      this.document.addEventListener('mousemove', this.mouseMoveHandler, activeCapturingEventOptions);
    }
  }

  private removeListener() {
    this.document.removeEventListener('touchend', this.pointUpHandler, true);
    this.document.removeEventListener('mouseup', this.pointUpHandler, true);
    this.document.removeEventListener('selectstart', this.selectstartHandler, activeCapturingEventOptions);
    this.document.removeEventListener('touchmove', this.touchMoveHandle, activeCapturingEventOptions);
    this.document.removeEventListener('mousemove', this.mouseMoveHandler, activeCapturingEventOptions);
  }

  // 拖拽过程中不允许选中
  private selectstartHandler = (event: Event) => {
    if (this.dragInstance.size > 0) {
      event.preventDefault();
    }
  };

  private pointUpHandler = (event: TouchEvent | MouseEvent) => {
    const handlers = this.dragEventMap.get('pointUp')!;
    for (const handler of handlers) {
      handler(event);
    }
  };

  private mouseMoveHandler = (event: MouseEvent) => {
    const handlers = this.dragEventMap.get('mousemove')!;
    for (const handler of handlers) {
      handler(event);
    }
  };

  private scrollHandler = (event: Event) => {
    const handlers = this.dragEventMap.get('scroll')!;
    for (const handler of handlers) {
      handler(event);
    }
  };

  private touchMoveHandle = (event: TouchEvent) => {
    for (const instance of this.dragInstance) {
      if (this.predicate(instance)) {
        event.preventDefault();
        break;
      }
    }
    const handlers = this.dragEventMap.get('touchmove')!;
    for (const handler of handlers) {
      handler(event);
    }
  };

  subscribe(eventName: DragEventName, handler: (event: any) => void): () => void {
    const handlers = this.dragEventMap.get(eventName)!;
    handlers.add(handler);
    return () => {
      handlers.delete(handler);
    };
  }
}

export const DragDropRegistry = new DragDropGlobalEventManager<DragRef, DropListRef>();

export function isTouchEvent(event: Event): event is TouchEvent {
  return event.type.startsWith('touch');
}

class ViewPort {
  private document = getDocument();

  private eventHandlers = new Set<(event: Event) => void>();

  private onResize = (event: Event) => {
    // eslint-disable-next-line no-useless-call
    this.eventHandlers.forEach(handler => handler.call(null, event));
  };

  private addHandler(handler: (event: Event) => void): void {
    this.eventHandlers.add(handler);
    if (this.eventHandlers.size === 1) {
      const _window = this.getWindows();
      _window.addEventListener('resize', this.onResize);
    }
  }

  private deleteHandler(handler: (event: Event) => void): void {
    this.eventHandlers.delete(handler);
    if (this.eventHandlers.size === 0) {
      const _window = this.getWindows();
      _window.removeEventListener('resize', this.onResize);
    }
  }

  private getWindows() {
    return this.document.defaultView || window;
  }

  /**
   * 监听window onResize 变化
   *
   * 返回的是一个取消订阅的函数
   * @param handler
   * @returns
   */
  subscribe(handler: (event: Event) => void): () => void {
    this.addHandler(handler);
    return () => this.deleteHandler(handler);
  }
}

export const ViewPortRegister = new ViewPort();
