import { h } from '@wakeadmin/h';
import { Popover as OPopover } from 'element-ui';

export const Popover = {
  name: 'PopoverAdapter',
  functional: true,
  render(_, context) {
    return h(
      OPopover,
      Object.assign({}, context.data, {
        props: Object.assign({}, context.props, {
          value: context.props.value ?? context.props.visible,
        }),
        on: Object.assign({}, context.listeners, {
          input: context.listeners.input ?? context.listeners['update:visible'],
        }),
        attrs: undefined,
      }),
      context.slots()
    );
  },
};
