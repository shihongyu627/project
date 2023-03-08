<template>
  <el-card class="deploy-data-card-box">
    <div class="header">
      <div class="deployData-Rate">机构部署覆盖率统计</div>
      <div>
        <el-radio-group v-model="timeType" @change="onChangeRadio" size="small">
          <el-radio fill="#232731" text-color="#232731" label="1"
            >近半年</el-radio
          >
          <el-radio fill="#232731" text-color="#232731" label="2"
            >近一年</el-radio
          >
        </el-radio-group>
      </div>
    </div>
    <div class="content">
      <div class="item">
        <div class="title">新增定点医疗机构数 (家)：</div>
        <div class="num" style="color:#2BA245">{{ this.ylTotalNum }}</div>
      </div>
      <div class="item">
        <div class="title">新增定点零售药店数 (家)：</div>
        <div class="num" style="color:#2EA6AA">{{ this.ydTotalNum }}</div>
      </div>
      <!-- <div class="item">
        <div class="title">覆盖率：</div>
        <div class="num" style="color:#3B7FF6">94%</div>
      </div> -->
    </div>
    <div :style="{ width: '100%', height: height }" :id="uuid"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
var img_url = require("@/assets/image/deployData_line.png");
import api_list from "@/views/business/dataAnalyse/deployData/api/deployData";

export default {
  name: "mechanism",
  data() {
    return {
      id: null,
      chart: null,
      xAxisArr: [],
      timeType: "1",
      data: null,
      ylTotalNum: 0,
      ydTotalNum: 0
    };
  },
  props: {
    title: {
      type: String,
      default: "机构部署覆盖率统计"
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
      api_list.getorYdAndYljgDeployMonth(d).then(res => {
        if (res.code > 0) {
          let arr = res.data || [];
          let date = [];
          let ydNum = [];
          let ylNum = [];
          let percent = [];
          arr.map(item => {
            date.push(item.monthStr);
            ydNum.push(item.ydNum);
            ylNum.push(item.ylNum);
            percent.push(item.deployCoverPercent);
            this.ylTotalNum += Number(item.ylNum);
            this.ydTotalNum += Number(item.ydNum);
          });
          console.log(res.data, "机构部署覆盖率统计");
          this.chart = echarts.init(
            document.getElementById(this.uuid),
            "light"
          );
          const option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "none",
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
                // shadowStyle: {
                //   color: {
                //     type: "linear",
                //     x: 0,
                //     y: 0,
                //     x2: 0,
                //     y2: 1,
                //     colorStops: [
                //       {
                //         offset: 0,
                //         color: "rgba(54, 123, 245, 0)" // 0% 处的颜色
                //       },
                //       {
                //         offset: 1,
                //         color: "rgba(54, 123, 245, 0.35)" // 100% 处的颜色
                //       }
                //     ],
                //     global: false // 缺省为 false,
                //   }
                // },
                lineStyle: {
                  width: 95,
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
                    global: false // 缺省为 false,
                  }
                }
              },
              backgroundColor: "#fff",
              borderRadius: 2,
              padding: [10, 10, 10, 10],
              textStyle: {
                align: "left",
                fontSize: 14
              },
              extraCssText: "box-shadow: 0 4px 12px rgba(192, 195, 202, 0.4);", //额外附加到浮层的 css 样式
              formatter: function(v) {
                var str = "";
                v.forEach(item => {
                  var unit = item.seriesName == "覆盖率" ? "%" : "";
                  var str2 =
                    '<span style="color:#979CB2 ">' +
                    item.seriesName +
                    "：" +
                    "</span>" +
                    '<span style="color: ' +
                    item.color +
                    ';font-family:Microsoft YaHei;font-weight:600;">' +
                    item.data +
                    unit +
                    "</span>" +
                    "<br/>";
                  str = str + str2;
                });
                return str;
              }
            },
            title: {},
            toolbox: {},
            legend: {
              data: [
                { name: "覆盖率", icon: "image://" + img_url },
                "新增定点医疗机构数",
                "新增定点零售药店数"
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
              right: "3%"
            },
            xAxis: [
              {
                type: "category",
                data: date,
                axisPointer: {
                  type: "line"
                },
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
            yAxis: [
              {
                type: "value",
                name: "(百分比)",
                min: 0,
                max: 100,
                interval: 20,
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: "dashed",
                    width: 1,
                    color: "#EEF3FA"
                  }
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: "#979CB2",
                    fontSize: 14
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
              {
                type: "value",
                name: "(千)",
                min: 0,
                max: 100000,
                interval: 20000,
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: "#979CB2",
                    fontSize: 12
                  },
                  formatter: function(value) {
                    return value / 10000;
                  }
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
                name: "覆盖率",
                type: "line",
                barWidth: 30,
                yAxisIndex: 0,
                data: percent,
                color: "#3B7FF6"
              },
              {
                name: "新增定点医疗机构数",
                type: "bar",
                barWidth: 30,
                data: ylNum,
                yAxisIndex: 1,
                color: "#2BA245",
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: "top",
                      textStyle: {
                        color: "#2BA245",
                        fontSize: 14
                      }
                    }
                  }
                }
              },
              {
                name: "新增定点零售药店数",
                type: "bar",
                barWidth: 30,
                data: ydNum,
                yAxisIndex: 1,
                color: "#2EA8A9",
                barGap: "100%",
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: "top",
                      textStyle: {
                        color: "#2EA8A9",
                        fontSize: 14
                      }
                    }
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
      this.initChart();
      console.log(val, "选择时间 1近半年   2近一年");
    }
  }
};
</script>
<style lang="scss" scoped>
.deploy-data-card-box {
  border-radius: 0px;
  background: #fff;
  border: 0px solid #fff;
  .header {
    display: flex;
    align-items: center;
  }
  ::v-deep .el-radio__label {
    padding-left: 5px;
  }
  .el-radio {
    margin-right: 20px;
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
      font-size: 12px;
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
</style>
<style lang="scss">
.deploy-data-card-box {
  .el-radio-group {
    .el-radio__input.is-checked + .el-radio__label {
      color: #232731;
    }
  }
}
</style>
