<template>
  <div class="container">
    <el-row :gutter="16" class="row">
      <el-col>
        <FatCard escape-header title="1 模块"><div class="block"></div></FatCard>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="row">
      <el-col :span="12">
        <FatCard escape-header title="2 模块">
          <div class="block"></div>
        </FatCard>
      </el-col>
      <el-col :span="12">
        <FatCard escape-header title="2 模块">
          <div class="block"></div>
        </FatCard>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="row" align="bottom">
      <el-col :span="8">
        <FatCard escape-header title="3 模块">
          <div class="block"></div>
        </FatCard>
      </el-col>
      <el-col :span="8">
        <FatCard>
          <div class="block"></div>
        </FatCard>
      </el-col>
      <el-col :span="8">
        <FatCard>
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
  }
</style>
