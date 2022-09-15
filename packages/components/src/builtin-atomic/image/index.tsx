/**
 * 图片上传
 */
import { computed } from '@wakeadmin/demi';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

import { AImagesProps, AImagesComponent } from '../images';

/**
 * 值由用户自定定义，默认为 string 类型
 */
export type AImageValue = any;

export type AImageProps = DefineAtomicProps<AImageValue, Omit<AImagesProps, 'limit'>, {}>;

declare global {
  interface AtomicProps {
    image: AImageProps;
  }
}

export const AImageComponent = defineAtomicComponent(
  (props: AImageProps) => {
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
      return AImagesComponent({ ...props, value: valueInArray.value, onChange: handleChange, limit: 1 });
    };
  },
  { name: 'AImage', globalConfigKey: 'aImageProps' }
);

export const AImage = defineAtomic({
  name: 'image',
  component: AImageComponent,
  description: '单图片选择器',
  author: 'ivan-lee',
});
