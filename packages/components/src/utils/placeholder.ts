import { formatFileSize } from '@wakeadmin/utils';

function formatAccept(accept: string | string[]): string {
  const textMap = {
    image: '图片',
    video: '视频',
    audio: '音频',
  };

  const list = Array.isArray(accept) ? accept : accept.split(',');

  return (
    list
      /**
       * 处理 image/* 这种情况
       * 目前只考虑最常见的这三种情况的文字替换
       */
      .map(type => type.replace(/\/\*$/, ''))
      /**
       * 处理 image/png 这种情况 转换成 png
       * 这里 提示稍微有点问题 比如 image/jpeg 理论上允许选择 .jpg .jpeg 这两种格式 暂时摆烂
       */
      .map(type => type.replace(/^(image|video|audio)\//, ''))
      /**
       * 统一格式
       */
      .map(type => type.replace(/^\./, ''))
      .map(type => textMap[type as keyof typeof textMap] ?? type)
      .join(', ')
  );
}

function createFilesPlaceholder(props: AtomicProps['files']): string {
  const { tip, sizeLimit, accept, limit } = props;
  if (tip) {
    return tip;
  }
  const texts = [];
  if (accept) {
    texts.push(`请上传 ${formatAccept(accept)} 格式的文件`);
  }
  if (sizeLimit) {
    texts.push(`大小不能超过 ${formatFileSize(sizeLimit)} `);
  }
  if (limit && limit !== 1) {
    texts.push(`最多只能上传 ${limit} 个文件`);
  }
  return texts.join(', ');
}

const createPlaceholderMap: Partial<Record<keyof AtomicProps, (props: any) => string>> = {
  files: createFilesPlaceholder,
  images: createFilesPlaceholder,
  select: prop => `请选择${prop.label ?? '选项'}`,
  'multi-select': prop => `请选择${prop.label ?? '选项'}`,
  cascader: prop => `请选择${prop.label ?? '选项'}`,
  'cascader-lazy': prop => `请选择${prop.label ?? '选项'}`,
  date: prop => `请选择${prop.label ?? '日期'}`,
  'date-time': prop => `请选择${prop.label ?? '日期时间'}`,
  time: prop => `请选择${prop.label ?? '时间'}`,
  captcha: prop => `请输入${prop.label ?? '验证码'}`,
};

/**
 * 创建默认的原件提示
 *
 * 时间范围用默认的
 *
 * @param atomicType 原件类型
 * @param props 原件props
 * @returns
 */
export function getOrCreatePlaceholder<T extends keyof AtomicProps>(
  atomicType: T,
  atomicProps: AtomicProps[T]
): string {
  /**
   * label 可能为 VNode
   * 稍微处理一下 如果为 VNode 的话 重置为 null 方便进行回退
   */
  let label = atomicProps.context?.label || null;
  if (typeof label === 'object') {
    label = null;
  }

  const props = {
    ...atomicProps,
    label,
  };

  return (props as any).placeholder ?? createPlaceholderMap[atomicType]?.(props) ?? label ?? '请输入';
}
