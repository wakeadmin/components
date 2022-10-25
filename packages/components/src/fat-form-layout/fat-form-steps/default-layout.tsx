import { FatContent, FatFloatFooter } from '../../fat-layout';
import { addUnit, normalizeClassName } from '../../utils';

import { FatFormStepsLayout } from './types';

export const defaultLayout: FatFormStepsLayout = renders => {
  const { hasSections, vertical, formWidth } = renders;

  const contentStyle = formWidth ? { maxWidth: addUnit(formWidth) } : undefined;

  return (
    <div
      class={normalizeClassName('fat-form-steps-default-layout', {
        'fat-form-steps-default-layout--section': hasSections,
        'fat-form-steps-default-layout--vertical': vertical,
      })}
    >
      {hasSections ? (
        <div class="fat-form-steps-default-layout__standalone">
          <div class="fat-form-steps-default-layout__steps">{renders.renderSteps()}</div>
          <div class="fat-form-steps-default-layout__content" style={contentStyle}>
            {renders.renderContent()}
          </div>
        </div>
      ) : (
        <FatContent class="fat-form-steps-default-layout__body">
          <div class="fat-form-steps-default-layout__steps">{renders.renderSteps()}</div>
          <div class="fat-form-steps-default-layout__content" style={contentStyle}>
            {renders.renderContent()}
          </div>
        </FatContent>
      )}
      <FatFloatFooter class="fat-form-steps-default-layout__footer">{renders.renderSubmitter()}</FatFloatFooter>
    </div>
  );
};
