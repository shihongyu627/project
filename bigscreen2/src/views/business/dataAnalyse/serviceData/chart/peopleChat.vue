<template>
  <el-card class="active-data-card-box">
    <div class="header">
      <div class="left">
        <div class="deployData-Rate">终端服务人数</div>
        <div>
          <el-radio-group v-model="radio1" @change="onChangeRadio" size="small">
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
      <!-- <el-input
        class="right"
        placeholder="请输入机构名称"
        v-model="input"
        clearable
        @change="onChange"
        @clear="onClear"
      >
      </el-input> -->
    </div>
    <div class="content">
      <div class="item">
        <div class="title">终端服务人数（人）：</div>
        <div class="num" style="color:#3B7FF6">849454</div>
      </div>
    </div>
    <div :style="{ width: '100%', height: height }" :id="uuid"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
import api_list from "@/views/business/dataAnalyse/serviceData/api/serviceData";

export default {
  name: "peopleChat",
  data() {
    return {
      id: null,
      chart: null,
      xAxisArr: [],
      radio1: "1",
      data: null,
      input: ""
    };
  },
  props: {
    title: {
      type: String,
      default: "终端服务人数"
    },
    height: {
      type: String,
      default: "433px"
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
      // api_list.getorDeployOverview({}).then(res => {
      //   if (res.code > 0) {
      //     console.log(res.data, "部署概览");
      //     this.deployData = res.data || {};
      //     this.deployCoverPercent = Number(res.data.deployCoverPercent) || 0;
      //     this.ydDeployCoverPercent =
      //       Number(res.data.ydDeployCoverPercent) || 0;
      //     this.ylDeployCoverPercent =
      //       Number(res.data.ylDeployCoverPercent) || 0;
      //     this.$message({
      //       message: res.message,
      //       type: "success",
      //       offset: 100
      //     });
      //   } else {
      //     this.$message({
      //       message: res.message,
      //       type: "error",
      //       offset: 100
      //     });
      //   }
      // });
      this.chart = echarts.init(document.getElementById(this.uuid), "light");
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
          backgroundColor: "#fff",
          borderRadius: 0,
          padding: [10, 10, 10, 10],
          textStyle: {
            align: "left",
            fontSize: 12
          },
          extraCssText: "box-shadow: 0 4px 12px rgba(192, 195, 202, 0.4);", //额外附加到浮层的 css 样式
          formatter: function(v) {
            var str = "";
            v.forEach(item => {
              var str2 =
                '<span style="color:#979CB2;font-weight:400;font-size: 14px;font-family: PingFang SC;">' +
                item.name +
                "</span>" +
                "<br/>" +
                '<span style="color:#232731;font-size: 12px;font-family: PingFang SC;">' +
                item.seriesName +
                "：" +
                "</span>" +
                '<span style="color: ' +
                item.color +
                ';font-family: PingFang SC;font-weight:600;font-size: 16px;">' +
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
          left: "4%",
          right: "4%"
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
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
        },
        series: [
          {
            name: "终端服务人数",
            type: "line",
            yAxisIndex: 0,
            data: [
              108445,
              194445,
              281245,
              188245,
              189245,
              188945,
              189845,
              198945,
              179845,
              158845,
              148945,
              139845
            ],
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
    },
    //搜索机构名称
    onChange(data) {
      console.log(data);
    },
    //清空内容
    onClear() {
      console.log("清空内容");
    },
    //单选日期
    onChangeRadio(val) {
      console.log(val, "选择时间 1近一周  2近一月   3近半年   4近一年");
    }
  }
};
</script>
<style lang="scss" scoped>
.active-data-card-box {
  border-radius: 0px;
  background: #fff;
  border: 0px solid #fff;
  margin-bottom: 10px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    ::v-deep .el-radio__label {
      padding-left: 5px;
    }
    .el-radio {
      margin-right: 20px;
    }
  }
  .left {
    display: flex;
    align-items: center;
  }
  .right {
    width: 190px;
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
