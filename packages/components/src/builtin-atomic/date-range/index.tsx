import { DatePicker, DatePickerProps, model, DatePickerValue } from '@wakeadmin/component-adapter';
import { unref } from '@wakeadmin/demi';
import { formatDate } from '@wakeadmin/utils';

import { globalRegistry, AtomicCommonProps, defineAtomic, defineAtomicComponent } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export interface ADateRangeProps
  extends AtomicCommonProps<DatePickerValue>,
    Omit<DatePickerProps, 'value' | 'onChange' | 'disabled' | 'modelValue' | 'onUpdate:modelValue' | 'type'> {
  /**
   * 预览时日期格式，默认同 format
   */
  previewFormat?: string;
}

export const ADateRangeComponent = defineAtomicComponent((props: ADateRangeProps) => {
  const configurableRef = useFatConfigurable();
  const preview = (value: any, format: string, rangeSeparator: string) => {
    const f = (v: any) => {
      if (v == null) {
        return unref(configurableRef).undefinedPlaceholder;
      }

      return formatDate(v, format);
    };

    if (Array.isArray(value)) {
      return `${f(value[0])} ${rangeSeparator} ${f(value[1])}`;
    } else if (value) {
      return f(value);
    }

    return unref(configurableRef).undefinedPlaceholder;
  };

  return () => {
    let { value, mode, onChange, previewFormat, ...other } = props;
    const configurable = unref(configurableRef);
    previewFormat = other.format ?? configurable.dateFormat ?? 'YYYY-MM-DD';
    const rangeSeparator = other.rangeSeparator ?? '-';

    return mode === 'preview' ? (
      <span>{preview(value, previewFormat, rangeSeparator)}</span>
    ) : (
      <DatePicker {...other} type="daterange" {...model(value, onChange!)} />
    );
  };
});

declare global {
  interface AtomicProps {
    'date-range': ADateRangeProps;
  }
}

export const ADateRange = defineAtomic({
  name: 'date-range',
  component: ADateRangeComponent,
  description: '时间范围',
  author: 'ivan-lee',
});

globalRegistry.register('date-range', ADateRange);
