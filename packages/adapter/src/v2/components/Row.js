import { Row as ORow } from 'element-ui';

export const Row = {
  functional: true,
  render(h, context) {
    return h(
      ORow,
      // 和 plus 保持一致， 默认为 flex
      Object.assign({}, context.data, { props: Object.assign({ type: 'flex' }, context.props) }),
      context.children
    );
  },
};
