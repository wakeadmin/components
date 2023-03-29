import { formatFileSize } from '@wakeadmin/utils';
import { getI18nInstance } from '../i18n';

function formatAccept(accept: string | string[]): string {
  const i18n = getI18nInstance();
  const textMap = {
    image: i18n.t('wkc.image'),
    video: i18n.t('wkc.video'),
    audio: i18n.t('wkc.audio'),
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
  const i18n = getI18nInstance();
  const { tip, sizeLimit, accept, limit } = props;
  if (tip) {
    return tip;
  }
  const texts = [];
  if (accept) {
    texts.push(i18n.t('wkc.uploadFormat', { accept: formatAccept(accept) }));
  }
  if (sizeLimit) {
    texts.push(i18n.t('wkc.uploadFileSizeLimit', { sizeLimit: formatFileSize(sizeLimit) }));
  }
  if (limit && limit !== 1) {
    texts.push(i18n.t('wkc.uploadFileLimit', { limit }));
  }
  return texts.join(', ');
}

const createPlaceholderMap: Partial<Record<keyof AtomicProps, (props: any) => string>> = {
  files: createFilesPlaceholder,
  images: createFilesPlaceholder,
  select: prop => {
    const i18n = getI18nInstance();
    return i18n.t('wkc.selectOption', { label: prop.label ?? '选项' });
  },
  'multi-select': prop => {
    const i18n = getI18nInstance();
    return i18n.t('wkc.selectOption', { label: prop.label ?? '选项' });
  },
  cascader: prop => {
    const i18n = getI18nInstance();
    return i18n.t('wkc.selectOption', { label: prop.label ?? '选项' });
  },
  'cascader-lazy': prop => {
    const i18n = getI18nInstance();
    return i18n.t('wkc.selectOption', { label: prop.label ?? '选项' });
  },
  date: prop => {
    const i18n = getI18nInstance();
    return i18n.t('wkc.selectOption', { label: prop.label ?? '日期' });
  },
  'date-time': prop => {
    const i18n = getI18nInstance();
    return i18n.t('wkc.selectOption', { label: prop.label ?? '日期时间' });
  },
  time: prop => {
    const i18n = getI18nInstance();
    return i18n.t('wkc.selectOption', { label: prop.label ?? '时间' });
  },
  captcha: prop => {
    const i18n = getI18nInstance();
    return i18n.t('wkc.inputCaptcha', { label: prop.label ?? '验证码' });
  },
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
