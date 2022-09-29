<template>
  <FatForm :enable-submitter="false">
    <FatFormGroup>
      <FatFormItem prop="name" label="名称"></FatFormItem>
      <FatFormItem prop="password" label="密码" value-type="password"></FatFormItem>
      <FatFormItem prop="remember" value-type="checkbox" :value-props="{ label: '记住密码' }"></FatFormItem>
    </FatFormGroup>
    <FatFormItem label="角色" prop="role" value-type="select"></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormGroup } from '@wakeadmin/components';
</script>
