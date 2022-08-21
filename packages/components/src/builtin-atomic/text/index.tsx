/**
 * 纯文本
 */
import { globalRegistry, AtomicCommonProps } from '../../atomic';
import { normalizeClassName } from '../../utils';

export const AText = (props: AtomicCommonProps<string>) => {
  const { value, class: className, style } = props;
  return (
    <span class={normalizeClassName('wk-text', className)} style={style}>
      {value ? String(value) : ''}
    </span>
  );
};

// 类型声明
declare global {
  interface AtomicProps {
    text: {};
  }
}

globalRegistry.register('text', {
  name: 'text',
  component: AText,
  description: '纯文本展示',
  author: 'ivan-lee',
});
