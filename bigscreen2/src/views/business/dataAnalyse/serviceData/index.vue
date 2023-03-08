<template>
  <div class="service-wrap">
    <el-row :span="24" :gutter="10" style="padding-left:24px;margin-top:24px">
      <el-col :span="9" style="padding-right:20px">
        <div class="deployData-box">
          <div class="deployData-Rate">终端服务统计</div>
          <div class="deal-one">
            <div class="deal-one-item">
              <img class="deal-one-img" src="./assets/image/people.png" />
              <div class="deal-one-content">
                <div class="deal-one-num">{{ this.serviceData.peopleNum }}</div>
                <div class="deal-one-text">终端累计服务人数（人）</div>
              </div>
            </div>
            <div class="deal-one-item">
              <img class="deal-one-img" src="./assets/image/num.png" />
              <div class="deal-one-content">
                <div class="deal-one-num">
                  {{ this.serviceData.serviceNum }}
                </div>
                <div class="deal-one-text">终端累计服务次数（次）</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="15" style="padding-right:29px">
        <div class="deployData-box">
          <div class="deployData-Rate">
            身份核验统计
          </div>
          <div class="deployData-content" style="margin-top:12px">
            <div class="terminal">
              <statisticsChat :serviceData="this.serviceData"></statisticsChat>
            </div>
            <div class="right">
              <div class="right-item">
                <div class="title">
                  <div class="radio" style="background:#6C6AFF"></div>
                  刷脸核验身份（次）
                </div>
                <div class="num-size">{{ this.serviceData.slNum }}</div>
                <div class="num-size" style="color:#3B7FF6">
                  {{ this.serviceData.slPercent }}%
                </div>
              </div>
              <div class="right-item">
                <div class="title">
                  <div class="radio" style="background:#FFA736"></div>
                  身份证核验身份（次）
                </div>
                <div class="num-size">{{ this.serviceData.sfNum }}</div>
                <div class="num-size" style="color:#FE9D21">
                  {{ this.serviceData.sfPercent }}%
                </div>
              </div>
              <div class="right-item">
                <div class="title">
                  <div class="radio" style="background:#2BA245"></div>
                  电子凭证扫码核验身份（次）
                </div>
                <div class="num-size">{{ this.serviceData.pzNum }}</div>
                <div class="num-size" style="color:#2BA245">
                  {{ this.serviceData.pzPercent }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 趋势图 -->
    <el-row :span="24" :gutter="25" style="padding-left:24px;padding-right:24px">
      <el-col :span="12">
        <peopleChat></peopleChat>
      </el-col>
      <el-col :span="12">
        <numberChat></numberChat>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import peopleChat from "./chart/peopleChat.vue"; // 终端服务人数
import numberChat from "./chart/numberChat.vue"; // 终端服务次数
import statisticsChat from "./chart/statisticsChat.vue"; // 身份核验统计
// import Pagination from '@/components/Pagination'
import echarts from "echarts";
import api_list from "@/views/business/dataAnalyse/serviceData/api/serviceData";

export default {
  name: "ServiceData",
  components: {
    // Pagination
    peopleChat,
    numberChat,
    statisticsChat
  },
  data() {
    return {
      id: null,
      chart: null,
      xAxisArr: [],
      radio1: "1",
      data: null,
      serviceData: {}
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
  },
  methods: {
    initData() {
      api_list.getServiceDataTop({}).then(res => {
        if (res.code > 0) {
          console.log(res.data, "服务数据概览（原型上部）");
          this.serviceData = res.data || {};
        } else {
          this.$message({
            message: res.message,
            type: "error",
            offset: 100
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.service-wrap {
  .deployData-box {
    background: #fff;
    float: left;
    width: 100%;
    height: 272px;
    box-sizing: border-box;
    transition: 0.2s all ease;
    position: relative;
    padding: 20px 24px 8px;
    margin-bottom: 20px;
    border-radius: 2px;
    .deployData-Rate {
      border-left: 4px solid #3b7ff6;
      height: 15px;
      line-height: 15px;
      text-indent: 5px;
      font-family: PingFang SC;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      letter-spacing: 0px;
      text-align: left;
      width: 100%;
    }
    .deal-one {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 60px;
      .deal-one-item {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
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
          font-weight: 700;
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
      .right {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        .right-item {
          height: 125px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .title {
            font-family: PingFang SC;
            font-size: 14px;
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
            font-weight: 700;
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
            font-weight: 700;
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
        border-radius: 0px;
      }
      .terminal {
        border-radius: 0px;
        width: 255px;
      }
    }
  }
}
</style>
<style lang="scss">
.service-wrap {
  .el-card__body {
    .el-radio__input.is-checked + .el-radio__label {
      color: #232731;
    }
  }
}
</style>
