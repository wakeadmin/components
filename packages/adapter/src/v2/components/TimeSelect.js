import { TimeSelect as ElTimeSelect } from 'element-ui';

// WARNING: 不支持 format
export const TimeSelect = {
  functional: true,
  render(h, context) {
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

    return h(ElTimeSelect, Object.assign({}, context.data, { props: other }), context.children);
  },
};
