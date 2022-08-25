import { Form, FormMethods, size, Button } from '@wakeadmin/component-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { ref, provide, computed } from '@wakeadmin/demi';
import { cloneDeep, isPlainObject, merge, get, set } from '@wakeadmin/utils';

import {
  hasByPath,
  hasSlots,
  normalizeClassName,
  renderSlot,
  setByPath,
  ToHEmitDefinition,
  ToHSlotDefinition,
} from '../utils';

import { FatFormEvents, FatFormMethods, FatFormProps, FatFormSlots } from './types';
import { FatFormContext, FatFormInheritanceContext } from './constants';
import { FatFormGroup } from './fat-form-group';

const FatFormInner = declareComponent({
  name: 'FatForm',
  props: declareProps<FatFormProps<any>>({
    mode: null,
    initialValue: null,
    request: null,
    requestOnMounted: { type: Boolean, default: true },
    submit: null,
    layout: null,
    labelAlign: null,
    labelWidth: null,
    labelSuffix: null,
    size: null,
    disabled: Boolean,
    rules: null,
    hideRequiredAsterisk: Boolean,
    validateOnRuleChange: { type: Boolean, default: true },
    enableSubmitter: { type: Boolean, default: true },
    submitText: String,
    resetText: String,
    enableReset: { type: Boolean, default: true },
    submitProps: null,
    resetProps: null,

    // slots
    renderSubmitter: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatFormSlots<any>>>(),
  emits: declareEmits<ToHEmitDefinition<FatFormEvents<any>>>(),
  setup(props, { slots, expose, attrs, emit }) {
    const formRef = ref<FormMethods>();
    const loading = ref(false);
    const submitting = ref(false);
    const error = ref<Error>();
    const values = ref({});
    let touched: Record<string, boolean> = {};

    /**
     * 初始值
     */
    const initialValue: any = {};

    const setInitialValue = (value: any) => {
      merge(initialValue, value);

      values.value = cloneDeep(initialValue);

      emit('load', values.value);
    };

    /**
     * 数据请求
     * @returns
     */
    const fetch = async () => {
      if (props.request == null) {
        return;
      }

      try {
        loading.value = true;
        error.value = undefined;

        const response = await props.request();

        if (isPlainObject(response)) {
          setInitialValue(response);
        }
      } catch (err) {
        error.value = err as Error;

        console.error(`[fat-form] 数据加载失败`, err);
      } finally {
        loading.value = false;
      }
    };

    if (isPlainObject(props.initialValue)) {
      setInitialValue(props.initialValue);
    }

    // 初始化请求
    if (props.request && props.requestOnMounted) {
      fetch();
    }

    const validate = async () => {
      try {
        await formRef?.value?.validate();

        return true;
      } catch (err) {
        emit('validateFailed', values.value, err as any);
        return false;
      }
    };

    const validateField = async (prop: string | string[]) => {
      try {
        await formRef.value?.validateField(prop);
        return true;
      } catch (err) {
        return false;
      }
    };

    const clearValidate = async (prop: string | string[]) => {
      formRef.value?.clearValidate(prop);
    };

    const submit = async () => {
      if (!(await validate())) {
        return;
      }

      if (props.submit == null) {
        console.warn(`[fat-form] 未设置 submit 选项`);
        return;
      }

      if (submitting.value) {
        return;
      }

      try {
        submitting.value = true;
        error.value = undefined;
        await props.submit(values.value);

        emit('finish', values.value);
      } catch (err) {
        error.value = err as Error;
        console.log(`[fat-form] submit error`, err);
        emit('submitFailed', values.value, error.value);
      } finally {
        submitting.value = false;
      }
    };

    /**
     * 重置表单
     */
    const reset = () => {
      formRef.value?.clearValidate();

      values.value = cloneDeep(initialValue);

      touched = {};

      emit('reset', values.value);
    };

    /**
     * 获取字段值
     * @param prop
     * @returns
     */
    const getFieldValue = (prop: string) => {
      return get(values.value, prop);
    };

    /**
     * 设置字段
     * @param prop
     * @param value
     */
    const setFieldValue = (prop: string, value: any) => {
      setByPath(values.value, prop, value);

      emit('valuesChange', values.value, prop, value);

      touched[prop] = true;
    };

    const isFieldTouched = (prop: string | string[], allTouched = true): boolean => {
      const p = Array.isArray(prop) ? prop : [prop];

      if (allTouched) {
        return p.every(i => touched[i]);
      } else {
        return p.some(i => touched[i]);
      }
    };

    // ------ 以下是 私有方法 --------
    const __setInitialValue = (prop: string, value: any) => {
      if (!hasByPath(initialValue, prop)) {
        set(initialValue, prop, value);

        // vue2 兼容
        setByPath(values.value, prop, value);
      }
    };

    // 表单实例
    const instance: FatFormMethods<any> = {
      get mode() {
        return props.mode ?? 'editable';
      },
      get layout() {
        return props.layout ?? 'horizontal';
      },
      get labelWidth() {
        return props.labelWidth ?? 'auto';
      },
      get labelSuffix() {
        return props.labelSuffix ?? '：';
      },
      get disabled() {
        return !!props.disabled;
      },
      get error() {
        return error.value;
      },
      get loading() {
        return loading.value;
      },
      get submitting() {
        return submitting.value;
      },
      get formRef() {
        return formRef.value;
      },
      get values() {
        return values.value;
      },
      set values(value: any) {
        values.value = value;
      },
      request: fetch,
      submit,
      reset,
      validate,
      clearValidate,
      validateField,
      getFieldValue,
      setFieldValue,
      isFieldTouched,
      __setInitialValue,
    };

    const rules = computed(() => {
      return typeof props.rules === 'function' ? props.rules(values.value, instance) : props.rules;
    });

    const hasSubmitter = computed(() => {
      return hasSlots(props, slots, 'submitter');
    });

    provide(FatFormContext, instance);
    provide(FatFormInheritanceContext, {
      get mode() {
        return instance.mode;
      },
      get disabled() {
        return instance.disabled;
      },
      get hidden() {
        return false;
      },
      get size() {
        return props.size;
      },
    });

    expose(instance);

    const handleSubmit = (evt: SubmitEvent) => {
      evt.preventDefault();

      submit();
    };

    const handleValidate = (prop: string, valid: boolean, message?: string) => {
      emit('validate', prop, valid, message);
    };

    return () => {
      const layout = instance.layout;
      const labelAlign = props.labelAlign ?? 'right';

      return (
        <Form
          ref={formRef}
          class={normalizeClassName('fat-form', attrs.class)}
          style={attrs.style}
          model={values.value}
          labelWidth={instance.labelWidth}
          labelPosition={layout === 'vertical' ? 'top' : labelAlign}
          inline={layout === 'inline'}
          labelSuffix={instance.labelSuffix}
          size={props.size && size(props.size)}
          disabled={props.disabled}
          rules={rules.value}
          hideRequiredAsterisk={props.hideRequiredAsterisk}
          validateOnRuleChange={props.validateOnRuleChange}
          onValidate={handleValidate}
          // @ts-expect-error 原生事件
          // vue3
          onSubmit={handleSubmit}
          // vue2
          onSubmitNative={handleSubmit}
        >
          {slots.default?.()}
          {props.enableSubmitter && hasSubmitter.value ? (
            renderSlot(props, slots, 'submitter', instance)
          ) : (
            <FatFormGroup labelWidth="auto" gutter="medium">
              <Button type="primary" {...props.submitProps} onClick={instance.submit}>
                {props.submitText ?? '保存'}
              </Button>
              {!!props.enableReset && (
                <Button {...props.resetProps} onClick={instance.reset}>
                  {props.resetText ?? '重置'}
                </Button>
              )}
            </FatFormGroup>
          )}
        </Form>
      );
    };
  },
});

export const FatForm = FatFormInner as unknown as <S extends {}>(props: FatFormProps<S>) => any;
