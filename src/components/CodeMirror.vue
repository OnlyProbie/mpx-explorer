<template>
  <div :class="$style.editorBox">
    <header :class="$style.editorHeader">
      {{ title }}
      <slot />
    </header>
    <div :class="$style.editorContainer">
      <div ref="editor"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from 'throttle-debounce'
import { basicSetup } from 'codemirror'
import { keymap, EditorView } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
// https://github.com/craftzdog/cm6-themes
// import { solarizedDark } from 'cm6-theme-solarized-dark'
// import { basicDark } from 'cm6-theme-basic-dark'
// import { solarizedLight } from 'cm6-theme-solarized-light'
// import { gruvboxLight } from 'cm6-theme-gruvbox-light'
import { materialDark } from 'cm6-theme-material-dark'

// import * as monaco from "monaco-editor";

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Vue component'
  },
  mode: {
    type: String,
    default: 'vue',
    validator (mode) {
      return ['vue', 'markdown', 'javascript'].indexOf(mode) > -1
    }
  },
  theme: {
    type: String,
    default: 'panda-syntax',
    validator (theme) {
      return (
        ['panda-syntax', 'base16-light', 'darcula', 'neo'].indexOf(theme) > -1
      )
    }
  }
})

const editorIns = ref(null)
const editor = ref(null)
const vModel = defineModel()

watch(vModel, (val) => {
  console.log(' ------ 触发 watch', val, props.readOnly)
  props.readOnly && setValue(val)
})

watch(props.mode, (val) => {
  editorIns.value && editorIns.value.setOption('mode', val)
}, { immediate: true })

onMounted(() => {
  editorIns.value = new EditorView({
    doc: vModel.value,
    extensions: [
      // basicSetup 是一套插件集合，包含了很多常用插件
      basicSetup,
      // 新版本一切皆插件，所以实时侦听数据变化也要通过写插件实现
      EditorView.updateListener.of(debounce(500, (v) => {
        if (props.readOnly) return;
        vModel.value = v.state.doc.toString();
      })),
      materialDark,
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      javascript()
    ],
    parent: editor.value
  })
  setValue(vModel.value.trim())
})

function setValue (code) {
  // console.log('------ 触发 setValue', code)
  editorIns.value.dispatch({
    change: { from: 0, to: editorIns.value.state.doc.length, insert: code }
  })
}

</script>

<style lang="stylus" module>
.editorContainer
  flex 1
  height 100%
  overflow scroll
.editorBox
  display flex
  flex-direction column
  height 100%
  flex 1
.editorHeader
  display flex
  font-weight bold
  justify-content center
  align-items center
  height 40px
</style>
