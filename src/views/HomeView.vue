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
    // console.log(' --------- vue make', vueSourceStr.value)
    parserRes.value = parser(delScriptJsonBlock(vueSourceStr.value), { isMpx: true })
    const VR = new Render(parserRes.value, {
      props: [
        {
          type: 'Name',
          zh: '参数',
          en: 'Name'
        },
        {
          type: 'Description',
          zh: '说明',
          en: 'Description'
        },
        {
          type: 'Type',
          zh: '类型',
          en: 'Type'
        },
        {
          type: 'Optional',
          zh: '可选值',
          en: 'Optional'
        },
        {
          type: 'Default',
          zh: '默认值',
          en: 'Default'
        }
        // {
        //   type: 'Wx',
        //   zh: '微信',
        //   en: 'WeChat'
        // },
        // {
        //   type: 'Web',
        //   zh: 'web',
        //   en: 'web'
        // },
        // {
        //   type: 'Ali',
        //   zh: '支付宝',
        //   en: 'Alipay'
        // }
      ],
      slots: [
        {
          type: 'Name',
          zh: '插槽名',
          en: 'Name'
        },
        {
          type: 'Description',
          zh: '说明',
          en: 'Description'
        },
        {
          type: 'Default',
          zh: '默认值',
          en: 'Default Slot Content'
        }
      ],
      methods: [
        {
          type: 'Name',
          zh: '组件实例方法',
          en: 'Method Name'
        },
        {
          type: 'Description',
          zh: '说明',
          en: 'Description'
        },
        {
          type: 'Parameters',
          zh: '参数',
          en: 'Parameters'
        },
        {
          type: 'Return',
          zh: '返回值',
          en: 'Return'
        }
      ],
      events: [
        {
          type: 'Name',
          zh: '事件名',
          en: 'Method Name'
        },
        {
          type: 'Description',
          zh: '说明',
          en: 'Description'
        },
        {
          type: 'Parameters',
          zh: '参数',
          en: 'Parameters'
        }
      ],
      mixIns: [
        {
          type: 'Name',
          zh: '参数',
          en: 'Name'
        }
      ]
    })
    mdRes = VR.renderMarkdown()
    renderRes.value = VR.render()
    handleSwitch(currentType.value)
  } catch (e: any) {
    console.log('--------- error', e)
    consumerSource.value = e.toString()
  }
}

function handleSwitch(type: number) {
  currentType.value = type
  switch (type) {
    // Parser result
    case 0:
      mdSource.value = mdRes ? mdRes.content : ''
      consumerSource.value = stringify(parserRes.value)
      consumerMode.value = 'javascript'
      break
    // Raw markdown
    case 1:
      consumerSource.value = mdRes ? mdRes.content : ''
      // console.log('------- mdRes', mdRes.content)
      consumerMode.value = 'markdown'
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
