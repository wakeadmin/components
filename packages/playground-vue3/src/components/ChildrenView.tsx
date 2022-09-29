import { defineComponent } from 'vue';

export default defineComponent({
  setup(props, { slots }) {
    return () => {
      const children = slots.default?.();
      console.log(children);

      return <div>{children}</div>;
    };
  },
});
