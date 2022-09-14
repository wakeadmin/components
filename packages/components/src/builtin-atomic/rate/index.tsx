import { RateProps, model, Rate } from '@wakeadmin/component-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps, globalRegistry } from '../../atomic';

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

export const ARateComponent = defineAtomicComponent(
  (props: ARateProps) => {
    return () => {
      const { value, mode, onChange, context, scene, renderPreview, ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        } else {
          // readonly
          other.disabled = true;
        }
      }

      return <Rate {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'ARate', globalConfigKey: 'aRateProps' }
);

export const ARate = defineAtomic({
  name: 'rate',
  component: ARateComponent,
  description: '评分',
  author: 'ivan-lee',
});

globalRegistry.register('rate', ARate);
