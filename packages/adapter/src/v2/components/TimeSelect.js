import { TimeSelect as ElTimeSelect } from 'element-ui';
import { h } from '@wakeadmin/h';

// WARNING: 不支持 format
export const TimeSelect = {
  functional: true,
  render(_, context) {
    const { start, end, step, minTime, maxTime, ...other } = context.props;

    // vue3 pickerOptions 提取到了全局
    other.pickerOptions = {
      ...other.pickerOptions,
      start,
      end,
      step,
      minTime,
      maxTime,
    };

    return h(ElTimeSelect, Object.assign({}, context.data, { props: other, attrs: undefined }), context.slots());
  },
};
