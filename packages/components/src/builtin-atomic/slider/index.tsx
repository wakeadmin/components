import { Slider, SliderProps, model } from '@wakeadmin/component-adapter';
import { unref } from '@wakeadmin/demi';

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

export const ASliderComponent = defineAtomicComponent((props: ASliderProps) => {
  const configurableRef = useFatConfigurable();

  return () => {
    const configurable = unref(configurableRef);
    const { mode, scene, context, value, onChange, renderPreview, ...other } = props;
    const passthrough = { ...configurable.aSliderProps, ...other };

    if (mode === 'preview') {
      if (renderPreview) {
        return renderPreview(value);
      } else {
        return <span>{value ?? configurable.undefinedPlaceholder}</span>;
      }
    }

    return <Slider {...passthrough} {...model(value, onChange!)}></Slider>;
  };
}, 'ASlider');

export const ASlider = defineAtomic({
  name: 'slider',
  component: ASliderComponent,
  description: '滑块选择器',
  author: 'ivan-lee',
});

globalRegistry.register('slider', ASlider);
