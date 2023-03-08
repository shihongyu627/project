<template>
  <div class="main organ">
    <!-- 查询区 开始-->
    <div class="queryFrom">
      <h3>数据筛选</h3>
      <el-form
        ref="searchForm"
        :model="searchForm"
        label-width="110px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="人脸渠道名称" prop="channelName">
              <el-input
                v-model="searchForm.channelName"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="5">
            <el-form-item label="人脸渠道类型">
              <el-select v-model="searchForm.channelType" placeholder="请选择">
                <el-option
                  label="支付宝"
                  value="1"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="创建日期">
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
            <div style="float:right;">
              <el-button type="primary" @click="searchSubmit">查询</el-button>
              <el-button @click="resetSubmit('searchForm')">重置</el-button>
              <!-- <el-button type="success" @click="addChannel">新增渠道</el-button> -->
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 查询区 end -->
    <!--主内容区-->
    <div class="Content">
      <h3>数据列表 </h3>
      <el-table
        v-loading="listLoading"
        :data="channelData"
        border
        style="width: 100%"
        :cell-style="{textAlign: 'center'}"
        :header-cell-style="{textAlign: 'center'}"
      >
        <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="50px" />
        <el-table-column
          prop="id"
          label="人脸渠道编号"
        />
        <el-table-column
          prop="channelName"
          label="人脸渠道名称"
        />
        <!-- <el-table-column
          prop="channelKey"
          label="人脸渠道公钥"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="channelSecret"
          label="人脸渠道私钥"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="systemKey"
          label="服务器公钥"
          :show-overflow-tooltip="true"
        /> -->
        <el-table-column
          prop="channelUser"
          label="联系人"
        />
        <el-table-column
          prop="channelPhone"
          label="联系电话"
        />
        <el-table-column
          prop="channelEmill"
          label="渠道邮箱"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="170px"
        />
        <el-table-column
          prop="address"
          label="操作"
          width="180px"
        >
          <template slot-scope="props">
            <!-- <el-button type="text" :disabled="!props.row.status" @click="editChannel(props.row)">修改</el-button> -->
            <!-- <el-button type="text" :disabled="!props.row.status" @click="delChannel(props.row)">删除</el-button> -->
            <p style="margin: 0;"><el-button type="text" @click="exportFun(props.row)">导出《业务开通通知单》</el-button></p>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 开始 -->
      <div class="pag">
        <pagination v-show="channelTotal>0" :total="channelTotal" :page.sync="searchForm.pageNum" :limit.sync="searchForm.pageSize" @pagination="initData" />
      </div>
      <el-dialog title="提示" :visible.sync="dialogFormVisible" width="30%" :append-to-body="true">
        <el-form ref="dialogForm" :model="dialogForm" label-width="95px">
          <el-form-item label="压缩包密码" prop="password" :rules="[{required: true, message: '请输入压缩包密码', trigger: 'change'},{pattern: /^[0-9a-zA-Z]{4,6}$/, message: '压缩包密码要求4-6位数字或者字母',trigger: 'change'}]">
            <el-input v-model.trim="dialogForm.password" autocomplete="off" style="width: 100%;" />
            <el-input v-show="false" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmExport('dialogForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 结束 -->
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import api_list from './api/faceChannelApi'
export default {
  name: 'FaceChannelManagement',
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      createTime: [],
      searchForm: {
        channelName: '',
        createEndTime: '',
        createStartTime: '',
        pageNum: 1,
        pageSize: 10
      },
      channelData: [],
      channelTotal: 0,
      dialogFormVisible: false,
      dialogForm: {
        password: ''
      },
      exportConf: {}
    }
  },
  watch: {
    'createTime': function(nval, oval) {
      if (nval == null) this.clearDatePicker()
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      if (this.createTime.length > 0) {
        this.searchForm.createStartTime = this.createTime[0]
        this.searchForm.createEndTime = this.createTime[1]
      }
      api_list.getChannelList(this.searchForm).then((res) => {
        this.listLoading = false
        if (res.code === 0) {
          this.channelData = res.data.rows
          this.channelTotal = res.data.totalNum
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
    clearDatePicker() {
      this.createTime = []
      this.searchForm.createStartTime = ''
      this.searchForm.createEndTime = ''
    },
    resetSubmit(formName) {
      if (this.$refs[formName] !== undefined) {
        this.clearDatePicker()
        this.$refs[formName].resetFields()
        this.searchForm.pageNum = 1
        this.searchForm.pageSize = 10
        this.initData()
      }
    },
    addChannel() {
      this.$router.push({ path: 'faceChannelDetail' })
    },
    editChannel(conf) {
      delete conf.channelKey
      delete conf.channelSecret
      delete conf.systemKey
      delete conf.createTime
      this.$router.push({ path: 'faceChannelDetail', query: conf })
    },
    delChannel(conf) {
      this.$confirm('确定要删除此渠道吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api_list.delChannel({ channelDelId: conf.id }).then((res) => {
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
    },
    exportFun(conf) {
      this.dialogFormVisible = true
      if (this.$refs.dialogForm !== undefined) this.$refs.dialogForm.resetFields()
      this.exportConf = conf
    },
    confirmExport(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var export_obj = Object.assign({}, { pass: this.dialogForm.password, channelId: this.exportConf.id })
          this.dialogFormVisible = false
          var down_url = process.env.VUE_APP_BASE_API + '/face-route/manager/noticeDownload/' + export_obj.channelId + '/' + export_obj.pass
          this.downLoadFun(down_url)
        }
      })
    },
    // 下载功能
    downLoadFun(data) {
      // const url = window.URL.createObjectURL(new Blob([data]))
      const url = data
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '业务开通通知单.zip')
      document.body.appendChild(link)
      link.click()
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
