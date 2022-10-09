import { computed, CSSProperties, HTMLAttributes } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { NoopObject } from '@wakeadmin/utils';

import { addUnit, Color, inheritProps, normalizeClassName, normalizeColor, normalizeStyle } from '../utils';

export interface FatIconProps extends Omit<HTMLAttributes, 'color'> {
  color?: Color;
  size?: string | number;
  align?: CSSProperties['vertical-align'];

  /**
   * 加载状态, 默认 false
   */
  loading?: boolean;

  /**
   * 靠左，即在右侧添加边距，默认 false
   */
  left?: boolean;

  /**
   * 靠右，在左侧添加边距，默认 false
   */
  right?: boolean;
}

/**
 * 图标，从 element-plus 中移植
 */
export const FatIcon = declareComponent({
  name: 'FatIcon',
  props: declareProps<FatIconProps>({
    color: null,
    size: null,
    align: null,
    loading: { type: Boolean, default: false },
    left: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
  }),
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
      const { left, right, loading } = props;
      return (
        <i
          class={normalizeClassName('fat-icon', attrs.class, {
            'fat-icon--left': left,
            'fat-icon--right': right,
            'fat-icon--loading': loading,
          })}
          style={normalizeStyle(style.value, attrs.style)}
          {...inheritProps()}
        >
          {slots.default?.()}
        </i>
      );
    };
  },
});
