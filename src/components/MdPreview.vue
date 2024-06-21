<template>
  <div class="md-container">
    <div class="md-title">Markdown Preview</div>
    <div id="result" ref="container" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import markdownIt from '@/utils/markdown-it-init'

const vModel = defineModel()

watch(vModel, markdownItdRender, { immediate: true })

function markdownItdRender() {
  if (vModel.value) {
    const htmlSource = markdownIt.render(vModel.value)
    nextTick(() => {
      document.querySelector('#result')!.innerHTML = htmlSource || ''
    })
  }
}


</script>

<style lang="stylus" scoped>
.container
  width 100vw
  height 100vh
  background-color #ccc
.md-title
  text-align center
  font-weight bold
.md-container
  flex 1
  margin 10px
  overflow scroll
</style>
