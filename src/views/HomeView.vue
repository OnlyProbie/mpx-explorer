<template>
  <div id="app">
    <code-mirror style="max-width:50%;" v-model="vueSourceStr" title="Vue Component(editable)" />
    <md-preview v-model="mdSource" />
    <code-mirror ref="consumeMirror" v-model="consumerSource" v-if="controlStore.showGeneratedContent"
      title="Generated content" :mode="consumerMode" theme="darcula" read-only>
      <button type="button" :class="{ active: currentType === 0 }" @click="handleSwitch(0)">
        Parser Result
      </button>
      <!-- <button type="button" :class="{ active: currentType === 1 }" @click="handleSwitch(1)">
        Raw Markdown
      </button>
      <button type="button" :class="{ active: currentType === 2 }" @click="handleSwitch(2)">
        Render Result
      </button> -->
    </code-mirror>
  </div>
</template>

<script setup lang="ts">
import { useControlStore } from '../stores/control'
import useMpxToMdRender from '@/utils/useMpxToMdRender'

const controlStore = useControlStore()

const {
  vueSourceStr,
  currentType,
  consumerMode,
  mdSource,
  handleSwitch,
  CodeMirror,
  MdPreview
} = useMpxToMdRender()

</script>

<style lang="stylus">
html, body, #app
  height 100%
  margin 0
#app
  display flex
button[type=button]
  border none
  background #e4f5ef
  height 30px
  box-sizing border-box
  border-radius 3px
  padding 0 14px
  font-size 14px
  cursor pointer
  margin-right 4px
  outline 0
  &:first-child
    margin-left 20px
  &.active
    background-color #42b983
    color #fff
  &:hover
    box-shadow 0 0 2px #42b983
.githubLink
  margin-left 20px
  color #42b983
</style>
