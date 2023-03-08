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
            <el-form-item label="业务流水号" prop="busNo">
              <el-input
                v-model="searchForm.busNo"
                placeholder="请输入"
              />
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
          <!-- <el-col :span="8">
            <el-form-item label="设备型号" prop="deviceId">
              <el-select v-model="searchForm.deviceId" placeholder="请选择">
                <el-option
                  v-for="(item, index) in selDeviceList"
                  :key="index"
                  :label="item.deviceName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="算法服务" prop="algorithmId">
              <el-select v-model="searchForm.algorithmId" placeholder="请选择">
                <el-option
                  v-for="(item, index) in selAlgorithmList"
                  :key="index"
                  :label="item.algorithmName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="服务名称" prop="serviceId">
              <el-select v-model="searchForm.serviceId" clearable placeholder="请选择">
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
          <!-- <el-col :span="8">
            <el-form-item label="业务场景" prop="typeId">
              <el-select v-model="searchForm.typeId" placeholder="请选择">
                <el-option
                  v-for="(item, index) in selBusinessTypeList"
                  :key="index"
                  :label="item.typeName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                style="width:280px;"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                :value-format="'yyyy-MM-dd HH:mm:ss.SSS'"
                style="width:280px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作结果" prop="routeStatus">
              <el-select v-model="searchForm.routeStatus" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in routeStatusList"
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
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="Content">
      <h3>数据列表 </h3>
      <el-table
        v-loading="listLoading"
        :data="logsData"
        border
        style="width: 100%"
        :cell-style="{textAlign: 'center'}"
        :header-cell-style="{textAlign: 'center'}"
      >
        <el-table-column
          prop="busNo"
          label="业务流水号"
        />
        <el-table-column
          prop="channelName"
          label="人脸渠道名称"
        />
        <el-table-column
          prop="serviceName"
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
          prop="startTime"
          label="操作时间"
          width="180px"
        />
        <el-table-column
          prop="useTime"
          label="耗时"
        >
          <template slot-scope="props">
            {{ props.row.useTime }}ms
          </template>
        </el-table-column>
        <el-table-column
          prop="routeStatus"
          label="操作结果"
        >
          <template slot-scope="props">
            {{ props.row.routeStatus == 1 ? '成功': '失败' }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="操作"
        >
          <template slot-scope="props">
            <el-button type="text" @click="editRoute(props.row)">修改</el-button>
            <el-button type="text" @click="delRoute(props.row)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 分页 开始 -->
      <div class="pag">
        <pagination v-show="logsTotal>0" :total="logsTotal" :page.sync="searchForm.pageNum" :limit.sync="searchForm.pageSize" @pagination="initData" />
      </div>
      <!-- 分页 结束 -->
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import api_list from './api/logQueryApi'
export default {
  name: 'RouterConfig',
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      selChannelList: [],
      selDeviceList: [],
      selAlgorithmList: [],
      selBusinessTypeList: [],
      routeStatusList: [],
      createTime: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        busNo: '',
        channelId: '',
        serviceId: '',
        // deviceId: '',
        // algorithmId: '',
        // typeId: '',
        createStartTime: '',
        createEndTime: '',
        routeStatus: ''
      },
      logsData: [],
      logsTotal: 0
    }
  },
  watch: {
    'createTime': function(nval, oval) {
      if (nval == null) this.clearDatePicker()
    }
  },
  mounted() {
    this.selChannel()
    // this.selDevice()
    this.selAlgorithm()
    this.selRouteStatus()
    // this.selBusinessType()
    this.initData()
  },
  methods: {
    selChannel() {
      api_list.selConfList({ conditionType: 'CHANNEL_ID' }).then((res) => {
        this.selChannelList = res.data
      })
    },
    selDevice() {
      api_list.selDevice().then((res) => {
        this.selDeviceList = res.data
      })
    },
    selAlgorithm() {
      api_list.selConfList({ conditionType: 'SERVICE_ID' }).then((res) => {
        this.selAlgorithmList = res.data
      })
    },
    selBusinessType() {
      api_list.selBusinessType().then((res) => {
        this.selBusinessTypeList = res.data
      })
    },
    selRouteStatus() {
      api_list.selConfList({ conditionType: 'ROUTE_STATUS' }).then((res) => {
        this.routeStatusList = res.data
      })
    },
    clearDatePicker() {
      this.createTime = []
      this.searchForm.createStartTime = ''
      this.searchForm.createEndTime = ''
    },
    initData() {
      this.listLoading = true
      if (this.createTime.length > 0) {
        this.searchForm.createStartTime = this.createTime[0]
        this.searchForm.createEndTime = this.createTime[1]
      }
      api_list.getlogList(this.searchForm).then((res) => {
        this.listLoading = false
        if (res.code === 0) {
          this.logsData = res.data.rows
          this.logsTotal = res.data.totalNum
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
        this.clearDatePicker()
        this.$refs[formName].resetFields()
        this.searchForm.pageNum = 1
        this.searchForm.pageSize = 10
        this.initData()
      }
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
