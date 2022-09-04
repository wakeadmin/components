import { RateProps, model, Rate } from '@wakeadmin/component-adapter';
import { unref } from '@wakeadmin/demi';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps, globalRegistry } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ARateProps = DefineAtomicProps<
  number,
  RateProps,
  {
    renderPreview?: (value?: number) => any;
  }
>;

declare global {
  interface AtomicProps {
    rate: ARateProps;
  }
}

export const ARateComponent = defineAtomicComponent((props: ARateProps) => {
  const configurable = useFatConfigurable();

  return () => {
    const { value, mode, onChange, context, scene, renderPreview, ...other } = props;
    const passthrough = { ...unref(configurable).aRateProps, ...other };

    if (mode === 'preview') {
      if (renderPreview) {
        return renderPreview(value);
      } else {
        // readonly
        passthrough.disabled = true;
      }
    }

    return <Rate {...passthrough} {...model(value, onChange!)} />;
  };
}, 'ARate');

export const ARate = defineAtomic({
  name: 'rate',
  component: ARateComponent,
  description: '评分',
  author: 'ivan-lee',
});

globalRegistry.register('rate', ARate);
