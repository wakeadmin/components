/**
 * 多图片上传
 */
import { FileListItem, Upload, UploadProps } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { Plus } from '@wakeadmin/icons';

import { FatIcon } from '../../fat-icon';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { normalizeClassName, normalizeStyle } from '../../utils';
import { useFatConfigurable } from '../../fat-configurable';

import { CommonUploadProps, useUpload } from '../files/useUpload';
import { getOrCreatePlaceholder } from '../../utils/placeholder';

/**
 * 值由用户自定定义，默认为 string 类型
 */
export type AImagesValue = any[];

export type ImageObjectFit = 'fill' | 'contain' | 'cover' | 'scale-down' | 'none';

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
     * 图片如何适应容器框
     *
     * 默认为 `cover`
     */
    fit?: ImageObjectFit;
    /**
     * 自定义渲染
     */
    renderPreview?: (list: FileListItem[]) => any;
    /*
     * 文案提示
     */
    tip?: any;

    /**
     * 是否隐藏默认文案提示
     */
    hideTip?: boolean;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
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

    const tip = computed(() => {
      if (props.tip) {
        return props.tip;
      }
      if (props.hideTip) {
        return undefined;
      }
      return (
        <div class="fat-form-item-placeholder">
          {getOrCreatePlaceholder('files', { ...props, accept: accept.value })}
        </div>
      );
    });

    return () => {
      const {
        mode,
        scene,
        context,
        value,
        onChange,
        transformToFileListItem,
        transformToValue,
        size,
        sizeLimit,
        filter,
        renderPreview,
        fit,
        accept: _accept, // ignore
        tip: _tip,
        undefinedPlaceholder,

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
                ? undefinedPlaceholder ?? configurable.undefinedPlaceholder
                : fileList.value.map((i, idx) => {
                    return (
                      <picture class="fat-a-images__p-item" key={`${i.name}_${idx}`}>
                        <img
                          class="fat-a-images__p-item-img"
                          alt={i.name}
                          style={{ objectFit: fit ?? 'cover' }}
                          // @ts-expect-error
                          loading="lazy"
                          src={i.url}
                        />
                      </picture>
                    );
                  })}
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
          v-slots={{
            tip: tip.value,
          }}
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
