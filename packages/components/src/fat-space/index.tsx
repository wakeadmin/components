import { declareComponent, declareProps } from '@wakeadmin/h';
import { NoopArray } from '@wakeadmin/utils';
import { normalizeClassName, normalizeStyle } from '../utils';

import { FatSpaceProps, FatSpaceSize } from './types';

const SpaceSize: Record<string, number> = {
  small: 8,
  medium: 16,
  large: 24,
  huge: 32,
};

export const toNumberSize = (size: FatSpaceSize | number = 'small') => {
  if (typeof size === 'string' && !(size in SpaceSize)) {
    throw new Error(`Invalid size: ${size}`);
  }
  return (size in SpaceSize ? SpaceSize[size] : size) as number;
};

const toSizes = (sizes: FatSpaceProps['size'] = 'small'): [number, number] => {
  return (
    Array.isArray(sizes) ? [toNumberSize(sizes[0]), toNumberSize(sizes[0])] : new Array(2).fill(toNumberSize(sizes))
  ) as [number, number];
};

const FatSpaceInner = declareComponent({
  name: 'FatSpace',
  props: declareProps<FatSpaceProps>({
    align: null,
    direction: null,
    size: null,
    wrap: null,
    inline: { type: Boolean, default: true },
  }),
  setup(props, { attrs, slots }) {
    return () => {
      const direction = props.direction ?? 'horizontal';
      const align = props.align;
      const wrap = props.wrap;
      const size = props.size ?? 'small';
      const sizesInNumber = toSizes(size);
      const inline = props.inline;

      const nodes = (slots.default?.() ?? NoopArray) as any[];

      const children = nodes.map((n, idx) => {
        return (
          <div class="fat-space__item" key={n?.key ?? idx}>
            {n}
          </div>
        );
      });

      return (
        <div
          class={normalizeClassName(
            'fat-space',
            `fat-space--${direction}`,
            {
              [`fat-space--align-${align}`]: align,
              'fat-space--wrap': wrap,
              'fat-space--inline': inline,
            },
            attrs.class
          )}
          style={normalizeStyle(attrs.style, { columnGap: `${sizesInNumber[0]}px`, rowGap: `${sizesInNumber[1]}px` })}
        >
          {children}
        </div>
      );
    };
  },
});

export const FatSpace = FatSpaceInner as unknown as (props: FatSpaceProps) => any;
