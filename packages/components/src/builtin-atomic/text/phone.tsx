import { hidePhoneNumber, PHONE_REG } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

import { ATextProps, ATextComponent } from './text';

export interface APhoneProps extends ATextProps {
  /**
   * 预览时是否添加掩码，默认 false
   */
  mask?: boolean;
}

declare global {
  interface AtomicProps {
    phone: APhoneProps;
  }
}

// TODO: 支持国际手机号码
export const APhoneComponent = defineAtomicComponent(
  (props: APhoneProps) => {
    const configurable = useFatConfigurable();

    return () => {
      return ATextComponent(
        props.mode === 'preview' && props.mask && props.value
          ? {
              renderPreview(value) {
                return (
                  <span class={props.class} style={props.style}>
                    {value ? hidePhoneNumber(value) : configurable.undefinedPlaceholder}
                  </span>
                );
              },
              ...props,
            }
          : { ...props }
      );
    };
  },
  {
    name: 'APhone',
    globalConfigKey: 'aPhoneProps',
  }
);

export const APhone = defineAtomic({
  name: 'phone',
  component: APhoneComponent,
  description: '手机号码输入框',
  author: 'ivan-lee',
  async validate(value) {
    if (value && !PHONE_REG.test(value)) {
      throw new Error('请输入正确的手机号码');
    }
  },
  validateTrigger: 'blur',
});
