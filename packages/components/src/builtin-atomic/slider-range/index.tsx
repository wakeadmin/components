import { Slider, SliderProps, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ASliderRangeValue = [number, number];

export type ASliderRangeProps = DefineAtomicProps<
  ASliderRangeValue,
  SliderProps,
  {
    /**
     * 自定义渲染预览
     */
    renderPreview?: (value?: ASliderRangeValue) => any;

    /**
     * 分割器，预览时用于分割开始值和结束值, 默认 ~
     */
    separator?: string;
  }
>;

declare global {
  interface AtomicProps {
    'slider-range': ASliderRangeProps;
  }
}

export const ASliderRangeComponent = defineAtomicComponent(
  (props: ASliderRangeProps) => {
    const configurable = useFatConfigurable();

    return () => {
      const { mode, scene, context, value, onChange, renderPreview, separator = ' ~ ', ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        } else {
          return (
            <span class={other.class} style={other.style}>
              {value ? `${value[0]}${separator}${value[1]}` : configurable.undefinedPlaceholder}
            </span>
          );
        }
      }

      return <Slider range {...other} {...model(value, onChange!)}></Slider>;
    };
  },
  { name: 'ASliderRange', globalConfigKey: 'aSliderRangeProps' }
);

export const ASliderRange = defineAtomic({
  name: 'slider-range',
  component: ASliderRangeComponent,
  description: '滑块范围选择器',
  author: 'ivan-lee',
});
