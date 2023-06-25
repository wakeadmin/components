import { TimePicker, TimePickerProps, model } from '@wakeadmin/element-adapter';

import { formatDate } from '../../utils';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ATimeValue = string | Date | number;
export type ATimeProps = DefineAtomicProps<
  ATimeValue,
  TimePickerProps,
  {
    /**
     * 预览时日期格式，默认同 format
     */
    previewFormat?: string;

    /**
     * 自定义预览
     */
    renderPreview?: (value?: ATimeValue) => any;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  }
>;

export const ATimeComponent = defineAtomicComponent(
  (props: ATimeProps) => {
    const configurable = useFatConfigurable();

    return () => {
      let { value, mode, onChange, previewFormat, scene, context, renderPreview, undefinedPlaceholder, ...other } =
        props;

      previewFormat ??= other.format ?? configurable.timeFormat ?? 'HH:mm';

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        return (
          <span class={other.class} style={other.style}>
            {value != null
              ? formatDate(value, previewFormat)
              : undefinedPlaceholder ?? configurable.undefinedPlaceholder}
          </span>
        );
      }

      return <TimePicker {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'ATime', globalConfigKey: 'aTimeProps' }
);

declare global {
  interface AtomicProps {
    time: ATimeProps;
  }
}

export const ATime = defineAtomic({
  name: 'time',
  component: ATimeComponent,
  description: '时间',
  author: 'ivan-lee',
});
