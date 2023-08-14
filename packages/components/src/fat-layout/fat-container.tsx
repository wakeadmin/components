import { computed, ref, watch } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';

import { ToHEmitDefinition, ToHSlotDefinition, hasSlots, renderSlot } from '../utils';

import { useFatConfigurable } from '../fat-configurable';
import { FatCard } from './fat-card';

export interface FatContainerSlots {
  /**
   * 标题区
   */
  renderTitle?: () => any;

  /**
   * 标题额外区域
   */
  renderExtra?: () => any;

  /**
   * 筛选区, 可选
   */
  renderQuery?: () => any;

  /**
   * 内容区域
   */
  renderDefault?: () => any;
}

export interface FatContainerTab {
  key: string | number;
  title?: string;
  renderTitle?: () => any;
}

export interface FatContainerEvents {
  onActiveKeyChange?: (key: string | number) => void;
}

export interface FatContainerProps extends FatContainerSlots, FatContainerEvents {
  /**
   * 标题， 也可以使用 renderTitle 或者 #title slot
   */
  title?: string;

  /**
   * 标签形式
   */
  tabs?: FatContainerTab[];

  /**
   * 当前激活的 tab key
   */
  activeKey?: string | number;

  /**
   * 传统模式，即将筛选区和内容区分离的形式，默认 false
   *
   * 这个选项也可以通过 FatConfigurable 的 legacyContainer 配置
   */
  legacyMode?: boolean;

  /**
   * 是否有边框，默认为 true
   */
  border?: boolean;
}

/**
 * 页面布局
 */
export const FatContainer = declareComponent({
  name: 'FatContainer',
  props: declareProps<Omit<FatContainerProps, keyof FatContainerEvents>>({
    title: null,
    tabs: null,
    activeKey: null,
    legacyMode: { type: Boolean, default: undefined },
    border: null,

    // slots
    renderTitle: null,
    renderExtra: null,
    renderQuery: null,
    renderDefault: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatContainerEvents>>(),
  slots: declareSlots<ToHSlotDefinition<FatContainerSlots>>(),
  setup(props, { slots, emit, attrs }) {
    const configurable = useFatConfigurable();
    const hasQuerySlots = computed(() => hasSlots(props, slots, 'query'));
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

    const titleRenderOrSlot = computed(() => {
      if (props.tabs) {
        return (
          <div class="fat-container__tabs">
            {props.tabs.map(menu => {
              return (
                <div
                  class={['fat-container__tab', { active: menu.key === realActiveKey.value }]}
                  key={menu.key}
                  onClick={() => handleTabClick(menu.key)}
                >
                  {menu.renderTitle ? menu.renderTitle() : menu.title}
                </div>
              );
            })}
          </div>
        );
      }
      if (hasTitleSlots.value) {
        return renderSlot(props, slots, 'title');
      }
      return undefined;
    });

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
      const legacyMode = (props.legacyMode ?? configurable.legacyContainer) && hasDefaultSlot.value;
      const className = ['fat-container', attrs.class, { 'fat-container--legacy': legacyMode }];
      const style = attrs.style;
      const rootProps = { class: className, style };

      const header = (
        <FatCard
          {...(legacyMode ? undefined : rootProps)}
          border={props.border}
          title={props.title}
          padding={false}
          v-slots={{
            title: titleRenderOrSlot.value,
            /* 扩展区域，通常放置按钮 */
            extra: hasExtraSlots.value ? () => renderSlot(props, slots, 'extra') : undefined,
          }}
        >
          {/* 筛选区， 通常是条件筛选 */}
          {hasQuerySlots.value && <div class="fat-container__query">{renderSlot(props, slots, 'query')}</div>}
          {/* 内容区， 可以放置列表或表格 */}
          {hasDefaultSlot.value && !legacyMode && (
            <div class="fat-container__body">{renderSlot(props, slots, 'default')}</div>
          )}
        </FatCard>
      );

      if (legacyMode) {
        return (
          <div {...rootProps}>
            {header}
            {/* 内容区， 可以放置列表或表格 */}
            <FatCard class="fat-container__body">{renderSlot(props, slots, 'default')}</FatCard>
          </div>
        );
      }

      return header;
    };
  },
});
