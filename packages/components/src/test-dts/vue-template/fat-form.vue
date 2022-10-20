<template>
  <div>
    <FatForm
      @load-failed="(e) => { expectType<Error>(e) }"
      @submit-failed="(values, err) => {expectType<any>(values); expectType<Error>(err)}">
      <FatFormGroup label="x">
        <template #label="scope">{{ expectType<FatFormMethods<any>>(scope) }}</template>
      </FatFormGroup>
      <FatFormItem prop="sample"
       :rules="(a) => {return []}"
       :value-props="{
        // @ts-expect-error FIXME: volar 这里有问题, 下面的例子显示定义 text 就没问题？
        renderPreview: (v) => {
           expectType<string | undefined>(v);
            return ''
        }
      }">
        <template #label="scope">{{ expectType<FatFormItemMethods<any>>(scope) }}</template>
      </FatFormItem>
      <FatFormItem prop="sample" value-type="text" :value-props="{
        renderPreview: (v) => {
           expectType<string | undefined>(v);
            return ''
        }
      }"></FatFormItem>
      <FatFormItem prop="radio" :value-type="'checkbox'" :value-props="{
        label: (a) => {
          expectType<boolean>(a)
          return ''
        },
        renderPreview(v) {expectType<boolean>(v)}
        }" ></FatFormItem>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  // eslint-disable-next-line no-unused-vars
  import { FatFormItem, FatForm, FatFormGroup, FatFormMethods, FatFormItemMethods } from '../../fat-form';
  import { expectType } from '..';
</script>
