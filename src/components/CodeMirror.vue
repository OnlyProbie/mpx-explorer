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

<script setup lang="ts">
import { ref, watch, type ModelRef } from 'vue'
import useCodeMirror from '@/hooks/useCodeMirror'

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
    validator(mode: string) {
      return ['vue', 'markdown', 'javascript'].indexOf(mode) > -1
    }
  },
  theme: {
    type: String,
    default: 'panda-syntax',
    validator(theme: string) {
      return (
        ['panda-syntax', 'base16-light', 'darcula', 'neo'].indexOf(theme) > -1
      )
    }
  }
})
const editor = ref(null as unknown as HTMLDivElement)
const vModel = defineModel()

const { setValue } = useCodeMirror(editor!, vModel as ModelRef<string>, {
  readOnly: props.readOnly,
  mode: props.mode,
})

watch(vModel, (val) => {
  props.readOnly && setValue(val as string)
})

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
../hooks/useCodeMirror