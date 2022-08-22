import { Form, FormMethods, size } from '@wakeadmin/component-adapter';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { ref, provide } from '@wakeadmin/demi';
import { cloneDeep, isPlainObject, merge, get, set } from '@wakeadmin/utils';

import { hasByPath, setByPath } from '../utils';

import { FatFormMethods, FatFormProps } from './types';
import { FatFormContext } from './constants';

const FatFormInner = declareComponent({
  name: 'FatForm',
  props: declareProps<FatFormProps<any>>([
    'mode',
    'initialValue',
    'request',
    'requestOnMounted',
    'submit',
    'layout',
    'labelAlign',
    'labelWidth',
    'labelSuffix',
    'size',
    'disabled',
  ]),
  setup(props, { slots, expose }) {
    const requestOnMounted = props.requestOnMounted ?? true;
    const formRef = ref<FormMethods>();
    const loading = ref(false);
    const submitting = ref(false);
    const error = ref<Error>();
    const values = ref({});

    /**
     * 初始值
     */
    const initialValue: any = {};

    const setInitialValue = (value: any) => {
      merge(initialValue, value);

      values.value = cloneDeep(initialValue);
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
    if (props.request && requestOnMounted) {
      fetch();
    }

    const validate = async () => {
      try {
        await formRef?.value?.validate();

        return true;
      } catch (err) {
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
      } catch (err) {
        error.value = err as Error;
        console.log(`[fat-form] submit error`, err);
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
      set(values.value, prop, value);
    };

    // 私有方法
    const __setInitialValue = (prop: string, value: any) => {
      if (!hasByPath(initialValue, prop)) {
        set(initialValue, prop, value);

        setByPath(values.value, prop, value);
      }
    };

    // 表单实例
    const instance: FatFormMethods<any> = {
      get mode() {
        return props.mode ?? 'editable';
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
      __setInitialValue,
    };

    provide(FatFormContext, instance);
    expose(instance);

    return () => {
      const layout = props.layout ?? 'horizontal';
      const labelAlign = props.labelAlign ?? 'right';
      const labelSuffix = props.labelSuffix ?? '：';

      return (
        <Form
          ref={formRef}
          labelWidth={props.labelWidth ?? 'auto'}
          labelPosition={layout === 'vertical' ? 'top' : labelAlign}
          inline={layout === 'inline'}
          labelSuffix={labelSuffix}
          size={props.size && size(props.size)}
          disabled={props.disabled}
        >
          {slots.default?.()}
        </Form>
      );
    };
  },
});

export const FatForm = FatFormInner as unknown as <S extends {}>(props: FatFormProps<S>) => any;
