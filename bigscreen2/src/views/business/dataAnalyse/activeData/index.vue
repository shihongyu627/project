<template>
  <div class="active-wrap">
    <el-row
      :span="24"
      :gutter="10"
      style="padding-left:24px;margin-top:24px;padding-right:24px"
    >
      <el-col :span="8" style="padding-right:20px">
        <div class="deployData-box">
          <div class="deployData-Rate">医保电子凭证激活统计</div>
          <div class="deal-one">
            <div class="deal-one-item">
              <img class="deal-one-img" src="./assets/image/insurance.png" />

              <div class="deal-one-content">
                <div class="deal-one-num">
                  {{ this.activeData.ybPzActivedTotalNum }}
                </div>
                <div class="deal-one-text">医保电子凭证激活总数</div>
              </div>
            </div>
            <div class="deal-one-item" style="margin-right:20px">
              <img class="deal-one-img" src="./assets/image/terminal.png" />
              <div class="deal-one-content">
                <div class="deal-one-num">
                  {{ this.activeData.devYbPzActivedTotalNum }}
                </div>
                <div class="deal-one-text">终端激活医保电子凭证总数</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="8" style="padding-right:20px">
        <div class="deployData-box">
          <div class="deployData-Rate">医保电子凭证激活数/参保总人数</div>
          <div class="deployData-content" style="margin-top:40px">
            <div class="insurance">
              <insuranceChart :activeData="this.activeData"></insuranceChart>
            </div>
            <div class="right">
              <div class="right-top">
                <div class="right-item">
                  <div class="title">
                    <div class="radio" style="background:#FFA736"></div>
                    医保电子凭证激活数
                  </div>
                  <div class="num-size">
                    {{ this.activeData.ybPzActivedTotalNum }}
                  </div>
                </div>
                <div class="right-item">
                  <div class="title">
                    <div class="radio" style="background:#6C6AFF"></div>
                    参保总人数
                  </div>
                  <div class="num-size">
                    {{ this.activeData.cbTotalPersionNum }}
                  </div>
                </div>
              </div>
              <div class="right-bottom">
                <div class="right-item">
                  <div class="title">
                    <div
                      class="radio"
                      style="background:#FFA736;margin-right:-2px"
                    ></div>
                    <div class="radio" style="background:#6C6AFF"></div>
                    医保电子凭证激活数 /参保总人数
                  </div>
                  <div class="num-size" style="text-indent: 22px;">
                    {{ this.activeData.ybPzActivedPercent }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="deployData-box">
          <div class="deployData-Rate">
            终端激活医保电子凭证总数/医保电子凭证激活总数
          </div>
          <div style="margin-top:20px">
            <el-radio-group
              v-model="timeType"
              @change="onChangeRadio"
              size="small"
            >
              <el-radio fill="#232731" text-color="#232731" label="1"
                >近一月</el-radio
              >
              <el-radio fill="#232731" text-color="#232731" label="2"
                >近半年</el-radio
              >
              <el-radio fill="#232731" text-color="#232731" label="3"
                >近一年</el-radio
              >
            </el-radio-group>
          </div>
          <div class="deployData-content" style="margin-top:10px">
            <div class="terminal">
              <terminalChart
                :activePercent="this.activePercent"
              ></terminalChart>
            </div>
            <div class="right">
              <div class="right-top">
                <div class="right-item">
                  <div class="title">
                    <div class="radio" style="background:#6C6AFF"></div>
                    终端激活医保电子凭证数
                  </div>
                  <div class="num-size">
                    {{ this.activePercent.devYbPzActivedTotalNum }}
                  </div>
                </div>
                <div class="right-item">
                  <div class="title">
                    <div class="radio" style="background:#FFA736"></div>
                    医保电子凭证激活数
                  </div>
                  <div class="num-size">
                    {{ this.activePercent.ybPzActivedTotalNum }}
                  </div>
                </div>
              </div>
              <div class="right-bottom">
                <div class="right-item">
                  <div class="title">
                    <div
                      class="radio"
                      style="background:#FFA736;margin-right:-2px"
                    ></div>
                    <div class="radio" style="background:#6C6AFF"></div>
                    终端激活医保电子凭证数 /医保电子凭证激活数
                  </div>
                  <div class="num-size">
                    {{ this.activePercent.devYbPzActivedPercent }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 趋势图 -->
    <el-row
      :gutter="25"
      style="padding-right:24px;padding-left:24px;margin-top:20px"
    >
      <el-col :span="24">
        <activeChart></activeChart>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import activeChart from "./chart/activeChart.vue"; // 终端激活医保电子凭证走势
import terminalChart from "./chart/terminalChart.vue"; // 医保电子凭证激活数/参保总人数
import insuranceChart from "./chart/insuranceChart.vue"; // 终端激活医保电子凭证总数/医保电子凭证激活总数
// import Pagination from '@/components/Pagination'
import echarts from "echarts";
import api_list from "@/views/business/dataAnalyse/activeData/api/activeData";

export default {
  name: "ActiveData",
  components: {
    // Pagination
    activeChart,
    terminalChart,
    insuranceChart
  },
  data() {
    return {
      id: null,
      xAxisArr: [],
      timeType: "1",
      data: null,
      activeData: {},
      activePercent: {}
    };
  },
  props: {
    height: {
      type: String,
      default: "160px"
    }
  },
  computed: {},
  mounted() {},
  created() {
    this.initData();
    this.getActivedPercent();
  },
  methods: {
    initData() {
      api_list.getActivedOverview({}).then(res => {
        if (res.code > 0) {
          console.log(res.data, "激活数据总数及凭证激活百分比（原型上部）");
          this.activeData = res.data || {};
        } else {
          this.$message({
            message: res.message,
            type: "error",
            offset: 100
          });
        }
      });
    },
    getActivedPercent() {
      let d = {};
      d.timeType = this.timeType;
      api_list.getActivedPercent(d).then(res => {
        if (res.code > 0) {
          console.log(res.data, "终端激活凭证占比");
          this.activePercent = res.data || {};
        } else {
          this.$message({
            message: res.message,
            type: "error",
            offset: 100
          });
        }
      });
    },
    //单选日期
    onChangeRadio(val) {
      // console.log(val, "选择时间  1近一月   2近半年   3近一年");
      this.getActivedPercent();
    }
  }
};
</script>

<style lang="scss" scoped>
.active-wrap {
  .deployData-box {
    background: #fff;
    float: left;
    width: 100%;
    height: 292px;
    box-sizing: border-box;
    transition: 0.2s all ease;
    position: relative;
    padding: 20px 24px 8px;
    border-radius: 2px;
    ::v-deep .el-radio__label {
      padding-left: 5px;
    }
    .el-radio {
      margin-right: 20px;
    }
    .deployData-Rate {
      border-left: 4px solid #3b7ff6;
      height: 15px;
      line-height: 15px;
      text-indent: 5px;
      font-family: PingFang SC;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      letter-spacing: 0px;
      text-align: left;
      width: 100%;
    }
    .deal-one {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 70px;
      .deal-one-item {
        display: flex;
        align-items: center;
        justify-content: center;
        .deal-one-img {
          height: 40px;
          width: 34px;
          border-radius: 4px;
        }
        .deal-one-content {
          display: flex;
          flex-direction: column;
          margin-left: 24px;
        }
        .deal-one-text {
          font-family: PingFang SC;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0px;
          text-align: left;
          color: #979cb2;
          margin-top: 15px;
        }
        .deal-one-num {
          font-family: PingFang SC;
          font-size: 30px;
          font-style: normal;
          font-weight: 600;
          letter-spacing: 0px;
          text-align: left;
          color: #232731;
        }
      }
    }
    .deployData-content {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 40px;
      justify-content: space-around;
      .right {
        display: flex;
        flex-direction: column;
        margin-left: 40px;
        width: 100%;
        .right-top {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .right-item {
          height: 75px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .title {
            font-family: PingFang SC;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            letter-spacing: 0px;
            text-align: left;
            color: #979cb2;
            display: flex;
            align-items: center;
          }
          .num {
            font-family: PingFang SC;
            font-size: 22px;
            font-style: normal;
            font-weight: 600;
            letter-spacing: 0px;
            text-align: left;
            color: #232731;
            margin-top: 10px;
            text-indent: 16px;
          }
          .num-size {
            font-family: PingFang SC;
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            letter-spacing: 0px;
            text-align: left;
            color: #232731;
            margin-top: 22px;
            text-indent: 16px;
          }
          .radio {
            height: 6px;
            width: 6px;
            border-radius: 6px;
            background: #3b7ff6;
            margin-right: 10px;
          }
          .color {
            background: #ff5e5a;
          }
        }
      }
      .insurance {
        width: 265px;
        border-radius: 0px;
      }
      .terminal {
        width: 265px;
        border-radius: 0px;
      }
    }
  }
}
</style>
<style lang="scss">
.active-wrap {
  .el-radio-group {
    .el-radio__input.is-checked + .el-radio__label {
      color: #232731;
    }
  }
}
</style>
