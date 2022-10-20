<template>
  <div>
    <FatForm
      @load-failed="(e) => { expectType<Error>(e) }"
      @submit-failed="(values, err) => {expectType<any>(values); expectType<Error>(err)}">
      <FatFormGroup label="x">
        <template #label="scope">{{ expectType<FatFormMethods<any>>(scope) }}</template>
      </FatFormGroup>
      <FatFormItem prop="sample" :value-props="{
        // @ts-expect-error volar 暂时不支持推断
        renderPreview(v) { expectType<string | undefined>(v) }
      }">
        <template #label="scope">{{ expectType<FatFormItemMethods<any>>(scope) }}</template>
      </FatFormItem>
      <FatFormItem prop="radio" value-type="checkbox" :value-props="{
        // @ts-expect-error volar 暂时不支持推断
        label: (a) => { expectType<boolean>(a) }}" ></FatFormItem>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  // eslint-disable-next-line no-unused-vars
  import { FatFormItem, FatForm, FatFormGroup, FatFormMethods, FatFormItemMethods } from '../../fat-form';
  import { expectType } from '..';
</script>
