import { getCurrentInstance, inject, computed } from '@wakeadmin/demi';
import { NoopArray } from '@wakeadmin/utils';

/**
 * 获取 ElForm 实例
 * @returns {{disabled?: boolean} | null}
 */
export function useForm() {
  return inject('elForm', null);
}

export function useFormItem() {
  return inject('elFormItem', null);
}

/**
 * 获取表单的大小
 * @param {string[]} [allows]
 */
export function useSize(allows) {
  const vm = getCurrentInstance().proxy;
  const formItem = useFormItem();

  return computed(() => {
    const size = vm.$props.size ?? formItem?.elFormItemSize ?? vm.$ELEMENT?.size;
    if (!size) {
      return size;
    }

    // 不在范围的使用默认尺寸
    if (allows && !allows.includes(size)) {
      return undefined;
    }

    return size;
  });
}

/**
 *
 * 向上查找指定名称的父级组件实例，并触发事件
 *
 * @param {import('@wakeadmin/demi').Vue} vm
 * @param {string} componentName
 * @param {string} eventName
 * @param {any[]} params
 */
export function dispatch(vm, componentName, eventName, params) {
  let parent = vm.$parent || vm.$root;
  let name = parent.$options.componentName;

  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.componentName;
    }
  }

  if (parent) {
    parent.$emit.apply(parent, [eventName].concat(params));
  }
}

/**
 * 触发 form-item 验证。用于自定义表单组件
 * @returns
 */
export function useFormItemValidate() {
  const vm = getCurrentInstance().proxy;

  /**
   * @param {'change' | 'blur'} event
   */
  return function validate(event) {
    if (vm) {
      dispatch(vm, 'ElFormItem', `el.form.${event}`, NoopArray);
    }
  };
}
