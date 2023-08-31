import { ComponentInternalInstance, getCurrentInstance, isVue3 } from '@wakeadmin/demi';
import { set, get } from '@wakeadmin/utils';

function isHMRComponent(instance: ComponentInternalInstance) {
  return !!Object.prototype.hasOwnProperty.call(instance.type, '__wkhmr');
}

export function useHMR() {
  if (isVue3 && process.env.NODE_ENV === 'development') {
    const instance = getCurrentInstance();

    if (instance == null) {
      return null;
    }

    let parent = instance.parent;
    let depth = 0;

    while (parent && !isHMRComponent(parent) && depth < 3) {
      parent = parent.parent;
      depth++;
    }

    if (parent && isHMRComponent(parent)) {
      const id = (parent.type as any).__wkhmr;
      const grandParent = parent.parent;

      const saveState = (state: any) => {
        if (grandParent?.proxy) {
          set(grandParent.proxy, `__hmrState__.${id}`, state);
        }
      };

      const loadState = (): unknown => {
        if (grandParent?.proxy) {
          return get(grandParent.proxy, `__hmrState__.${id}`);
        }

        return undefined;
      };

      return {
        parent,
        hmrId: id,
        saveState,
        loadState,
      };
    }
  }

  return null;
}
