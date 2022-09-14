import { DatePicker, DatePickerProps, model } from '@wakeadmin/component-adapter';
import { unref } from '@wakeadmin/demi';
import { formatDate } from '@wakeadmin/utils';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ADateRangeValue = Date[] | string[];

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
  }
>;

export const ADateRangeComponent = defineAtomicComponent(
  (props: ADateRangeProps) => {
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

      previewFormat ??= other.format ?? configurable.dateFormat ?? 'YYYY-MM-DD';
      const rangeSeparator = other.rangeSeparator ?? '-';

      return mode === 'preview' ? (
        <span>{preview(value, previewFormat, rangeSeparator)}</span>
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

globalRegistry.register('date-range', ADateRange);
