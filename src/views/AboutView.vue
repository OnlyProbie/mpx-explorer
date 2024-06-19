<template>
  <div class="about">
    <div><h1>Options</h1></div>
    <div>
      <label>1.</label>
      是否展示 Generated content
      <input type="checkbox" v-model="controlStore.showGeneratedContent">
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from '../stores/control'

const controlStore = useControlStore()

</script>

<style lang="stylus" scoped>
.about
  min-height: 100vh;
  padding 0 1rem
  display flex
  flex-direction column
  h1
    padding-top 5rem

</style>
