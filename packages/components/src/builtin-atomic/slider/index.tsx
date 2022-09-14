import { Slider, SliderProps, model } from '@wakeadmin/component-adapter';

import { defineAtomic, globalRegistry, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ASliderProps = DefineAtomicProps<
  number,
  SliderProps,
  {
    /**
     * 自定义渲染预览
     */
    renderPreview?: (value?: number) => any;
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
      const { mode, scene, context, value, onChange, renderPreview, ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        } else {
          return <span>{value ?? configurable.undefinedPlaceholder}</span>;
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

globalRegistry.register('slider', ASlider);
