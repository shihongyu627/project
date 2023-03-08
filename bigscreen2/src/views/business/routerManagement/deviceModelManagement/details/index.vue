<template>
  <div class="main caseMain">
    <div class="formcon">
      <el-form
        ref="subForm"
        :model="subForm"
        label-width="120px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备型号名称" prop="deviceName" :rules="[{required: true, message: '请输入设备型号名称', trigger: 'change'}]">
              <el-input
                v-model.trim="subForm.deviceName"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="sub_btn">
          <el-button v-if="!id" type="primary" :loading="addLoading" @click="addDeviceModel('subForm')">保存</el-button>
          <el-button v-if="id" type="primary" :loading="editLoading" @click="editDeviceModel('subForm')">保存</el-button>
          <el-button @click="cancelFun">取消</el-button>
        </el-row>
      </el-form>
    </div>
  </div>

</template>

<script>
import api_list from '../api/deviceModelApi'
export default {
  name: 'DeviceModelManagement',
  components: {
  },
  data() {
    return {
      addLoading: false,
      editLoading: false,
      id: '',
      subForm: {
        deviceName: ''
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
    // 初始化数据
    initData() {
      Object.assign(this.subForm, this.$route.query)
    },
    addDeviceModel(formName) {
      var that = this
      var subObj = Object.assign({}, this.subForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addLoading = true
          api_list.addDeviceModel(subObj).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '新增设备型号成功',
                type: 'success',
                offset: 100
              })
              setTimeout(() => {
                this.addLoading = false
                // 关闭当前标签页
                that.$store.dispatch('tagsView/delView', this.$route)
                // 返回指定路由
                that.$router.push({ name: 'deviceModelManagement' })
              }, 1500)
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
    editDeviceModel(formName) {
      var that = this
      var subObj = Object.assign({}, this.subForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editLoading = true
          api_list.editDeviceModel(subObj).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '编辑设备型号成功',
                type: 'success',
                offset: 100
              })
              setTimeout(() => {
                this.editLoading = false
                // 关闭当前标签页
                that.$store.dispatch('tagsView/delView', this.$route)
                // 返回指定路由
                that.$router.push({ name: 'deviceModelManagement' })
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
      this.$router.push({ name: 'deviceModelManagement' })
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
    }
    .sub_btn{
        text-align: center;
    }
    .el-table {
        margin-top: 30px;
    }
}
</style>
