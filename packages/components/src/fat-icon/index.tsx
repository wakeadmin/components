import { computed, CSSProperties, HTMLAttributes } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { NoopObject } from '@wakeadmin/utils';

import { addUnit, Color, inheritProps, normalizeClassName, normalizeColor, normalizeStyle } from '../utils';

export interface FatIconProps extends Omit<HTMLAttributes, 'color'> {
  color?: Color;
  size?: string | number;
  align?: CSSProperties['vertical-align'];
}

/**
 * 图标，从 element-plus 中移植
 */
export const FatIcon = declareComponent({
  name: 'FatIcon',
  props: declareProps<FatIconProps>({ color: null, size: null, align: null }),
  setup(props, { slots, attrs }) {
    const style = computed(() => {
      const { size, color, align } = props;
      if (!size && !color && !align) {
        return NoopObject;
      }

      return {
        fontSize: addUnit(size),
        verticalAlign: align,
        '--color': normalizeColor(color),
      };
    });

    return () => {
      return (
        <i
          class={normalizeClassName('fat-icon', attrs.class)}
          style={normalizeStyle(style.value, attrs.style)}
          {...inheritProps()}
        >
          {slots.default?.()}
        </i>
      );
    };
  },
});
