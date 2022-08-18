import { DatePicker as ODatePicker } from 'element-ui';

// TODO: format 转换
export const DatePicker = {
  functional: true,
  render(h, context) {
    const { shortcuts, disabledDate, cellClassName, firstDayOfWeek, ...other } = context.props;

    // vue3 pickerOptions 提取到了全局
    other.pickerOptions = {
      shortcuts,
      disabledDate,
      cellClassName,
      firstDayOfWeek,
    };

    return h(ODatePicker, Object.assign({}, context.data, { props: other }), context.children);
  },
};
