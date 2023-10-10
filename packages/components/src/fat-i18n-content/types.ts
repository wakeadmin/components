import { ClassValue, StyleValue } from '@wakeadmin/element-adapter';

export interface FatI18nLanguage {
  /**
   * 语言名称, 用于 Label 展示
   */
  name: string;

  /**
   * 语言代码
   */
  tag: string;

  /**
   * 语言图标
   */
  icon?: string;
}

export interface FatI18nDesc {
  /**
   * 默认内容
   */
  default: string;

  /**
   * 句柄
   */
  uuid?: string;
}

export interface FatI18nPackage {
  /**
   * 语言
   */
  code: string;

  /**
   * 内容
   */
  content: string;
}

export interface FatI18nContentOptions {
  /**
   * 是否开启, 默认为 true
   */
  enable?: boolean;

  /**
   * 源语言
   */
  sourceLanguage?: string | (() => Promise<string>);

  /**
   * 支持的语言列表
   */
  list?: FatI18nLanguage[] | (() => Promise<FatI18nLanguage[]>);

  /**
   * 悬浮窗位置, 默认为 rightBottom
   */
  position?: 'leftTop' | 'leftCenter' | 'leftBottom' | 'rightTop' | 'rightCenter' | 'rightBottom';

  /**
   * 生成唯一 ID
   */
  genUUID?: () => Promise<string>;

  /**
   * 存储的格式，默认为 __i18n__({default}, {uuid})
   * 其中 {default} 为默认内容，{uuid} 为句柄
   *
   * 如果定义了 parse 和 serialize 方法，则 format 无效
   */
  format?: string;

  /**
   * 解析内容
   * @param content
   * @returns
   */
  parse?: (content: string) => FatI18nDesc;

  /**
   * 序列化内容
   * @param desc
   * @returns
   */
  serialize?: (desc: FatI18nDesc) => string;

  /**
   * 注入悬浮窗
   * @param badge
   * @param target 被包装的组件库
   * @returns
   */
  inject?: (
    props: Record<string, any>,
    badge: (props?: Record<string, any>) => any,
    target: (props?: Record<string, any>) => any
  ) => any;

  /**
   * 语言包存储
   * @param uuid
   * @param changed 已变动的
   * @param list 当前所有的列表
   * @returns
   */
  save?: (uuid: string, changed: FatI18nPackage[], list: FatI18nPackage[]) => Promise<void>;

  /**
   * 语言包获取
   * @param uuid
   * @returns
   */
  get?: (uuid: string) => Promise<FatI18nPackage[]>;
}

export interface FatI18nContentProps extends FatI18nContentOptions {
  badgeClass?: ClassValue;
  badgeStyle?: StyleValue;

  /**
   * 传递给 target 的属性
   */
  targetProps?: Record<string, any> | ((userProps: Record<string, any>) => Record<string, any>);
}
