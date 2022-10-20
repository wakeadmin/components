<template>
  <MyGenericComponent value="1" @change="value => {}">
    <template #label="scope">{{ expectScope(scope) }}</template>
  </MyGenericComponent>
</template>

<script setup lang="tsx">
  /* eslint-disable no-empty-function */

  const expectScope = (scoped: { foo: number; value: string }) => {};

  const MyGenericComponent: new <T>(props: { value: T }) => {
    $props: typeof props;
    $emit: { (event: 'change', e: T): void };
    $slots: {
      label: (value: { value: T; foo: number }) => any;
    };
  } = {} as any;
</script>
