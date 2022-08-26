import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { computed, ref, watch } from '@wakeadmin/demi';

import { hasSlots, renderSlot, ToHSlotDefinition, ToHEmitDefinition } from '../utils';

export interface FatHeaderSlots {
  renderTitle?: () => any;
  renderDefault?: () => any;
  renderExtra?: () => any;
}

export interface FatHeaderTab {
  key: string | number;
  title?: string;
  renderTitle?: () => any;
}

export interface FatHeaderEvents {
  onActiveKeyChange?: (key: string | number) => void;
}

export interface FatHeaderProps extends FatHeaderSlots, FatHeaderEvents {
  /**
   * 标题， 也可以使用 renderTitle 或者 #title slot
   */
  title?: string;

  /**
   * 标签形式
   */
  tabs?: FatHeaderTab[];

  activeKey?: string | number;
}

/**
 * 页面头部布局
 * TODO: 微前端模式复用基座组件
 */
export const FatHeader = declareComponent({
  name: 'FatHeader',
  props: declareProps<FatHeaderProps>(['title', 'renderTitle', 'renderDefault', 'renderExtra', 'tabs', 'activeKey']),
  emits: declareEmits<ToHEmitDefinition<FatHeaderEvents>>(),
  slots: declareSlots<ToHSlotDefinition<FatHeaderSlots>>(),
  setup(props, { slots, emit, attrs }) {
    const hasDefaultSlot = computed(() => {
      return hasSlots(props, slots, 'default');
    });

    const hasTitleSlots = computed(() => {
      return hasSlots(props, slots, 'title');
    });

    const activeKey = ref<string | number>('');

    const handleTabClick = (key: string | number) => {
      activeKey.value = key;

      emit('activeKeyChange', key);
    };

    watch(
      () => props.activeKey,
      () => {
        const nextActiveKey = props.activeKey ?? '';
        if (nextActiveKey !== activeKey.value) {
          activeKey.value = nextActiveKey;
        }
      },
      { immediate: true }
    );

    return () => {
      return (
        <div class={['fat-header', attrs.class]} style={attrs.style}>
          <div class={['fat-header__top', { lonely: !hasDefaultSlot.value }]}>
            <div class="fat-header__left">
              {props.tabs ? (
                <div class="fat-header__tabs">
                  {props.tabs.map(menu => {
                    return (
                      <div
                        class={['fat-header__tab', { active: menu.key === activeKey.value }]}
                        key={menu.key}
                        onClick={() => handleTabClick(menu.key)}
                      >
                        {menu.renderTitle ? menu.renderTitle() : menu.title}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div class="fat-header__title">
                  {hasTitleSlots.value ? renderSlot(props, slots, 'title') : props.title}
                </div>
              )}
            </div>
            {/* 扩展区域，通常放置按钮 */}
            <div class="fat-header__extra">{renderSlot(props, slots, 'extra')}</div>
          </div>
          {/* 内容区， 通常是条件筛选 */}
          <div class="fat-header__body">{renderSlot(props, slots, 'default')}</div>
        </div>
      );
    };
  },
});
