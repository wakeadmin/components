import { DatePicker as ODatePicker } from 'element-ui';
import { h } from '@wakeadmin/h';

import { normalizeDateFormat } from '../../shared';

export const DatePicker = {
  functional: true,
  render(_, context) {
    const { shortcuts, disabledDate, cellClassName, firstDayOfWeek, format, valueFormat, ...other } = context.props;

    // vue3 pickerOptions 提取到了全局
    other.pickerOptions = {
      ...other.pickerOptions,
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

    return h(ODatePicker, Object.assign({}, context.data, { props: other, attrs: undefined }), context.slots());
  },
};
