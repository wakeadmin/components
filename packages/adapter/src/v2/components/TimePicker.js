import { TimePicker as ElTimePicker } from 'element-ui';
import { h } from '@wakeadmin/h';

import { normalizeDateFormat } from '../../shared/date-format';

export const TimePicker = {
  functional: true,
  render(_, context) {
    const { format, selectableRange, valueFormat, ...other } = context.props;

    // vue3 pickerOptions 提取到了全局
    other.pickerOptions = {
      ...other.pickerOptions,
      format: format && normalizeDateFormat(format),
      selectableRange,
    };

    if (valueFormat) {
      other.valueFormat = normalizeDateFormat(valueFormat);
    }

    return h(ElTimePicker, Object.assign({}, context.data, { props: other, attrs: undefined }), context.slots());
  },
};
