import { ProgressProps, Progress } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

// progress 是只读的
export type AProgressProps = DefineAtomicProps<number, ProgressProps, {}>;

declare global {
  interface AtomicProps {
    progress: AProgressProps;
  }
}

export const AProgressComponent = defineAtomicComponent(
  (props: AProgressProps) => {
    return () => {
      const { value, mode, onChange, scene, context, ...other } = props;

      return <Progress percentage={value} {...other} />;
    };
  },
  { name: 'AProgress', globalConfigKey: 'aProgressProps' }
);

export const AProgress = defineAtomic({
  name: 'progress',
  component: AProgressComponent,
  description: '进度(只读)',
  author: 'ivan-lee',
});
