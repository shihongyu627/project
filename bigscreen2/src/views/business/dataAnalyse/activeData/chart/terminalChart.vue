<template>
  <div :style="{ width: '100%', height: height }" :id="uuid"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "mechanism",
  data() {
    return {
      id: null,
      chart: null,
      xAxisArr: [],
      radio1: "1",
      data: null,
      devYbPzActivedTotalNum: 0,
      ybPzActivedTotalNum: 0
    };
  },
  props: {
    title: {
      type: String,
      default: "终端激活医保电子凭证总数/医保电子凭证激活总数"
    },
    height: {
      type: String,
      default: "200px"
    },
    activePercent: {
      type: Object
    }
  },
  watch: {
    activePercent: {
      deep: true,
      handler(val) {
        this.devYbPzActivedTotalNum=val.devYbPzActivedTotalNum
        this.ybPzActivedTotalNum=val.ybPzActivedTotalNum
        this.initChart();
      }
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
    initChart(val) {
      this.chart = echarts.init(document.getElementById(this.uuid), "light");
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          data: [],
          selectedMode: false
        },
        series: [
          {
            name: "终端激活医保电子凭证总数/医保电子凭证激活总数",
            type: "pie",
            selectedMode: false,
            hoverAnimation: false,
            radius: [0, "80%"],
            label: {
              //饼图图形上的文本标签
              normal: {
                show: true,
                position: "inner", //标签的位置
                textStyle: {
                  fontWeight: 600,
                  fontSize: 14 //文字的字体大小
                },
                formatter: "{d}%"
              }
            },
            labelLine: {
              show: false
            },
            formatter: "{d}%",
            data: [
              {
                value: this.devYbPzActivedTotalNum,
                name: "终端激活医保电子凭证数 ",
                itemStyle: {
                  color: "#3B7FF6"
                }
              },
              {
                value: this.ybPzActivedTotalNum,
                name: "医保电子凭证激活数",
                itemStyle: {
                  color: "#FFA736"
                },
                label: {
                  show: false
                }
              }
            ],
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              }
            }
          },
          {
            name: "终端激活医保电子凭证总数/医保电子凭证激活总数",
            type: "pie",
            radius: ["80%", "100%"],
            hoverAnimation: false,
            labelLine: {
              show: false
            },
            data: [
              {
                value: this.devYbPzActivedTotalNum,
                name: "终端激活医保电子凭证数 ",
                itemStyle: {
                  color: "rgba(59, 127, 246, 0.3)"
                }
              },
              {
                value: this.ybPzActivedTotalNum,
                name: "医保电子凭证激活数",
                itemStyle: {
                  color: "rgba(255, 167, 54, 0.3)"
                }
              }
            ],
            itemStyle: {
              normal: {
                label: {
                  show: false
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
    }
  }
};
</script>
<style lang="scss" scoped></style>
<style lang="scss"></style>
