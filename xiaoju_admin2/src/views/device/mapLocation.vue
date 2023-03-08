<template>
  <!-- 显示地图弹框 -->
  <div style="width:100%;height:450px;margin-top:0px">
    <div id="mapcontainer" style="width:100%;height:450px;margin-top:0px"></div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  name: 'mapLocation',
  components: {},
  props: {
    lng: {
      type: String,
      value: '',
    },
    lat: {
      type: String,
      value: '',
    },
    device_no: {
      type: String,
      value: '',
    },
    name: {
      type: String,
      default: '',
    },
    store_id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      AMap: null,
      map: null,
      // 高德地图key
      amapkey: '728738a7d077c8125905b04e7eb28715',
      area_list: [], // 全部围栏区域
    }
  },
  watch: {
    store_id(val) {
      if (val) {
        this.getAllArea(val)
      }
    },
  },
  created() {},
  mounted() {
    this.loadMap()
  },
  methods: {
    async loadMap() {
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
                center: [this.lng, this.lat],
                zoom: 16,
              })
            }
            this.map.setCenter([this.lng, this.lat])
            this.map.addControl(new AMap.Scale())
            this.map.addControl(new AMap.Geolocation())
            this.map.addControl(new AMap.MapType())
            this.map.addControl(new AMap.ToolBar({ position: 'LT' }))

            // 添加点标记
            if (this.lng && this.lat) {
              let marker = new AMap.Marker({
                position: new AMap.LngLat(this.lng, this.lat),
                title: '车辆-' + this.device_no,
              })
              this.map && this.map.add(marker)
            }

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
        if (item.points !== this.value) {
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
                if (!this.value) {
                  // !如果新建区域，则无法定位之前的围栏区域，默认设置地图中心为已有的骑行区域
                  this.map.setCenter([lng, lat])
                }
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
  destroyed() {},
}
</script>
<style>
.amap-sug-result {
  z-index: 9999;
}
</style>
<style lang="less" scoped>
.input_search {
  width: 100%;
  height: 36px;
  padding: 5px;
}
</style>
