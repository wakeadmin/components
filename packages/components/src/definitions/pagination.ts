import { PaginationProps } from '@wakeadmin/component-adapter';

/**
 * 默认分页设置
 */
export const DEFAULT_PAGINATION_PROPS: PaginationProps = {
  pageSize: 10,
  layout: 'prev, pager, next, jumper, sizes, total',
  pageSizes: [10, 20, 30, 40, 50, 100],
};
