<template>
  <Row>
    <Col style="width:375px;">
      <script style="width:375px" id="ueditor" type="text/plain"></script>
    </Col>
  </Row>
</template>

<script>
import config from '@/../build/config'
if (config.env === 'production') {
  window.UEDITOR_HOME_URL = '/app/admin/static/assets/js/ueditor/'
} else {
  window.UEDITOR_HOME_URL = '/static/assets/js/ueditor/'
}
var URL = window.UEDITOR_HOME_URL
import '@/../static/assets/js/ueditor/ueditor.config.js'
import '@/../static/assets/js/ueditor/ueditor.all.min.js'
import '@/../static/assets/js/ueditor/lang/zh-cn/zh-cn.js'
import '@/../static/assets/js/ueditor/ueditor.parse.min.js'
import '@/../static/assets/js/ueditor/xiumi-ue-dialog-v5.js'
import '@/../static/assets/js/ueditor/xiumi-ue-v5.css'
export default {
  name: 'formUeditor',
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    config: {
      type: String,
      default: () => {
        return {
          autoHeight: false
        }
      }
    }
  },
  data() {
    return {
      ueditor: null,
      isinit: false
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.ueditor = UE.getEditor(
      'ueditor',
      Object.assign(
        {
          UEDITOR_HOME_URL: URL,
          serverUrl:
            $utils.config.API_HOST + window.UEDITOR_HOME_URL + 'php2/controller.php'
        },
        this.config
      )
    ) // 初始化UE
    this.ueditor.addListener('ready', () => {
      console.log('formUeditor ready', true)
      this.ueditor.setContent(this.value) // 确保UE加载完成后，放入内容。
    })
    this.ueditor.addListener('contentChange', () => {
      const val = this.ueditor.getContent()
      this.$emit('input', val)
      // console.log('formUeditor content', true)    // 内容更改触发
    })
  },
  methods: {
    getContent() {
      // 获取内容方法
      if(this.ueditor){
        return this.ueditor.getContent()
      }
      return ''
    }
  },
  destroyed() {
    if(this.ueditor){
      this.ueditor.destroy()
    }
  },
  updated() {},
  methods: {},
  watch: {
    value(val) {
      if (!this.isinit && val) {
        this.isinit = true
        if(this.ueditor){
          this.ueditor.setContent(val) // 确保UE加载完成后，放入内容。
        }
      }
    }
  },
  init() {}
}
</script>
<style lang="less"></style>
