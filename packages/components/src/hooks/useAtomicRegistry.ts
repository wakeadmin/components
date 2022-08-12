import { globalRegistry, Registry, createRegistry } from '../atomic';
import { provide, InjectionKey, inject } from '@wakeadmin/demi';

const AtomicRegistryInjectKey: InjectionKey<Registry> = Symbol('atomic-registry');

/**
 * 提供注册器
 * @param registry
 */
export function provideAtomicRegistry() {
  const parent = inject(AtomicRegistryInjectKey, globalRegistry);

  provide(AtomicRegistryInjectKey, createRegistry(parent));
}

/**
 * 获取注册器
 * @returns
 */
export function useAtomicRegistry() {
  return inject(AtomicRegistryInjectKey, globalRegistry);
}
