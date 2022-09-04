import { ProgressProps, Progress } from '@wakeadmin/component-adapter';
import { unref } from '@wakeadmin/demi';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

// progress 是只读的
export type AProgressProps = DefineAtomicProps<number, ProgressProps, {}>;

declare global {
  interface AtomicProps {
    progress: AProgressProps;
  }
}

export const AProgressComponent = defineAtomicComponent((props: AProgressProps) => {
  const configurable = useFatConfigurable();

  return () => {
    const { value, mode, onChange, scene, context, ...other } = props;

    return <Progress percentage={value} {...unref(configurable).aProgressProps} {...other} />;
  };
}, 'AProgress');

export const AProgress = defineAtomic({
  name: 'progress',
  component: AProgressComponent,
  description: '进度(只读)',
  author: 'ivan-lee',
});

globalRegistry.register('progress', AProgress);
