import { Slider, SliderProps, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ASliderValue = number;

export type ASliderProps = DefineAtomicProps<
  ASliderValue,
  SliderProps,
  {
    /**
     * 自定义渲染预览
     */
    renderPreview?: (value?: ASliderValue) => any;
    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  }
>;

declare global {
  interface AtomicProps {
    slider: ASliderProps;
  }
}

export const ASliderComponent = defineAtomicComponent(
  (props: ASliderProps) => {
    const configurable = useFatConfigurable();

    return () => {
      const { mode, scene, context, value, undefinedPlaceholder, onChange, renderPreview, ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        } else {
          return (
            <span class={other.class} style={other.style}>
              {value ?? undefinedPlaceholder ?? configurable.undefinedPlaceholder}
            </span>
          );
        }
      }

      return <Slider {...other} {...model(value, onChange!)}></Slider>;
    };
  },
  { name: 'ASlider', globalConfigKey: 'aSliderProps' }
);

export const ASlider = defineAtomic({
  name: 'slider',
  component: ASliderComponent,
  description: '滑块选择器',
  author: 'ivan-lee',
});
