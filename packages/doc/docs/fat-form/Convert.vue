<template>
  <FatForm :request="request" layout="inline">
    <FatFormItem label="时间区间" prop="dateRange" value-type="date-range"></FatFormItem>
    <FatFormItem label="生日" prop="birthday" value-type="date" :convert="timestampToDate"></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';

  // 模拟请求, 假设后端返回时间戳
  const fetchData = () =>
    Promise.resolve({
      startDate: new Date('2012/12/12 12:12:12').getTime(),
      endDate: new Date('2012/12/14 12:12:12').getTime(),
      birthday: Date.now(),
    });

  const timestampToDate = (timestamp: number | undefined) => timestamp && new Date(timestamp);

  // 复杂转换推荐在 request 中进行
  const request = async () => {
    const { startDate, endDate, ...other } = await fetchData();

    return {
      dateRange: [timestampToDate(startDate), timestampToDate(endDate)],
      ...other,
    };
  };
</script>
