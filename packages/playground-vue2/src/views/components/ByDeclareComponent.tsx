import { declareComponent, declareProps, declareEmits } from '@wakeadmin/h';

export default declareComponent({
  name: 'ByDeclareComponent',
  props: declareProps<{ foo: string }>(['foo']),
  emits: declareEmits<{ ok: (value: number) => void }>(),
  setup() {
    return () => {
      return <div>by declareComponent</div>;
    };
  },
});
