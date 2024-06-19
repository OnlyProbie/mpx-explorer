export default `
<template>
  <cube-button
    bindclick="handleClick"
    styleConfig="{{btnStyleConfig}}"
    loading="{{loading}}"
    outline="{{outline}}"
    class="{{classes}}"
    disabled="{{disabled}}"
    inline="{{inline}}"
    tip="{{tip}}">
    <view >
      <view class="{{titleClass}}" wx:if="{{text}}">{{text}}</view>
      <slot></slot>
      <slot slot="tip" name="buttonTip" />
    </view>
  </cube-button>
</template>

<script>
import { createComponent } from '@mpxjs/core'

const DisabledBtnStyle = {
  boxShadow: 'none'
}

createComponent({
  computed: {
    classes () {
      return \`mpx-basic-button-\${ this.themeType }\`
    },
    titleClass() {
      return this.isEllipsis ? 'mpx-button-title-ellipsis' : ''
    },
    btnStyleConfig () {
      const btn = this.styleConfig?.btn
      const content = this.styleConfig?.content
      return {
        btn: {
          ...btn,
          ...(this.disabled ? DisabledBtnStyle : {}) // 如果按钮不可用，清除shadow
        },
        content
      }
    }
  },
  properties: {
    // 按钮文案
    text: {
      type: String,
      value: ''
    },
    // 辅助文案
    tip: {
      type: String,
      value: ''
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      value: false
    },
    // 是否内联
    inline: {
      type: Boolean,
      value: false
    },
    // 是否展示外边框
    outline: {
      type: Boolean,
      value: false
    },
    // 是否展示loading态
    loading: {
      type: Boolean,
      value: false
    },
    // 主题类型
    themeType: {
      type: String,
      value: 'dd'
    },
    // 是否打点
    isEllipsis: {
      type: Boolean,
      value: false
    },
    // 按钮样式配置
    styleConfig: Object
  },
  methods: {
    handleClick () {
      this.triggerEvent('click')
    }
  }
})
</script>

<style lang="stylus" scoped>
.mpx-button-title-ellipsis
  text-overflow:ellipsis
  white-space:nowrap
  overflow:hidden
  width: 100%

</style>
<script type="application/json">
{
  "component": true,
  "usingComponents": {
    "cube-button": "@didi/mpx-cube-ui/lib/components/button/index.mpx"
  }
}
</script>
`
