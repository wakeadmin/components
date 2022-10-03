export type FatSpaceSize = 'small' | 'medium' | 'large' | 'huge' | number;

export interface FatSpaceProps {
  /**
   * 对齐方式, 默认 center
   */
  align?: 'start' | 'end' | 'center' | 'baseline';

  /**
   * 内联模式， 默认 true
   */
  inline?: boolean;

  /**
   * 间距方向, 默认 horizontal
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * 间距大小, 默认  small
   * 如果传入的是一个元组，则分别用于控制水平、垂直的间距
   */
  size?: FatSpaceSize | [FatSpaceSize, FatSpaceSize];

  /**
   * 是否自动换行，仅在 horizontal 时有效， 默认 false
   */
  wrap?: boolean;
}
