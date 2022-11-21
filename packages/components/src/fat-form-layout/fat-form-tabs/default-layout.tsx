import { FatFloatFooter } from '../../fat-layout';
import { FatFormTabsLayout } from './types';

export const DEFAULT_LAYOUT: FatFormTabsLayout = renderers => {
  return (
    <div class="fat-form-tabs-default-layout">
      {renderers.renderTabs()}
      <FatFloatFooter>{renderers.renderSubmitter()}</FatFloatFooter>
    </div>
  );
};
