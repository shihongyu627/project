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
      data: null
    };
  },
  props: {
    title: {
      type: String,
      default: "医保电子凭证激活数/参保总人数"
    },
    height: {
      type: String,
      default: "200px"
    },
    activeData: {
      type: Object
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
    // this.search();
    //当前日期
  },
  watch: {
    activeData: {
      deep: true,
      handler(val) {
        console.log(val, "医保电子凭证激活数/参保总人数");
        this.initChart(val);
      }
    }
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
            name: "参保总人数",
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
                value: val.ybPzActivedTotalNum,
                name: "医保电子凭证激活数 ",
                itemStyle: {
                  color: "#FFA736"
                }
              },
              {
                value: val.cbTotalPersionNum,
                name: "参保总人数",
                itemStyle: {
                  color: "#6C6AFF"
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
            name: "参保总人数",
            type: "pie",
            radius: ["80%", "100%"],
            hoverAnimation: false,
            labelLine: {
              show: false
            },
            data: [
              {
                value: val.ybPzActivedTotalNum,
                name: "医保电子凭证激活数 ",
                itemStyle: {
                  color: "rgba(255, 167, 54, 0.3)"
                }
              },
              {
                value: val.cbTotalPersionNum,
                name: "参保总人数",
                itemStyle: {
                  color: "rgba(108, 106, 255, 0.3)"
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
