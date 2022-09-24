import { getCurrentInstance } from '@wakeadmin/demi';
import { NoopArray } from '@wakeadmin/utils';

/**
 *
 * 向上查找指定名称的父级组件实例，并触发事件
 *
 * @param {import('@wakeadmin/demi').Vue} vm
 * @param {string} componentName
 * @param {string} eventName
 * @param {any[]} params
 */
function dispatch(vm, componentName, eventName, params) {
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
