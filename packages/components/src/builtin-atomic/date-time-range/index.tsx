import { DatePicker, DatePickerProps, model } from '@wakeadmin/element-adapter';
import { unref } from '@wakeadmin/demi';

import { formatDate } from '../../utils';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ADateTimeRangeValue = Date[] | string[] | number[];

export type ADateTimeRangeProps = DefineAtomicProps<
  ADateTimeRangeValue,
  DatePickerProps,
  {
    /**
     * 预览时日期格式，默认同 format
     */
    previewFormat?: string;

    /**
     * 自定义预览
     */
    renderPreview?: (value?: ADateTimeRangeValue) => any;
  }
>;

export const ADateTimeRangeComponent = defineAtomicComponent(
  (props: ADateTimeRangeProps) => {
    const configurable = useFatConfigurable();

    const preview = (value: any, format: string, rangeSeparator: string) => {
      const f = (v: any) => {
        if (v == null) {
          return configurable.undefinedPlaceholder;
        }

        return formatDate(v, format);
      };

      if (props.renderPreview) {
        return props.renderPreview(value);
      }

      if (Array.isArray(value)) {
        return `${f(value[0])} ${rangeSeparator} ${f(value[1])}`;
      } else if (value) {
        return f(value);
      }

      return unref(configurable).undefinedPlaceholder;
    };

    return () => {
      let { value, mode, onChange, previewFormat, scene, context, ...other } = props;

      previewFormat ??= other.format ?? configurable.dateTimeFormat ?? 'YYYY-MM-DD HH:mm:ss';
      const rangeSeparator = other.rangeSeparator ?? '-';

      return mode === 'preview' ? (
        <span class={other.class} style={other.style}>
          {preview(value, previewFormat, rangeSeparator)}
        </span>
      ) : (
        <DatePicker type="datetimerange" {...other} {...model(value, onChange!)} />
      );
    };
  },
  { name: 'ADateTimeRange', globalConfigKey: 'aDateTimeRangeProps' }
);

declare global {
  interface AtomicProps {
    'date-time-range': ADateTimeRangeProps;
  }
}

export const ADateTimeRange = defineAtomic({
  name: 'date-time-range',
  component: ADateTimeRangeComponent,
  description: '日期时间范围',
  author: 'ivan-lee',
});
