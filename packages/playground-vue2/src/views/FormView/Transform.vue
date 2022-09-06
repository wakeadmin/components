<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div># 数据转换</div>
    <FatForm class="form" :request="request" :submit="submit">
      <FatFormItem
        prop="dateRange"
        :convert="convert"
        :transform="transform"
        label="date-range"
        value-type="date-range"
        :rules="{ required: true }"
      />
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';

  interface Response {
    startTime: number;
    endTime: number;
  }

  const submit = async (values: any) => {
    console.log(values);
  };

  const request = async () => {
    return {
      startTime: Date.now(),
      endTime: Date.now() + 3600 * 1000 * 72,
    };
  };

  const convert = (_: any, response: Response) => {
    return [new Date(response.startTime), new Date(response.endTime)];
  };

  const transform = (value: any, response: Response) => {
    if (value == null) {
      return value;
    }

    return {
      startTime: value[0].getTime(),
      endTime: value[1].getTime(),
    };
  };
</script>

<style lang="scss" scoped>
  .form {
    margin-top: 50px;
  }
</style>
