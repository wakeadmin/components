import { model, CascaderProps, Cascader, CascaderInnerProps, CascaderOption } from '@wakeadmin/element-adapter';
import { computed, watch, shallowReactive, isVue2, set as $set } from '@wakeadmin/demi';
import { NoopArray, pick } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { toUndefined } from '../../utils';
import { memoizeTask } from '../../atomic/host';

export type ACascaderLazyValue = any[];

export interface ACascaderOption {
  /**
   * 标题
   */
  label: string;

  /**
   * 节点值
   */
  value: any;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 子节点, 返回数据时，可以显式将 children 设置为 null， 来标记该节点为 leaf
   */
  children?: ACascaderOption[] | undefined | null;
}

export type ACascaderLazyProps = DefineAtomicProps<
  ACascaderLazyValue,
  Omit<CascaderProps, 'props'>,
  {
    /**
     * 数据加载，parentId 为父节点 id，如果是根节点，则为 undefined
     */
    load?: (parentId?: any) => Promise<ACascaderOption[] | undefined>;

    /**
     * 自定义预览
     */
    renderPreview?: (options: ACascaderOption[]) => any;

    /**
     * options 是固定结构的
     */
    props?: Omit<CascaderInnerProps<any, ACascaderOption>, 'value' | 'label' | 'children' | 'disabled'>;
  }
>;

declare global {
  interface AtomicProps {
    'cascader-lazy': ACascaderLazyProps;
  }
}

const ROOT_KEY = '__root__';

export const ACascaderLazyComponent = defineAtomicComponent(
  (props: ACascaderLazyProps) => {
    console.assert(props.load != null, '[cascader-lazy] 必须配置 load 参数');
    const loader = memoizeTask(props.load ?? (() => Promise.resolve(undefined)));

    const data: Record<string, ACascaderOption[]> = shallowReactive({});

    const getFromCache = (parentId?: any) => {
      const key = parentId == null ? ROOT_KEY : parentId;
      return data[String(key)];
    };

    const saveCache = (parentId: any | undefined, value: ACascaderOption[]) => {
      const key = parentId == null ? ROOT_KEY : parentId;
      $set(data, String(key), value);
    };

    // 加载节点数据
    const load = async (parentId?: any): Promise<CascaderOption[] | undefined> => {
      const result = getFromCache(parentId) ?? (await loader(parentId));

      saveCache(parentId, result ?? NoopArray);

      if (result == null) {
        return undefined;
      }

      return result.map(i => {
        return {
          ...i,
          children: toUndefined(i.children),
          // 如果 children 为 null， 显式设置为 leaf
          leaf: i.children === null ? true : undefined,
        } as CascaderOption;
      });
    };

    /**
     * 预览模式，批量加载
     * @param ids
     */
    const batchLoad = async (ids: any[]) => {
      await Promise.all(ids.map(i => load(i)));
    };

    // 预览模式匹配选项
    const matched = computed(() => {
      const value = props.value;
      if (value == null || value.length === 0 || props.mode !== 'preview') {
        return NoopArray;
      }

      const parentIds = [ROOT_KEY, ...value];

      const list: ACascaderOption[] = [];

      for (let i = 0; i < value.length; i++) {
        const currentId = value[i];
        const parentId = parentIds[i];
        const result = getFromCache(parentId);

        if (result == null) {
          return list;
        }

        const node = result.find(j => j.value === currentId);

        if (node == null) {
          return list;
        }

        list.push(node);
      }

      return list;
    });

    const cascaderProps = computed(() => {
      const innerProps: CascaderInnerProps<any, ACascaderOption> = {
        lazy: true,
        async lazyLoad(node, resolve) {
          const item = node.level === 0 ? undefined : node.value;
          resolve(await load(item));
        },
        ...props.props,
      };

      if (isVue2) {
        return { props: innerProps };
      }

      return innerProps;
    });

    watch(
      () => props.value,
      async value => {
        if (value == null || !Array.isArray(value) || props.mode !== 'preview') {
          return;
        }

        await batchLoad([undefined, ...value.slice(0, -1)]);
      },
      { immediate: true }
    );

    return () => {
      const { mode, scene, context, value, onChange, load: _load, renderPreview, props: _props, ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(matched.value);
        }

        const sep = props.separator ?? '/';
        return <span {...pick(other, 'class', 'style')}>{matched.value.map(i => i.label).join(sep)}</span>;
      }

      return <Cascader {...other} props={cascaderProps.value} {...model(value, onChange!)} />;
    };
  },
  { name: 'ACascaderLazy', globalConfigKey: 'aCascaderLazyProps' }
);

export const ACascaderLazy = defineAtomic({
  name: 'cascader-lazy',
  component: ACascaderLazyComponent,
  description: '异步级联选择器',
  author: 'ivan-lee',
});
