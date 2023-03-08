<template>
  <div class="deal-wrap">
    <el-row
      :gutter="10"
      style="padding-left:24px;margin-top:24px;padding-right:24px"
    >
      <el-col :span="8" style="padding-right:20px">
        <div class="deployData-box">
          <div class="deployData-Rate">终端交易统计</div>
          <div class="deal-one">
            <div class="deal-one-item">
              <img class="deal-one-img" src="./assets/image/people.png" />
              <div class="deal-one-text">终端交易人数（人）</div>
              <div class="deal-one-num">{{ this.dealData.devDealPersion }}</div>
            </div>
            <div class="deal-one-item">
              <img class="deal-one-img" src="./assets/image/num.png" />
              <div class="deal-one-text">终端交易笔数（笔）</div>
              <div class="deal-one-num">{{ this.dealData.devDealNum }}</div>
            </div>
            <div class="deal-one-item">
              <img class="deal-one-img" src="./assets/image/price.png" />
              <div class="deal-one-text">终端交易金额（元）</div>
              <div class="deal-one-num">{{ this.dealData.devDealMoney }}</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="8" style="padding-right:20px">
        <div class="deployData-box">
          <div class="deployData-Rate">医保电子凭证交易笔数统计</div>
          <div class="deployData-content" style="margin-top:20px">
            <div style="width:220px" class="dealNum-progress">
              <el-progress
                type="circle"
                :width="120"
                stroke-linecap="square"
                :stroke-width="15"
                color="#3B7FF6"
                :percentage="this.ybPzDealNumPercent"
              ></el-progress>
            </div>
            <div class="right">
              <div class="right-top">
                <div class="right-item">
                  <div class="title">
                    <div class="radio" style="background:#3B7FF6"></div>
                    医保电子凭证交易笔数（笔）
                  </div>
                  <div class="num-size">{{ this.dealData.devYbPzDealNum }}</div>
                </div>
                <div class="right-item">
                  <div class="title">
                    <div
                      class="radio"
                      style="background:rgba(59, 127, 246, 0.3)"
                    ></div>
                    医保交易笔数（笔）
                  </div>
                  <div class="num-size">{{ this.dealData.ybDealNum }}</div>
                </div>
              </div>
              <div class="right-bottom">
                <div class="right-item">
                  <div class="title">
                    <div class="radio" style="background:#3B7FF6"></div>
                    医保电子凭证交易笔数/医保交易笔数
                  </div>
                  <div class="num-size">
                    {{ this.ybPzDealNumPercent }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="deployData-box">
          <div class="deployData-Rate">医保电子凭证交易金额统计</div>
          <div class="deployData-content" style="margin-top:20px">
            <div style="width:220px" class="dealPrice-progress">
              <el-progress
                type="circle"
                :width="120"
                stroke-linecap="square"
                :stroke-width="15"
                color="#FF5E5A"
                :percentage="this.ybPzDealMoneyPercent"
              ></el-progress>
            </div>

            <div class="right">
              <div class="right-top">
                <div class="right-item">
                  <div class="title">
                    <div class="radio" style="background:#FF5E5A"></div>
                    医保电子凭证交易金额（元）
                  </div>
                  <div class="num-size">{{ this.dealData.ybPzDealMoney }}</div>
                </div>
                <div class="right-item">
                  <div class="title">
                    <div class="radio" style="background:#FFCBCA"></div>
                    医保交易金额（元）
                  </div>
                  <div class="num-size">{{ this.dealData.ybDealMoney }}</div>
                </div>
              </div>
              <div class="right-bottom">
                <div class="right-item">
                  <div class="title">
                    <div class="radio" style="background:#FF5E5A"></div>
                    医保电子凭证交易金额/医保交易金额
                  </div>
                  <div class="num-size">
                    {{ this.ybPzDealMoneyPercent }}%
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
        <dealChat></dealChat>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import dealChat from "./chart/dealChat.vue"; // 机构部署覆盖率统计
// import Pagination from '@/components/Pagination'
import echarts from "echarts";
import api_list from "@/views/business/dataAnalyse/dealData/api/dealData";

export default {
  name: "DealData",
  components: {
    // Pagination
    dealChat
  },
  data() {
    return {
      dealData: {},
      ybPzDealMoneyPercent: 0,
      ybPzDealNumPercent: 0
    };
  },
  mounted() {},
  created() {
    this.initData();
  },
  methods: {
    initData() {
      api_list.getDealOverview({}).then(res => {
        if (res.code > 0) {
          console.log(res.data, "交易概览（原型上部）");
          this.dealData = res.data || {};
          this.ybPzDealNumPercent = Number(res.data.ybPzDealNumPercent) || 0;
          this.ybPzDealMoneyPercent = Number(res.data.ybPzDealMoneyPercent) || 0;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.deal-wrap {
  .deployData-box {
    background: #fff;
    float: left;
    width: 100%;
    height: 252px;
    box-sizing: border-box;
    transition: 0.2s all ease;
    position: relative;
    padding: 20px 24px;
    border-radius: 2px;
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
      justify-content: space-around;
      margin-top: 40px;
      .deal-one-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .deal-one-img {
          height: 40px;
          width: 34px;
          border-radius: 4px;
        }
        .deal-one-text {
          font-family: PingFang SC;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0px;
          text-align: left;
          color: #979cb2;
          margin-top: 15px;
        }
        .deal-one-num {
          font-family: PingFang SC;
          font-size: 22px;
          font-style: normal;
          font-weight: 600;
          letter-spacing: 0px;
          text-align: left;
          color: #232731;
          margin-top: 27px;
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
    }
  }
}
.dealNum-progress {
  ::v-deep .el-progress-circle__track {
    stroke: rgba(59, 127, 246, 0.3);
  }
  ::v-deep .el-progress__text {
    font-weight: 600;
    color: #000000;
  }
}
.dealPrice-progress {
  ::v-deep .el-progress-circle__track {
    stroke: rgba(255, 94, 90, 0.3);
  }
  ::v-deep .el-progress__text {
    font-weight: 600;
    color: #000000;
  }
}
</style>
