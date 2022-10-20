<template>
  <MyGenericComponent value="1" @change="value => {}">
    <template #label="scope">{{ expectScope(scope) }}</template>
  </MyGenericComponent>
  <MyGenericComponent2
    type="a"
    @change="
      e => {
        expectType<number>(e);
      }
    "
  ></MyGenericComponent2>
</template>

<script setup lang="tsx">
  /* eslint-disable no-empty-function */

  function expectType<T>(value: T) {}
  const expectScope = (scoped: { foo: number; value: string }) => {};

  const MyGenericComponent: new <T>(props: { value: T }) => {
    $props: typeof props;
    $emit: { (event: 'change', e: T): void };
    $slots: {
      label: (value: { value: T; foo: number }) => any;
    };
  } = {} as any;

  interface Mapper {
    a: number;
    b: string;
  }

  // 映射类型泛型
  const MyGenericComponent2: new <T extends keyof Mapper>(props: { type: T; onChange?: (v: Mapper[T]) => void }) => {
    $props: typeof props;
  } = {} as any;
</script>
