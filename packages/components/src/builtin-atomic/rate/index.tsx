import { RateProps, model, Rate } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

export type ARateValue = number;

export type ARateProps = DefineAtomicProps<
  ARateValue,
  RateProps,
  {
    renderPreview?: (value?: ARateValue) => any;
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
