import { DatePicker, DatePickerProps, model } from '@wakeadmin/element-adapter';

import { formatDate } from '../../utils';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ADateTimeValue = string | Date | number;
export type ADateTimeProps = DefineAtomicProps<
  ADateTimeValue,
  DatePickerProps,
  {
    /**
     * 预览时日期格式，默认同 format
     */
    previewFormat?: string;

    /**
     * 自定义预览
     */
    renderPreview?: (value: ADateTimeValue) => any;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  }
>;

export const ADateTimeComponent = defineAtomicComponent(
  (props: ADateTimeProps) => {
    const configurable = useFatConfigurable();
    const preview = (value: any, format: string, valueFormat: string | undefined) => {
      if (props.renderPreview) {
        return props.renderPreview(value);
      }

      if (value == null) {
        return props.undefinedPlaceholder ?? configurable.undefinedPlaceholder;
      }

      return formatDate(value, format, valueFormat);
    };

    return () => {
      let { value, mode, onChange, previewFormat, scene, context, ...other } = props;

      previewFormat ??= other.format ?? configurable.dateTimeFormat ?? 'YYYY-MM-DD HH:mm:ss';

      return mode === 'preview' ? (
        <span class={other.class} style={other.style}>
          {preview(value, previewFormat, other.valueFormat)}
        </span>
      ) : (
        <DatePicker type="datetime" {...other} {...model(value, onChange!)} />
      );
    };
  },
  { name: 'ADateTime', globalConfigKey: 'aDateTimeProps' }
);

declare global {
  interface AtomicProps {
    'date-time': ADateTimeProps;
  }
}

export const ADateTime = defineAtomic({
  name: 'date-time',
  component: ADateTimeComponent,
  description: '日期时间',
  author: 'ivan-lee',
});
