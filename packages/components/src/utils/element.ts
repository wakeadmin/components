function transferInputData(source: HTMLInputElement, clone: HTMLInputElement): void {
  if (source.type !== 'file') {
    clone.value = source.value;
  }
}
function transferChildData<T extends HTMLElement>(
  selector: string,
  source: HTMLElement,
  clone: HTMLElement,
  cb: (source: T, clone: T) => void
): void {
  const sourceChild = source.querySelectorAll<T>(selector);
  if (sourceChild.length > 0) {
    const cloneChild = clone.querySelectorAll<T>(selector);
    let i = 0;
    for (; i < cloneChild.length; i++) {
      cb(sourceChild[i], cloneChild[i]);
    }
  }
}

export function cloneElement(node: HTMLElement): HTMLElement {
  // todo shadowDom 支持
  const clone = node.cloneNode(true) as HTMLElement;
  const nodeName = node.nodeName.toLowerCase();
  // 删除所有id
  const elementsById = clone.querySelectorAll('[id]');
  clone.removeAttribute('id');
  for (const ele of elementsById) {
    ele.removeAttribute('id');
  }

  // todo canvas的情况也要处理下

  if (nodeName === 'input' || nodeName === 'textarea' || nodeName === 'select') {
    transferInputData(node as HTMLInputElement, clone as HTMLInputElement);
  }

  transferChildData('input, select, textarea', node, clone, transferInputData);

  return clone;
}

export interface ClientRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

export function getClientRect(ele: Element): ClientRect {
  const rect = ele.getBoundingClientRect();

  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: rect.y,
  };
}

export function adjustClientRect(clientRect: Omit<ClientRect, 'x' | 'y'>, top: number, left: number) {
  clientRect.top += top;
  clientRect.bottom = clientRect.top + clientRect.height;

  clientRect.left += left;
  clientRect.right = clientRect.left + clientRect.width;
}

/**
 * 判断是否接近这个容器
 * @param rect
 * @param threshold
 * @param pointerX
 * @param pointerY
 * @returns
 */
export function isPointerNearClientRect(
  rect: ClientRect,
  threshold: number,
  pointerX: number,
  pointerY: number
): boolean {
  const { top, right, bottom, left, width, height } = rect;
  const xThreshold = width * threshold;
  const yThreshold = height * threshold;

  return (
    pointerY > top - yThreshold &&
    pointerY < bottom + yThreshold &&
    pointerX > left - xThreshold &&
    pointerX < right + xThreshold
  );
}

/**
 * 判断是否在指定容器内
 * @param clientRect
 * @param x
 * @param y
 * @returns
 */
export function isInsideClientRect(clientRect: ClientRect, x: number, y: number): boolean {
  const { top, bottom, left, right } = clientRect;
  return y >= top && y <= bottom && x >= left && x <= right;
}
