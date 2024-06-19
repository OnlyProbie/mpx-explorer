<template>
  <div :class="$style.editorBox">
    <header :class="$style.editorHeader">
      {{ title }}
      <slot />
    </header>
    <textarea ref="editor" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import CodeMirror from 'codemirror'
import { debounce } from 'throttle-debounce'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/javascript/javascript'

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

const vModel = defineModel()

const editorIns = ref(null)
const editor = ref(null)

const inputEmit = defineEmits(['input'])

watch(vModel, (val) => {
  props.readOnly && editorIns.value.setValue(val)
})

watch(props.mode, (val) => {
  editorIns.value && editorIns.value.setOption('mode', val)
}, { immediate: true })

onMounted(() => {
  editorIns.value = CodeMirror.fromTextArea(editor.value, {
    value: '',
    mode: props.mode,
    theme: props.theme,
    lineNumbers: true,
    styleActiveLine: true,
    autofocus: props.readOnly ? false : true,
    readOnly: props.readOnly,
    matchBrackets: true,
    lineWrapping: true
  })
  editorIns.value.setValue(vModel.value.trim())

  editorIns.value.on(
    'change',
    debounce(500, () => {
      inputEmit('input', editorIns.value.getValue())
    })
  )
})

</script>

<style src="codemirror/lib/codemirror.css"></style>
<style src="codemirror/theme/panda-syntax.css"></style>
<style src="codemirror/theme/base16-light.css"></style>
<style src="codemirror/theme/darcula.css"></style>
<style src="codemirror/theme/neo.css"></style>
<style lang="stylus">
.CodeMirror
  flex 1
</style>
<style lang="stylus" module>
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
