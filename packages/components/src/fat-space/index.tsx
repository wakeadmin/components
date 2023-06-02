import { declareComponent, declareProps } from '@wakeadmin/h';
import { booleanPredicate, NoopArray } from '@wakeadmin/utils';
import { normalizeChildren, normalizeClassName, normalizeStyle } from '../utils';

import { FatSpaceProps, FatSpaceSize } from './types';

export * from './types';

// 遵循惟客云规范
const SpaceSize: Record<string, number> = {
  xs: 8,
  sm: 16,
  base: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

export const toNumberSize = (size: FatSpaceSize = 'xs') => {
  if (typeof size === 'string' && !(size in SpaceSize)) {
    throw new Error(`Invalid size: ${size}`);
  }

  return (typeof size === 'string' ? SpaceSize[size] : size) as number;
};

const toSizes = (sizes: FatSpaceProps['size'] = 'xs'): [number, number] => {
  return (
    Array.isArray(sizes) ? [toNumberSize(sizes[0]), toNumberSize(sizes[0])] : new Array(2).fill(toNumberSize(sizes))
  ) as [number, number];
};

export const FatSpace = declareComponent({
  name: 'FatSpace',
  props: declareProps<FatSpaceProps>({
    align: { type: null, default: 'center' },
    direction: null,
    size: null,
    wrap: { type: Boolean, default: false },
    inline: { type: Boolean, default: true },
  }),
  setup(props, { attrs, slots }) {
    return () => {
      const direction = props.direction ?? 'horizontal';
      const align = props.align;
      const wrap = props.wrap;
      const size = props.size ?? 'xs';
      const sizesInNumber = toSizes(size);
      const inline = props.inline;

      const nodes = normalizeChildren((slots.default?.() ?? NoopArray) as any[]);

      const children = nodes?.filter(booleanPredicate).map((n, idx) => {
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
