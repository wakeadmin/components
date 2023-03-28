import { model, vLoading } from '@wakeadmin/element-adapter';
import { booleanPredicate, NoopArray, NoopObject, pick } from '@wakeadmin/utils';
import { computed } from '@wakeadmin/demi';
import { withDirectives } from '@wakeadmin/h';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { FatTreeSelectProps, FatTreeSelectData, FatTreeSelect } from '../../fat-tree-select';
import { memoizeTask } from '../../atomic/host';
import { useDevtoolsExpose, useLazyOptions } from '../../hooks';
import { toArray } from '../../utils';
import { isDev } from '../../utils/isDev';

export type ATreeSelectValue = string | number | (string | number)[];

export type ATreeSelectProps = DefineAtomicProps<
  ATreeSelectValue,
  Omit<FatTreeSelectProps, 'data' | 'props' | 'load' | 'lazy'>,
  {
    /**
     * 数据加载，可以是异步的
     */
    data?: FatTreeSelectData[] | (() => Promise<FatTreeSelectData[]>);

    /**
     * 预览分割器, 默认为 ', '
     */
    separator?: string;

    /**
     * 自定义预览
     */
    renderPreview?: (data: FatTreeSelectData[]) => any;
  }
>;

declare global {
  interface AtomicProps {
    'tree-select': ATreeSelectProps;
  }
}

export const ATreeSelectComponent = defineAtomicComponent(
  (props: ATreeSelectProps) => {
    if (isDev) {
      if (props.data == null) {
        throw new Error('tree-select 组件需要提供 data 选项');
      }

      // @ts-expect-error
      if (props.lazy || props.load) {
        throw new Error(`tree-select 原件不支持 lazy 动态加载模式`);
      }
    }

    const loader = typeof props.data === 'function' ? memoizeTask(props.data) : computed(() => props.data);

    const { value: data, loading } = useLazyOptions(loader, []);

    // 建立树节点索引
    const dataIndex = computed<Record<string, FatTreeSelectData>>(() => {
      if (props.mode !== 'preview' || data.value.length === 0) {
        return NoopObject;
      }

      const results: Record<string, any> = {};
      const walk = (list: FatTreeSelectData[]) => {
        for (const item of list) {
          results[item.value] = item;
          if (item.children?.length) {
            walk(item.children);
          }
        }
      };

      walk(data.value);

      return results;
    });

    const matched = computed(() => {
      const value = toArray(props.value);
      if (value == null || value.length === 0 || props.mode !== 'preview' || data.value.length === 0) {
        return NoopArray;
      }

      return value.map(k => dataIndex.value[k]).filter(booleanPredicate);
    });

    useDevtoolsExpose({
      matched,
    });

    return () => {
      const { mode, scene, context, value, onChange, data: _data, renderPreview, ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(matched.value);
        }

        return (
          <span {...pick(other, 'class', 'style')}>
            {matched.value.map(i => i.label).join(props.separator ?? ', ')}
          </span>
        );
      }

      return (
        <FatTreeSelect
          // 垃圾 element-ui loading 没有效果
          {...withDirectives([[vLoading, loading.value]])}
          disabled={loading.value}
          loading={loading.value}
          {...other}
          data={data.value}
          {...model(value, onChange!)}
        />
      );
    };
  },
  {
    name: 'ATreeSelect',
    globalConfigKey: 'aTreeSelectProps',
  }
);

export const ATreeSelect = defineAtomic({
  name: 'tree-select',
  component: ATreeSelectComponent,
  description: '树选择器',
  author: 'ivan-lee',
});
