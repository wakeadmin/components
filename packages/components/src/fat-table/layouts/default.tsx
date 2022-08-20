import { normalizeClassName } from '../../utils';
import { FatTableLayout } from '../types';

/**
 * 默认布局实现
 */
const DefaultLayout: FatTableLayout = props => {
  return (
    <div {...props.rootProps} class={normalizeClassName(props.rootProps.class, 'fat-table', 'fat-table--default')}>
      <div class="fat-table__header">
        <div class="fat-table__top">
          <div class="fat-table__title">{props.renderTitle?.()}</div>
          <div class="fat-table__navbar">{props.renderNavBar?.()}</div>
        </div>
        {!!props.renderQuery && <div class="fat-table__query">{props.renderQuery()}</div>}
      </div>

      <div class="fat-table__body">
        {!!props.renderError && <div class="fat-table__error">{props.renderError()}</div>}
        {!!props.renderToolbar && <div class="fat-table__toolbar">{props.renderToolbar()}</div>}

        <div class="fat-table__table">{props.renderTable?.()}</div>
      </div>

      <div class="fat-table__footer">
        {!!props.renderBottomToolbar && <div class="fat-table__bottom-toolbar">{props.renderBottomToolbar()}</div>}
        {!!props.renderPagination && <div class="fat-table__pagination">{props.renderPagination()}</div>}
      </div>
    </div>
  );
};

export default DefaultLayout;
