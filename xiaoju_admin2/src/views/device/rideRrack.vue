<template>
  <!-- 显示地图轨迹弹框 -->
  <div style="width:100%;height:450px;margin-top:0px">
    <div id="mapcontainer" style="width:100%;height:450px;margin-top:0px"></div>
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  name: 'rideRrack',
  props: {
    s_lnglat: {
      type: String,
      value: '',
    },
    e_lnglat: {
      type: String,
      value: '',
    },
    device_id: {
      type: String,
      value: '',
    },
    order_id: {
      type: String,
      value: '',
    },
    store_id: {
      type: String,
      value: '',
    },
    amap_trid: {
      type: String,
      value: '',
    },
    polygonRunStyle: {
      type: Object,
      default: () => {
        return {
          fillColor: 'green', // 多边形填充颜色
          borderWeight: 1, // 线条宽度，默认为 1
          strokeColor: 'green', // 线条颜色
        }
      },
    },
    polygonStopStyle: {
      type: Object,
      default: () => {
        return {
          fillColor: 'red', // 多边形填充颜色
          borderWeight: 1, // 线条宽度，默认为 1
          strokeColor: 'red', // 线条颜色
        }
      },
    },
  },
  data() {
    return {
      AMap: null,
      map: null,
      // 高德地图key
      amapkey: '728738a7d077c8125905b04e7eb28715',
      run_points: '',
      stop_points: '',
    }
  },
  created() {},
  mounted() {
    this.loadMap()
  },
  methods: {
    async loadMap() {
      let center = [] // 中心点
      let ss_lnglat = []
      if (this.s_lnglat) {
        ss_lnglat = this.s_lnglat.split(',')
        center = [ss_lnglat[0], ss_lnglat[1]]
      }
      try {
        AMapLoader.load({
          key: this.amapkey, // 申请好的Web端开发者Key，首次调用 load 时必填
          version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: ['AMap.ToolBar', 'AMap.MouseTool', 'AMap.Geocoder', 'AMap.Geolocation', 'AMap.MapType', 'AMap.Scale'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
          AMapUI: {
            // 是否加载 AMapUI，缺省不加载
            version: '1.1', // AMapUI 缺省 1.1
            plugins: [], // 需要加载的 AMapUI ui插件
          },
        })
          .then((AMap) => {
            this.AMap = AMap
            if (!this.map) {
              this.map = new AMap.Map('mapcontainer', {
                center: center,
                zoom: 16,
              })
            }
            this.map.setCenter(center)
            this.map.addControl(new AMap.Scale())
            this.map.addControl(new AMap.Geolocation())
            this.map.addControl(new AMap.MapType())
            this.map.addControl(new AMap.ToolBar({ position: 'LT' }))
            // 加载骑行轨迹
            this.loadTrsearch()
            // 加载围栏区域多边形
            this.loadAllArea()
          })
          .catch((err) => {
            console.log('loadmap catch', err)
          })
      } catch (error) {
        console.log('loadmap error', error)
      }
    },
    loadTrsearch() {
      let _this = this
      let q = {}
      q.device_id = this.device_id
      q.order_id = this.order_id
      q.trid = this.amap_trid
      $utils.api
        .load('mapTrsearch', q)
        .then((res) => {
          if (res.code > 0) {
            //  {"x":116.478928,"y":39.997761,"sp":19,"ag":0, "tm":1478031031},
            // console.log(res.data.tracks[0], 999999);
            if (!(res.data && res.data.tracks[0] && res.data.tracks[0].startPoint)) {
              // 加载骑行点
              let ss_lnglat = []
              if (this.s_lnglat) {
                ss_lnglat = this.s_lnglat.split(',')
              }
              let ee_lnglat = []
              if (this.e_lnglat) {
                ee_lnglat = this.e_lnglat.split(',')
              }
              this.loadMarker(ss_lnglat, ee_lnglat)
              return
            }
            let startPoint = this.s_lnglat.split(',') || res.data.tracks[0].startPoint.location.split(',') || []
            let endPoint = this.e_lnglat.split(',') || res.data.tracks[0].endPoint.location.split(',') || []
            // 加载骑行点
            this.loadMarker(startPoint, endPoint)

            let points = res.data.tracks[0].points || []
            let spoints = []
            if (points.length == 0) {
              return
            }
            for (let index = 0; index < points.length; index++) {
              const element = points[index]
              let time = 0
              let basetime = 0
              if (index == 0) {
                time = element.locatetime / 1000
                basetime = element.locatetime / 1000
              } else {
                time = element.locatetime - basetime
              }
              let latlng = element.location.split(',')
              let p = {}
              p.x = latlng[0]
              p.y = latlng[1]
              p.ag = element.accuracy
              p.sp = element.speed
              p.tm = time
              spoints.push(p)
            }

            // 显示骑行轨迹
            let paths = []
            for (let i = 0; i < spoints.length; i += 1) {
              paths.push([spoints[i].x, spoints[i].y])
            }
            let oline = new AMap.Polyline({
              path: paths,
              zIndex: 100,
              borderWeight: 5, // 线条宽度，默认为 1
              strokeColor: '#f20', // 线条颜色
              lineJoin: 'round', // 折线拐点连接处样式
            })
            if (oline) {
              _this.map && _this.map.add(oline)
            }
          }
        })
        .catch((error) => {
          console.log('loadTrsearch error', error)
        })
    },
    loadMarker(ss_lnglat, ee_lnglat) {
      // 开始位置
      if (ss_lnglat) {
        let startIcon = new AMap.Icon({
          size: new AMap.Size(48, 48),
          image: require('@/assets/icon/icon_start.png'),
          imageSize: new AMap.Size(48, 48),
        })
        let startMarker = new AMap.Marker({
          position: new AMap.LngLat(ss_lnglat[0], ss_lnglat[1]),
          icon: startIcon,
          offset: new AMap.Pixel(-24, -48),
          zIndex: 122
        })
        if (startMarker) {
          this.map && this.map.add(startMarker)
        }
      }
      
      // 结束位置
      if (ee_lnglat) {
        let endIcon = new AMap.Icon({
          size: new AMap.Size(48, 48),
          image: require('@/assets/icon/icon_end.png'),
          imageSize: new AMap.Size(48, 48),
        })
        let endMarker = new AMap.Marker({
          position: new AMap.LngLat(ee_lnglat[0], ee_lnglat[1]),
          icon: endIcon,
          offset: new AMap.Pixel(-30, -48),
          zIndex: 120
        })
        if (endMarker) {
          this.map && this.map.add(endMarker)
        }
      }
    },
    async getAllArea(store_id) {
      // 获取全部围栏区域
      let area_list = []
      let d = {}
      d.store_id = store_id
      let res = await $utils.api.load('storeAreaAllArea', d)
      if (res) {
        area_list = res.data || []
        console.log('storeAreaAllArea ll:', area_list)
        this.area_list = area_list
      }
      return area_list
    },
    async loadAllArea() {
      let area_list = await this.getAllArea(this.store_id)
      // 加载多边形
      area_list.map((item) => {
        // 跳过当前编辑的区域
        if (item.points) {
          let pathArr = []
          let paths = (item.points || '').split(';') || []
          for (let ii = 0; ii < paths.length; ii++) {
            const lnglat = paths[ii]
            if (lnglat) {
              if (lnglat.split(',')) {
                let lng = lnglat.split(',')[0]
                let lat = lnglat.split(',')[1]
                let path = new AMap.LngLat(lng, lat)
                pathArr.push(path)
              }
            }
          }
          console.log(item.name, ' paths ', paths, pathArr)
          if (paths && pathArr && pathArr.length > 0) {
            // 初始化多边形
            let polygon = new AMap.Polygon({
              path: pathArr,
              zIndex: 10,
              strokeOpacity: 0.4,
              strokeStyle: 'dashed', // 	轮廓线样式，实线:solid，虚线:dashed
              strokeColor: item.type === 1 ? '#008000' : item.type === 2 ? '#FF4500' : '#00B2D5',
              fillColor: item.type === 1 ? '#008000' : item.type === 2 ? '#FF4500' : '#00B2D5',
              fillOpacity: 0.3,
            })
            // 多边形添加到地图
            this.map.add(polygon)
          }
        }
      })
    },
  },
}
</script>
<style lang="less">
// .modelMap {
//   position: relative;
// }
// #containers {
//   margin: 0 auto;
// }
</style>
