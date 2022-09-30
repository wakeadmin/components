<template>
  <FatForm>
    <FatFormItem label="密码" prop="password" value-type="password" :rules="passwordRule"></FatFormItem>
    <FatFormItem
      label="确认密码"
      prop="passwordConfirm"
      value-type="password"
      :rules="passwordConfirmRule"
      dependencies="password"
    ></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormItemRules } from '@wakeadmin/components';

  interface T {
    password?: string;
    passwordConfirm?: string;
  }

  const rule: (compareKey: keyof T) => FatFormItemRules<T> = compareKey => values =>
    [
      { required: true },
      {
        validator(_rule: any, value, callback) {
          if (value && values[compareKey] && value !== values[compareKey]) {
            callback(new Error('密码不匹配'));
          } else {
            callback();
          }
        },
      },
    ];

  const passwordRule = rule('passwordConfirm');
  const passwordConfirmRule = rule('password');
</script>
