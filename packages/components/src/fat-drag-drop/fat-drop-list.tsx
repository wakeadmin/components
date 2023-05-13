import { inject, getCurrentInstance, onMounted, onUnmounted, provide, watch } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { useDevtoolsExpose } from '../hooks';
import { hasSlots, normalizeClassName, OurComponentInstance, renderSlot } from '../utils';
import { DropListRef, DropSortThreshold } from './dropListRef';
import { FatDragDropError } from './error';
import { FatDropContainerToken, FatDropListGroupToken } from './token';
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
    connectTo: {
      type: Array,
      default: () => [],
    },
    enterPredicate: {
      // 默认是函数的话 vue会执行一次 所以这里嵌一下
      default: () => () => true,
    },
    dropSortThreshold: {
      type: Number,
      default: DropSortThreshold,
    },
    data: {
      type: Array,
      default: () => [],
    },

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
  setup(props, { emit, slots, expose, attrs }) {
    const instance = getCurrentInstance()!.proxy!;
    const dropListInstance = new DropListRef(instance.$el as any);

    const renderPlaceholder = hasSlots(props, slots, 'placeholder')
      ? (data: any) => renderSlot(props, slots, 'placeholder', data)
      : undefined;

    const renderPreview = hasSlots(props, slots, 'preview')
      ? (data: any) => renderSlot(props, slots, 'preview', data)
      : undefined;

    const dropListGroup = inject(FatDropListGroupToken, null);

    if (dropListGroup) {
      dropListGroup.add(dropListInstance);
      dropListInstance.withDropListGroup(dropListGroup);
    }

    provide(FatDropContainerToken, {
      instance: dropListInstance,
      renderPlaceholder,
      renderPreview,
      emits: emit,
    });

    // 覆盖掉 防止子元素获取到一样的dropListGroup
    // @ts-expect-error
    provide(FatDropListGroupToken, undefined);

    watch(
      () => props.disabled,
      val => {
        dropListInstance.disabled = !!val;
      },
      {
        immediate: true,
      }
    );
    watch(
      () => props.orientation,
      val => {
        dropListInstance.setOrientation(val || 'vertical');
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.enterPredicate,
      val => {
        if (typeof val !== 'function') {
          throw new FatDragDropError('enterPredicate 必须是一个函数');
        }
        dropListInstance.enterPredicate = val;
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.dropSortThreshold,
      val => {
        if (typeof val !== 'number') {
          throw new FatDragDropError('dropSortThreshold 必须是一个数字');
        }
        dropListInstance.setDropSortThreshold(val);
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.connectTo,
      val => {
        if (!val || !Array.isArray(val) || !val.every(item => item instanceof DropListRef)) {
          throw new FatDragDropError('connectTo 必须是一个DropListRef数组');
        }
        dropListInstance.withConnectTo(props.connectTo!);
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.data,
      val => {
        if (!Array.isArray(val)) {
          throw new FatDragDropError('data 必须是一个数组');
        }
        dropListInstance.withData(props.data);
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

      if (dropListGroup) {
        dropListGroup.delete(dropListInstance);
      }
    });

    useDevtoolsExpose({
      dropListRef: dropListInstance,
    });

    expose({
      // 暴露出去 提供给connectTo使用
      instance: dropListInstance,
    });

    return () => {
      return (
        <div class={normalizeClassName('fat-drop-list', attrs.class)} style={attrs.style}>
          {renderSlot(props, slots, 'default')}
        </div>
      );
    };
  },
});

export const FatDropList = FatDropListInner as unknown as new (props: FatDropListProps) => OurComponentInstance<
  typeof props,
  FatDropListSlots,
  FatDropListEvents
>;
