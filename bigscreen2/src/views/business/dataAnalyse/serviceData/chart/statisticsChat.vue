<template>
  <div :style="{ width: '100%', height: height }" :id="uuid"></div>
</template>

<script>
import echarts from "echarts";
import { div } from "echarts-gl";
export default {
  name: "mechanism",
  data() {
    return {
      id: null,
      chart: null,
      xAxisArr: [],
      radio1: "1",
      data: null,
      curIndex: 0
    };
  },
  props: {
    title: {
      type: String,
      default: "身份核验统计"
    },
    height: {
      type: String,
      default: "200px"
    },
    serviceData: {
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
  watch: {
    serviceData: {
      deep: true,
      handler(val) {
        console.log(val, "身份核验统计");
        this.initChart(val);
      }
    }
  },
  mounted() {
    // this.search();
    //当前日期
  },
  methods: {
    initData() {
      // c
    },
    initChart(val) {
      let pzNum = val.pzNum;
      let sfNum = val.sfNum;
      let slNum = val.slNum;
      this.chart = echarts.init(document.getElementById(this.uuid), "light");
      const option = {
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(97, 103, 118, 1)", //背景颜色（此时为默认色）
          borderRadius: 0, //边框圆角
          padding: 5,
          position: function(point, params, dom, rect, size) {
            // 位置回调
            // console.log && console.log(p);
            // return [p[0], p[1] - 30];
            let x = 0;
            let y = 0;
            let pointX = point[0];
            let pointY = point[1];
            let boxWidth = size.contentSize[0];
            let boxHeight = size.contentSize[1];
            // console.log(boxWidth, boxHeight, pointX, pointY);
            if (boxWidth > pointX) {
              //1  3 负数  2正
              x = boxWidth - pointX + 30;
            } else {
              x = pointX + 30;
            }
            if (boxHeight > pointY) {
              y = pointY - boxHeight;
            } else {
              y = pointY;
            }
            // console.log(x, pointY);
            return [x, y];
          },
          formatter: function(params, ticket, callback) {
            var str =
              '<div style="position:relative">' +
              '<div style="position:absolute;left:-12px;bottom:-5px;width:0;height:0;border-top:12px solid transparent;border-bottom:12px solid transparent;border-right:12px solid #616776"></div>' +
              '<span style="color:#EAEAF2;font-size:16px">' +
              params.percent +
              "%" +
              "</span>" +
              '<span style="color:#B6BECD;font-size:14px">' +
              " 占比" +
              "</span>" +
              "</div>";
            return str;
          }
        },

        legend: {
          data: [],
          selectedMode: false
        },
        series: [
          {
            name: "身份核验统计",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            selectedMode: false,
            // hoverAnimation: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            selectedOffset: 0,
            hoverOffset: 3,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                formatter: "{a|{c}}\n{b|{b}}",
                rich: {
                  a: {
                    color: "#000000",
                    fontWeight: "600",
                    align: "center",
                    fontSize: 14,
                    lineHeight: 22,
                    "font-family": "PingFang SC"
                  },

                  b: {
                    color: "#979CB2",
                    fontSize: 12,
                    fontWeight: "400",
                    lineHeight: 20,
                    "font-family": "PingFang SC"
                  }
                },
                textStyle: {
                  fontSize: 15,
                  fontWeight: "600"
                }
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: slNum,
                name: "刷脸",
                itemStyle: {
                  color: "#3B7FF6"
                }
              },
              {
                value: sfNum,
                name: "身份证",
                itemStyle: {
                  color: "#FE9D21"
                }
              },
              {
                value: pzNum,
                name: "电子凭证",
                itemStyle: {
                  color: "#2BA245"
                }
              }
            ]
          }
        ]
      };
      this.chart.setOption(option);
      this.curIndex = 0;
      // setInterval(() => {
      let dataLen = option.series[0].data.length;
      // this.chart.dispatchAction({
      //   type: "downplay",
      //   seriesIndex: 0,
      //   dataIndex: curIndex
      // });
      this.chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: this.curIndex
      });
      this.chart.on("mouseover", v => {
        if (v.dataIndex != 0) {
          this.chart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: 0
          });
        }
      });
      this.chart.on("mouseout", v => {
        this.chart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: 0
        });
      });
      // this.chart.dispatchAction({
      //   type: "showTip",
      //   seriesIndex: 0,
      //   dataIndex: curIndex
      // });
      // }, 1000);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
<style lang="scss"></style>
