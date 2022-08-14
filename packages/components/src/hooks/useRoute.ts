import { getCurrentInstance } from '@wakeadmin/demi';

export interface RouteLike {
  query: Record<string, any>;
  params: Record<string, any>;
  hash: string;
  path: string;
}

type RouteLocation =
  | string
  | {
      query?: Record<string, any>;
      hash?: string;
      path?: string;
      name?: string;
      params?: Record<string, any>;
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

export function useRoute() {
  const instance = getCurrentInstance();

  return (instance?.proxy as { $route: RouteLike } | undefined)?.$route;
}
