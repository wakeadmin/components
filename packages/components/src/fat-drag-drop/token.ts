import { InjectionKey } from '@wakeadmin/demi';
import { DropListRef } from './dropListRef';
import { DragRef } from './dragRef';
import { DragRefEvents } from './type';

export const FatDropContainerToken: InjectionKey<{
  instance: DropListRef;
  emits<K extends keyof DragRefEvents>(eventName: K, ...args: Parameters<DragRefEvents[K]>): void;
  renderPlaceholder?: (...args: any) => any;
  renderPreview?: (...args: any) => any;
}> = Symbol('FatDropContainer');

export const FatDragRefToken: InjectionKey<DragRef> = Symbol('FatDragRef');

export const FatDropListGroupToken: InjectionKey<Set<DropListRef>> = Symbol('FatDropListGroup');
