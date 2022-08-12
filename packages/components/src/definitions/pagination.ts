import { CSSProperties } from '@wakeadmin/demi';

/**
 * 分页组件属性
 */
export interface PaginationProps {
  small?: boolean;
  pageSize?: number;
  layout?: string;
  background?: boolean;
  pagerCount?: number;
  pageSizes?: number[];
  popperClass?: string;
  prevText?: string;
  nextText?: string;
  hideOnSinglePage?: boolean;
  disabled?: boolean;
  class?: string;
  style?: CSSProperties;
}

/**
 * 默认分页设置
 */
export const DEFAULT_PAGINATION_PROPS: PaginationProps = {
  pageSize: 10,
  layout: 'prev, pager, next, jumper, sizes, total',
  pageSizes: [10, 20, 30, 40, 50, 100],
};
