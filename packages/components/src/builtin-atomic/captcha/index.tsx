import { InputProps, Input, model, ButtonProps, Button, Message } from '@wakeadmin/element-adapter';
import { computed, onBeforeUnmount, ref } from '@wakeadmin/demi';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { normalizeClassName } from '../../utils';
import { getOrCreatePlaceholder } from '../../utils/placeholder';
import { useT } from '../../hooks';

export enum ACaptchaStatus {
  Initial = 'initial', // 初始状态
  Loading = 'loading', // 获取验证码中
  Waiting = 'waiting', // 等待倒计时中
}

export type ACaptchaProps = DefineAtomicProps<
  string,
  InputProps,
  {
    /**
     * 按钮属性
     */
    buttonProps?: ButtonProps;

    /**
     * 自定义按钮文案渲染
     */
    renderButtonText?: (scope: { status: ACaptchaStatus; count: number }) => any;

    /**
     * 倒计时的秒数，默认 60
     */
    countDown?: number;

    /**
     * 获取验证码
     */
    onGetCaptcha?: () => Promise<void>;

    /**
     * 自定义错误处理
     */
    onError?: (error: Error) => void;
  }
>;

declare global {
  interface AtomicProps {
    captcha: ACaptchaProps;
  }
}

export const ACaptchaComponent = defineAtomicComponent(
  (props: ACaptchaProps) => {
    const status = ref(ACaptchaStatus.Initial);
    const countDown = props.countDown ?? 60;
    const count = ref(countDown);
    const t = useT();
    let timer: any;

    const buttonText = computed(() => {
      if (typeof props.renderButtonText === 'function') {
        return props.renderButtonText({ status: status.value, count: count.value });
      }

      switch (status.value) {
        case ACaptchaStatus.Initial:
          return t('wkc.getCaptcha');
        case ACaptchaStatus.Loading:
          return t('wkc.retrieving');
        case ACaptchaStatus.Waiting:
          return `${count.value} S`;
        default:
          return null;
      }
    });

    const tick = () => {
      timer = setTimeout(() => {
        count.value--;

        if (count.value <= 0) {
          // stop
          status.value = ACaptchaStatus.Initial;
        } else {
          // continue
          tick();
        }
      }, 1000);
    };

    const clearTick = () => {
      if (timer != null) {
        clearTimeout(timer);
        timer = undefined;
      }
    };

    const handleClick = async () => {
      if (status.value !== ACaptchaStatus.Initial) {
        return;
      }

      try {
        status.value = ACaptchaStatus.Loading;

        if (props.onGetCaptcha == null) {
          throw new Error(`[wakeadmin/components] captcha 请配置 onGetCaptcha 回调`);
        }

        await props.onGetCaptcha();

        // 开始等待
        count.value = countDown;
        status.value = ACaptchaStatus.Waiting;

        tick();
      } catch (err) {
        status.value = ACaptchaStatus.Initial;
        if (props.onError) {
          props.onError(err as Error);
        } else {
          Message.error(`${t('wkc.retrievalFailed')}：${(err as Error).message}`);
        }
      }
    };

    onBeforeUnmount(clearTick);

    return () => {
      const {
        value,
        mode,
        onChange,
        scene,
        context,

        buttonProps,
        class: className,
        style,

        // ignore
        renderButtonText: _ignoreRenderButtonText,
        countDown: _ignoreCountDown,
        onGetCaptcha: _ignoreOnGetCaptcha,
        onError: _ignoreOnError,
        placeholder: _placeholder,

        ...other
      } = props;

      // edit only

      return (
        <div class={normalizeClassName('fat-a-captcha', className)} style={style}>
          <Input
            class="fat-a-captcha__input"
            {...other}
            {...model(value, onChange!)}
            placeholder={getOrCreatePlaceholder('captcha', props)}
          />
          <Button
            {...buttonProps}
            class="fat-a-captcha__button"
            loading={status.value === ACaptchaStatus.Loading}
            disabled={status.value !== ACaptchaStatus.Initial}
            onClick={handleClick}
          >
            {buttonText.value}
          </Button>
        </div>
      );
    };
  },
  { name: 'ACaptcha', globalConfigKey: 'aCaptchaProps' }
);

export const ACaptcha = defineAtomic({
  name: 'captcha',
  component: ACaptchaComponent,
  editOnly: true,
  description: '验证码输入',
  author: 'ivan-lee',
});
