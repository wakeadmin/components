import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { computed } from '@wakeadmin/demi';

import { hasSlots, renderSlot, ToHSlotDefinition } from '../utils';

export interface FatCardSlots {
  /**
   * 标题
   */
  renderTitle?: () => any;

  /**
   * 右侧扩展区域
   */
  renderExtra?: () => any;

  /**
   * 内容区域
   */
  renderDefault?: () => any;
}

export interface FatCardProps extends FatCardSlots {
  /**
   * 标题。 也可以使用 renderTitle 或者 #title 插槽
   */
  title?: any;

  /**
   * 外置标题栏，默认 false
   */
  escapeHeader?: boolean;

  /**
   * 内容区是否添加 padding, 默认 true
   */
  padding?: boolean;
}

/**
 * 卡片
 */
export const FatCard = declareComponent({
  name: 'FatCard',
  props: declareProps<FatCardProps>({
    title: null,
    escapeHeader: { type: Boolean, default: false },
    padding: { type: Boolean, default: true },
    renderTitle: null,
    renderExtra: null,
    renderDefault: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatCardSlots>>(),
  setup(props, { attrs, slots }) {
    const hasHeader = computed(() => {
      return !!props.title || hasSlots(props, slots, 'title') || hasSlots(props, slots, 'extra');
    });

    return () => {
      const { title, escapeHeader, padding } = props;

      return (
        <div class={['fat-card', attrs.class, { 'fat-card--escaped': escapeHeader }]} style={attrs.style}>
          {hasHeader.value && (
            <header class="fat-card__header">
              <div class="fat-card__title">
                {hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title') : title}
              </div>
              <div class="fat-card__extra">{renderSlot(props, slots, 'extra')}</div>
            </header>
          )}
          <main class={['fat-card__content', { 'fat-card__content--padding': padding }]}>
            {renderSlot(props, slots, 'default')}
          </main>
        </div>
      );
    };
  },
});
