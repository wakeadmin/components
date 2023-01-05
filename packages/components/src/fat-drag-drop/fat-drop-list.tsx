import { getCurrentInstance, onMounted, onUnmounted, provide, watch } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { hasSlots, OurComponentInstance, renderSlot } from '../utils';
import { DropListRef } from './dropListRef';
import { FatDropContainerToken } from './token';
import { FatDropListEvents, FatDropListProps, FatDropListSlots } from './type';

const FatDropListInner = declareComponent({
  props: declareProps<FatDropListProps>({
    disabled: {
      type: Boolean,
      default: false,
    },
    dragDelay: {
      type: Number,
      default: 0,
    },
    orientation: null,
    previewContainer: undefined,

    // emits
    onDropped: null,
    onEnded: null,
    onEnter: null,
    onExited: null,
    onMove: null,
    onRelease: null,
    onStarted: null,

    // slots
    renderPlaceholder: null,
    renderPreview: null,
  }),
  setup(props, { emit, slots }) {
    const instance = getCurrentInstance()!.proxy!;
    const dropListInstance = new DropListRef(instance.$el as any);

    const renderPlaceholder = hasSlots(props, slots, 'placeholder')
      ? (data: any) => renderSlot(props, slots, 'placeholder', data)
      : undefined;

    if (props.orientation) {
      dropListInstance.setOrientation(props.orientation);
    }

    const renderPreview = hasSlots(props, slots, 'preview')
      ? (data: any) => renderSlot(props, slots, 'preview', data)
      : undefined;

    provide(FatDropContainerToken, {
      instance: dropListInstance,
      renderPlaceholder,
      renderPreview,
      emits: emit,
    });

    watch(
      () => props.disabled,
      val => {
        dropListInstance.disabled = !!val;
      },
      {
        immediate: true,
      }
    );

    dropListInstance.forwardSubscribeToEmit(emit);

    onMounted(() => {
      dropListInstance.withRootElement(instance.$el as any);
    });
    onUnmounted(() => {
      dropListInstance.destroy();
    });
    return () => {
      return <div class="fat-drop-list">{renderSlot(props, slots, 'default')}</div>;
    };
  },
});

export const FatDropList = FatDropListInner as unknown as new (props: FatDropListProps) => OurComponentInstance<
  typeof props,
  FatDropListSlots,
  FatDropListEvents
>;
