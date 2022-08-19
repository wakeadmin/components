import { DatePicker as ODatePicker } from 'element-ui';

import { normalizeDateFormat } from '../../shared';

export const DatePicker = {
  functional: true,
  render(h, context) {
    const { shortcuts, disabledDate, cellClassName, firstDayOfWeek, format, valueFormat, ...other } = context.props;

    // vue3 pickerOptions 提取到了全局
    other.pickerOptions = {
      shortcuts,
      disabledDate,
      cellClassName,
      firstDayOfWeek,
    };

    if (format) {
      other.format = normalizeDateFormat(format);
    }

    if (valueFormat) {
      other.valueFormat = normalizeDateFormat(valueFormat);
    }

    return h(ODatePicker, Object.assign({}, context.data, { props: other }), context.children);
  },
};
