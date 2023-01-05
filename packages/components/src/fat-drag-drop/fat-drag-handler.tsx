import { declareComponent, declareProps } from '@wakeadmin/h';
import { getCurrentInstance, inject, onMounted } from '@wakeadmin/demi';
import { inheritProps, OurComponentInstance, renderSlot } from '../utils';
import { FatDragRefToken } from './token';
import { FatDragRefError } from './error';

export interface FatDragHandlerProps {
  disabled?: boolean;
  /**
   * 渲染容器
   *
   * 默认为 span
   */
  tag?: string;
}
const FatDragHandlerInner = declareComponent({
  props: declareProps<FatDragHandlerProps>({
    disabled: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: 'span',
    },
  }),
  setup(props, { slots }) {
    const dragRef = inject(FatDragRefToken);
    const instance = getCurrentInstance()!.proxy!;
    if (!dragRef) {
      throw new FatDragRefError('FatDragHandler 只能工作在 FatDragItem 组件中');
    }

    onMounted(() => {
      dragRef.withHandlerElement(instance.$el as any);
    });
    return () => {
      const Tag = props.tag as 'span';
      return <Tag {...inheritProps()}>{renderSlot(props, slots, 'default')}</Tag>;
    };
  },
});

export const FatDragHandler = FatDragHandlerInner as unknown as new (
  props: FatDragHandlerProps
) => OurComponentInstance<typeof props, {}, {}>;
