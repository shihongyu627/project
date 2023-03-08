<template>
  <div>
    <row>
      <Upload
        :name="name"
        :action="action"
        :multiple="multiple"
        :format="format"
        :before-upload="handleBeforeUpload"
        :data="getTokenData"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :on-progress="handleProgress"
        :on-error="handleError"
        :on-remove="handleRemove"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleSizeError"
        style="height:118px;display: block;border-radius: 0;"
      >
        <div class="upload_box" @mouseenter="showMasterBox" @mouseleave="hideMasterBox">
          <div class="upload_master" v-if="!isUploading && showMaster">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff;margin-top:10px;"></Icon>
            <p>点击或者拖拽至此上传</p>
          </div>
          <div class="upload_rate" v-if="isUploading">
            <i-circle :percent="uploading_rate" :dashboard="false" style="padding: 15px">
              <span class="demo-circle-inner" style="font-size:18px">{{ uploading_rate }}%</span>
            </i-circle>
          </div>
          <img :src="setimage(value)" v-if="!multiple && value && type == 'image'" class="upload_img" />
          <img :src="setimage(value)" v-if="!multiple && value && type == 'avatar'" class="upload_img" style="width:50%;border-radius:10px;" />
        </div>
        <!-- <Col span="4" style="width:200px;text-align:center;margin-right: 10px;">
                <img :src="setimage(value)" v-if="value && type == 'image'" style="width:200px;height:auto;">
                <img :src="setimage(value)" v-if="value && type == 'avatar'" style="width:100px;height:auto;border-radius:10px;" />
            </Col> -->
        <!-- <Col  span="4" style="">
                <Button type="ghost" icon="ios-cloud-upload-outline">点击上传</Button>
            </Col> -->
      </Upload>
      <Col>
        <template v-for="(value, kk) in gallery">
          <div @click="delImage(value)" class="upload_box_del" :key="kk">
            <img :src="setimage(value)" v-if="multiple && type == 'image'" style="width:80px;height:auto;" />
          </div>
        </template>
      </Col>
    </row>
    <row style="margin-top:-7px;width:200px;" v-if="!multiple">
      <Input v-model="weburl" @on-change="inputChange" placeholder="网络地址"></Input>
    </row>
  </div>
</template>
<script>
import * as qiniu from 'qiniu-js'
export default {
  name: 'uploadFile',
  props: {
    name: String,
    value: String,
    type: String,
    uploadType: {
      type: String,
      default: () => 'Qiniu',
    },
    multiple: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      action: '',
      actionQiniu: 'http://upload.qiniup.com',
      actionOss: 'http://oss-cn-hangzhou.aliyuncs.com',
      isUploading: false,
      uploading_rate: 0,
      showMaster: true,
      weburl: '',
      format: ['jpg', 'jpeg', 'png', 'doc', 'docx', 'xlsx', 'xls', 'bin'],
      gallery: [],
    }
  },
  computed: {},
  watch: {
    value(v) {
      if (this.multiple) {
        if (v) {
          this.gallery = v.split(',')
        } else {
          this.gallery = []
        }
        return true
      }
      // 设置网络地址
      this.weburl = v
      this.showMaster = false
    },
  },
  async created() {
    if (this.type == 'image') {
      this.action = '/admin/api/upload/uploadimage'
      this.format = ['jpg', 'gif', 'png', 'jpeg']
    } else if (this.type == 'avatar') {
      this.action = '/admin/api/upload/uploadimage'
      this.format = ['jpg', 'gif', 'png', 'jpeg']
    } else if (this.type == 'audio') {
      this.action = '/admin/api/upload/uploadaudio'
      this.format = ['mp3', 'aac', 'm4a', 'wav', 'flac']
    } else if (this.type == 'video') {
      this.action = '/admin/api/upload/uploadvideo'
      this.format = ['mp4', 'avi', 'mov']
    } else if (this.type == 'document') {
      this.action = '/admin/api/upload/uploaddocument'
      this.format = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'wps']
    } else if (this.type == 'design') {
      this.action = '/admin/api/upload/uploaddesign'
      this.format = ['jpg', 'gif', 'png', 'jpeg', 'bmp', 'psd', 'cdr', 'zip', 'pdf', 'is', 'so', 'eps', 'ai', 'pcd', 'raw']
    } else {
      this.action = '/admin/api/upload/uploadfile'
      this.format = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'wps', 'bin']
    }
  },
  mounted() {
    if (this.multiple) {
      if (this.value) {
        this.gallery = this.value.split(',')
      } else {
        this.gallery = []
      }
    } else {
      if (this.value) {
        // 设置网络地址
        this.weburl = this.value
        this.showMaster = false
      }
    }
  },
  methods: {
    // 获取上传Token
    async getTokenData() {
      if (this.uploadType == 'Local') {
        return {}
      }
      let q = {}
      q.upload_type = this.uploadType
      let res = await $utils.api.load('uploadToken', q)
      if (res && res.data) {
        this.token = res.data.upload_token
        this.domain = res.data.upload_domain
      }
      return { token: this.token, domain: this.domain }
    },
    setimage(src) {
      if (src) {
        return $utils.image.load(src)
      }
    },
    showMasterBox() {
      this.showMaster = true
    },
    hideMasterBox() {
      if (this.value) {
        this.showMaster = false
      } else {
        this.showMaster = true
      }
    },
    showMasterDelBox() {
      this.showMasterDel = true
    },
    hideMasterDelBox() {
      this.showMasterDel = false
    },
    delImage(value) {
      console.log('delImage', value)
      let gallery = []
      for (let index = 0; index < this.gallery.length; index++) {
        const element = this.gallery[index]
        if (element == value) {
          continue
        }
        gallery.push(element)
      }
      this.gallery = gallery
      let xxx = ''
      if (this.multiple) {
        xxx = this.gallery.join(',')
      }
      this.$emit('input', xxx)
    },
    async handleBeforeUpload(file) {
      this.file = file
      console.log(file)
      this.isUploading = true
      this.uploading_rate = 0
      if (this.uploadType == 'Local') {
        return true
      }
      // 其他上传方式
      if (this.uploadType == 'Qiniu') {
        let tokenConfig = await this.getTokenData()
        let token = tokenConfig.token
        let domain = tokenConfig.domain
        if (!token) {
          // 返回本地上传
          return true
        }
        this.action = ''
        let ext = file.name.substring(file.name.lastIndexOf('.'))
        let fileName = Date.parse(new Date()) + (file.lastModified || file.size)
        let key = 'upload/xiaoju/' + $utils.time.format(Date.parse(new Date()) / 1000, 'YYYY-MM-DD') + '/' + fileName + ext
        console.log(file, key, token)
        let observable = qiniu.upload(file, key, token, {}, {})
        // 开始上传
        this.subscription = observable.subscribe(
          (next) => {
            this.isUploading = true
            this.uploading_rate = parseFloat(next.total.percent).toFixed(2)
            console.log('upload subscribe next', next)
          },
          (error) => {
            this.isUploading = false
            this.uploading_rate = 0
            console.log('upload subscribe error', error)
            $utils.toast.error(error.message + ':' + error.code)
          },
          (complete) => {
            this.isUploading = false
            this.uploading_rate = 100
            console.log('upload subscribe complete', complete)
            let url = domain + '/' + complete.key
            this.value = url
            let xxx = url
            if (this.multiple) {
              this.gallery.push(this.value)
              xxx = this.gallery.join(',')
            }
            this.$emit('input', xxx)
          }
        )
        // subscription.unsubscribe() // 上传取消
        return false
      }
      return true
    },
    handleProgress(res, file, filelist) {
      if (this.uploadType == 'Qiniu' || this.uploadType == 'Oss') {
        return true
      }
      this.isUploading = true
      this.uploading_rate = parseFloat(res.percent).toFixed(2)
      console.log('handleProgress ', res, file, filelist)
    },
    handleSuccess(res, file, filelist) {
      this.isUploading = false
      this.uploading_rate = parseFloat(res.percentage).toFixed(2)
      if (this.uploadType == 'Qiniu' || this.uploadType == 'Oss') {
        return true
      }
      $utils.toast.text(res.message)
      let src = (res.data && res.data.url) || ''
      this.value = src
      let xxx = src
      if (this.multiple) {
        this.gallery.push(this.value)
        xxx = this.gallery.join(',')
      }
      this.$emit('input', xxx)
      console.log('handleSuccess ', res, file, filelist)
    },
    handleError(error, file, filelist) {
      if (this.uploadType == 'Qiniu' || this.uploadType == 'Oss') {
        return true
      }
      this.isUploading = false
      this.uploading_rate = 0
      $utils.toast.error('上传错误')
      console.log('handleError ', error, file, filelist)
    },
    handleRemove(file, filelist) {
      this.isUploading = false
      this.uploading_rate = 0
    },
    handleFormatError(file, filelist) {
      this.isUploading = false
      this.uploading_rate = 0
      $utils.toast.error('上传格式错误')
      console.log('handleFormatError ', file, filelist)
    },
    handleSizeError(file, filelist) {
      this.isUploading = false
      this.uploading_rate = 0
      $utils.toast.error('上传大小超限')
      console.log('handleSizeError ', file, filelist)
    },
    inputChange(e) {
      this.value = this.weburl
      this.$emit('input', this.weburl)
      console.log('inputChange ', this.weburl)
    },
  },
}
</script>
<style lang="less" scoped>
.upload_box {
  position: relative;
  display: flex;
  width: 200px;
  height: 112px;
  text-align: center;
  margin-right: 10px;
  border: 1px dashed #dddee1;
  border-radius: 0px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  &:hover {
    border-color: #2d8cf0;
  }
}

.upload_master {
  position: absolute;
  width: 100%;
  height: 110px;
  border: none;
  border-radius: 0px;
  background: rgba(255, 255, 255, 1);
  top: 0;
  bottom: 0;
  color: #333;
  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
  }
}

.upload_box_del {
  position: relative;
  display: flex;
  width: 100px;
  height: 112px;
  text-align: center;
  margin-right: 10px;
  border: 1px dashed #dddee1;
  border-radius: 0px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  float: left;
  margin-top: 5px;
  &:hover {
    border-color: #2d8cf0;
  }
}

.upload_master_del {
  position: absolute;
  width: 100%;
  height: 110px;
  border: none;
  border-radius: 0px;
  background: rgba(255, 255, 255, 1);
  top: 0;
  bottom: 0;
  color: #333;
  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
  }
}

.upload_rate {
  position: absolute;
  width: 100%;
  height: 110px;
  border: none;
  border-radius: 0px;
  background: #fff;
  top: 0;
  bottom: 0;
  color: #333;
  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
  }
}

.upload_img {
  width: 90%;
  border-radius: 0px;
  overflow: hidden;
  height: auto;
}
</style>
