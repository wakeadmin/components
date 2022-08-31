import { DatePicker, DatePickerProps, model, DatePickerValue } from '@wakeadmin/component-adapter';
import { formatDate } from '@wakeadmin/utils';

import { globalRegistry, AtomicCommonProps, defineAtomic } from '../../atomic';
import { UNDEFINED_PLACEHOLDER } from '../../constants';

export interface ADateRangeProps
  extends AtomicCommonProps<DatePickerValue>,
    Omit<DatePickerProps, 'value' | 'onChange' | 'disabled' | 'modelValue' | 'onUpdate:modelValue' | 'type'> {
  /**
   * 预览时日期格式，默认同 format
   */
  previewFormat?: string;
}

const preview = (value: any, format: string, rangeSeparator: string) => {
  const f = (v: any) => {
    if (v == null) {
      // TODO: 配置 undefined 占位符
      return UNDEFINED_PLACEHOLDER;
    }

    return formatDate(v, format);
  };

  if (Array.isArray(value)) {
    return `${f(value[0])} ${rangeSeparator} ${f(value[1])}`;
  } else if (value) {
    return f(value);
  }

  return UNDEFINED_PLACEHOLDER;
};

export const ADateRangeComponent = (props: ADateRangeProps) => {
  let { value, mode, onChange, previewFormat, ...other } = props;

  previewFormat = other.format ?? 'YYYY-MM-DD';
  const rangeSeparator = other.rangeSeparator ?? '-';

  return mode === 'preview' ? (
    preview(value, previewFormat, rangeSeparator)
  ) : (
    <DatePicker {...other} type="daterange" {...model(value, onChange!)} />
  );
};

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
