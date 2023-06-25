import { DatePicker, DatePickerProps, model } from '@wakeadmin/element-adapter';

import { formatDate } from '../../utils';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ADateRangeValue = Date[] | string[] | number[];

export type ADateRangeProps = DefineAtomicProps<
  ADateRangeValue,
  DatePickerProps,
  {
    /**
     * 预览时日期格式，默认同 format
     */
    previewFormat?: string;

    /**
     * 自定义预览
     */
    renderPreview?: (value?: ADateRangeValue) => any;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  }
>;

export const ADateRangeComponent = defineAtomicComponent(
  (props: ADateRangeProps) => {
    const configurable = useFatConfigurable();
    const preview = (value: any, format: string, rangeSeparator: string) => {
      const f = (v: any) => {
        if (v == null) {
          return props.undefinedPlaceholder ?? configurable.undefinedPlaceholder;
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

      return props.undefinedPlaceholder ?? configurable.undefinedPlaceholder;
    };

    return () => {
      let { value, mode, onChange, previewFormat, scene, context, ...other } = props;

      previewFormat ??= other.format ?? configurable.dateFormat ?? 'YYYY-MM-DD';
      const rangeSeparator = other.rangeSeparator ?? '-';

      return mode === 'preview' ? (
        <span class={other.class} style={other.style}>
          {preview(value, previewFormat, rangeSeparator)}
        </span>
      ) : (
        <DatePicker type="daterange" {...other} {...model(value, onChange!)} />
      );
    };
  },
  { name: 'ADateRange', globalConfigKey: 'aDateRangeProps' }
);

declare global {
  interface AtomicProps {
    'date-range': ADateRangeProps;
  }
}

export const ADateRange = defineAtomic({
  name: 'date-range',
  component: ADateRangeComponent,
  description: '日期范围',
  author: 'ivan-lee',
});
