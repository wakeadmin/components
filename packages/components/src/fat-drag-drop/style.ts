import { extendStyles, type ClientRect } from '../utils';

export function toggleElementDragStyle(ele: HTMLElement, enable: boolean): void {
  extendStyles(ele, {
    'touch-action': enable ? '' : 'none',
    '-webkit-user-drag': enable ? '' : 'none',
    '-webkit-tap-highlight-color': enable ? '' : 'transparent',
    'user-select': enable ? '' : 'transparent',
  });
}

export function toggleElementDragVisibility(
  element: HTMLElement,
  enable: boolean,
  importantProperties?: Set<'position' | 'top' | 'opacity' | 'left'>
) {
  extendStyles(
    element,
    {
      position: enable ? '' : 'fixed',
      top: enable ? '' : '0',
      opacity: enable ? '' : '0',
      left: enable ? '' : '-999em',
    },
    importantProperties
  );
}

export function getTransform(x: number, y: number): string {
  return `translate3d(${~~x}px, ${~~y}px, 0)`;
}

export function matchElementSize(target: HTMLElement, sourceRect: ClientRect): void {
  target.style.width = `${sourceRect.width}px`;
  target.style.height = `${sourceRect.height}px`;
  target.style.transform = getTransform(sourceRect.left, sourceRect.top);
}
