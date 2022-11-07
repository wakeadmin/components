import { isVue3, getCurrentInstance, proxyRefs, isRef } from '@wakeadmin/demi';
import { Noop } from '@wakeadmin/utils';

function proxyWithRefUnwrapVue2(target: any, source: Record<string, any>, key: string) {
  if (key in target) {
    throw new Error(`can not override existed property: ${key}`);
  }

  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      const val = source[key];
      if (isRef(val)) {
        return val.value;
      } else {
        return val;
      }
    },
    set: value => {
      const oldValue = source[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
      } else {
        source[key] = value;
      }
    },
  });
}

/**
 * 使用 setup + return render function 的形式，组件的内部状态不会暴露到开发者工具中
 * 这导致开发体验会比较差，所以封装了该 hooks
 *
 */
export const useDevtoolsExpose: (state: any) => void =
  process.env.NODE_ENV === 'production'
    ? Noop
    : (state: any) => {
        if (state == null || typeof state !== 'object') {
          return;
        }

        const instance = getCurrentInstance();

        if (instance == null) {
          return;
        }

        const normalizedState: Record<string, any> = {};

        for (const key in state) {
          const newKey = `DEV_${key}`;
          normalizedState[newKey] = state[key];
        }

        if (isVue3) {
          // vue 3.0
          // https://github.dev/vuejs/core/blob/f67bb500b6071bc0e55a89709a495a27da73badd/packages/runtime-core/src/component.ts#L731
          // @ts-expect-error
          instance.devtoolsRawSetupState = normalizedState;
          // @ts-expect-error
          instance.setupState = proxyRefs(normalizedState);

          // 挂载到 ctx
          for (const key in normalizedState) {
            // @ts-expect-error
            Object.defineProperty(instance.ctx, key, {
              enumerable: true,
              configurable: true,
              get: () => normalizedState[key],
              set: Noop,
            });
          }
        } else {
          const vm = instance.proxy;

          // @ts-expect-error
          if (vm._setupProxy == null) {
            // @ts-expect-error
            vm._setupProxy = normalizedState;
          }

          // @ts-expect-error
          vm._setupState = normalizedState;

          for (const key in normalizedState) {
            // 需要挂载到组件实例上
            proxyWithRefUnwrapVue2(vm, normalizedState, key);
          }
        }
      };
