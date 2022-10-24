import { FatFloatFooter } from '../../fat-layout';

import { FatFormStepsLayout } from './types';

export const defaultLayout: FatFormStepsLayout = renders => {
  return (
    <div class="fat-form-steps-default-layout">
      <div class="fat-form-steps-default-layout__steps">{renders.renderSteps()}</div>
      <div class="fat-form-steps-default-layout__content">{renders.renderContent()}</div>
      <FatFloatFooter class="fat-form-steps-default-layout__footer">{renders.renderSubmitter()}</FatFloatFooter>
    </div>
  );
};
