<template>
  <el-card class="deal-data-card-box">
    <div class="header">
      <div class="deployData-Rate">终端医保电子凭证交易笔数/交易金额统计</div>
      <div>
        <el-radio-group v-model="timeType" @change="onChangeRadio" size="small">
          <el-radio label="1">近一天</el-radio>
          <el-radio label="2">近三天</el-radio>
          <el-radio label="3">近一周</el-radio>
          <el-radio label="4">近一月</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="content">
      <div class="item">
        <div class="title">终端医保电子凭证交易笔数（笔）：</div>
        <div class="num" style="color:#3B7FF6">
          {{ this.devYbPzDealTotalNum }}
        </div>
      </div>
      <div class="item">
        <div class="title">终端医保电子凭证交易金额（元）：</div>
        <div class="num" style="color:#FA675C">
          {{ this.devYbPzDealTotalMoney }}
        </div>
      </div>
    </div>
    <div :style="{ width: '100%', height: height }" :id="uuid"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
var img_url = require("@/assets/image/dealData_line.png");
import api_list from "@/views/business/dataAnalyse/dealData/api/dealData";

export default {
  name: "mechanism",
  data() {
    return {
      id: null,
      chart: null,
      xAxisArr: [],
      timeType: "1",
      data: null,
      devYbPzDealTotalMoney: 0,
      devYbPzDealTotalNum: 0
    };
  },
  props: {
    title: {
      type: String,
      default: "终端医保电子凭证交易笔数/交易金额统计"
    },
    height: {
      type: String,
      default: "410px"
    }
  },
  computed: {
    uuid() {
      if (!this.id) {
        this.id = "chart_data_id" + Math.ceil(Math.random() * 1000);
      }
      return this.id;
    }
  },
  mounted() {
    this.initChart();
    // this.search();
    //当前日期
  },
  methods: {
    initData() {
      // c
    },
    initChart() {
      let d = {};
      d.timeType = this.timeType;
      api_list.getDealTrend(d).then(res => {
        if (res.code > 0) {
          console.log(res.data, "终端凭证交易趋势");
          let v = res.data || {};
          this.devYbPzDealTotalMoney = v.devYbPzDealTotalMoney;
          this.devYbPzDealTotalNum = v.devYbPzDealTotalNum;
          let devDealTrendArrayVos = v.devDealTrendArrayVos || [];
          let date = [];
          let dealNum = [];
          let dealMoney = [];
          devDealTrendArrayVos.map(item => {
            date.push(item.xname);
            dealNum.push(item.devYbPzDealNum);
            dealMoney.push(item.devYbPzDealMoney);
          });
          this.chart = echarts.init(
            document.getElementById(this.uuid),
            "light"
          );
          const option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow",
                crossStyle: {
                  color: "#999"
                },
                //滑动x轴文字颜色
                label: {
                  color: "#3B7FF6",
                  backgroundColor: "#fff",
                  shadowBlur: 0,
                  show: true,
                  fontSize: 14
                },
                //滑动阴影
                shadowStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(54, 123, 245, 0)" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(54, 123, 245, 0.35)" // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              },
              extraCssText: "box-shadow: 0 4px 12px rgba(192, 195, 202, 0.4);", //额外附加到浮层的 css 样式
              backgroundColor: "#fff",
              borderRadius: 0,
              padding: [10, 10, 10, 10],
              textStyle: {
                align: "left",
                fontSize: 16
              },
              formatter: function(v) {
                var str =
                  '<span style="color:#979CB2;font-weight:400;font-size: 14px;font-family: PingFang SC;">' +
                  v[0].name +
                  "</span>" +
                  "<br/>";
                v.forEach(item => {
                  var str2 =
                    '<span style="color:#232731;font-size: 12px;font-family: PingFang SC;">' +
                    item.seriesName +
                    "：" +
                    "</span>" +
                    '<span style="color: ' +
                    item.color +
                    ';font-size: 16px;font-family: PingFang SC;font-weight:600;">' +
                    item.data +
                    "</span>" +
                    "<br/>";
                  str = str + str2;
                });
                return str;
              }
            },
            title: {
              // text: `<div class="deployData-Rate">定点零售药店终端医保电子凭证交易金额</div>`
            },
            toolbox: {},
            legend: {
              data: [
                {
                  name: "终端医保电子凭证交易金额",
                  icon: "image://" + img_url
                },
                "终端医保电子凭证交易笔数"
              ],
              x: "right",
              padding: [0, 60, 0, 0],
              itemHeight: 14,
              itemWidth: 14
            },
            grid: {
              with: "1653px",
              height: "auto",
              left: "3%",
              right: "4%"
            },
            xAxis: [
              {
                type: "category",
                data: date,
                axisPointer: {
                  type: "shadow"
                },
                axisTick: {
                  //y轴刻度线
                  show: false
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: "dashed",
                    width: 1,
                    color: "#EEF3FA"
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: "979CB2"
                  }
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "（万笔）",
                min: 0,
                max: 10000000,
                interval: 2000000,
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: "#979CB2",
                    fontSize: 14
                  },
                  formatter: function(value) {
                    return value / 10000;
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: "dashed",
                    width: 1,
                    color: "#EEF3FA"
                  }
                },
                nameTextStyle: {
                  color: "#979CB2",
                  fontSize: 12
                },
                axisLine: {
                  lineStyle: {
                    color: "979CB2"
                  }
                }
              },
              {
                type: "value",
                name: "(万元)",
                min: 0,
                max: 100000000,
                interval: 20000000,
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: "#979CB2",
                    fontSize: 12
                  },
                  formatter: function(value) {
                    return value / 1000;
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: "dashed",
                    width: 1,
                    color: "#EEF3FA"
                  }
                },
                nameTextStyle: {
                  color: "#979CB2",
                  fontSize: 12
                },
                axisLine: {
                  lineStyle: {
                    color: "979CB2"
                  }
                }
              }
            ],
            series: [
              {
                name: "终端医保电子凭证交易笔数",
                type: "bar",
                barWidth: 30,
                data: dealNum,
                yAxisIndex: 1,
                color: "#3B7FF6"
              },
              {
                name: "终端医保电子凭证交易金额",
                type: "line",
                barWidth: 30,
                yAxisIndex: 0,
                data: dealMoney,
                color: "#FF5E5A",
                smooth: 0.2,
                symbol: "none"
              }
            ]
          };
          this.chart.setOption(option);
          window.addEventListener("resize", () => {
            this.chart.resize();
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
    onChangeRadio(val) {
      console.log(val, "选择时间  1近一天   2近三天   3近一周   4近一月");
      this.initChart();
    }
  }
};
</script>
<style lang="scss" scoped>
.deal-data-card-box {
  border-radius: 0px;
  background: #fff;
  border: 0px solid #fff;
  .header {
    display: flex;
    align-items: center;
    ::v-deep .el-radio__label {
      padding-left: 5px;
    }
    .el-radio {
      margin-right: 20px;
    }
  }
  // .ivu-card-head {
  //   border-bottom: 1px solid #e8e8e8;
  // }
  .content {
    display: flex;
    align-items: center;
    padding-left: 10px;
    margin-top: 24px;
    .item {
      display: flex;
      align-items: center;
      margin-right: 24px;
    }
    .title {
      font-family: PingFang SC;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      letter-spacing: 0px;
      text-align: left;
      color: #979cb2;
    }
    .num {
      font-family: PingFang SC;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      letter-spacing: 0px;
      text-align: left;
    }
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
    margin-right: 22px;
  }
  .el-radio {
    color: #979cb2;
  }
}
</style>
<style lang="scss">
.deal-data-card-box {
  .el-radio-group {
    .el-radio__input.is-checked + .el-radio__label {
      color: #232731;
    }
  }
}
</style>
