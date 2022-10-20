<template>
  <MyGenericComponent
    ref="instance"
    :value="1"
    @change="e => {
      expectType<number>(e);
    }"
  >
    <template #label="scope">
      {{expectScope(scope)}}
    </template>
  </MyGenericComponent>;
</template>

<script lang="tsx" setup>
  import {ref} from '@wakeadmin/demi'
  import {MyGenericComponent} from '../MyGenericComponent'
  import {expectType} from '..'

  const instance = ref<{ getValue(): number }>();
  const expectScope = (scope: {foo: number, value: number}) => {
    // ignore
  }
</script>
