import {
  FileListItem,
  useFormItemValidate,
  UploadInternalRawFile,
  UploadInternalFileDetail,
  Message,
} from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { NoopArray, isPromise, queryString } from '@wakeadmin/utils';
import memoize from 'lodash/memoize';

import { formatFileSize } from '../../utils';

// 尝试从 url 中提取原始文件名称
const tryPickNameFromUrl = memoize((value: string) => {
  try {
    const { query } = queryString.parseUrl(value);
    if ('name' in query && typeof query.name === 'string') {
      return query.name;
    }
    return value;
  } catch (err) {
    return value;
  }
});

function defaultTransformToFileList(value: any): FileListItem {
  return { name: tryPickNameFromUrl(value), url: value, uid: value };
}

function defaultTransformToValue(file: FileListItem): any {
  return file.url;
}

class BreakError extends Error {}

export interface CommonUploadProps {
  value?: any[];
  onChange?: (value: any[]) => void;
  /**
   * 遵循 input#file 规范 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   *
   * 你也可以传入扩展名数组, 例如 [.jpg, .jpeg, .png].
   *
   * NOTE: 传入扩展名数组，我们才会对文件类型进行校验，否则只是在系统文件选择器中进行筛选
   */
  accept?: string | string[];
  /**
   * 转换 value 为 upload 能识别的 file-item
   */
  transformToFileListItem?: (value: any) => FileListItem;
  /**
   * 转换 file-item 为用户系统要保存的 value
   */
  transformToValue?: (item: FileListItem) => any;
  /**
   * 文件过滤。并不是所有上传接口都按照严格的 HTTP code 返回，因此这里可以做一些改写(直接修改 item)和过滤
   *
   * 返回 false 或 抛出异常都会跳过
   * 执行时机：在 onChange 时调用
   */
  filter?: (item: UploadInternalFileDetail) => void | boolean | Promise<boolean | void>;

  /**
   * 文件上传前置检查
   */
  beforeUpload?: (file: UploadInternalRawFile) => boolean | Promise<File | Blob | boolean | void>;

  /**
   * 自定义限额提示语, 在尺寸、大小不符合预期的情况下提示
   */
  limitMessage?: string;

  /**
   * 数量限制
   */
  limit?: number;

  /**
   * 大小限制
   */
  sizeLimit?: number;
}

export function useUpload(
  props: CommonUploadProps,
  options: {
    name: string;
    defaultAccept?: string;
  }
) {
  const formItemValidate = useFormItemValidate();

  // 缓存 uid 修复动画问题
  const uidCache: Map<any, string | number> = new Map();

  const accept = computed(() => {
    if (Array.isArray(props.accept)) {
      if (process.env.NODE_ENV !== 'production') {
        // 检查是否为扩展名
        if (props.accept.some(i => !i.startsWith('.'))) {
          throw new Error(`[wakeadmin/components] ${options.name} atomic accept 需要传入扩展名数组，例如 [".png"]`);
        }
      }
      return props.accept.join(',');
    }

    return props.accept ?? options.defaultAccept;
  });

  const fileList = computed(() => {
    return props.value == null
      ? NoopArray
      : props.value.map(item => {
          const t = props.transformToFileListItem ?? defaultTransformToFileList;
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

      // 触发 form item 变更
      formItemValidate('change');
    }
  };

  return {
    exceeded,
    fileList,
    accept,
    handleExceed,
    beforeUpload,
    handleChange,
  };
}
