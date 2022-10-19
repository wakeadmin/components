/* eslint-disable vue/require-default-prop */
/**
 * 移植 element-plus switch 组件
 */
import { computed, ref, defineComponent, PropType, nextTick, watch, onMounted } from '@wakeadmin/demi';
import { isPromise, isBoolean } from '@wakeadmin/utils';

import { useForm, useFormItemValidate, useSize } from '../utils';

export interface SwitchEvent {
  onChange: (value: boolean | string | number) => void;
  onInput: (value: boolean | string | number) => void;
}

export const Switch = defineComponent({
  name: 'ElSwitch',
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: '',
    },
    inlinePrompt: {
      type: Boolean,
      default: false,
    },
    activeIcon: {
      type: String,
    },
    inactiveIcon: {
      type: String,
    },
    activeText: {
      type: String,
      default: '',
    },
    inactiveText: {
      type: String,
      default: '',
    },
    activeColor: {
      type: String,
      default: '',
    },
    inactiveColor: {
      type: String,
      default: '',
    },
    borderColor: {
      type: String,
      default: '',
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true,
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
    id: String,
    loading: {
      type: Boolean,
      default: false,
    },
    beforeChange: {
      type: Function as PropType<() => Promise<boolean> | boolean>,
    },
    // 只允许 默认和 small
    size: {
      type: String,
    },
    tabindex: {
      type: [String, Number],
    },
  },
  emits: ['change', 'input'],
  setup(props, { emit, expose }) {
    const form = useForm();
    const formValidate = useFormItemValidate();
    const input = ref<HTMLInputElement>();
    const core = ref<HTMLSpanElement>();
    const size = useSize(['small']);

    const switchDisabled = computed(() => {
      return props.disabled || props.loading || form?.disabled;
    });

    const checked = computed(() => props.value === props.activeValue);

    const className = computed(() => [
      'ad-switch',
      {
        'ad-switch--disabled': switchDisabled.value,
        'ad-switch--checked': checked.value,
        'ad-switch--inline-prompt': props.inlinePrompt && (props.activeText || props.inactiveText),
        [`ad-switch--${size.value}`]: size.value,
      },
    ]);

    const styles = computed(() => {
      const res: Record<string, any> = {};

      if (props.activeColor) {
        res['--ad-switch-on-color'] = props.activeColor;
      }

      if (props.inactiveColor) {
        res['--ad-switch-off-color'] = props.inactiveColor;
      }

      if (props.borderColor) {
        res['--ad-switch-border-color'] = props.borderColor;
      }

      return res;
    });

    const coreStyles = computed(() => {
      return {
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      };
    });

    const handleChange = () => {
      const val = checked.value ? props.inactiveValue : props.activeValue;
      emit('change', val);
      emit('input', val);

      nextTick(() => {
        if (input.value) {
          input.value.checked = checked.value;
        }
      });
    };

    const switchValue = () => {
      if (switchDisabled.value) {
        return;
      }

      const { beforeChange } = props;
      if (!beforeChange) {
        handleChange();
        return;
      }

      const shouldChange = beforeChange();

      const isPromiseOrBool = [isPromise(shouldChange), isBoolean(shouldChange)].includes(true);
      if (!isPromiseOrBool) {
        throw new Error(`ElSwitch: beforeChange must return type \`Promise<boolean>\` or \`boolean\``);
      }

      if (isPromise(shouldChange)) {
        shouldChange
          .then(result => {
            if (result) {
              handleChange();
            }
          })
          .catch(e => {
            console.warn(`ElSwitch: some error occurred: ${e}`);
          });
      } else if (shouldChange) {
        handleChange();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') {
        return;
      }

      switchValue();
    };

    const handleSwitch = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      switchValue();
    };

    const focus = () => {
      input.value?.focus();
    };

    // 初始化
    if (![props.activeValue, props.inactiveValue].includes(props.value)) {
      emit('change', props.inactiveValue);
      emit('input', props.inactiveValue);
    }

    // 触发 form item 验证
    watch(checked, val => {
      input.value!.checked = val;

      if (props.validateEvent) {
        formValidate('change');
      }
    });

    onMounted(() => {
      if (input.value) {
        input.value.checked = checked.value;
      }
    });

    expose({
      focus,
    });

    return () => {
      return (
        <div class={className.value} style={styles.value} onClick={handleSwitch}>
          <input
            id={props.id}
            ref={input}
            class="ad-switch__input"
            type="checkbox"
            name={props.name}
            disabled={switchDisabled.value}
            tabindex={props.tabindex}
            onChange={handleChange}
            onKeydown={handleKeyDown}
          />

          {/* 外置文本和 icon */}
          {!!(!props.inlinePrompt && (props.inactiveIcon || props.inactiveText)) && (
            <span
              class={[
                'ad-switch__label',
                'ad-switch__label--left',
                {
                  'ad-switch__label--active': !checked.value,
                },
              ]}
            >
              {props.inactiveIcon ? (
                <i class={['ad-switch__icon', props.inactiveIcon]} />
              ) : props.inactiveText ? (
                <span>{props.inactiveText}</span>
              ) : null}
            </span>
          )}

          <span ref={core} class="ad-switch__core" style={coreStyles.value}>
            {/* 内联文本和 icon */}
            {props.inlinePrompt && (
              <div class="ad-switch__inner">
                {props.activeIcon || props.inactiveIcon ? (
                  <i class={['ad-switch__icon', checked.value ? props.activeIcon : props.inactiveIcon]}></i>
                ) : checked.value && props.activeText ? (
                  <span class="ad-switch__text">{props.activeText.substring(0, 3)}</span>
                ) : !checked.value && props.inactiveText ? (
                  <span class="ad-switch__text">{props.inactiveText.substring(0, 3)}</span>
                ) : null}
              </div>
            )}
            <div class="ad-switch__action">{props.loading && <i class="ad-switch__loading el-icon-loading" />}</div>
          </span>

          {/* 外置文本和 icon */}
          {!!(!props.inlinePrompt && (props.activeIcon || props.activeText)) && (
            <span
              class={[
                'ad-switch__label',
                'ad-switch__label--right',
                {
                  'ad-switch__label--active': checked.value,
                },
              ]}
            >
              {props.activeIcon ? (
                <i class={['ad-switch__icon', props.activeIcon]} />
              ) : props.activeText ? (
                <span>{props.activeText}</span>
              ) : null}
            </span>
          )}
        </div>
      );
    };
  },
});
