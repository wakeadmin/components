<template>
  <FatFormSteps>
    <template #submitter="scope">
      {{scope.disabled}}
    </template>
  </FatFormSteps>
</template>

<script lang="tsx" setup>
  import {FatFormSteps} from '../../fat-form-layout'
</script>
