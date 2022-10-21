import { ref } from '@wakeadmin/demi';
import { FatForm, FatFormItem, useFatFormRef } from '../fat-form';
import { FatTable, useFatTableRef } from '../fat-table';
import {
  FatFormDrawer,
  FatFormModal,
  FatFormPage,
  FatFormQuery,
  useFatFormDrawerRef,
  useFatFormModalRef,
  useFatFormPageRef,
  useFatFormQueryRef,
} from '../fat-form-layout';
import { MyGenericComponent } from './MyGenericComponent';
import { ADateValue } from '../builtin-atomic';
import { expectType, test } from '.';

test('MyGenericComponent jsx 正常推断类型', () => {
  const instance = ref<{ getValue(): number }>();

  <MyGenericComponent
    ref={instance}
    value={1}
    onChange={e => {
      expectType<number>(e);
    }}
    v-slots={{
      label: scope => {
        expectType<{ foo: number; value: number }>(scope);
      },
    }}
  ></MyGenericComponent>;

  <MyGenericComponent
    value="string"
    // @ts-expect-error 报错，类型不兼容
    ref={instance}
  />;
});

test('FatTable', () => {
  const tableRef = useFatTableRef();

  // 显式定义
  <FatTable<{ foo: 1 }>
    ref={tableRef}
    // @ts-expect-error list 不匹配
    request={async () => {
      return { list: [{ foo: 'ad' }], total: 1 };
    }}
    columns={[]}
  />;

  // 自动推断
  <FatTable
    request={async () => {
      return { list: [{ foo: 'ad' }], total: 1 };
    }}
    onLoad={list => {
      expectType<{ foo: string }[]>(list);
    }}
    columns={[]}
  />;
});

test('FatForm', () => {
  const formRef = useFatFormRef();

  <FatForm ref={formRef} />;
});

test('FatFormItem', () => {
  // @ts-expect-error prop 不能为空
  <FatFormItem />;

  <FatFormItem
    prop="text"
    // 默认推断为 text props
    valueProps={{
      // @ts-expect-error 类型错误
      type: 'unknown',
      renderPreview(value) {
        expectType<string | undefined>(value);
        return '';
      },
    }}
  ></FatFormItem>;

  <FatFormItem
    prop="text"
    valueType="date"
    valueProps={{
      renderPreview(value) {
        expectType<ADateValue | undefined>(value);
        return '';
      },
    }}
  ></FatFormItem>;

  <FatFormItem
    prop="checkbox"
    valueType="checkbox"
    // 可以正常推断类型 checkbox props
    valueProps={{
      label: active => {
        expectType<boolean>(active);
        return '';
      },

      renderPreview(value, label) {
        expectType<boolean>(value);
        return '';
      },
    }}
  ></FatFormItem>;
});

test('FatFormDrawer', () => {
  const r = useFatFormDrawerRef();
  <FatFormDrawer ref={r} />;
});

test('FatFormModal', () => {
  const r = useFatFormModalRef();
  <FatFormModal ref={r} />;
});

test('FatFormPage', () => {
  const r = useFatFormPageRef();
  <FatFormPage ref={r} />;
});

test('FatFormQuery', () => {
  const r = useFatFormQueryRef();
  <FatFormQuery ref={r} />;
});
