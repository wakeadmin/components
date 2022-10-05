import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { computed, ref, watch } from '@wakeadmin/demi';

import { hasSlots, renderSlot, ToHSlotDefinition, ToHEmitDefinition } from '../utils';

import { isWakeadminBayEnabled, ceSlot } from './utils';

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

  /**
   * 当前激活的 tab key
   */
  activeKey?: string | number;

  /**
   * 在微前端环境是否直接使用基座提供的 wkc-header，默认 true
   */
  useWakeadminHeaderIfNeed?: boolean;
}

/**
 * 页面头部布局
 */
export const FatHeader = declareComponent({
  name: 'FatHeader',
  props: declareProps<Omit<FatHeaderProps, keyof FatHeaderEvents>>({
    title: null,
    renderTitle: null,
    renderDefault: null,
    renderExtra: null,
    tabs: null,
    activeKey: null,
    useWakeadminHeaderIfNeed: { type: Boolean, default: true },
  }),
  emits: declareEmits<ToHEmitDefinition<FatHeaderEvents>>(),
  slots: declareSlots<ToHSlotDefinition<FatHeaderSlots>>(),
  setup(props, { slots, emit, attrs }) {
    const hasDefaultSlot = computed(() => hasSlots(props, slots, 'default'));
    const hasTitleSlots = computed(() => hasSlots(props, slots, 'title'));
    const hasExtraSlots = computed(() => hasSlots(props, slots, 'extra'));

    const activeKey = ref<string | number | undefined>();

    const realActiveKey = computed(() => {
      if (activeKey.value != null) {
        return activeKey.value;
      }

      // 默认选择第一个
      return props.tabs?.[0]?.key;
    });

    const handleTabClick = (key: string | number) => {
      activeKey.value = key;

      emit('activeKeyChange', key);
    };

    watch(
      () => props.activeKey,
      () => {
        const nextActiveKey = props.activeKey;
        if (nextActiveKey !== activeKey.value) {
          activeKey.value = nextActiveKey;
        }
      },
      { immediate: true }
    );

    return () => {
      const wakeadminBayEnabled = isWakeadminBayEnabled();

      // 使用 惟客云 基座实现
      if (wakeadminBayEnabled && props.useWakeadminHeaderIfNeed) {
        return (
          <wkc-header class={['fat-header', attrs.class]} style={attrs.style} title={props.title}>
            {!!hasTitleSlots.value && <div {...ceSlot('title')}>{renderSlot(props, slots, 'title')}</div>}
            {!!hasExtraSlots.value && <div {...ceSlot('extra')}>{renderSlot(props, slots, 'extra')}</div>}
            {!!hasDefaultSlot.value && renderSlot(props, slots, 'default')}
          </wkc-header>
        );
      }

      return (
        <div class={['fat-header', attrs.class]} style={attrs.style}>
          <div class={['fat-header__top', { lonely: !hasDefaultSlot.value }]}>
            <div class="fat-header__left">
              {props.tabs ? (
                <div class="fat-header__tabs">
                  {props.tabs.map(menu => {
                    return (
                      <div
                        class={['fat-header__tab', { active: menu.key === realActiveKey.value }]}
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
