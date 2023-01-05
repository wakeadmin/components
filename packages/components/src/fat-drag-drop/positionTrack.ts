import { adjustClientRect, getClientRect, type ClientRect } from '../utils';

interface ScrollPosition {
  top: number;
  left: number;
}


export class DragPositionTrack {
  readonly positions = new Map<
    Document | HTMLElement,
    {
      scrollPosition: ScrollPosition;
      clientRect?: ClientRect;
    }
  >();

  private readonly document = document;

  clear() {
    this.positions.clear();
  }

  cache(elements: readonly HTMLElement[]) {
    this.clear();
    this.positions.set(this.document, {
      scrollPosition: this.getViewportScrollPosition(),
    });

    elements.forEach(element => {
      this.positions.set(element, {
        scrollPosition: { top: element.scrollTop, left: element.scrollLeft },
        clientRect: getClientRect(element),
      });
    });
  }

  handleScroll(event: Event): ScrollPosition | null {
    const target = event.target as HTMLElement | Document;
    const cachedPosition = this.positions.get(target);

    if (!cachedPosition) {
      return null;
    }

    const scrollPosition = cachedPosition.scrollPosition;
    let newTop: number;
    let newLeft: number;

    if (target === this.document) {
      const viewportScrollPosition = this.getViewportScrollPosition();
      newTop = viewportScrollPosition.top;
      newLeft = viewportScrollPosition.left;
    } else {
      newTop = (target as HTMLElement).scrollTop;
      newLeft = (target as HTMLElement).scrollLeft;
    }

    const topDifference = scrollPosition.top - newTop;
    const leftDifference = scrollPosition.left - newLeft;

    this.positions.forEach((position, node) => {
      if (position.clientRect && target !== node && target.contains(node)) {
        adjustClientRect(position.clientRect, topDifference, leftDifference);
      }
    });

    scrollPosition.top = newTop;
    scrollPosition.left = newLeft;

    return { top: topDifference, left: leftDifference };
  }

  getViewportScrollPosition() {
    return { top: window.scrollY, left: window.scrollX };
  }
}
