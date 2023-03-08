<template>
  <div class="main caseMain">
    <!-- <div class="queryFrom">
        <h3>数据筛选</h3>
      <div class="backStyle">
        <el-page-header content="数据管理-详情页面" @back="backBtn" />
      </div>
    </div> -->
    <div class="formcon">
      <el-form
        ref="subForm"
        :model="subForm"
        label-width="120px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="人脸渠道名称" prop="channelName" :rules="[{required: true, message: '请输入人脸渠道名称', trigger: 'change'}]">
              <el-input
                v-model.trim="subForm.channelName"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人" prop="channelUser">
              <el-input
                v-model.trim="subForm.channelUser"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系邮箱" prop="channelEmill">
              <el-input
                v-model.trim="subForm.channelEmill"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="channelPhone">
              <el-input
                v-model.trim="subForm.channelPhone"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="sub_btn">
          <el-button v-if="id.length == 0" type="primary" :loading="addLoading" @click="addChannel('subForm')">保存</el-button>
          <el-button v-if="id.length > 0" type="primary" :loading="editLoading" @click="editChannel('subForm')">保存</el-button>
          <el-button @click="cancelFun">取消</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import api_list from '../api/faceChannelApi'
export default {
  name: 'FaceChannelManagement',
  components: {
  },
  data() {
    return {
      id: '',
      addLoading: false,
      editLoading: false,
      subForm: {
        channelName: '',
        channelUser: '',
        channelEmill: '',
        channelPhone: ''
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.initData()
    }
  },
  methods: {
    initData() {
      Object.assign(this.subForm, this.$route.query)
    },
    addChannel(formName) {
      var that = this
      var subObj = Object.assign({}, this.subForm)
      for (var i in subObj) {
        if (subObj[i] === null || subObj[i].length === 0) delete subObj[i]
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addLoading = true
          api_list.addChannel(subObj).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '新增人脸渠道成功',
                type: 'success',
                offset: 100
              })
              setTimeout(() => {
                this.addLoading = false
                // 关闭当前标签页
                that.$store.dispatch('tagsView/delView', this.$route)
                // 返回指定路由
                that.$router.push({ name: 'faceChannelManagement' })
              }, 1000)
            } else {
              this.addLoading = false
              this.$message({
                message: res.message,
                type: 'error',
                offset: 100
              })
            }
          })
        }
      })
    },
    editChannel(formName) {
      var that = this
      var subObj = Object.assign({}, this.subForm)
      for (var i in subObj) {
        if (subObj[i] === null || subObj[i].length === 0) delete subObj[i]
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editLoading = true
          api_list.editChannel(subObj).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '编辑人脸渠道成功',
                type: 'success',
                offset: 100
              })
              setTimeout(() => {
                this.editLoading = false
                // 关闭当前标签页
                that.$store.dispatch('tagsView/delView', this.$route)
                // 返回指定路由
                that.$router.push({ name: 'faceChannelManagement' })
              }, 1500)
            } else {
              this.editLoading = false
              this.$message({
                message: res.message,
                type: 'error',
                offset: 100
              })
            }
          })
        }
      })
    },
    cancelFun() {
      // 关闭当前标签页
      this.$store.dispatch('tagsView/delView', this.$route)
      // 返回指定路由
      this.$router.push({ name: 'faceChannelManagement' })
    },
    backBtn() {
      // this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'faceChannelManagement' })
    }
  }
}
</script>

<style lang="scss" scoped>
.caseMain {
    .backStyle{
        background-color: #fff;
        padding: 15px;
        margin-right: 15px;
        margin-bottom: 15px;
        color: #1B64B8;
        ::v-deep .el-page-header__content {
            font-size: 14px;
            color: #666;
            font-weight: bold;
        }
    }
    .formcon{
        background: #fff;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-right: 15px;
    }
    .sub_btn{
        text-align: center;
    }
    .el-table {
        margin-top: 30px;
    }
}
</style>
