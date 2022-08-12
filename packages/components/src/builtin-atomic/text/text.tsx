/**
 * 纯文本
 */
import { globalRegistry, AtomicCommonProps } from '../../atomic';
import './index.scss';

const Text = (props: AtomicCommonProps<string>) => {
  return (
    <span class={['wk-text', props.class]} style={props.style}>
      {props.value ?? ''}
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
  component: Text,
  description: '纯文本展示',
  author: 'ivan-lee',
});
