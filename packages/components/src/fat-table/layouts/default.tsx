import { normalizeClassName } from '../../utils';
import { FatTableLayout } from '../types';

import { FatHeader, FatContent } from '../../fat-layout';

/**
 * 默认布局实现
 */
const DefaultLayout: FatTableLayout = props => {
  return (
    <div {...props.rootProps} class={normalizeClassName(props.rootProps.class, 'fat-table', 'fat-table--default')}>
      <FatHeader class="fat-table__header" v-slots={{ title: props.renderTitle, extra: props.renderNavBar }}>
        {!!props.renderQuery && <div class="fat-table__query">{props.renderQuery()}</div>}
      </FatHeader>

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

export default DefaultLayout;
