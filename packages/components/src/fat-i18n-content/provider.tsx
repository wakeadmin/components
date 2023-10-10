import { provide, inject } from '@wakeadmin/demi';

import { FatI18nContentOptions, FatI18nPackage } from './types';
import { FatI18nContentDefaultOptions, FatI18nContentKey } from './constants';

/**
 * 提供全局配置
 * @param options 全局配置
 * @param batchSave 是否批量保存, 如果开启了批量保存，你需要调用 flush 方法来触发保存, 比如在表单提交时，默认为 false。建议在表单页面开启
 * @returns
 */
export function providerI18nContentOptions(options: FatI18nContentOptions, batchSave = false) {
  let pending: Map<string, { changed: FatI18nPackage[]; all: FatI18nPackage[] }> = new Map();

  // 支持继承父层配置
  const inheritOptions = inject(FatI18nContentKey, {});
  const finalOptions = {
    ...inheritOptions,
    ...options,
  };

  if (batchSave) {
    const save = async (uuid: string, changed: FatI18nPackage[], all: FatI18nPackage[]) => {
      if (!pending.has(uuid)) {
        pending.set(uuid, { changed: changed.slice(0), all });
      } else {
        const entry = pending.get(uuid)!;

        for (const item of changed) {
          const idx = entry.changed.findIndex(it => it.code === item.code);
          if (idx === -1) {
            entry.changed.push(item);
          } else {
            entry.changed[idx] = item;
          }
        }

        entry.all = all;
      }
    };
    provide(FatI18nContentKey, {
      ...finalOptions,
      save,
    });
  } else {
    provide(FatI18nContentKey, finalOptions);
  }

  return {
    /**
     * 保存变更
     */
    async flush() {
      if (!batchSave) {
        throw new Error('You must enable batchSave when you call flush');
      }

      if (!pending.size) {
        return;
      }

      const toSave = pending;
      pending = new Map();

      // 批量保存
      const tasks: Promise<void>[] = [];

      for (const [uuid, entry] of toSave) {
        tasks.push(
          (async () => {
            await (finalOptions.save ?? FatI18nContentDefaultOptions.save)(uuid, entry.changed, entry.all);
          })()
        );
      }

      await Promise.all(tasks);
    },
  };
}