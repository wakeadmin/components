import { normalizeClassName } from '../../utils';
import { FatTableLayout } from '../types';

import { FatContainer } from '../../fat-layout';

/**
 * 默认布局实现
 */
const DefaultLayout: FatTableLayout = props => {
  return (
    <FatContainer
      {...props.layoutProps}
      {...props.rootProps}
      class={normalizeClassName(props.rootProps.class, 'fat-table', 'fat-table--default')}
      v-slots={{ title: props.renderTitle, extra: props.renderNavBar, query: props.renderQuery }}
    >
      <div class="fat-table__body">
        {!!props.renderError && <div class="fat-table__error">{props.renderError()}</div>}
        {!!props.renderToolbar && <div class="fat-table__toolbar">{props.renderToolbar()}</div>}

        <div class="fat-table__table">{props.renderTable?.()}</div>
      </div>

      <div class="fat-table__footer">
        {!!props.renderBottomToolbar && <div class="fat-table__bottom-toolbar">{props.renderBottomToolbar()}</div>}
        {!!props.renderPagination && <div class="fat-table__pagination">{props.renderPagination()}</div>}
      </div>
    </FatContainer>
  );
};

export default DefaultLayout;
