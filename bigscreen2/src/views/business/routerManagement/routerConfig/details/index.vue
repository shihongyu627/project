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
            <el-form-item label="路由名称" prop="routeName" :rules="[{required: true, message: '请输入路由名称', trigger: 'change'}]">
              <el-input
                v-model.trim="subForm.routeName"
                placeholder="请输入"
                style="width:204px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="路由类型" prop="routeType" :rules="[{required: true, message: '请选择路由类型', trigger: 'change'}]">
              <el-select v-model="subForm.routeType" placeholder="请选择" @change="routeTypeChange">
                <el-option
                  v-for="(item, index) in selRouteTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="人脸渠道名称" prop="channelId" :rules="[{required: true, message: '请选择人脸渠道', trigger: 'change'}]">
              <el-select v-model="subForm.channelId" placeholder="请选择" :disabled="subForm.routeType.length == 0" @change="channelIdChange">
                <el-option
                  v-for="(item, index) in selChannelList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="服务类型" prop="serviceId" :rules="[{required: true, message: '请选择服务', trigger: 'change'}]">
              <el-select v-model="subForm.serviceId" placeholder="请选择" :disabled="subForm.channelId.length == 0" @change="serviceIdChange">
                <el-option
                  v-for="(item, index) in selAlgorithmList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应用端" prop="appId" :rules="[{required: true, message: '请选择应用端', trigger: 'change'}]">
              <el-select v-model="subForm.appId" placeholder="请选择" :disabled="subForm.serviceId.length == 0" @change="appIdChange">
                <el-option
                  v-for="(item, index) in selAppList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="业务场景" prop="sceneId" :rules="[{required: true, message: '请选择业务场景', trigger: 'change'}]">
              <el-select v-model="subForm.sceneId" placeholder="请选择" :disabled="subForm.appId.length == 0" @change="sceneIdChange">
                <el-option
                  v-for="(item, index) in selSceneList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="算法版本" prop="serviceVersion" :rules="[{required: true, message: '请选择算法版本', trigger: 'change'}]">
              <el-select v-model="subForm.serviceVersion" placeholder="请选择" :disabled="subForm.channelId.length == 0 || subForm.serviceId.length == 0 || subForm.appId.length == 0 || subForm.sceneId.length == 0">
                <el-option
                  v-for="(item, index) in selVersionList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备型号" prop="deviceId">
              <el-select v-model="subForm.deviceId" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in selDeviceList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="sub_btn">
          <el-button v-if="!id" type="primary" :loading="addLoading" @click="addRouter('subForm')">保存</el-button>
          <el-button v-if="id" type="primary" :loading="editLoading" @click="editRouter('subForm')">保存</el-button>
          <el-button @click="cancelFun">取消</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import api_list from '../api/routerConfigApi'
export default {
  name: 'RouterConfig',
  components: {
  },
  data() {
    return {
      addLoading: false,
      editLoading: false,
      id: '',
      selRouteTypeList: [
        // { id: '1', name: '内部' },
        // { id: '2', name: '外部' },
        { id: '4', name: '人脸路由' }
        // { id: '3', name: '人脸回流' }
      ],
      selChannelList: [],
      selDeviceList: [],
      selAlgorithmList: [],
      selAppList: [],
      selSceneList: [],
      selVersionList: [],
      selBusinessTypeList: [],
      subForm: {
        routeName: '',
        routeType: '',
        channelId: '',
        serviceId: '',
        appId: '',
        sceneId: '',
        serviceVersion: '',
        deviceId: '',
        algorithmId: ''
      }
    }
  },
  watch: {
  },
  mounted() {
    // this.selScene()
    this.selDevice({ conditionType: 'DEVICE_ID' })
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.initData()
    }
  },
  methods: {
    routeTypeChange() {
      this.subForm.channelId = ''
      this.selChannel({ routeType: this.subForm.routeType, conditionType: 'CHANNEL_ID' })
      this.channelIdChange()
      this.serviceIdChange()
      this.appIdChange()
      this.sceneIdChange()
    },
    channelIdChange() {
      this.subForm.serviceId = ''
      if (this.subForm.channelId.length !== 0) this.selAlgorithm({ routeType: this.subForm.routeType, channelId: this.subForm.channelId, conditionType: 'SERVICE_ID' })
      this.serviceIdChange()
      this.appIdChange()
      this.sceneIdChange()
    },
    serviceIdChange() {
      this.subForm.appId = ''
      if (this.subForm.channelId.length !== 0 && this.subForm.serviceId.length !== 0) {
        this.selApp({ routeType: this.subForm.routeType, channelId: this.subForm.channelId, serviceId: this.subForm.serviceId, conditionType: 'APP_ID' })
      }
      this.appIdChange()
      this.sceneIdChange()
    },
    appIdChange() {
      // this.subForm.serviceVersion = ''
      // if (this.subForm.channelId.length !== 0 && this.subForm.serviceId.length !== 0 && this.subForm.appId.length !== 0 && this.subForm.sceneId.length !== 0) { this.selVersion(this.subForm.channelId, this.subForm.serviceId, this.subForm.appId, this.subForm.sceneId) }
      this.subForm.sceneId = ''
      if (this.subForm.channelId.length !== 0 && this.subForm.serviceId.length !== 0 && this.subForm.appId.length !== 0) { this.selScene({ routeType: this.subForm.routeType, channelId: this.subForm.channelId, serviceId: this.subForm.serviceId, appId: this.subForm.appId, conditionType: 'SCENE_ID' }) }
      this.sceneIdChange()
    },
    sceneIdChange() {
      // this.subForm.serviceVersion = ''
      // if (this.subForm.channelId.length !== 0 && this.subForm.serviceId.length !== 0 && this.subForm.appId.length !== 0 && this.subForm.sceneId.length !== 0) { this.selVersion(this.subForm.channelId, this.subForm.serviceId, this.subForm.appId, this.subForm.sceneId) }
      this.subForm.serviceVersion = ''
      if (this.subForm.channelId.length !== 0 && this.subForm.serviceId.length !== 0 && this.subForm.appId.length !== 0 && this.subForm.sceneId.length !== 0) { this.selVersion({ routeType: this.subForm.routeType, channelId: this.subForm.channelId, serviceId: this.subForm.serviceId, appId: this.subForm.appId, sceneId: this.subForm.sceneId, conditionType: 'SERVICE_VERSION' }) }
    },
    selChannel(data) {
      api_list.routerOption(data).then((res) => {
        this.selChannelList = res.data
      })
    },
    selDevice(data) {
      api_list.routerOption(data).then((res) => {
        this.selDeviceList = res.data
      })
    },
    selAlgorithm(data) {
      api_list.routerOption(data).then((res) => {
        this.selAlgorithmList = res.data
      })
    },
    selApp(data) {
      api_list.routerOption(data).then((res) => {
        this.selAppList = res.data
        if (this.$route.query.id) this.no_matach_sel(this.selAppList, 'conditionValue', this.subForm.appId, 'appId')
      })
    },
    no_matach_sel(sellist, key, id, idstr) {
      var arr = []
      arr = sellist.filter(item => {
        return item[key] === String(id)
      })
      if (arr.length === 0) this.subForm[idstr] = ''
    },
    selScene(data) {
      api_list.routerOption(data).then((res) => {
        this.selSceneList = res.data
        if (this.$route.query.id) this.no_matach_sel(this.selSceneList, 'conditionValue', this.subForm.sceneId, 'sceneId')
      })
    },
    selVersion(data) {
      api_list.routerOption(data).then((res) => {
        this.selVersionList = res.data
        if (this.$route.query.id) this.no_matach_sel(this.selVersionList, 'conditionName', this.subForm.serviceVersion, 'serviceVersion')
      })
    },
    selBusinessType() {
      api_list.selBusinessType().then((res) => {
        this.selBusinessTypeList = res.data
      })
    },
    initData() {
      var query_conf = Object.assign({}, this.$route.query)
      // for(var i in query_conf) {
      //   if(query_conf[i] === '0') query_conf[i] = '';
      // }
      Object.assign(this.subForm, query_conf)
      this.selChannel({ routeType: this.subForm.routeType, conditionType: 'CHANNEL_ID' })
      this.selAlgorithm({ routeType: this.subForm.routeType, channelId: this.subForm.channelId, conditionType: 'SERVICE_ID' })
      this.selApp({ routeType: this.subForm.routeType, channelId: this.subForm.channelId, serviceId: this.subForm.serviceId, conditionType: 'APP_ID' })
      this.selScene({ routeType: this.subForm.routeType, channelId: this.subForm.channelId, serviceId: this.subForm.serviceId, appId: this.subForm.appId, conditionType: 'SCENE_ID' })
      this.selVersion({ routeType: this.subForm.routeType, channelId: this.subForm.channelId, serviceId: this.subForm.serviceId, appId: this.subForm.appId, sceneId: this.subForm.sceneId, conditionType: 'SERVICE_VERSION' })
    },
    addRouter(formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addLoading = true
          var subObj = Object.assign({}, this.subForm)

          for (var i = 0; i < that.selVersionList.length; i++) {
            if (that.selVersionList[i].conditionName === subObj.serviceVersion) {
              Object.assign(subObj, { algorithmId: that.selVersionList[i].conditionValue })
            }
          }
          api_list.addRoute(subObj).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '新增路由成功',
                type: 'success',
                offset: 100
              })
              setTimeout(() => {
                this.addLoading = false
                // 关闭当前标签页
                that.$store.dispatch('tagsView/delView', this.$route)
                // 返回指定路由
                that.$router.push({ name: 'routerConfig' })
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
    editRouter(formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editLoading = true
          var subObj = Object.assign({}, this.subForm)
          for (var i = 0; i < that.selVersionList.length; i++) {
            if (that.selVersionList[i].conditionName === subObj.serviceVersion) {
              Object.assign(subObj, { algorithmId: that.selVersionList[i].conditionValue })
            }
          }
          api_list.editRoute(subObj).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '编辑路由成功',
                type: 'success',
                offset: 100
              })
              setTimeout(() => {
                this.editLoading = false
                // 关闭当前标签页
                that.$store.dispatch('tagsView/delView', this.$route)
                // 返回指定路由
                that.$router.push({ name: 'routerConfig' })
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
      this.$router.push({ name: 'routerConfig' })
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
