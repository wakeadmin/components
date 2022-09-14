import { OptionProps } from '@wakeadmin/element-adapter';

import { Color } from '../../utils';

export { normalizeColor } from '../../utils';

export interface ASelectOption extends OptionProps {
  /**
   * 颜色
   */
  color?: Color;
}
