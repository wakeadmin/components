import { Upload as ElUpload } from 'element-ui';
import { upperFirst } from '@wakeadmin/utils';

const bindEmit = (name, props, listeners) => {
  const propsName = `on${upperFirst(name)}`;

  const handler = (...args) => {
    if (propsName in props) {
      props[propsName].apply(props, args);
    }

    if (name in listeners) {
      listeners[name].apply(listeners, args);
    }
  };

  if (propsName in props || name in listeners) {
    props[propsName] = handler;
  }
};

const EVENTS = ['preview', 'remove', 'success', 'error', 'progress', 'change', 'exceed'];

export const Upload = {
  functional: true,
  render(h, context) {
    const clone = { ...context.props };

    for (const evt of EVENTS) {
      bindEmit(evt, clone, context.listeners);
    }

    // TODO: v-slots 测试
    return h(ElUpload, Object.assign({}, context.data, { props: clone }), context.children);
  },
};
