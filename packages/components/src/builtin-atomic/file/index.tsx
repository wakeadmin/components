/**
 * 单文件上传
 */
import { computed } from '@wakeadmin/demi';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

import { AFilesProps, AFilesComponent } from '../files';

/**
 * 值由用户自定定义，默认为 string 类型
 */
export type AFileValue = any;

export type AFileProps = DefineAtomicProps<AFileValue, Omit<AFilesProps, 'limit'>, {}>;

declare global {
  interface AtomicProps {
    file: AFileProps;
  }
}

export const AFileComponent = defineAtomicComponent(
  (props: AFileProps) => {
    /**
     * 转换为数组形式
     */
    const valueInArray = computed(() => {
      return props.value && [props.value];
    });

    const handleChange = (arr?: any[]) => {
      if (arr?.length) {
        props.onChange?.(arr[0]);
      } else {
        props.onChange?.();
      }
    };

    return () => {
      return AFilesComponent({ ...props, value: valueInArray.value, onChange: handleChange, limit: 1 });
    };
  },
  { name: 'AFile', globalConfigKey: 'aFileProps' }
);

export const AFile = defineAtomic({
  name: 'file',
  component: AFileComponent,
  description: '单文件选择器',
  author: 'ivan-lee',
});
