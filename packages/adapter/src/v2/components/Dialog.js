import { Dialog as ElDialog } from 'element-ui';

export const Dialog = {
  functional: true,
  render(h, context) {
    return h(
      ElDialog,
      Object.assign({}, context.data, {
        // 和 element-plus 一样使用 modelValue
        props: Object.assign({}, context.props, {
          visible: context.props.modelValue,
        }),
        // 和 element-plus 一样使用 update:modelValue
        on: Object.assign({}, context.listeners, {
          'update:visible': context.listeners['update:modelValue'],
        }),
      }),
      context.children
    );
  },
};
