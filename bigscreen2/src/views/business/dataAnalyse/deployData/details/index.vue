<template>
  <div class="app-container">
    <el-row
      :gutter="10"
      :span="24"
      style="margin:1px;background:#fff;height:84px"
    >
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="75px"
      >
        <el-form-item
          label="机构编码:"
          prop="medinsCode"
          style="margin: 26px 0 0 30px"
        >
          <el-input
            v-model="queryParams.medinsCode"
            placeholder="请输入机构编码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="机构名称:"
          prop="medinsName"
          style="margin: 26px 0 0 60px"
        >
         <el-input
            v-model="queryParams.medinsName"
            placeholder="请输入机构名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item
          label="选择地区"
          prop="area"
          style="margin: 26px 0 0 60px"
        >
          <el-select
            v-model="queryParams.area"
            placeholder="请选择地区"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in realTypesOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="机构类型:"
          prop="medinsType"
          style="margin: 26px 0 0 60px"
        >
          <el-select
            v-model="queryParams.medinsType"
            placeholder="请选择类型"
            clearable
            size="small"
            style="width: 120px"
          >
            <el-option
              v-for="item in medinsTypes"
              :key="item.conditionValue"
              :label="item.conditionName"
              :value="item.conditionValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="margin: 24px 0 0 38px">
          <el-button class="b1" @click="handleQuery"
            >
            <div class="b2">查询</div>
            </el-button
          >
          <el-button class="b3" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row
      :gutter="10"
      :span="24"
      :data="organDeployDeviceRanking"
      style="margin:1px;background:#fff;height:54px;margin-bottom:0;margin-top:19px"
    >
      <div class="tab1">
        <div class="medins-radio"></div>
        <div class="item">
          机构总数:<span class="s1">{{medinsTotal }}</span>
        </div>
        <div class="deviceTo-radio"></div>
        <div class="item">
          终端总数:<span class="s1">{{ deviceTotal }}</span>
        </div>
      </div>
    </el-row>
    <el-row :gutter="10" class="mb8">
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="organDeployDeviceRanking"
      @selection-change="handleSelectionChange"
      :header-cell-style="{
        background: '#F9FBFF',
        padding: '17px 0 17px 23px',
        color: '#232731'
      }"
      :cell-style="{ padding: '17px 0 17px 23px' }"
    >
      <el-table-column
        label="排名"
        type="index"
        width="180"
        align="left"
        :cell-style="{ padding: '17px 0 17px 23px' }"
      >
        <template slot-scope="scope">
          <span v-if="scope.$index + 1 == 1" class="no1"
            >NO.{{ scope.$index + 1 }}</span
          >
          <span v-else-if="scope.$index + 1 == 2" class="no2"
            >NO.{{ scope.$index + 1 }}
          </span>
          <span v-else-if="scope.$index + 1 == 3" class="no3"
            >NO.{{ scope.$index + 1 }}
          </span>
          <span v-else class="no">NO.{{ scope.$index + 1 }} </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="排名" align="center" prop="medinsLv" /> -->
      <el-table-column
        label="机构编码"
        align="left"
        prop="medinsCode"
        min-width="160"
      />
      <el-table-column
        label="机构名称"
        align="left"
        prop="medinsName"
        min-width="160"
      />
      <el-table-column
        label="机构类型"
        align="left"
        prop="medinsType"
        min-width="120"
      />
      <el-table-column
        label="终端数量"
        align="left"
        prop="deviceNum"
        min-width="120"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="机构地址"
        align="left"
        prop="medinsAddress"
        min-width="160"
      />
      <el-table-column
        label="操作"
        align="left"
        min-width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="props">
        <el-button @click="handleUpdate(props.row)" class="b4" type="text">
          查看详情
        </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      background=""
      layout=" prev, pager, next,sizes,jumper"
      @pagination="initData"
    />
    <el-drawer :visible.sync="drawer" :with-header="true" size="69%">
      <div class="doalog">
        <div class="d1">
          <div class="d2">机构详情</div>
        </div>
        <div class="d5">
          <div class="d3"></div>
          <div class="d4">机构信息</div>
        </div>
        <div 
        :data="organDeployDeviceRanking"
        class="m">
          <div class="m1">
            <dev class="item2"
              >机构名称:<span class="s2">{{ medinsName }}</span>
            </dev>
            <dev class="item3"
              >机构编码:<span class="s2">{{ medinsCode }}</span>
            </dev>
            <dev class="item3"
              >机构地址:<span class="s2">{{ medinsAddress }}</span>
            </dev>
            <dev class="item3"
              >机构类型:<span class="s2">{{ medinsType }}</span>
            </dev>
          </div>
          <div class="m2">
            <dev class="item2"
              >机构等级:<span class="s2">{{ medinsLv }}</span>
            </dev>
            <dev class="item3"
              >联系人:<span class="s2">{{ medinsContacts }}</span>
            </dev>
            <dev class="item3"
              >联系电话:<span class="s2">{{ medinsContactsTel }}</span>
            </dev>
            <dev class="item3"
              >终端数量:<span class="s2">{{ deviceNum }}台</span>
            </dev>
          </div>
        </div>
        <div class="d5">
          <div class="d3"></div>
          <div class="d4">终端信息</div>
        </div>
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="74px"
          class="search"
        >
          <el-form-item label="终端SN:" prop="serialSn" style="margin: 10px">
            <el-input
              v-model="queryParams.serialSn"
              placeholder="请输入终端SN"
              clearable
              size="small"
              style="width: 190px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item
            label="医保SN:"
            prop="ybSn"
            style="margin: 10px 0 0 45px"
          >
            <el-input
              v-model="queryParams.ybSn"
              placeholder="请输入医保SN"
              clearable
              size="small"
              style="width: 190px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item
            label="终端型号"
            prop="modelId"
            style="margin: 10px 0 0 45px"
          >
            <el-select
              v-model="queryParams.modelId"
              placeholder="请选择型号"
              clearable
              size="small"
              style="width: 120px"
            >
              <el-option
                v-for="dict in realTypesOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="终端状态:"
            prop="deviceStatus"
            style="margin: 10px 0 0 45px"
          >
            <el-select
              v-model="queryParams.deviceStatus"
              placeholder="请选择状态"
              clearable
              size="small"
              style="width: 120px"
            >
              <el-option
                v-for="dict in realTypesOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="margin: 10px 0 0 51px">
          <el-button class="b1" @click="handleQuery"
            >
            <div class="b2">查询</div>
            </el-button
          >
          <el-button class="b3" @click="resetQuery">重置</el-button>
        </el-form-item>
          <!-- <el-form-item style="margin: 10px 0 0 51px">
            <el-button type="primary" size="mini" @click="handleQuery"
              >查询</el-button
            >
            <el-button size="mini" @click="resetQuery(queryParams)">重置</el-button>
          </el-form-item> -->
        </el-form>
        <el-table
          v-loading="loading"
          
          :data="organDeployDeviceDetail"
          @selection-change="handleSelectionChange"
          :header-cell-style="{
            background: '#F9FBFF',
            padding: '17px 0 17px 23px',
            color: '#232731'
          }"
          :cell-style="{ padding: '17px 0 17px 23px' }"
        >
          <el-table-column
            label="终端SN"
            align="left"
            prop="serialSn"
            min-width="160"
          />
          <el-table-column
            label="医保SN"
            align="left"
            prop="ybSn"
            min-width="160"
          />
          <el-table-column
            label="终端型号"
            align="left"
            prop="modelId"
            min-width="120"
          />
          <el-table-column
            label="终端状态"
            align="left"
            prop="deviceStatus"
            min-width="120"
            :formatter="deviceStatus"
          >
          </el-table-column>
          <el-table-column
            label="激活时间"
            align="left"
            prop="activeTime"
            min-width="180"
          >
          </el-table-column>
        </el-table>
         <!-- 分页 开始 -->
      <div class="pag">
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" layout=" prev, pager, next,sizes,jumper" @pagination="initData" />
      </div>
      <!-- 分页 结束 -->
        <!-- <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="initData"
        /> -->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import api_list from "@/views/business/dataAnalyse/deployData/api/deployData";
import { div } from 'echarts-gl';

export default {
  name: "OrganDeployDeviceRanking",
  components: {
    Pagination
  },
  data() {
    return {
      drawer: false,
      medinsTotal: null,
      deviceTotal: null,
      deviceNum:null,
      medinsAddress:null,
      medinsCode:null,
      medinsContacts:null,
      medinsContactsTel:null,
      medinsLv:null,
      medinsName:null,
      medinsType:null,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      organDeployDeviceRanking: [],
      organDeployDeviceDetail:[],
      // 弹出层标题
      title:"",
      // 是否显示弹出层
      open: false,
      medinsTypes: [],
      // realTypesOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        area: "",
        medinsCode: "",
        medinsLv: "",
        medinsName: "",
        medinsType: "",
        medinsAddress: "",
        deviceNum: "",    
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.initData();
  },
  methods: {
    deviceStatus(row,column){
           if(row.deviceStatus==='1'){
             return <div class="deviceStatus"><div class="Status-radio"></div><div class="Status">在线</div></div>
           }else{
             return <div><div class="Status-radio1"></div><div class="Status">离线</div></div>
           }
    },
    initData() {
      // this.organDeployDeviceRanking = [
      //   {
      //     area: "西宁市",
      //     medinsCode: "ZD2234444SDFWSDF",
      //     medinsLv: "三级",
      //     medinsName: "青海省第一人民医院第一分院",
      //     medinsType: "定点医院",
      //     medinsAddress: "西宁市普陀区金沙江路 1518 弄",
      //     deviceNum: "1781200",
      //   },
      //   {
      //     area: "西宁市",
      //     medinsCode: "ZD223555SDFWSDF",
      //     medinsLv: "三级",
      //     medinsName: "青海省第一人民医院第二分院",
      //     medinsType: "定点医院",
      //     medinsAddress: "西宁市普陀区金沙江路 1518 弄",
      //     deviceNum: "143202",
      //   },
      //   {
      //     area: "西宁市",
      //     medinsCode: "ZD2236666SDFWSDF",
      //     medinsLv: "三级",
      //     medinsName: "青海省第一人民医院第三分院",
      //     medinsType: "定点医院",
      //     medinsAddress: "西宁市普陀区金沙江路 1518 弄",
      //     deviceNum: "17803",
      //   },
      //   {
      //     area: "西宁市",
      //     medinsCode: "ZD2237777SDFWSDF",
      //     medinsLv: "三级",
      //     medinsName: "青海省第一人民医院第四分院",
      //     medinsType: "定点医院",
      //     medinsAddress: "西宁市普陀区金沙江路 1518 弄",
      //     deviceNum: "166604",
      //   },
      //   {
      //     area: "西宁市",
      //     medinsCode: "ZD2237777SDFWSDF",
      //     medinsLv: "三级",
      //     medinsName: "青海省第一人民医院第四分院",
      //     medinsType: "定点医院",
      //     medinsAddress: "西宁市普陀区金沙江路 1518 弄",
      //     deviceNum: "166604",
      //   },
      // ];
      this.listLoading = true;
      let q ={
        conditionType:'MEDINS_AREA_TYPE'
      }
      api_list.getmedinsOption(q).then(res => {
                    this.medinsTypes=res.data;
                })
      api_list.getorganDeployDeviceRanking(this.queryParams).then(res => {
        this.listLoading = false;
        if (res.code > 0) {
          this.organDeployDeviceRanking = res.data.pageList.rows;
          this.medinsTotal=res.data.medinsTotal;
          this.deviceTotal=res.data.deviceTotal;
          this.total = res.data.pageList.totalNum;
          this.$message({
            message: res.message,
            type: "success",
            offset: 100
          });
        } else {
          this.$message({
            message: res.message,
            type: "error",
            offset: 100
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        // area: null,
        medinsCode: null,
        medinsLv: null,
        medinsName: null,
        medinsType: null,
        medinsAddress: null,
        deviceNum: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      // this.getList();
      this.initData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.initData();
      this.resetForm("queryForm");
      
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.customerId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    // handleAdd() {
    //   this.reset();
    //   this.open = true;
    //   this.title = "添加客户";
    // },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.drawer = true
      // this.reset();
      // const medinsName = row.medinsName;
      // initData(medinsName).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改客户";
      // });
       this.listLoading = true;
      //  const medinsCode = row.medinsCode;
      api_list.getorganDeployDeviceDetail().then(res => {
        this.listLoading = false;
        if (res.code > 0) {
          this.organDeployDeviceDetail = res.data.rows;
          this.medinsTotal=res.data.medinsTotal;
          this.deviceTotal=res.data.deviceTotal;
          this.total = res.data.pageList.totalNum;
          this.$message({
            message: res.message,
            type: "success",
            offset: 100
          });
        } else {
          this.$message({
            message: res.message,
            type: "error",
            offset: 100
          });
        }
      });
       this.deviceNum= "3738";
      this.medinsAddress= "青海省西宁市远大路99号";
      this.medinsCode= "601234";
      this.medinsContacts= "张伟龙";
      this.medinsContactsTel= "17839373922";
      this.medinsLv= "1";
     this.medinsName= "青海省西宁市第一人民医院附属医院";
      this.medinsType= "1"
    //    this.listLoading = true;
    //   api_list.getorganDeployDeviceRanking(this.queryParams).then(res => {
    //     this.listLoading = false;
    //     if (res.code > 0) {
    // //        this.deviceNum= res.data.pageList.rows.deviceNum;
    // //   this.medinsAddress= res.data.pageList.rows.medinsAddress;
    // //   this.medinsCode= res.data.pageList.rows.medinsCode;
    // //   this.medinsContacts= res.data.pageList.rows.medinsContacts;
    // //   this.medinsContactsTel= res.data.pageList.rows.medinsContactsTel;
    // //   this.medinsLv= res.data.pageList.rows.medinsLv;
    // //  this.medinsName= res.data.pageList.rows.medinsName;
    // //   this.medinsType= res.data.pageList.rows.medinsType;
    //       this.organDeployDeviceRanking = res.data.pageList.rows;
    //       // this.medinsTotal=res.data.medinsTotal;
    //       // this.deviceTotal=res.data.deviceTotal;
    //       this.total = res.data.pageList.totalNum;
    //       this.$message({
    //         message: res.message,
    //         type: "success",
    //         offset: 100
    //       });
    //     } else {
    //       this.$message({
    //         message: res.message,
    //         type: "error",
    //         offset: 100
    //       });
    //     }
    //   });
    }
  }
};
</script>
<style lang="scss">
.b1{
width: 70px;
height: 36px;
left: 1735px;
top: 293px;
background: #367BF5;
border-radius: 2px;
}
.b2{
  font-family: PingFang SC;
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 20px;
display: flex;
align-items: center;
text-align: center;
letter-spacing: -0.02em;
color: #FFFFFF;
margin-top:-3px
}
.b3{
width: 70px;
height: 36px;
left: 1735px;
top: 293px;
background: #E7E7E7;
border-radius: 2px;
}
.b4{
  font-family: PingFang SC;
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 20px;
/* identical to box height, or 143% */

display: flex;
align-items: center;
text-transform: uppercase;

color: #367BF5;

}
.el-input--small .el-input__inner {
    height: 36px;
    line-height: 32px;
}
.deviceStatus{
  display: flex;
  .Status-radio {
    width: 6px;
    height: 6px;
    background: #367bf5;
    border-radius: 50%;
    // margin-left: 30px;
    margin-top: 8px;
  }
  .Status-radio1{
    width: 6px;
    height: 6px;
    background: #979CB2;
    border-radius: 50%;
    // margin-left: 30px;
    margin-top: 8px;
  }
  .Status{
    font-family: PingFang SC;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    /* identical to box height, or 143% */
    display: flex;
    align-items: center;
    text-transform: uppercase;
    color: #616776;
    margin-left: 5px;
  }
}
.app-container {
  .el-drawer__wrapper {
    z-index: 9999999 !important;
  }
}
.pagination-container[data-v-72233bcd] {
    text-align: center;
    background: #fff;
    padding: 32px 16px;
    margin-top: 0;
}

.el-pagination {
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: bold;
    float: right;
    margin-top: -12px;
}
.search {
  background: #ffffff;
  width: 1670px;
  height: 84px;
}
.tab1 {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  .medins-radio {
    width: 6px;
    height: 6px;
    background: #069697;
    border-radius: 50%;
    margin-left: 30px;
    margin-right: 5px;
  }
  .deviceTo-radio {
    width: 6px;
    height: 6px;
    background: #367bf5;
    border-radius: 50%;
    margin-left: 30px;
    margin-right: 5px;
  }
  .item {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    margin-left: 5px;
    /* identical to box height, or 167% */
    display: flex;
    align-items: center;
    text-transform: uppercase;
    color: #979cb2;
    .s1 {
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      /* identical to box height, or 157% */
      display: flex;
      align-items: center;
      text-transform: uppercase;
      color: #232731;
    }
  }
}

.no1 {
  // display: inline-block;
  text-align: center;
  color: #ff625e;
  // background-image: url("../../../../../static/img/lz-data-monitor/red-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-size: '14px';
  width: 20px;
  height: 20px;
  line-height: 20px;
}
.no2 {
  // display: inline-block;
  font-size: '14px';
  text-align: center;
  color: #fe9d21;
  // background-image: url("../../../../../static/img/lz-data-monitor/yellow-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
  line-height: 20px;
}
.no3 {
  // display: inline-block;
  font-size: '14px';
  text-align: center;
  color: #367bf5;
  // background-image: url("../../../../../static/img/lz-data-monitor/green-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
  line-height: 20px;
}
.no {
  // display: inline-block;
  text-align: center;
  border-radius: 5px;
  width: 20px;
  height: 20px;
  line-height: 20px;
}
.doalog {
  // z-index: 9999999;
  .d1 {
    height: 64px;
    width: 1322px;
    // border-style:double;
    border-bottom: 1px solid;
    border-bottom-color: #eef3fa;
    margin: -104px 0 0 -20px;
    .d2 {
      // width: 72px;
      // height: 20px;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 20px;
      /* identical to box height, or 111% */
      display: flex;
      align-items: center;
      text-transform: uppercase;
      color: #232731;
      margin: 46px 0 0 43px;
    }
  }
  .d5 {
    height: 64px;
    width: 1322px;
    display: flex;
    .d3 {
      height: 12px;
      width: 4px;
      border-left: 4px solid;
      border-left-color: #2176ff;
      margin: 27px 0 0 24px;
    }
    .d4 {
      font-family: PingFang SC;
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
      /* identical to box height, or 125% */
      display: flex;
      align-items: center;
      text-transform: uppercase;
      color: #232731;
      margin: 0px 0 0 6px;
    }
  }
  .m {
    height: 92px;
    width: 1322px;
    margin-left: -20px;
    border-bottom: 1px solid;
    border-bottom-color: #eef3fa;
    .m1 {
      //  margin-top: 24px;
      display: flex;
      margin-left: 20px;
      .item3{
        width: 289px;
        height: 20px;
        margin-left: 90px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        // margin-left: 5px;
        /* identical to box height, or 167% */
        display: flex;
        align-items: center;
        text-transform: uppercase;
        color: #979cb2;
        .s2 {
          font-family: PingFang SC;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */
          display: flex;
          align-items: center;
          text-transform: uppercase;
          color: #232731;
          margin-left: 5px;
        }
      }
      .item2 {
        width: 410px;
        height: 20px;
        margin-left: 24px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        // margin-left: 5px;
        /* identical to box height, or 167% */
        display: flex;
        align-items: center;
        text-transform: uppercase;
        color: #979cb2;
        .s2 {
          font-family: PingFang SC;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 22px;
          width: 256px;
          /* identical to box height, or 157% */
          display: flex;
          align-items: center;
          text-transform: uppercase;
          color: #232731;
          margin-left: 5px;
        }
      }
    }
    .m2 {
      margin-top: 24px;
      margin-left: 20px;
      display: flex;
       .item3{
        width: 289px;
        height: 20px;
        margin-left: 90px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        // margin-left: 5px;
        /* identical to box height, or 167% */
        display: flex;
        align-items: center;
        text-transform: uppercase;
        color: #979cb2;
        .s2 {
          font-family: PingFang SC;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */
          display: flex;
          align-items: center;
          text-transform: uppercase;
          color: #232731;
          margin-left: 5px;
        }
      }
      .item2 {
        width: 410px;
        height: 20px;
        margin-left: 24px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        // margin-left: 5px;
        /* identical to box height, or 167% */
        display: flex;
        align-items: center;
        text-transform: uppercase;
        color: #979cb2;
        .s2 {
          font-family: PingFang SC;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 22px;
          width: 256px;
          /* identical to box height, or 157% */
          display: flex;
          align-items: center;
          text-transform: uppercase;
          color: #232731;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
