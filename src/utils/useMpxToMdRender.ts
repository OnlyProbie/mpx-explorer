import { ref, watch } from 'vue'
import vueSource from '@/utils/vueSource'
import { stringify, delScriptJsonBlock } from '@/utils/tools'
import { parser } from '@mpxjs/vuese-parser'
import { Render } from '@mpxjs/vuese-markdown-render'
import CodeMirror from '@/components/CodeMirror.vue'
import MdPreview from '@/components/MdPreview.vue'

// 默认的解析选项
const defaultOptions = {
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
}

export default function useMpxToMdRender() {
  const vueSourceStr = ref(vueSource)
  const parserRes = ref({})
  const renderRes = ref({})
  const currentType = ref(0)
  const consumerMode = ref('markdown')
  const consumerSource = ref('')
  const mdSource = ref('')
  let mdRes = {} as unknown as { content: string }

  watch(vueSourceStr, make, { immediate: true })

  function make() {
    try {
      parserRes.value = parser(delScriptJsonBlock(vueSourceStr.value), { isMpx: true })
      const VR = new Render(parserRes.value, defaultOptions as unknown as RenderOptions)
      mdRes = VR.renderMarkdown()!
      renderRes.value = VR.render()
      handleSwitch(currentType.value)
    } catch (e: any) {
      console.error('[vueSourceStc parser error]: ', e)
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
        consumerMode.value = 'markdown'
        break
      // Render result
      case 2:
        consumerSource.value = stringify(renderRes.value)
        consumerMode.value = 'javascript'
        break
    }
  }
  return {
    vueSourceStr,
    currentType,
    consumerMode,
    mdSource,
    consumerSource,
    handleSwitch,
    CodeMirror,
    MdPreview
  }
}
