<template>
  <div>
    <div>#form initialValue</div>
    <FatForm :initial-value="{ a: '1', b: { c: 2, d: 3 } }">
      <FatFormItem prop="a" />
      <FatFormItem prop="b.c" />
      <FatFormItem prop="b.d" />
      <FatFormConsumer v-slot="scope">
        {{ JSON.stringify(scope.values) }}
      </FatFormConsumer>
    </FatForm>

    <div>#item initialValue</div>
    <FatForm>
      <FatFormItem prop="a" initial-value="1" />
      <FatFormItem prop="b.c" :initial-value="2" />
      <FatFormItem prop="b.d" :initial-value="3" />
      <FatFormConsumer v-slot="scope">
        {{ JSON.stringify(scope.values) }}
      </FatFormConsumer>
    </FatForm>

    <div>#without initialValue</div>
    <FatForm>
      <FatFormItem prop="a" />
      <FatFormItem prop="b.c" />
      <FatFormItem prop="b.d" />
      <FatFormItem prop="c[0]" />
      <FatFormItem prop="c[1]" />
      <FatFormItem prop="c[2].d" />
      <FatFormConsumer v-slot="scope">
        {{ JSON.stringify(scope.values) }}
      </FatFormConsumer>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormConsumer } from '@wakeadmin/components';
</script>
