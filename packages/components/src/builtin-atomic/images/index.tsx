/**
 * 多图片上传
 */
import {
  FileListItem,
  Upload,
  UploadInternalRawFile,
  UploadProps,
  UploadInternalFileDetail,
  Message,
} from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { isPromise, NoopArray } from '@wakeadmin/utils';
import { Plus } from '@wakeadmin/icons';

import { FatIcon } from '../../fat-icon';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { formatFileSize, normalizeClassName, normalizeStyle } from '../../utils';
import { useFatConfigurable } from '../../fat-configurable';

/**
 * 值由用户自定定义，默认为 string 类型
 */
export type AImagesValue = any[];

// TODO: vue3 测试
export type AImagesProps = DefineAtomicProps<
  AImagesValue,
  Omit<UploadProps, 'fileList' | 'onChange' | 'onRemove' | 'accept'>,
  {
    /**
     * 转换 value 为 upload 能识别的 file-item
     */
    transformToFileList?: (value: any) => FileListItem;

    /**
     * 转换 file-item 为用户系统要保存的 value
     */
    transformToValue?: (item: FileListItem) => any;

    /**
     * 文件过滤。并不是所有上传接口都按照严格的 HTTP code 返回，因此这里可以做一些改写(直接修改 item)和过滤
     * 返回 false 或 抛出异常都会跳过
     */
    filter?: (item: UploadInternalFileDetail) => void | boolean | Promise<boolean | void>;

    /**
     * 自定义限额提示语, 再尺寸、大小不符合预期的情况下提示
     */
    limitMessage?: string;

    /**
     * 图片尺寸, 默认 86px
     */
    size?: number | string;

    /**
     * 大小限制
     */
    sizeLimit?: number;

    /**
     * 遵循 input#file 规范 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
     *
     * 你也可以传入扩展名数组, 例如 [.jpg, .jpeg, .png].
     *
     * NOTE: 传入扩展名数组，我们才会对文件类型进行校验，否则只是在系统文件选择器中进行筛选
     */
    accept?: string | string[];

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

function defaultTransformToFileList(value: any): FileListItem {
  return { name: value, url: value, uid: value };
}

function defaultTransformToValue(file: FileListItem): any {
  return file.url;
}

class BreakError extends Error {}

export const AImagesComponent = defineAtomicComponent(
  (props: AImagesProps) => {
    const configurable = useFatConfigurable();

    // 缓存 uid 修复动画问题
    const uidCache: Map<any, string | number> = new Map();

    const accept = computed(() => {
      if (Array.isArray(props.accept)) {
        if (process.env.NODE_ENV !== 'production') {
          // 检查是否为扩展名
          if (props.accept.some(i => !i.startsWith('.'))) {
            throw new Error('[wakeadmin/components] images atomic accept 需要传入扩展名数组，例如 [".png"]');
          }
        }
        return props.accept.join(',');
      }

      return props.accept ?? 'image/*';
    });

    const fileList = computed(() => {
      return props.value == null
        ? NoopArray
        : props.value.map(item => {
            const t = props.transformToFileList ?? defaultTransformToFileList;
            const result = t(item);

            if (uidCache.has(item)) {
              result.uid = uidCache.get(item);
            }

            return result;
          });
    });

    const exceeded = computed(() => {
      if (props.limit != null) {
        return fileList.value.length >= props.limit;
      }
      return false;
    });

    const rootStyle = computed(() => ({
      '--fat-a-images-size': props.size ?? '86px',
    }));

    const beforeUpload = async (file: UploadInternalRawFile) => {
      try {
        if (props.sizeLimit && file.size > props.sizeLimit) {
          throw new Error(props.limitMessage ?? `请选择小于 ${formatFileSize(props.sizeLimit)} 的文件`);
        }

        if (Array.isArray(props.accept)) {
          const filename = file.name;
          if (!props.accept.some(ext => filename.endsWith(ext))) {
            throw new Error(props.limitMessage ?? `请选择 ${props.accept.map(i => i.slice(1)).join('/')} 格式的文件`);
          }
        }

        if (props.beforeUpload) {
          const result = props.beforeUpload(file);
          if (isPromise(result)) {
            await result;
          } else if (!result) {
            throw new BreakError();
          }
        }
      } catch (err) {
        if (!(err instanceof BreakError)) {
          Message.warning((err as Error).message);
        }

        throw err;
      }
    };

    const handleExceed = (file: UploadInternalFileDetail, list: UploadInternalFileDetail[]) => {
      Message.warning(`上传失败：最多只能选择 ${props.limit} 个文件`);
    };

    const isAllDone = (list: UploadInternalFileDetail[]) => {
      return list.every(i => i.status === 'success');
    };

    // 新增、上传成功、错误都会调用 onChange
    // 我们在这里处理双向绑定
    const handleChange = async (file: UploadInternalFileDetail, list: UploadInternalFileDetail[]) => {
      if (isAllDone(list)) {
        const newList: any[] = [];
        const add = (item: UploadInternalFileDetail) => {
          const t = props.transformToValue ?? defaultTransformToValue;
          const value = t(item as FileListItem);

          // 缓存 uid
          uidCache.set(value, item.uid);

          newList.push(value);
        };

        for (const item of list) {
          if (props.filter) {
            try {
              // eslint-disable-next-line no-await-in-loop
              if ((await props.filter(item)) !== false) {
                add(item);
              }
            } catch {
              // ignore error
            }
          } else {
            add(item);
          }
        }

        if (newList.length === 0 && fileList.value.length === 0) {
          return;
        }

        // 触发更新
        props.onChange?.(newList);
      }
    };

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
                : fileList.value.map((i, idx) => {
                    return (
                      <div
                        class="fat-a-images__p-item"
                        key={`${i.name}_${idx}`}
                        style={{ backgroundImage: `url(${i.url})` }}
                      ></div>
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
