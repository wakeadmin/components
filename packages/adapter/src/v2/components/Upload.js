import { Upload as ElUpload } from 'element-ui';
import { upperFirst } from '@wakeadmin/utils';
import { h } from '@wakeadmin/h';

const bindEmit = (name, props, listeners) => {
  const propsName = `on${upperFirst(name)}`;
  const outerHandler = props[propsName];
  const outerListener = listeners[name];

  const handler = (...args) => {
    outerHandler?.apply(props, args);

    outerListener?.apply(listeners, args);
  };

  if (outerHandler || outerListener) {
    props[propsName] = handler;
  }
};

const EVENTS = ['preview', 'remove', 'success', 'error', 'progress', 'change', 'exceed'];

export const Upload = {
  functional: true,
  render(_h, context) {
    const clone = { ...context.props };

    for (const evt of EVENTS) {
      bindEmit(evt, clone, context.listeners);
    }

    return h(ElUpload, Object.assign({}, context.data, { props: clone, 'v-slots': context.slots() }));
  },
};
