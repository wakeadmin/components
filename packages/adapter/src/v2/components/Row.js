import { Row as ORow } from 'element-ui';
import { h } from '@wakeadmin/h';

export const Row = {
  functional: true,
  render(_, context) {
    return h(
      ORow,
      // 和 plus 保持一致， 默认为 flex
      Object.assign({}, context.data, { props: Object.assign({ type: 'flex' }, context.props), attrs: undefined }),
      context.slots()
    );
  },
};
