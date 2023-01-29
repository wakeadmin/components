<template>
  <div>
    <div>
      <h4>只能X轴移动</h4>
      <FatDragItem class="inline-block" lock-axis="x">
        <FatDragHandler class="handler"> 🐇 </FatDragHandler>
        <span>落花人独立 </span>
      </FatDragItem>
      <h4>只能Y轴移动</h4>
      <FatDragItem class="inline-block" lock-axis="y">
        <FatDragHandler class="handler"> 🦌 </FatDragHandler>
        <span>微雨燕双飞 </span>
      </FatDragItem>
    </div>
    <div>
      <h4>限制范围</h4>
      <div id="boundary" class="drag-boundary">
        <FatDragItem class="drag-boundary-item" drag-boundary="#boundary"> </FatDragItem>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { FatDragItem, FatDragHandler } from '@wakeadmin/components';
</script>
<style lang="scss" scoped>
  h4 {
    margin: 12px;
  }
  .inline-block {
    display: inline-block;
    background: #fff;
    padding: 6px 12px;
    box-sizing: border-box;
    margin-right: 20px;
  }
  .handler {
    cursor: move;
  }
  .drag-boundary {
    display: inline-block;
    width: 662px;
    height: 662px;
    border: 1px solid #ccc;
    margin-left: 3vw;
  }
  .drag-boundary-item {
    display: inline-block;
    width: 83px;
    height: 83px;
    background-color: bisque;
    cursor: move;
  }
</style>
