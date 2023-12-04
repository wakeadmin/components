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
      renderQuery={props.renderQuery}
      renderTitle={props.renderTitle}
      renderExtra={props.renderNavBar}
    >
      <div class="fat-table__body">
        {!!props.renderError && <div class="fat-table__error">{props.renderError()}</div>}
        {(!!props.renderToolbar || !!props.renderSettings) && (
          <div class="fat-table__toolbar">
            <main class="fat-table__toolbar-main">{props.renderToolbar?.()}</main>
            {!!props.renderSettings && <div class="fat-table__settings">{props.renderSettings()}</div>}
          </div>
        )}

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
