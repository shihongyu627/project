<template>
  <el-card class="active-data-card-box">
    <div class="header">
      <div class="deployData-Rate">终端激活医保电子凭证走势</div>
      <div>
        <el-radio-group v-model="timeType" @change="onChangeRadio" size="small">
          <el-radio fill="#232731" text-color="#232731" label="1"
            >近一周</el-radio
          >
          <el-radio fill="#232731" text-color="#232731" label="2"
            >近一月</el-radio
          >
          <el-radio fill="#232731" text-color="#232731" label="3"
            >近半年</el-radio
          >
          <el-radio fill="#232731" text-color="#232731" label="4"
            >近一年</el-radio
          >
        </el-radio-group>
      </div>
    </div>
    <div class="content">
      <div class="item">
        <div class="title">终端激活医保电子凭证总数：</div>
        <div class="num" style="color:#3B7FF6">
          {{ this.devYbPzActivedTotalNum }}
        </div>
      </div>
    </div>
    <div :style="{ width: '100%', height: height }" :id="uuid"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
import api_list from "@/views/business/dataAnalyse/activeData/api/activeData";

export default {
  name: "mechanism",
  data() {
    return {
      id: null,
      chart: null,
      xAxisArr: [],
      timeType: "1",
      data: null,
      devYbPzActivedTotalNum: 0
    };
  },
  props: {
    title: {
      type: String,
      default: "终端激活医保电子凭证走势"
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
      api_list.getActivedTrend(d).then(res => {
        if (res.code > 0) {
          console.log(res.data, "终端激活医保电子凭证走势");
          let v = res.data || {};
          this.devYbPzActivedTotalNum = v.devYbPzActivedTotalNum;
          let devActivedTrendArrayVos = v.devActivedTrendArrayVos || [];
          let date = [];
          let activeNum = [];
          devActivedTrendArrayVos.map(item => {
            date.push(item.xname);
            activeNum.push(item.devYbPzActivedNum);
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
                },
                lineStyle: {
                  type: "dashed",
                  width: 2,
                  color: "#2176FF"
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
                var str = "";
                v.forEach(item => {
                  var str2 =
                    '<span style="color:#979CB2;font-weight:400;font-size: 14px;font-family: PingFang SC;">' +
                    item.name +
                    "</span>" +
                    "<br/>" +
                    '<span style="color:#232731;font-family: PingFang SC;font-size: 12px;">' +
                    item.seriesName +
                    "：" +
                    "</span>" +
                    '<span style="color: ' +
                    item.color +
                    ';font-weight:600;font-family: PingFang SC;font-size: 16px;">' +
                    item.data +
                    "</span>";
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
              data: [],
              x: "right",
              padding: [0, 60, 0, 0]
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
                  type: "line"
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: "dashed",
                    width: 1,
                    color: "#EEF3FA"
                  }
                },
                // boundaryGap: false,
                axisTick: {
                  //y轴刻度线
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: "#979CB2",
                    fontSize: 14
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: "979CB2"
                  }
                }
              }
            ],
            yAxis: {
              type: "value",
              name: "（万）",
              min: 0,
              max: 1000000,
              interval: 200000,
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
              axisTick: {
                //y轴刻度线
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: "979CB2"
                }
              }
            },
            series: [
              {
                name: "终端医保电子凭证交易金额",
                type: "line",
                yAxisIndex: 0,
                data: activeNum,
                color: "#FF5E5A",
                smooth: 0.2,
                symbol: "none",
                areaStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(88,160,293,1)"
                      },
                      {
                        offset: 0.5,
                        color: "rgba(88,160,253,0.7)"
                      },
                      {
                        offset: 1,
                        color: "rgba(88,160,253,0)"
                      }
                    ]
                  }
                },
                lineStyle: {
                  normal: {
                    color: "rgba(88,160,253,1)"
                  }
                },
                itemStyle: {
                  normal: {
                    color: "rgba(88,160,253,1)"
                  }
                }
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
    //单选日期
    onChangeRadio(val) {
      console.log(val, "选择时间 1近一周  2近一月   3近半年   4近一年");
      this.initChart();
    }
  }
};
</script>
<style lang="scss" scoped>
.active-data-card-box {
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
      color: #616776;
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
}
</style>
<style lang="scss">
.active-data-card-box {
  .el-card__body {
    .el-radio__input.is-checked + .el-radio__label {
      color: #232731;
    }
  }
}
</style>
