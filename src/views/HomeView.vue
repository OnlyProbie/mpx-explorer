<template>
  <div id="app">
    <code-mirror v-model="vueSourceStr" title="Vue Component(editable)" />
    <md-preview v-model="mdSource" />
    <code-mirror ref="consumeMirror" v-model="consumerSource" v-if="controlStore.showGeneratedContent" title="Generated content" :mode="consumerMode"
      theme="darcula" read-only>
      <button type="button" :class="{ active: currentType === 0 }" @click="handleSwitch(0)">
        Raw Markdown
      </button>
      <button type="button" :class="{ active: currentType === 1 }" @click="handleSwitch(1)">
        Parser Result
      </button>
      <button type="button" :class="{ active: currentType === 2 }" @click="handleSwitch(2)">
        Render Result
      </button>
    </code-mirror>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import vueSource from '@/utils/vueSource'
import { stringify, delScriptJsonBlock } from '@/utils/tools'
import { parser } from '@mpxjs/vuese-parser'
import { Render } from '@mpxjs/vuese-markdown-render'

import CodeMirror from '@/components/CodeMirror.vue'
import MdPreview from '@/components/MdPreview.vue'

import { useControlStore } from '../stores/control'

const controlStore = useControlStore()

const vueSourceStr = ref(vueSource)
const parserRes = ref(null)
const renderRes = ref(null)
const currentType = ref(0)
const consumerMode = ref('markdown')
const consumerSource = ref('')
const mdSource = ref('')
let mdRes = null as unknown as { content: string }

watch(vueSourceStr, make, { immediate: true })

function make() {
  try {
    parserRes.value = parser(delScriptJsonBlock(vueSourceStr.value))
    const VR = new Render(parserRes.value)
    mdRes = VR.renderMarkdown()
    renderRes.value = VR.render()
    handleSwitch(currentType.value)
  } catch (e: any) {
    consumerSource.value = e.toString()
  }
}

function handleSwitch(type: number) {
  currentType.value = type
  switch (type) {
    // Raw markdown
    case 0:
      consumerSource.value = mdRes ? mdRes.content : ''
      mdSource.value = consumerSource.value
      consumerMode.value = 'markdown'
      break
    // Parser result
    case 1:
      consumerSource.value = stringify(parserRes.value)
      consumerMode.value = 'javascript'
      break
    // Render result
    case 2:
      consumerSource.value = stringify(renderRes.value)
      consumerMode.value = 'javascript'
      break
  }
}


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
