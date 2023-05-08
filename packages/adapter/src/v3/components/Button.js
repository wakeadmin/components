import { ElButton } from 'element-plus';
import { h } from '@wakeadmin/demi';

export const Button = (props, context) => {
  const overrideProps = {};

  // element-plus type=text 已废弃，使用 link 代替
  // 不要使用 text! link 更接近旧版的 type=text 样式
  if (props.type === 'text') {
    overrideProps.type = 'primary';
    overrideProps.link = true;
  }

  return h(ElButton, { ...props, ...overrideProps }, context.slots);
};
