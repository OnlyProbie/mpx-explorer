export default `
<template>
  <view class="mpx-action-sheet-wrapper">
    <cube-modal
      wx:ref="cubeModal"
      class="{{classes}}"
      title="{{title}}"
      themeType="{{themeType}}"
      showCloseIcon="{{true}}"
      maskClosable="{{true}}"
      noBuiltInBtns="{{true}}"
      bindclose="close"
      bindmaskClick="close">
      <!-- 弹窗 header 区域 -->
      <slot slot="header" name="header" />
      <!-- 弹窗 icon -->
      <slot slot="icon" name="icon" />
      <view class="action-sheet-subtitle" slot="title"><special-text text="{{subTitle}}" rules="{{subtitleRules}}"></special-text></view>
      <view slot="content">
        <view class="action-sheet-items">
          <view
            class="item {{selectedIndex === index ? 'active' : ''}}"
            wx:for="{{dataList}}"
            wx:key="index"
            bindtap="clickItem(index)">
            {{item.desc || item}}
          </view>
        </view>
      </view>
      <!-- 弹窗 footer 区域 -->
      <slot slot="footer" name="footer" />
    </cube-modal>
  </view>
</template>
<script>
import { createComponent } from '@mpxjs/core'
createComponent({
  properties: {
    /*
     * @description 列表数据
     */
    dataList: {
      type: Array,
      value: []
    },
    /*
     * @description 标题
     */
    title: String,
    /*
     * @description 副标题，special-text 支持
     */
    subTitle: String,
    /*
     * @description 当前选中的数据下标
     */
    selectedIndex: {
      type: Number,
      value: 0
    },
    /*
     * @description 副标题高亮文本样式
     */
    subtitleRules: Object,
    /*
     * @description 列表数据
     * @optional dd/sfc/daijia/kf
     */
    themeType: {
      type: String,
      value: 'dd'
    }
  },
  data: {},
  computed: {
    classes () {
      return 'mpx-action-sheet-\${ this.themeType }'
    }
  },
  methods: {
    close () {
      this.triggerEvent('toggle', {value: false})
      // close 按钮点击
      this.triggerEvent('close')
    },
    show () {
      this.$refs.cubeModal && this.$refs.cubeModal.show()
    },
    hide () {
      this.$refs.cubeModal && this.$refs.cubeModal.hide()
    },
    clickItem (index) {
      // 点击统一触发事件
      // @arg { value: false }
      this.triggerEvent('toggle', {value: false})
      // 点击列表触发事件
      // @arg { value: 选中列表数据, index: 选中列表索引 }
      this.triggerEvent('selected', {
        value: this.dataList[index].desc || this.dataList[index],
        index
      })
    }
  }
})
</script>
<style lang="stylus">
@import "../../common/stylus/var.styl"
@import "../../common/stylus/mixin.styl"
.mpx-action-sheet-wrapper
  .action-sheet-subtitle
    color #666
    font-size 14px
    line-height 1.4
    white-space pre-line
  .item
    border-bottom-1px($color-grey-line)
    height 50px
    text-align center
    line-height 50px
    font-size $fontsize-large
    color $color-grey
    &.active
      color $color-orange-t
</style>
<script type="application/json">
{
  "component": true,
  "usingComponents": {
    "special-text": "../../components/special-text/index.mpx",
    "cube-modal": "@didi/mpx-cube-ui/lib/components/modal/index.mpx"
  }
}
</script>
`
