import { DatePicker, DatePickerProps, model, DatePickerValue } from '@wakeadmin/component-adapter';
import { formatDate } from '@wakeadmin/utils';

import { globalRegistry, AtomicCommonProps } from '../../atomic';
import { UNDEFINED_PLACEHOLDER } from '../../constants';

export type ADateRangeProps = AtomicCommonProps<DatePickerValue> &
  Omit<DatePickerProps, 'value' | 'onChange' | 'disabled' | 'modelValue' | 'onUpdate:modelValue' | 'type'> & {
    /**
     * 在 preview 时是否也是展示时间范围, 默认关闭
     * 大部分场景表格展示的都是一个固定的时间点
     */
    previewInRange?: boolean;

    /**
     * 预览时日期格式，默认同 format
     */
    previewFormat?: string;
  };

const preview = (value: any, inRange: boolean, format: string, rangeSeparator: string) => {
  const f = (v: any) => {
    if (v == null) {
      // TODO: 配置 undefined 占位符
      return UNDEFINED_PLACEHOLDER;
    }

    return formatDate(v, format);
  };

  if (inRange) {
    if (Array.isArray(value)) {
      return `${f(value[0])} ${rangeSeparator} ${value[1]}`;
    }
  } else {
    return f(value);
  }

  return UNDEFINED_PLACEHOLDER;
};

export const ADateRange = (props: ADateRangeProps) => {
  let { value, mode, onChange, previewFormat, previewInRange, ...other } = props;

  previewFormat = other.format ?? 'YYYY-MM-DD';
  const rangeSeparator = other.rangeSeparator ?? '-';

  return mode === 'preview' ? (
    preview(value, !!previewInRange, previewFormat, rangeSeparator)
  ) : (
    <DatePicker {...other} type="daterange" {...model(value, onChange!)} />
  );
};

declare global {
  interface AtomicProps {
    'date-range': ADateRangeProps;
  }
}

globalRegistry.register('date-range', {
  name: 'date-range',
  component: ADateRange,
  description: '时间范围',
  author: 'ivan-lee',
});
