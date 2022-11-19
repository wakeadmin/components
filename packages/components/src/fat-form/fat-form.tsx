import { Form, FormMethods, size, Button, Message } from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { isVue2, ref, provide, computed, watch, onMounted, onBeforeUnmount, nextTick } from '@wakeadmin/demi';
import { cloneDeep, isPlainObject, merge, get, set, equal, isObject } from '@wakeadmin/utils';

import {
  hasByPath,
  hasSlots,
  normalizeClassName,
  renderSlot,
  setByPath,
  settledThrowIfNeed,
  ToHEmitDefinition,
  ToHSlotDefinition,
  reactiveUnset,
  unset,
} from '../utils';
import { useDevtoolsExpose } from '../hooks';
import { useFatConfigurable } from '../fat-configurable';

import {
  FatFormEvents,
  FatFormGroupMethods,
  FatFormItemMethods,
  FatFormMethods,
  FatFormProps,
  FatFormSlots,
} from './types';
import { FatFormContext, FatFormInheritanceContext } from './constants';
import { FatFormGroup } from './fat-form-group';
import { useFatFormContext, useTouches } from './hooks';
import { convert, transform, runInModifyContext } from './utils';

export const FatForm = declareComponent({
  name: 'FatForm',
  props: declareProps<Omit<FatFormProps<any>, keyof FatFormEvents<any>>>({
    mode: null,
    loading: { type: Boolean, default: false },
    initialValue: null,
    request: null,
    requestOnMounted: { type: Boolean, default: true },
    submit: null,
    layout: null,
    labelAlign: null,
    labelWidth: null,
    labelSuffix: null,
    size: null,
    disabled: { type: Boolean, default: undefined },
    clearable: { type: Boolean, default: undefined },
    preserve: { type: Boolean, default: true },
    rules: null,
    hideRequiredAsterisk: Boolean,
    validateOnRuleChange: { type: Boolean, default: true },
    enableSubmitter: { type: Boolean, default: true },
    submitText: String,
    resetText: String,
    enableReset: { type: Boolean, default: true },
    submitProps: null,
    resetProps: null,
    submitterProps: null,
    submitterClassName: null,
    submitterStyle: null,
    errorCapture: null,
    col: null,
    row: null,

    hierarchyConnect: { type: Boolean, default: true },
    syncToInitialValues: Boolean,
    hideMessageOnPreview: { type: Boolean, default: undefined },

    // private
    getValues: null,
    // slots
    renderSubmitter: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatFormSlots<any>>>(),
  emits: declareEmits<ToHEmitDefinition<FatFormEvents<any>>>(),
  setup(props, { slots, expose, attrs, emit }) {
    let requestLoaded = false;
    let ready = false;
    const configurable = useFatConfigurable();
    const parentForm = useFatFormContext();
    const formRef = ref<FormMethods>();
    const _loading = ref(false);
    const loading = computed({
      get() {
        return !!(_loading.value || props.loading);
      },
      set(value: boolean) {
        _loading.value = value;
      },
    });
    const submitting = ref(false);
    const error = ref<Error>();

    const values = props.getValues ? props.getValues() : ref({});

    const touches = useTouches();
    const childForms = new Set<FatFormMethods<any>>();
    const items = new Set<FatFormItemMethods<any>>();
    let instance: FatFormMethods<any>;

    /**
     * 初始值
     */
    const initialValue: any = {};

    const setInitialValue = (value: any, force: boolean) => {
      merge(initialValue, value);

      const cloned = cloneDeep(initialValue);

      if (!force && ready) {
        // 用户已经修改的字段不能覆盖
        for (const key of touches.getAllTouches()) {
          set(cloned, key, get(values.value, key));
        }
      } else {
        // 清理掉用户的更新状态
        touches.clear();
      }

      values.value = cloned;

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

        let response = await props.request();

        if (isPlainObject(response)) {
          // 数据转换
          convert(response, items);

          requestLoaded = true;

          setInitialValue(response, true);
        }
      } catch (err) {
        error.value = err as Error;

        console.error(`[fat-form] 数据加载失败`, err);
        emit('loadFailed', err as Error);
      } finally {
        loading.value = false;
      }
    };

    // 浅监听 initialValue 变动
    watch(
      () => props.initialValue,
      (value, oldValue) => {
        // 从远程加载了数据，将忽略 initialValue
        if (requestLoaded) {
          return;
        }

        if (value === oldValue) {
          return;
        }

        // 深比较，避免循环 reactive
        if (isPlainObject(value) && !equal(value, oldValue)) {
          setInitialValue(value, false);
        }
      },
      { immediate: true }
    );

    // 监听错误
    watch(
      error,
      e => {
        if (e != null) {
          if (props.errorCapture) {
            props.errorCapture(e);
          } else {
            // 默认提示
            Message.error(e.message);
          }
        }
      },
      { immediate: true }
    );

    const validate = async () => {
      try {
        let childValidateResults: PromiseSettledResult<any>[] | undefined;
        // 先触发子表单验证
        if (childForms.size) {
          childValidateResults = await Promise.allSettled(Array.from(childForms.values()).map(i => i.validate()));
        }

        await formRef?.value?.validate();

        settledThrowIfNeed(childValidateResults);

        return true;
      } catch (err) {
        emit('validateFailed', values.value, err as any);
        throw err;
      }
    };

    const validateField = async (prop: string | string[]) => {
      // FUCK: element-ui / element-plus 这里 API 不一样
      if (isVue2) {
        return await new Promise<boolean>((resolve, reject) => {
          formRef.value?.validateField(prop, errorMessage => {
            if (errorMessage) {
              reject(new Error(errorMessage));
            } else {
              resolve(true);
            }
          });
        });
      } else {
        await formRef.value?.validateField(prop);
        return true;
      }
    };

    const clearValidate = async (prop?: string | string[]) => {
      // 清除子表单验证
      if (childForms.size) {
        childForms.forEach(c => {
          c.clearValidate();
        });
      }
      formRef.value?.clearValidate(prop);
    };

    const getValuesToSubmit = () => {
      // 数据转换
      const valuesToSubmit = cloneDeep(values.value);
      // 数据转换
      transform(valuesToSubmit, items);

      return valuesToSubmit;
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

      submitting.value = true;
      error.value = undefined;

      const valuesToSubmit = getValuesToSubmit();

      try {
        await props.submit(valuesToSubmit);

        emit('finish', valuesToSubmit);
      } catch (err) {
        error.value = err as Error;
        console.log(`[fat-form] submit error`, err);
        emit('submitFailed', valuesToSubmit, error.value);
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

      touches.clear();

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
      const oldValue = get(values.value, prop);

      if (oldValue !== value) {
        runInModifyContext(() => {
          setByPath(values.value, prop, value);

          emit('valuesChange', values.value, prop, value, oldValue);

          if (props.syncToInitialValues && isObject(props.initialValue)) {
            // 直接同步修改 initialValue
            set(props.initialValue, prop, value);
          }

          if (ready) {
            touches.touch(prop);
          }
        });
      }
    };

    /**
     * 删除指定字段
     */
    const unsetFieldValue = (prop: string) => {
      touches.untouch(prop);

      reactiveUnset(values.value, prop);

      if (props.syncToInitialValues && isObject(props.initialValue)) {
        // 直接同步修改 initialValue
        unset(props.initialValue, prop);
      }
    };

    const isFieldTouched = (prop: string | string[], allTouched = true): boolean => {
      const p = Array.isArray(prop) ? prop : [prop];

      if (allTouched) {
        return p.every(touches.isTouched);
      } else {
        return p.some(touches.isTouched);
      }
    };

    // ------ 以下是 私有方法 --------
    const __setInitialValue = (prop: string, value: any) => {
      if (touches.isTouched(prop)) {
        return;
      }

      // request 数据优先
      if (requestLoaded && hasByPath(initialValue, prop)) {
        return;
      }

      if (get(values.value, prop) === undefined) {
        set(initialValue, prop, cloneDeep(value));

        setByPath(values.value, prop, cloneDeep(value));
      }
    };

    const __registerChildForm = (form: FatFormMethods<any>) => {
      childForms.add(form);
    };

    const __unregisterChildForm = (form: FatFormMethods<any>) => {
      if (!ready) {
        return;
      }

      childForms.delete(form);
    };

    const __registerFormItem = (item: FatFormItemMethods<any>) => {
      items.add(item);
    };

    const __unregisterFormItem = (item: FatFormItemMethods<any>) => {
      if (!ready) {
        return;
      }

      items.delete(item);
      // 删除 touch 状态
      touches.untouch(item.prop);

      // 字段删除后是否保留状态
      if (item.preserve === false) {
        nextTick(() => {
          reactiveUnset(values.value, item.prop);
        });
      }
    };

    const __unregisterFormGroup = (item: FatFormGroupMethods) => {
      if (!ready) {
        return;
      }

      if (item.preserve === false && item.prop != null) {
        nextTick(() => {
          reactiveUnset(values.value, item.prop!);
        });
      }
    };

    const renderButtons = () => {
      const pending = loading.value || submitting.value;
      return [
        <Button loading={pending} type="primary" {...props.submitProps} onClick={instance.submit}>
          {props.submitText ?? configurable.fatForm?.saveText ?? '保存'}
        </Button>,
        !!props.enableReset && (
          <Button loading={pending} {...props.resetProps} onClick={instance.reset}>
            {props.resetText ?? configurable.fatForm?.resetText ?? '重置'}
          </Button>
        ),
      ];
    };

    // 表单实例
    instance = {
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
        return props.labelSuffix ?? configurable.fatForm?.labelSuffix ?? ':';
      },
      get size() {
        return props.size ?? configurable.fatForm?.size;
      },
      get disabled() {
        return props.disabled;
      },
      get clearable() {
        return props.clearable;
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
      unsetFieldValue,
      isFieldTouched,
      getValuesToSubmit,
      renderButtons,
      __setInitialValue,
      __registerChildForm,
      __unregisterChildForm,
      __registerFormItem,
      __unregisterFormItem,
      __unregisterFormGroup,
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
      get preserve() {
        return props.preserve;
      },
      get clearable() {
        return props.clearable;
      },
      get hidden() {
        return false;
      },
      get size() {
        return instance.size;
      },
      get col() {
        return props.col;
      },
      get hideMessageOnPreview() {
        return props.hideMessageOnPreview;
      },
    });

    expose(instance);
    useDevtoolsExpose({
      loading,
      submitting,
      error,
      values,
      initialValue,
    });

    onMounted(() => {
      if (parentForm && props.hierarchyConnect) {
        parentForm.__registerChildForm(instance);
      }

      // 初始化请求
      if (props.request && props.requestOnMounted) {
        fetch();
      }

      ready = true;
    });

    onBeforeUnmount(() => {
      if (parentForm && props.hierarchyConnect) {
        parentForm.__unregisterChildForm(instance);
      }

      ready = false;
    });

    const handleSubmit = (evt: SubmitEvent) => {
      evt.preventDefault();

      submit();
    };

    const handleValidate = (prop: string, valid: boolean, message?: string) => {
      emit('validate', prop, valid, message);
    };

    return () => {
      const layout = instance.layout;
      const labelAlign = props.labelAlign ?? configurable.fatForm?.labelAlign ?? 'right';

      return (
        <Form
          ref={formRef}
          class={normalizeClassName(
            'fat-form',
            {
              'fat-form--row': props.col,
              [`is-justify-${props.row?.justify}`]: props.col && props.row?.justify,
              [`is-align-${props.row?.align ?? 'bottom'}`]: props.col,
            },
            attrs.class
          )}
          style={attrs.style}
          model={values.value}
          labelWidth={instance.labelWidth}
          labelPosition={layout === 'vertical' ? 'top' : labelAlign}
          inline={layout === 'inline'}
          labelSuffix={instance.labelSuffix}
          size={size(instance.size)}
          disabled={props.disabled}
          rules={rules.value}
          hideRequiredAsterisk={props.hideRequiredAsterisk ?? configurable.fatForm?.hideRequiredAsterisk}
          validateOnRuleChange={props.validateOnRuleChange}
          onValidate={handleValidate}
          // @ts-expect-error 原生事件
          onSubmitNative={handleSubmit}
        >
          {slots.default?.()}
          {props.enableSubmitter &&
            (hasSubmitter.value ? (
              renderSlot(props, slots, 'submitter', instance)
            ) : (
              <FatFormGroup
                labelWidth="auto"
                gutter="sm"
                class={props.submitterClassName}
                style={props.submitterStyle}
                col={false}
                {...props.submitterProps}
              >
                {renderButtons()}
              </FatFormGroup>
            ))}
        </Form>
      );
    };
  },
});
