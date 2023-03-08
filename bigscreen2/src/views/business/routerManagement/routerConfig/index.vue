<template>
  <div class="main organ">
    <div class="queryFrom">
      <h3>数据筛选</h3>
      <el-form
        ref="searchForm"
        :model="searchForm"
        label-width="120px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="路由名称" prop="routeName">
              <el-input
                v-model="searchForm.routeName"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="路由类型" prop="routeType">
              <el-select v-model="searchForm.routeType" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in selRouteTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="人脸渠道名称" prop="channelId">
              <el-select v-model="searchForm.channelId" clearable placeholder="请选择">
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
            <el-form-item label="服务名称" prop="algorithmId">
              <el-select v-model="searchForm.algorithmId" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in selAlgorithmList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应用端" prop="appId">
              <el-select v-model="searchForm.appId" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in selAppList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务场景" prop="sceneId">
              <el-select v-model="searchForm.sceneId" clearable placeholder="请选择">
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
            <el-form-item label="算法版本" prop="serviceVersion">
              <el-select v-model="searchForm.serviceVersion" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in selVersionList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备型号" prop="deviceId">
              <el-select v-model="searchForm.deviceId" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in selDeviceList"
                  :key="index"
                  :label="item.conditionName"
                  :value="item.conditionValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div style="float:right;">
              <el-button type="primary" @click="searchSubmit">查询</el-button>
              <el-button @click="resetSubmit('searchForm')">重置</el-button>
              <el-button type="success" @click="addRoute">新增路由</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="Content">
      <h3>数据列表 </h3>
      <el-table
        v-loading="listLoading"
        :data="routerData"
        border
        style="width: 100%"
        :cell-style="{textAlign: 'center'}"
        :header-cell-style="{textAlign: 'center'}"
      >
        <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="50px" />
        <el-table-column
          prop="routeName"
          label="路由名称"
        />
        <el-table-column
          prop="routeType"
          label="路由类型"
        >
          <template slot-scope="props">
            <span v-if="props.row.routeType == 1">内部</span>
            <span v-if="props.row.routeType == 2">外部</span>
            <span v-if="props.row.routeType == 3">人脸回流</span>
            <span v-if="props.row.routeType == 4">人脸路由</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="channelName"
          label="人脸渠道名称"
        />
        <el-table-column
          prop="algorithmName"
          label="服务名称"
        />
        <el-table-column
          prop="appName"
          label="应用端"
        />
        <el-table-column
          prop="sceneName"
          label="业务场景"
        />
        <el-table-column
          prop="serviceVersion"
          label="算法版本"
        />
        <el-table-column
          prop="deviceName"
          label="设备型号"
        />
        <el-table-column
          prop="isInvalid"
          label="是否失效"
        >
          <template slot-scope="props">
            {{ props.row.isInvalid == 1 ? '有效' : '失效' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="props">
            <el-button type="text" @click="editRoute(props.row)">修改</el-button>
            <el-button type="text" @click="delRoute(props.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 开始 -->
      <div class="pag">
        <pagination v-show="routerTotal>0" :total="routerTotal" :page.sync="searchForm.pageNum" :limit.sync="searchForm.pageSize" @pagination="initData" />
      </div>
      <!-- 分页 结束 -->
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import api_list from './api/routerConfigApi'
export default {
  name: 'RouterConfig',
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      selRouteTypeList: [
        // { id: '1', name: '内部' },
        // { id: '2', name: '外部' },
        // { id: '3', name: '人脸回流' }
        { id: '4', name: '人脸路由' }
      ],
      selChannelList: [],
      selDeviceList: [],
      selAlgorithmList: [],
      selAppList: [],
      selSceneList: [],
      selVersionList: [],
      selBusinessTypeList: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        routeName: '',
        routeType: '',
        channelId: '',
        algorithmId: '',
        appId: '',
        sceneId: '',
        serviceVersion: '',
        deviceId: ''
      },
      routerData: [],
      routerTotal: 0
    }
  },
  watch: {
    // 'searchForm.routeType': function(nval, oval) {
    //   this.searchForm.channelId = ''
    //   if (nval.length !== 0) this.selChannel(nval)
    // },
    // 'searchForm.channelId': function(nval, oval) {
    //   this.searchForm.algorithmId = ''
    //   if (nval.length !== 0) this.selAlgorithm(nval)
    // },
    // 'searchForm.algorithmId': function(nval, oval) {
    //   this.searchForm.appId = ''
    //   console.log(this.searchForm.channelId, nval)
    //   if (this.searchForm.channelId.length !== 0 && nval.length !== 0) {
    //     this.selApp(this.searchForm.channelId, nval)
    //   }
    // },
    // 'searchForm.appId': function() {
    //   this.searchForm.serviceVersion = ''
    //   if (this.searchForm.channelId.length !== 0 && this.searchForm.algorithmId.length !== 0 && this.searchForm.appId.length !== 0 && this.searchForm.sceneId.length !== 0) { this.selVersion(this.searchForm.channelId, this.searchForm.algorithmId, this.searchForm.appId, this.searchForm.sceneId) }
    // },
    // 'searchForm.sceneId': function(nval, oval) {
    //   this.searchForm.serviceVersion = ''
    //   console.log(this.searchForm.channelId, this.searchForm.algorithmId, this.searchForm.appId, this.searchForm.sceneId)
    //   if (this.searchForm.channelId.length !== 0 && this.searchForm.algorithmId.length !== 0 && this.searchForm.appId.length !== 0 && this.searchForm.sceneId.length !== 0) { this.selVersion(this.searchForm.channelId, this.searchForm.algorithmId, this.searchForm.appId, this.searchForm.sceneId) }
    // }
  },
  mounted() {
    // this.selChannel()
    // this.selScene()
    // this.selDevice()
    // this.selAlgorithm()
    // this.selBusinessType()
    this.selChannel2()
    this.selAlgorithm2()
    this.selApp2()
    this.selScene2()
    this.selVersion2()
    this.selDevice2()
    this.initData()
  },
  methods: {
    selChannel(data) {
      api_list.selChannel(data).then((res) => {
        this.selChannelList = res.data
      })
    },
    selChannel2() {
      api_list.selConfList({ conditionType: 'CHANNEL_ID' }).then((res) => {
        this.selChannelList = res.data
      })
    },
    selDevice() {
      api_list.selDevice().then((res) => {
        this.selDeviceList = res.data
      })
    },
    selDevice2() {
      api_list.selConfList({ conditionType: 'DEVICE_ID' }).then((res) => {
        this.selDeviceList = res.data
      })
    },
    selAlgorithm(data) {
      api_list.selAlgorithm(data).then((res) => {
        this.selAlgorithmList = res.data
      })
    },
    selAlgorithm2() {
      api_list.selConfList({ conditionType: 'SERVICE_ID' }).then((res) => {
        this.selAlgorithmList = res.data
      })
    },
    selApp(data1, data2) {
      api_list.selApp(data1, data2).then((res) => {
        this.selAppList = res.data
      })
    },
    selApp2() {
      api_list.selConfList({ conditionType: 'APP_ID' }).then((res) => {
        this.selAppList = res.data
      })
    },
    selScene() {
      api_list.selScene().then((res) => {
        this.selSceneList = res.data
      })
    },
    selScene2() {
      api_list.selConfList({ conditionType: 'SCENE_ID' }).then((res) => {
        this.selSceneList = res.data
      })
    },
    selVersion(data1, data2, data3, data4) {
      api_list.selVersion(data1, data2, data3, data4).then((res) => {
        this.selVersionList = res.data
      })
    },
    selVersion2() {
      api_list.selConfList({ conditionType: 'SERVICE_VERSION' }).then((res) => {
        this.selVersionList = res.data
      })
    },
    selBusinessType() {
      api_list.selBusinessType().then((res) => {
        this.selBusinessTypeList = res.data
      })
    },
    initData() {
      this.listLoading = true
      api_list.getRouteList(this.searchForm).then((res) => {
        this.listLoading = false
        if (res.code === 0) {
          this.routerData = res.data.rows
          this.routerTotal = res.data.totalNum
        } else {
          this.$message({
            message: res.message,
            type: 'error',
            offset: 100
          })
        }
      })
    },
    searchSubmit() {
      this.initData()
    },
    resetSubmit(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
        this.searchForm.pageNum = 1
        this.searchForm.pageSize = 10
        this.initData()
      }
    },
    addRoute() {
      this.$router.push({ path: 'routerConfigDetail' })
    },
    editRoute(conf) {
      this.$router.push({ path: 'routerConfigDetail', query: conf })
    },
    delRoute(conf) {
      this.$confirm('确定要删除此路由吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api_list.delRoute({ id: conf.id }).then((res) => {
          this.initData()
          this.$message({
            message: '删除成功',
            type: 'success',
            offset: 100
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消',
          offset: 100
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .Content{
        ::v-deep.el-table th.gutter{
            display: table-cell!important;
        }
     }
    .areaStyle {
        background-color: #fff;
    }
    .organ {
        .steps_border {
        border-bottom: 1px solid #ccc;
        padding-bottom: 15px;
        margin-bottom: 15px;
    }
}
</style>
