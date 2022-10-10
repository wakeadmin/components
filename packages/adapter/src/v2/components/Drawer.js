import { Drawer as ElDrawer } from 'element-ui';
import { h } from '@wakeadmin/h';

export const Drawer = {
  name: 'DrawerAdapter',
  functional: true,
  render(_, context) {
    return h(
      ElDrawer,
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
