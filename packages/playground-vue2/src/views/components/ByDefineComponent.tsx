import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ByDefineComponent',
  props: {
    foo: Boolean,
  },
  emits: ['ok', 'somethingChange'],
  setup() {
    return () => {
      return <div onClick={evt => console.log(evt)}>ok</div>;
    };
  },
});
