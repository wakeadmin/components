import { Dialog as ElDialog } from 'element-ui';
import { h } from '@wakeadmin/h';

export const Dialog = {
  name: 'DialogAdapter',
  functional: true,
  render(_, context) {
    return h(
      ElDialog,
      Object.assign({}, context.data, {
        props: Object.assign({}, context.props, {
          visible: context.props.modelValue,
        }),
        on: Object.assign({}, context.listeners, {
          'update:visible': context.listeners['update:modelValue'],
        }),
        attrs: undefined,
      }),
      context.slots()
    );
  },
};
