<template>
  <div style="width:100%;height:100%;">
    <div id="chartmainbar" style="width:100%; height:100%;" />
  </div>
</template>
<script>
var beijing_json = require('@/assets/mapjson/beijing.json')
var chongqing_json = require('@/assets/mapjson/chongqing.json')
var qinghai_json = require('@/assets/mapjson/qinghai.json')
var img_url = require('@/assets/image/warn.png')
export default {
  name: 'MapBox',
  props: {
    mapData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      map_data: [],
      number: 0,
      timer: null,
      centerList: [
        [3, 10, 2], [10, 8, -10], [10, 0, -18]
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.map_data = this.mapData
      this.map_data = this.map_data.map((item, ind) => {
        return {
          orgAddress: item.orgAddress,
          orgName: item.orgName,
          terminalSN: item.terminalSN,
          warningDate: item.warningDate,
          warningType: item.warningType,
          warningTypeStr: item.warningTypeStr,
          name: item.orgName,
          value: [item.longitude, item.latitude, 2000],
          center: this.centerList[ind]
        }
      })
      this.initMap()
    }, 500)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    initMap() {
      var city = [
        { name: '延庆区', value: 31.4, lng: 115.981186, lat: 40.462706 },
        { name: '怀柔区', value: 38.4, lng: 116.63853, lat: 40.322563 },
        { name: '密云区', value: 47.9, lng: 116.849551, lat: 40.382999 },
        { name: '昌平区', value: 196.3, lng: 116.237832, lat: 40.226854 },
        { name: '顺义区', value: 102, lng: 116.663242, lat: 40.1362 },
        { name: '平谷区', value: 42.3, lng: 117.128025, lat: 40.147115 },
        { name: '门头沟区', value: 30.8, lng: 116.108179, lat: 39.94648 },
        { name: '海淀区', value: 369.4, lng: 116.304872, lat: 39.96553 },
        { name: '石景山区', value: 65.2, lng: 116.229612, lat: 39.912017 },
        { name: '西城区', value: 129.8, lng: 116.372397, lat: 39.918561 },
        { name: '东城区', value: 90.5, lng: 116.42272, lat: 39.934579 },
        { name: '朝阳区', value: 395.5, lng: 116.449767, lat: 39.927254 },
        { name: '通州区', value: 137.8, lng: 116.662928, lat: 39.917001 },
        { name: '大兴区', value: 156.2, lng: 116.348053, lat: 39.732833 },
        { name: '房山区', value: 104.6, lng: 116.149892, lat: 39.755039 },
        { name: '丰台区', value: 232.4, lng: 116.293105, lat: 39.865042 }
      ]
      this.echarts.registerMap('chongqing', chongqing_json)
      this.echarts.registerMap('beijing', beijing_json)
      this.echarts.registerMap('qinghai', qinghai_json)
      const chart = this.echarts.init(document.getElementById('chartmainbar'))
      // 3d地图 + 散点图
      var option = {
        tooltip: {
          formatter: function(params) {
            return ''
          }
        },
        geo3D: {
          show: true,
          map: 'chongqing',
          regionHeight: 5,
          boxWidth: 125,
          boxHeight: 3,
          boxDepth: 60,
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              formatter: function(params) {
                return params.name
              },
              textStyle: {
                color: '#fff',
                backgroundColor: 'rgb(17, 26, 83)',
                padding: [10, 10, 10, 10],
                opacity: 1
              }
            },
            itemStyle: {
              borderWidth: 1.6,
              borderColor: '#95FFFF',
              color: '#0058B8'
            }
          },
          itemStyle: {
            color: '#0090FF',
            opacity: 0.8,
            borderWidth: 1.6,
            borderColor: '#8FDCDC'
          },
          regions: [
            {
              name: '丰都县',
              itemStyle: {
                color: '#2B5FE2'
              }
            },
            {
              name: '城口县',
              itemStyle: {
                color: '#2B5FE2'
              }
            },
            {
              name: '忠县',
              itemStyle: {
                color: '#54FDFA'
              }
            },
            {
              name: '酉阳土家族苗族自治县',
              itemStyle: {
                color: '#2B5FE2'
              }
            },
            {
              name: '巫溪县',
              itemStyle: {
                color: '#54FDFA'
              }
            },
            {
              name: '渝中区',
              itemStyle: {
                color: '#54FDFA'
              }
            },
            {
              name: '万州区',
              itemStyle: {
                color: '#54FDFA'
              }
            },
            {
              name: '沙坪坝区',
              itemStyle: {
                color: '#54FDFA'
              }
            },
            {
              name: '南川区',
              itemStyle: {
                color: '#2B5FE2'
              }
            },
            {
              name: '江津区',
              itemStyle: {
                color: '#2B5FE2'
              }
            },
            {
              name: '涪陵区',
              itemStyle: {
                color: '#54FDFA'
              }
            },
            {
              name: '巴南区',
              itemStyle: {
                color: '#2B5FE2'
              }
            }
          ],
          viewControl: {
            autoRotate: false,
            distance: 70,
            autoRoateSpeed: 10,
            minBeta: 0,
            maxBeta: Math.pow(360, 9999999)
          }
        },
        series: [
          // {
          //   name: '重庆',
          //   type: 'map3D', //map3d上无法显示其他类型的系列，所以只能构建geo3D
          //   map: 'chongqing',
          //   data: [],
          //   regionHeight: 3,
          //   boxWidth: 125,
          //   //boxHeight: 50,
          //   boxDepth: 60,
          //   groundPlane: {
          //     show: false
          //   },
          //   // top: '-10%',
          //   //left:'10%',
          //   label: {
          //     show: false,
          //     formatter: function(params) {
          //       console.log(params)
          //       var content = ''
          //       content = params.orgName
          //       return content
          //     },
          //     textStyle: {
          //       color: '#000',
          //       fontWeight: 'normal',
          //       fontSize: 12,
          //       backgroundColor: 'rgba(0,23,11,0)'
          //     },
          //     emphasis: {
          //       //对应的鼠标悬浮效果
          //       show: false,
          //       textStyle: { color: '#f00' }
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       //静态模式下显示的默认样式
          //       borderWidth: 1.6,
          //       borderColor: "#95FFFF",
          //       color: "#0090FF",
          //     }, //阴影效果
          //     emphasis: {
          //       borderWidth: 1.6,
          //       borderColor: "#95FFFF",
          //       color: "#0058B8",
          //       textStyle: {
          //         // color:'blue'
          //       },
          //     },
          //   },
          //   viewControl: {
          //     autoRotate: true,
          //     distance: 70,
          //     autoRoateSpeed: 10,
          //     minBeta: 0,
          //     maxBeta: Math.pow(360, 9999999)
          //   }
          // },
          {
            type: 'bar3D',
            name: 'bar3D',
            coordinateSystem: 'geo3D',
            minHeight: 0,
            barSize: 0.5, // 柱子粗细
            // shading: 'lambert',
            bevelSize: 1,
            data: [],
            itemStyle: {
              color: '#EC1C2E',
              opacity: 0.9
            },
            label: {
              show: true,
              formatter: function(params) {
                var render_str = '       预警类型：' + params.data.warningTypeStr + '\n\n' + '• 终端SN：' + params.data.terminalSN + '\n\n' + '• 所属机构：' + params.data.orgName + '\n\n' + '• 机构地址：' + params.data.orgAddress + '\n\n' + '• 预警时间：' + params.data.warningDate
                return render_str
              },
              distance: -3,
              position: 'top',
              textStyle: {
                color: '#fff',
                backgroundColor: 'rgba(17, 26, 83, 1)',
                padding: [20, 10, 10, 10],
                borderWidth: 1
                // borderColor: '#EC1C2E'
              }
            },
            animation: true,
            animationDUrationUpdate: 1000
          },
          {
            type: 'scatter3D',
            name: 'scatter3D',
            coordinateSystem: 'geo3D',
            // symbol: 'pin',
            symbol: 'path://M512 0A512 512 0 1 0 1024 512 512.445217 512.445217 0 0 0 512 0z m0 934.956522a422.956522 422.956522 0 1 1 422.956522-422.956522 423.401739 423.401739 0 0 1-422.956522 422.956522z M512 178.086957a333.913043 333.913043 0 1 0 333.913043 333.913043A333.913043 333.913043 0 0 0 512 178.086957z m0 578.782608a244.869565 244.869565 0 1 1 244.869565-244.869565 245.314783 245.314783 0 0 1-244.869565 244.869565z M512 512m-155.826087 0a155.826087 155.826087 0 1 0 311.652174 0 155.826087 155.826087 0 1 0-311.652174 0Z M512 356.173913a155.826087 155.826087 0 1 0 155.826087 155.826087A155.826087 155.826087 0 0 0 512 356.173913z m0 222.608696a66.782609 66.782609 0 1 1 66.782609-66.782609 66.782609 66.782609 0 0 1-66.782609 66.782609z',
            // // symbol: 'image://'+ img_url,
            symbolSize: 20,
            opacity: 1,
            data: this.map_data,
            label: {
              show: false,
              formatter: function(params) {
                var render_str = '预警类型：' + params.data.warningTypeStr + '\n\n' + '终端SN：' + params.data.terminalSN + '\n\n' + '所属机构：' + params.data.orgName + '\n\n' + '机构地址：' + params.data.orgAddress + '\n\n' + '预警时间：' + params.data.warningDate
                return render_str
              },
              distance: -20,
              position: 'top',
              textStyle: {
                color: '#fff',
                backgroundColor: '#0090FF',
                padding: 10
              }
            }
          }
        ]
      }
      // 2d地图 + 散点图
      var option2 = {
        geo: {
          show: true,
          map: 'qinghai',
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true,
              color: '#fff'
            }
          },
          // layoutCenter: ['50%', '40%'],
          // layoutSize: '80%',
          // roam: true,
          itemStyle: {
            normal: {
              areaColor: '#0090FF',
              opacity: 1,
              borderWidth: 1.6,
              borderColor: '#95FFFF'
            },
            emphasis: {
              areaColor: '#0058B8',
              opacity: 1,
              borderWidth: 1.6,
              borderColor: '#95FFFF'
            }
          }
        },
        series: [
          {
            type: 'scatter',
            symbol: 'path://M512 0A512 512 0 1 0 1024 512 512.445217 512.445217 0 0 0 512 0z m0 934.956522a422.956522 422.956522 0 1 1 422.956522-422.956522 423.401739 423.401739 0 0 1-422.956522 422.956522z M512 178.086957a333.913043 333.913043 0 1 0 333.913043 333.913043A333.913043 333.913043 0 0 0 512 178.086957z m0 578.782608a244.869565 244.869565 0 1 1 244.869565-244.869565 245.314783 245.314783 0 0 1-244.869565 244.869565z M512 512m-155.826087 0a155.826087 155.826087 0 1 0 311.652174 0 155.826087 155.826087 0 1 0-311.652174 0Z M512 356.173913a155.826087 155.826087 0 1 0 155.826087 155.826087A155.826087 155.826087 0 0 0 512 356.173913z m0 222.608696a66.782609 66.782609 0 1 1 66.782609-66.782609 66.782609 66.782609 0 0 1-66.782609 66.782609z',
            coordinateSystem: 'geo',
            data: [],
            label: {
              show: true,
              formatter: function(params) {
                var render_str = '预警类型：' + params.data.warningTypeStr + '\n\n' + '终端SN：' + params.data.terminalSN + '\n\n' + '所属机构：' + params.data.orgName + '\n\n' + '机构地址：' + params.data.orgAddress + '\n\n' + '预警时间：' + params.data.warningDate
                return render_str
              },
              distance: 5,
              position: 'top',
              textStyle: {
                color: '#000',
                backgroundColor: '#fcc262',
                padding: 10
              }
            }
          }
        ]
      }
      chart.setOption(option2)
      // this.timer = setInterval(() => {
      //   option.series[0].data = [this.map_data[this.number]]
      //   option.series[0].minHeight = 15
      //   option.geo3D.viewControl.center = this.map_data[this.number].center
      //   chart.setOption(option)
      //   this.number++
      //   if (this.number == this.map_data.length) this.number = 0
      // }, 2000)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
