/**
 * BETA: 提供上下文信息，可以用于存储
 */
import { InjectionKey, provide, inject } from '@wakeadmin/demi';
import { arrayEq } from '../utils';

export type AtomicHostData = Record<any, any>;

const AtomicHost: InjectionKey<AtomicHostData> = Symbol('atomic-host');

/**
 * 提供上下文
 * @param data
 */
export function provideAtomicHost(data: AtomicHostData) {
  const parent = inject(AtomicHost, null);

  if (parent != null) {
    // 直接复用父级
    return;
  }

  provide(AtomicHost, data);
}

/**
 * 获取上下文信息
 * @returns
 */
export function useAtomicHost(): AtomicHostData {
  const DEFAULT = {};
  return inject(AtomicHost, DEFAULT) ?? DEFAULT;
}

/**
 * BETA: 批量任务执行缓存
 */

const TASK_CACHE = Symbol('atomics-host-task-cache');

interface TaskExecuteQueueItem<T = any> {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
}

interface TaskExecuteState {
  status: 'loading' | 'resolved' | 'rejected';
  result: any;
  queue: TaskExecuteQueueItem[];
}

type TaskStore = Map<Function, TaskCacheStore>; // key 为 任务函数
type TaskCacheStore = Map<any, TaskExecuteState>; // key 为 任务函数的执行参数

function createTaskCacheStoreIfNeed(store: TaskStore, task: Function) {
  const cache = store.get(task);
  if (cache) {
    return cache;
  }

  const taskCacheStore = new Map<any, TaskExecuteState>();
  store.set(task, taskCacheStore);
  return taskCacheStore;
}

/**
 * 从缓存中获取执行状态
 * @param cacheStore
 * @param args
 */
function getTaskExecuteStateFromCache(
  cacheStore: TaskCacheStore,
  args: any[],
  detector?: (input: any[], cached: any[]) => boolean
): TaskExecuteState | undefined {
  if (!detector) {
    // 如果没有指定 detector，默认的查询策略会对单个参数、无参数场景进行优化
    if (args.length === 0) {
      return cacheStore.get(null);
    } else if (args.length === 1) {
      return cacheStore.get(args[0]);
    }
  }

  detector ??= arrayEq;

  // 遍历查找
  for (const key of cacheStore.keys()) {
    if (!Array.isArray(key)) {
      continue;
    }

    if (detector(key, args)) {
      return cacheStore.get(key);
    }
  }
}

function setTaskExecuteStateToCache(cacheStore: TaskCacheStore, args: any[], state: TaskExecuteState) {
  cacheStore.set(args, state);

  // 冗余
  if (args.length === 0) {
    cacheStore.set(null, state);
  } else if (args.length === 1) {
    cacheStore.set(args[0], state);
  }
}

/**
 * 用户合并和缓存异常操作
 *
 * @param task
 * @param detector 自定义缓存比较器
 * @returns
 */
export function memoizeTask<Arg extends any[], Rtn>(
  task: (...args: Arg) => Promise<Rtn>,
  detector?: (input: Arg, cached: Arg) => boolean
) {
  const host = useAtomicHost();
  const taskStore = ((host as any)[TASK_CACHE] ??= new Map()) as TaskStore;
  const cacheStore = createTaskCacheStoreIfNeed(taskStore, task);

  return async (...args: Arg): Promise<Rtn> => {
    let cacheState = getTaskExecuteStateFromCache(cacheStore, args, detector as any);

    // 缓存状态
    if (cacheState) {
      switch (cacheState.status) {
        case 'loading':
          return await new Promise((resolve, reject) => {
            cacheState?.queue.push({ resolve, reject });
          });
        case 'rejected':
          return await Promise.reject(cacheState.result);
        default:
          return await Promise.resolve(cacheState.result);
      }
    }

    cacheState = {
      status: 'loading',
      queue: [],
      result: undefined,
    };

    setTaskExecuteStateToCache(cacheStore, args, cacheState);

    return await new Promise((resolve, reject) => {
      cacheState?.queue.push({ resolve, reject });

      task(...args)
        .then(result => {
          cacheState!.result = result;
          cacheState!.status = 'resolved';

          cacheState!.queue.forEach(fn => fn.resolve(result));
          cacheState!.queue = [];
        })
        .catch(err => {
          cacheState!.result = err;
          cacheState!.status = 'rejected';

          cacheState!.queue.forEach(fn => fn.reject(err));
          cacheState!.queue = [];
        });
    });
  };
}
