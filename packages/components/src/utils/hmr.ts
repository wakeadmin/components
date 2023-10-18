import { ComponentInternalInstance, onBeforeUnmount, getCurrentInstance, isVue3 } from '@wakeadmin/demi';
import { set, get } from '@wakeadmin/utils';
import { useRouter } from '../hooks';

function isHMRComponent(instance: ComponentInternalInstance) {
  return !!Object.prototype.hasOwnProperty.call(instance.type, '__wkhmr');
}

export function useHMR(enable = true) {
  if (!enable) {
    return null;
  }

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
      const router = useRouter();

      const id = (parent.type as any).__wkhmr;
      const grandParent = parent.parent;

      // TODO:
      // 可能冲突

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

      // 路由变动后清理掉缓存，避免脏引用
      const dispose = router?.afterEach(() => {
        if (grandParent?.proxy) {
          set(grandParent.proxy, `__hmrState__.${id}`, undefined);
        }
      });

      onBeforeUnmount(() => {
        dispose?.();
      });

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
