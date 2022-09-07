import { getCurrentInstance, isVue2, effectScope, shallowReactive, reactive, computed } from '@wakeadmin/demi';

export interface RouteLike {
  query: Record<string, any>;
  params: Record<string, any>;
  hash: string;
  path: string;
}

export type RouteLocation =
  | string
  | {
      query?: Record<string, any>;
      hash?: string;
      path?: string;
      name?: string;
      params?: Record<string, any>;
      replace?: boolean;
    };

export interface RouterLike {
  push(to: RouteLocation): Promise<any>;
  replace(to: RouteLocation): Promise<any>;
  back(): void;
  forward(): void;
  go(delta: number): void;
}

export function useRouter() {
  const instance = getCurrentInstance();

  return (instance?.proxy as { $router: RouterLike } | undefined)?.$router;
}

export function useRoute(): RouteLike {
  const instance = getCurrentInstance()?.proxy;

  const root = instance!.$root as any;
  if (root._$route) {
    return root._$route;
  }

  if (isVue2) {
    // 模仿 vue-router 的实现
    // https://github.dev/vuejs/vue-router/blob/4d73be31f3e6781fcdcaecbd487c38084fd11f92/src/composables/globals.js#L16
    const route = effectScope(true).run(() => shallowReactive(Object.assign({}, root.$router.currentRoute)));
    root._$route = route;

    root.$router.afterEach((to: any) => {
      Object.assign(route, to);
    });
  } else {
    const reactiveRoute = {};

    for (const key in root.$route) {
      effectScope(true).run(() => {
        // @ts-expect-error
        reactiveRoute[key] = computed(() => root.$router.currentRoute.value[key]);
      });
    }

    root._$route = reactive(reactiveRoute);
  }

  return root._$route;
}
