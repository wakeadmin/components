import { declareComponent, declareProps } from '@wakeadmin/h';

export const FatVNode = declareComponent({
  name: 'FatVNode',
  props: declareProps<{ vnode: any }>({
    vnode: null,
  }),
  setup(props) {
    return () => {
      return props.vnode;
    };
  },
});
