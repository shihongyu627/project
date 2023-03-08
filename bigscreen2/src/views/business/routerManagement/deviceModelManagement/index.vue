<template>
  <div class="main organ">
    <div class="queryFrom">
      <h3>数据筛选</h3>
      <el-form
        ref="searchForm"
        :model="searchForm"
        label-width="110px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备型号名称" prop="deviceName">
              <el-input
                v-model="searchForm.deviceName"
                placeholder="请输入"
              />
              <el-input v-show="false" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <div style="float:right;">
              <el-button type="primary" @click="searchSubmit">查询</el-button>
              <el-button @click="resetSubmit('searchForm')">重置</el-button>
              <el-button type="success" @click="addDevice">新增设备号</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="Content">
      <h3>数据列表 </h3>
      <el-table
        v-loading="listLoading"
        :data="deviceData"
        border
        style="width: 100%"
        :cell-style="{textAlign: 'center'}"
        :header-cell-style="{textAlign: 'center'}"
      >
        <el-table-column
          type="index"
          label="序号"
          width="100px"
        />
        <el-table-column
          prop="deviceName"
          label="设备型号"
        />
        <el-table-column
          prop="address"
          label="操作"
        >
          <template slot-scope="props">
            <el-button type="text" @click="editDeviceModel(props.row)">修改</el-button>
            <el-button type="text" @click="delDeviceModel(props.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 开始 -->
      <div class="pag">
        <pagination v-show="deviceTotal>0" :total="deviceTotal" :page.sync="searchForm.pageNum" :limit.sync="searchForm.pageSize" @pagination="initData" />
      </div>
      <!-- 分页 结束 -->
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import api_list from './api/deviceModelApi'
export default {
  name: 'DeviceModelManagement',
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        deviceName: ''
      },
      deviceData: [],
      deviceTotal: 0
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      api_list.getDeviceModelList(this.searchForm).then((res) => {
        this.listLoading = false
        if (res.code === 0) {
          this.deviceData = res.data.rows
          this.deviceTotal = res.data.totalNum
        } else {
          this.$message({
            type: 'error',
            message: res.message,
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
    addDevice() {
      this.$router.push({ path: 'deviceModelDetail' })
    },
    editDeviceModel(conf) {
      console.log(conf)
      this.$router.push({ path: 'deviceModelDetail', query: conf })
    },
    delDeviceModel(conf) {
      this.$confirm('确定要删除此设备型号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api_list.delDeviceModel({ id: conf.id }).then((res) => {
          if (res.code === 0) {
            this.initData()
            this.$message({
              message: '删除成功',
              type: 'success',
              offset: 100
            })
          } else {
            this.$message({
              message: res.message,
              type: 'error',
              offset: 100
            })
          }
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
