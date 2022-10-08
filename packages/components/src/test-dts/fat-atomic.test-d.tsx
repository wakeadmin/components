import { test, expectType } from '.';
import { FatAtomic } from '../fat-atomic';

test('FatAtomicProps', () => {
  <FatAtomic
    valueType="text"
    onUpdate:modelValue={e => expectType<string | undefined>(e)}
    onBlur={() => console.log('blur')}
  />;
  <FatAtomic
    valueType="integer"
    onUpdate:modelValue={e => expectType<number | undefined>(e)}
    placeholder="ok"
    min={1}
  />;
});
