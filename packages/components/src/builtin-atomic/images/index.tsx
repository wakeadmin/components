/**
 * 多图片上传
 */
import { FileListItem, Upload, UploadProps } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { Plus } from '@wakeadmin/icons';

import { FatIcon } from '../../fat-icon';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { GetArrayMeta, normalizeClassName, normalizeStyle } from '../../utils';
import { useFatConfigurable } from '../../fat-configurable';

import { CommonUploadProps, useUpload } from '../files/useUpload';
import { declareComponent, declareProps } from '@wakeadmin/h';

/**
 * 值由用户自定定义，默认为 string 类型
 */
export type AImagesValue =
  | string[]
  | {
      /**
       * 图片地址
       */
      url: string;

      /**
       * 以逗号分隔的一个或多个字符串列表表明一系列用户代理使用的可能的图像。
       *
       * {@link  https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-srcset  详细描述 }
       */
      srcset?: string;

      /**
       * 表示资源大小的、以逗号隔开的一个或多个字符串。
       *
       * {@link  https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-sizes  详细描述 }
       */
      sizes?: string;

      width?: number;
      height?: number;

      /**
       * 加载模式 默认为`lazy`
       * - eager 立刻加载图片
       * - lazy 延迟加载图像，直到它和视口接近到一个计算得到的距离，由浏览器定义
       */
      loading?: 'eager' | 'lazy';

      alt?: string;
      title?: string;

      sources?: {
        /**
         * 以逗号分隔的一个或多个字符串列表表明一系列用户代理使用的可能的图像。
         *
         *
         * {@link  https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source#attr-srcset 详细描述 }
         */
        srcset?: string;

        /**
         * 表示资源大小的、以逗号隔开的一个或多个字符串。
         *
         * {@link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source#attr-sizes  详细描述 }
         */
        sizes?: string;

        /**
         * 图片类型
         *
         * @remarks
         *
         * 允许你为 <source> 元素的 srcset 属性指向的资源指定一个 MIME 类型。如果用户代理不支持指定的类型，那么这个 <source> 元素会被跳过。
         *
         * {@link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source#attr-type }
         */
        type?: string;

        /**
         * 媒体查询
         *
         * @remarks
         *
         * 属性允许你提供一个用于给用户代理作为选择 <source> 元素的依据的媒体条件 (media condition)（类似于媒体查询）。如果这个媒体条件匹配结果为 false，那么这个 <source> 元素会被跳过。
         * {@link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source#attr-media }
         */
        media?: string;
      }[];
    }[];

const ImagePreview = declareComponent({
  name: 'ImagePreview',
  props: declareProps<Exclude<GetArrayMeta<AImagesValue>, String> & FileListItem>({
    loading: {
      default: 'lazy',
    },
    width: null,
    height: null,
    srcset: null,
    sizes: null,
    sources: null,
    url: null,
    alt: null,
  }),
  setup(props) {
    const { url, sources = [], width, height, ...imgProps } = props;

    return () => (
      <picture class="fat-a-images__p-item">
        {sources.map(item => (
          <source {...item}></source>
        ))}
        <img {...imgProps} src={url} class="fat-a-images__p-item-img"></img>
      </picture>
    );
  },
});

// TODO: vue3 测试
export type AImagesProps = DefineAtomicProps<
  AImagesValue,
  Omit<UploadProps, 'fileList' | 'onChange' | 'onRemove' | 'accept'> & CommonUploadProps,
  {
    /**
     * 图片尺寸, 默认 86px
     * TODO: 支持指定宽高
     */
    size?: number | string;

    /**
     * 自定义渲染
     */
    renderPreview?: (list: FileListItem[]) => any;
  }
>;

declare global {
  interface AtomicProps {
    images: AImagesProps;
  }
}

export const AImagesComponent = defineAtomicComponent(
  (props: AImagesProps) => {
    const configurable = useFatConfigurable();
    const { accept, fileList, exceeded, beforeUpload, handleExceed, handleChange } = useUpload(props, {
      name: 'images',
      defaultAccept: 'image/*',
    });

    const rootStyle = computed(() => ({
      '--fat-a-images-size': props.size ?? '86px',
    }));

    return () => {
      const {
        mode,
        scene,
        context,
        value,
        onChange,
        transformToFileList,
        transformToValue,
        size,
        sizeLimit,
        filter,
        renderPreview,
        accept: _accept, // ignore

        ...other
      } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(fileList.value);
        } else {
          return (
            <div
              class={normalizeClassName('fat-a-images', 'fat-a-images--preview', other.class)}
              style={normalizeStyle(rootStyle.value, other.style)}
            >
              {fileList.value.length === 0
                ? configurable.undefinedPlaceholder
                : fileList.value.map((i, idx) => <ImagePreview key={`${i.name}_${idx}`} {...i}></ImagePreview>)}
            </div>
          );
        }
      }

      return (
        <Upload
          listType="picture-card"
          onExceed={handleExceed}
          multiple={props.limit !== 1}
          accept={accept.value}
          {...other}
          class={normalizeClassName('fat-a-images', { 'fat-a-images--exceeded': exceeded.value }, other.class)}
          style={normalizeStyle(rootStyle.value, other.style)}
          fileList={fileList.value}
          beforeUpload={beforeUpload}
          onRemove={handleChange}
          onChange={handleChange}
        >
          <FatIcon class="fat-a-images__add" color="gray" size="2em">
            <Plus />
          </FatIcon>
        </Upload>
      );
    };
  },
  { name: 'AImages', globalConfigKey: 'aImagesProps' }
);

export const AImages = defineAtomic({
  name: 'images',
  component: AImagesComponent,
  description: '多选图片选择器',
  author: 'ivan-lee',
});
