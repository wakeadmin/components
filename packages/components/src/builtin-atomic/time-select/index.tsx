import { TimeSelect, TimeSelectProps, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ATimeSelectValue = string;
export type ATimeSelectProps = DefineAtomicProps<
  ATimeSelectValue,
  TimeSelectProps,
  {
    /**
     * 自定义预览
     */
    renderPreview?: (value?: ATimeSelectValue) => any;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  }
>;

export const ATimeSelectComponent = defineAtomicComponent(
  (props: ATimeSelectProps) => {
    const configurable = useFatConfigurable();

    return () => {
      let { value, mode, onChange, scene, context, renderPreview, undefinedPlaceholder, ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        return (
          <span class={other.class} style={other.style}>
            {value != null ? value : undefinedPlaceholder ?? configurable.undefinedPlaceholder}
          </span>
        );
      }

      return <TimeSelect {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'ATimeSelect', globalConfigKey: 'aTimeSelectProps' }
);

declare global {
  interface AtomicProps {
    'time-select': ATimeSelectProps;
  }
}

export const ATimeSelect = defineAtomic({
  name: 'time-select',
  component: ATimeSelectComponent,
  description: '时间选择器',
  author: 'ivan-lee',
});
