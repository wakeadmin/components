import { model, CascaderProps, Cascader, CascaderInnerProps } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { NoopArray, pick } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useLazyOptions } from '../../hooks';
import { toArray, toUndefined } from '../../utils';
import { memoizeTask } from '../../atomic/host';

import { ACascaderOption } from './cascader-lazy';

export type ACascaderValue = any[];

export type ACascaderProps = DefineAtomicProps<
  ACascaderValue,
  Omit<CascaderProps, 'options' | 'props'>,
  {
    /**
     * 级联选项，可以是异步
     */
    options?: ACascaderOption[] | (() => Promise<ACascaderOption[]>);

    /**
     * 自定义预览
     */
    renderPreview?: (options: ACascaderOption[]) => any;

    /**
     * options 是固定结构的
     */
    props?: Omit<
      CascaderInnerProps<any, ACascaderOption>,
      'value' | 'label' | 'children' | 'disabled' | 'lazy' | 'lazyLoad'
    >;
  }
>;

declare global {
  interface AtomicProps {
    cascader: ACascaderProps;
  }
}

export const ACascaderComponent = defineAtomicComponent(
  (props: ACascaderProps) => {
    if (process.env.NODE_ENV !== 'production') {
      // @ts-expect-error
      if (props.props?.lazy || props.props?.lazyLoad) {
        throw new Error(`cascader 原件不支持 lazy 动态加载模式，请使用 cascader-lazy 原件代替`);
      }
    }

    const loader = typeof props.options === 'function' ? memoizeTask(props.options) : computed(() => props.options);
    const { value: options } = useLazyOptions(loader, []);

    const matched = computed(() => {
      const value = toArray(props.value);
      if (value == null || value.length === 0 || props.mode !== 'preview' || options.value.length === 0) {
        return NoopArray;
      }

      const results: ACascaderOption[] = [];
      let currentOptions: ACascaderOption[] | undefined = options.value;

      for (let i = 0; i < value.length && currentOptions?.length; i++) {
        const id = value[i];
        const result: ACascaderOption | undefined = currentOptions.find(j => j.value === id);

        if (result) {
          results.push(result);

          currentOptions = toUndefined(result.children);
        } else {
          break;
        }
      }

      return results;
    });

    return () => {
      const { mode, scene, context, value, onChange, options: _options, renderPreview, ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(matched.value);
        }

        const sep = props.separator ?? '/';
        return <span {...pick(other, 'class', 'style')}>{matched.value.map(i => i.label).join(sep)}</span>;
      }

      return <Cascader {...other} options={options.value} {...model(value, onChange!)} />;
    };
  },
  { name: 'ACascader', globalConfigKey: 'aCascaderProps' }
);

export const ACascader = defineAtomic({
  name: 'cascader',
  component: ACascaderComponent,
  description: '级联选择器',
  author: 'ivan-lee',
});
