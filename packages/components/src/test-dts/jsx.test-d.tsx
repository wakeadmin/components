import { expectType, test } from '.';
import { FatFormItem } from '../fat-form';

test('FatFormItem', () => {
  // @ts-expect-error prop 不能为空
  <FatFormItem />;

  <FatFormItem
    prop="text"
    valueType="text"
    valueProps={{
      type: 'unknown',
      // @ts-expect-error FIXME: 暂时不支持推断，后续 valor 支持泛型后开启
      renderPreview(value) {
        expectType<string | undefined>(value);
        return '';
      },
    }}
  ></FatFormItem>;

  <FatFormItem
    prop="checkbox"
    valueType="checkbox"
    // 可以正常推断类型
    valueProps={{
      // @ts-expect-error FIXME: 暂时不支持推断，后续 valor 支持泛型后开启
      label: active => {
        expectType<boolean>(active);
        return '';
      },

      // @ts-expect-error FIXME: 暂时不支持推断，后续 valor 支持泛型后开启
      renderPreview(value, label) {
        return '';
      },
    }}
  ></FatFormItem>;
});
