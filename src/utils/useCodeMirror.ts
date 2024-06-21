import { onMounted, ref, watch, type Ref } from 'vue'
import { debounce } from 'throttle-debounce'
import { basicSetup } from 'codemirror'
import { keymap, EditorView } from "@codemirror/view"
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentMore,
  indentLess
} from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
import { vue } from '@codemirror/lang-vue'
import { html } from "@codemirror/lang-html"

// https://github.com/craftzdog/cm6-themes
import { solarizedDark } from 'cm6-theme-solarized-dark'
import { basicDark } from 'cm6-theme-basic-dark'
import { solarizedLight } from 'cm6-theme-solarized-light'
import { gruvboxLight } from 'cm6-theme-gruvbox-light'
import { materialDark } from 'cm6-theme-material-dark'

const themeType = {
  'solarized-dark': solarizedDark,
  'basic-dark': basicDark,
  'solarized-light': solarizedLight,
  'gruvbox-light': gruvboxLight,
  'material-dark': materialDark
}

// 插入多行注释
const blockCommentCompletion = EditorView.updateListener.of(update => {
  if (update.docChanged) {
    const changes = update.changes
    changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
      const insertedText = inserted.toString()
      if (insertedText === '*') {
        const prevChar = update.state.doc.sliceString(fromA - 1, fromA)
        if (prevChar === '/') {
          const line = update.state.doc.lineAt(fromA)
          const indentation = line.text.slice(0, line.text.search(/\S|$/))
          update.view.dispatch({
            changes: {
              from: toB,
              insert: `\n${indentation} * \n${indentation} */`
            },
            selection: { anchor: toB + indentation.length + 4 }
          })
        }
      }
    })
  }
})

export default function useCodeMirror(
  editor: Ref<HTMLDivElement>,
  vModel: Ref<string>,
  options?: {
    value?: string;
    mode?: 'javascript' | 'vue';
    theme?: 'material-dark';
    readOnly?: boolean;
    extensions?: any[];
  }
): { setValue: (code: string) => void; editorIns: Ref<any> } {
  const editorIns = ref(null as unknown as EditorView)

  // watch(options?.mode, (val) => {
  //   editorIns.value && editorIns.value.setOption('mode', val)
  // }, { immediate: true })

  onMounted(() => {
    editorIns.value = new EditorView({
      doc: vModel.value,
      extensions: [
        // basicSetup 是一套插件集合，包含了很多常用插件
        basicSetup,
        // 新版本一切皆插件，所以实时侦听数据变化也要通过写插件实现
        EditorView.updateListener.of(debounce(500, (v: any) => {
          if (options?.readOnly) return;
          vModel.value = v.state.doc.toString();
        })),
        // html解析
        html(),
        // js解析
        javascript(),
        // vue模版解析
        vue(),
        // 主题配置
        themeType[options?.theme || 'material-dark'],
        // 历史记录
        history(),
        // 快捷键配置
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          { key: "Tab", run: indentMore },
          { key: "Shift-Tab", run: indentLess }
        ]),
        // 插入多行注释插件
        blockCommentCompletion,
        ...(options?.extensions || [])
      ],
      parent: editor.value
    })
    setValue(vModel.value.trim())
  })

  function setValue(code: string) {
    editorIns.value.dispatch({
      // @ts-ignore
      change: { from: 0, to: editorIns.value.state.doc.length, insert: code }
    })
  }
  return {
    setValue,
    editorIns
  }
}
