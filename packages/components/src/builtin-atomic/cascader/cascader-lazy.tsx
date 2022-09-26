import { model, CascaderProps, Cascader, CascaderInnerProps } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

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
  disabled: boolean;

  /**
   * 子节点
   */
  children?: ACascaderOption[] | undefined;
}

/**
 * 节点关键信息
 */
export interface ACascaderNode {
  label: string;
  value: any;
}

export type ACascaderLazyProps = DefineAtomicProps<
  ACascaderLazyValue,
  CascaderProps,
  {
    /**
     * 数据加载
     */
    load: (parent?: ACascaderNode) => Promise<ACascaderOption[] | undefined>;
  }
>;

declare global {
  interface AtomicProps {
    'cascader-lazy': ACascaderLazyProps;
  }
}

export const ACascaderLazyComponent = defineAtomicComponent(
  (props: ACascaderLazyProps) => {
    // 加载节点数据
    const load = async (node?: ACascaderNode): Promise<ACascaderOption[] | undefined> => {
      return await props.load(node);
    };

    const cascaderProps = computed<CascaderInnerProps>(() => {
      return {
        lazy: true,
        async lazyLoad(node, resolve) {
          resolve(await load(node));
        },
        ...props.props,
      };
    });

    return () => {
      const { mode, scene, context, value, onChange, props: _props, ...other } = props;

      return <Cascader {...other} props={cascaderProps.value} {...model(value, onChange!)} />;
    };
  },
  { name: 'ACascaderLazy', globalConfigKey: 'aCheckboxProps' }
);

export const ACascaderLazy = defineAtomic({
  name: 'cascader-lazy',
  component: ACascaderLazyComponent,
  description: '异步级联选择器',
  author: 'ivan-lee',
});
