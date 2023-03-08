<template>
  <div style="width:880px;height:192px;margin:0 auto;">
    <div :id="idstr" class="chartsdom" style="width:100%;height:100%;" />
  </div>
</template>

<script>
export default {
  name: 'ScrollArc',
  props: {
    idstr: {
      type: String,
      default: ''
    },
    xData: {
      type: Array,
      default: []
    },
    lineData: {
      type: Array,
      default: []
    },
    barData: {
      type: Array,
      default: []
    },
    color: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      option: null,
      number: 0,
      timer: null,
      myChart: {}
      // xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // lineData: [5422, 8622, 4622, 7227, 2926, 8229, 8888],
      // barData: [9774, 6222, 7222, 12227, 10226, 21229, 2238]
    }
  },
  watch: {
    'xData': function(nval, oval) {
      if (nval.length !== 0) this.getEchart()
    }
  },
  mounted() {
    console.log(this.echarts)
    this.getEchart()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getEchart() {
      this.myChart = this.echarts.init(document.getElementById(this.idstr))
      this.option = {
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 1,
                color: '#5d83ff'
              }, {
                offset: 0,
                color: 'rgba(255, 255, 255, 0)'
              }])
            }
          },
          formatter: function(params) {
            var str = params[0].name + '</br>'
            params.forEach(function(v) {
              if (v.seriesIndex === 0) {
                str += v.marker + v.seriesName + '：' + v.value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '笔</br>'
              } else {
                str += v.marker + v.seriesName + '：' + v.value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '台</br>'
              }
            })
            return str
          }
        },
        color: this.color,
        grid: {
          top: 30,
          left: 20,
          right: 20,
          bottom: 10,
          containLabel: true // 轴上的数值
        },
        xAxis: {
          type: 'category',
          data: this.xData,
          boundaryGap: true,
          axisTick: {
            show: true
          },
          axisLabel: {
            formatter: '{value}',
            interval: 2
            // rotate: 45
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '终端业务量(笔)',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          },
          {
            type: 'value',
            name: '终端在线数(台)',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [{
          name: '终端业务量',
          type: 'line',
          data: this.lineData,
          symbolSize: 10,
          areaStyle: {
            normal: {
              color: new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#5d83ff'
              }, {
                offset: 1,
                color: 'rgba(0, 0, 0, 0)'
              }])
            }
          },
          smooth: true
        },
        { name: '终端在线数',
          type: 'bar',
          barWidth: 20,
          data: this.barData,
          yAxisIndex: 1
        }]
      }
      this.myChart.setOption(this.option, true)
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
      this.timer = setInterval(() => {
        this.myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: this.number
        })
        this.number++
        if (this.number == this.lineData.length) this.number = 0
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
