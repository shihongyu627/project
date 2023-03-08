<template>
  <div :id="uuid()"></div>
</template>
<script>
import wangEditor from 'wangeditor'
import axios from 'axios'
export default {
  name: 'formEditor',
  components: {},
  props: {
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => {
        return {}
      },
    },
    debug: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 99999,
    },
  },
  data() {
    return {
      editor: null,
      id: '',
      isInit: false,
    }
  },
  computed: {},
  watch: {
    value(val) {
      if (!this.isInit && val) {
        this.isInit = true
        this.editor.txt.html(val)
      }
    },
  },
  created() {},
  mounted() {
    this.editor = new wangEditor('#' + this.uuid())
    // 自定义菜单配置
    this.editor.config.debug = this.debug
    this.editor.config.zIndex = this.zIndex
    this.editor.config.uploadImgTimeout = 60 * 1000
    // 配置 server 接口地址
    // this.editor.config.uploadImgServer = config.API_HOST + '/admin/common/upload'
    // 自定义上传图片
    this.editor.config.customUploadImg = function(resultFiles, insertImgFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      let param = new FormData()
      param.append('file', resultFiles[0]) //通过append向form对象添加数据
      console.log(param.get('file')) //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let aconfig = {
        headers: { 'Content-Type': 'multipart/form-data', "Admin-AUTHORIZATION": window.localStorage.getItem('token') || '' },
      } //添加请求头
      axios.post('/admin/api/upload/uploadImage', param, aconfig).then((response) => {
        console.log(response)
        let data = response.data.data || {}
        let imgUrl = data.url || ''
        if (imgUrl) {
          // 上传图片，返回结果，将图片插入到编辑器中
          insertImgFn(imgUrl)
        } else {
          alert('上传错误')
        }
      })
    }
    // 配置菜单栏，设置不需要的菜单
    this.editor.config.excludeMenus = ['emoticon', 'video', 'code']
    // 配置全屏功能按钮是否展示
    this.editor.config.showFullScreen = false // 全屏无法展开
    Object.assign(this.editor.config, this.config)
    this.editor.config.onchange = (html) => {
      console.log(html)
      this.$emit('input', html)
    }
    this.editor.create()
    this.editor.txt.html(this.value)
  },
  methods: {
    getContent() {
      return this.editor.txt.text()
    },
    uuid() {
      if (!this.id) {
        this.id = 'editor_id_' + Math.ceil(Math.random() * 1000)
      }
      return this.id
    },
  },
  destroyed() {
    this.editor.txt.clear()
  },
  updated() {},
}
</script>
<style lang="less"></style>
