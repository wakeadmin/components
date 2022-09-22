import { hasSlots, normalizeClassName, renderSlot, ToHSlotDefinition } from '../../utils';
import { FatTableLayout } from '../types';

import { computed } from '@wakeadmin/demi';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { FatContent, FatHeaderSlots } from '../../fat-layout';

export interface SimpleTableHeaderProps extends FatHeaderSlots {
  title?: string;
}

const SimpleTableHeader = declareComponent({
  name: 'SimpleTableHeader',
  props: declareProps<SimpleTableHeaderProps>({
    title: null,
    renderTitle: null,
    renderDefault: null,
    renderExtra: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatHeaderSlots>>(),
  setup(props, { slots, attrs }) {
    const hasDefaultSlot = computed(() => hasSlots(props, slots, 'default'));
    const hasTitleSlots = computed(() => hasSlots(props, slots, 'title'));
    const hasExtraSlots = computed(() => hasSlots(props, slots, 'extra'));
    const hasTitle = computed(() => {
      return hasTitleSlots.value || props.title;
    });

    const hasTop = computed(() => {
      return hasExtraSlots.value || hasTitleSlots.value;
    });

    return () => (
      <div class={attrs.class} style={attrs.style}>
        {hasTop.value && (
          <div class="fat-table__header-top">
            {hasTitle.value && (
              <div class="fat-table__header-title">
                {hasTitleSlots.value ? renderSlot(props, slots, 'title') : props.title}
              </div>
            )}
            {hasExtraSlots.value && <div class="fat-table__header-extra">{renderSlot(props, slots, 'extra')}</div>}
          </div>
        )}
        {hasDefaultSlot.value && <div class="fat-table__header-body">{renderSlot(props, slots, 'default')}</div>}
      </div>
    );
  },
});

/**
 * 建议表格布局
 */
const SimpleLayout: FatTableLayout = props => {
  return (
    <div {...props.rootProps} class={normalizeClassName(props.rootProps.class, 'fat-table', 'fat-table--simple')}>
      <SimpleTableHeader class="fat-table__header" v-slots={{ title: props.renderTitle, extra: props.renderNavBar }}>
        {!!props.renderQuery && <div class="fat-table__query">{props.renderQuery()}</div>}
      </SimpleTableHeader>

      <FatContent class="fat-table__content">
        <div class="fat-table__body">
          {!!props.renderError && <div class="fat-table__error">{props.renderError()}</div>}
          {!!props.renderToolbar && <div class="fat-table__toolbar">{props.renderToolbar()}</div>}

          <div class="fat-table__table">{props.renderTable?.()}</div>
        </div>

        <div class="fat-table__footer">
          {!!props.renderBottomToolbar && <div class="fat-table__bottom-toolbar">{props.renderBottomToolbar()}</div>}
          {!!props.renderPagination && <div class="fat-table__pagination">{props.renderPagination()}</div>}
        </div>
      </FatContent>
    </div>
  );
};

export default SimpleLayout;
