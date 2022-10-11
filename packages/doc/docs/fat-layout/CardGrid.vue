<template>
  <div class="container">
    <el-row :gutter="16" class="row">
      <el-col>
        <FatCard title="1 模块"><div class="block"></div></FatCard>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="row">
      <el-col :span="12">
        <FatCard title="2 模块">
          <div class="block"></div>
        </FatCard>
      </el-col>
      <el-col :span="12">
        <FatCard title="2 模块">
          <div class="block"></div>
        </FatCard>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="row">
      <el-col :span="8">
        <FatCard title="3 模块">
          <div class="block"></div>
        </FatCard>
      </el-col>
      <el-col :span="8">
        <FatCard title="3 模块">
          <div class="block"></div>
        </FatCard>
      </el-col>
      <el-col :span="8">
        <FatCard title="3 模块">
          <div class="block"></div>
        </FatCard>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="tsx" setup>
  import { FatCard } from '@wakeadmin/components';
</script>

<style lang="scss" scoped>
  .container {
  }

  .block {
    height: 100px;
    background-color: rgba(255, 145, 0, 0.5);
  }

  .row {
    margin-bottom: 16px;
  }
</style>
