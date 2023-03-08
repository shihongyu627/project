<template>
  <Row>
    <i-col>
      <Input v-model="value" :placeholder="placeholder" :disabled="true" style="width: 200px;margin-right:5px;">
        <div slot="append">
          <Button type="ghost" :disabled="disabled" @click="openModel">编辑</Button>
        </div>
      </Input>
    </i-col>
    <Modal class-name="vertical-center-modal" :title="title" v-model="modal" width="720" :fullscreen="isFull" :footer-hide="true" :scrollable="false" :draggable="false">
      <Row>
        <!-- <input id="tipinput" class="input_search" /> -->
        <Input element-id="tipinput" v-model="keywordName" placeholder="请输入具体地址名称" search enter-button="搜索" @on-search="search" />
      </Row>
      <br />
      <i-col style="">
        <div :id="uuid()" :style="{ height: (isFull ? windowHight - 200 : config.height) + 'px' }"></div>
      </i-col>
      <br />
      <Row justify="space-around">
        <Col :span="14">
          <Button type="success" @click="addPoly">编辑区域</Button>
          <Button type="error" @click="clearPoly">清理区域</Button>
        </Col>
        <Col :span="10">
          <span style="margin-right:10px"></span>
          <Button type="success" @click="fullModel">全屏</Button>
          <Button type="default" @click="closeModel">关闭</Button>
          <Button type="primary" @click="savePath">保存</Button>
        </Col>
      </Row>
    </Modal>
  </Row>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  name: 'formMapArea',
  components: {},
  props: {
    value: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    info: {
      type: Object,
      default: () => {
        return {}
      },
    },
    store_id: {
      type: Number,
      default: 0,
    },
    keyword: {
      type: String,
      default: '',
    },
    type: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default: () => {
        return {
          height: 500,
        }
      },
    },
    polygonStyle: {
      type: Object,
      default: () => {
        return {
          fillColor: 'green', // 多边形填充颜色
          borderWeight: 1, // 线条宽度，默认为 1
          strokeColor: 'green', // 线条颜色
        }
      },
    },
  },
  data() {
    return {
      title: '地图区域',
      AMap: null,
      map: null,
      polyEditor: null,
      polygon: null, // 多边形点集合
      // 高德地图key
      amapkey: '728738a7d077c8125905b04e7eb28715',
      autocomplete: '',
      keywordName: '',
      lnglat: '',
      address: '',
      containerId: '',
      modal: false,
      isInit: false,
      isFull: false,
      windowHeight: window.innerHeight,
      area_list: [], // 全部围栏区域
    }
  },
  computed: {
    count() {
      let count = 0 || 0
      return count
    },
  },
  watch: {
    value(val) {
      if (!this.isInit && val) {
        this.isInit = true
      }
    },
    keyword(val) {
      if (val) {
        this.search(val)
      }
    },
    store_id(val) {
      if (val) {
        this.getAllArea(val)
      }
    },
    info(val) {
      if (val) {
        this.title = '地图围栏 - ' + (val.type == 1 ? '骑行区域' : '停车区域')
      }
    },
  },
  created() {},
  async mounted() {},
  methods: {
    async openModel() {
      this.modal = true
      await this.loadMap()
    },
    closeModel() {
      this.modal = false
      if(this.polygon){
        console.log(this.polygon.getPath(), 999)
      }
    },
    fullModel() {
      console.log('height', window.innerHeight)
      this.windowHight = window.innerHeight
      this.isFull = !this.isFull
    },
    uuid() {
      if (!this.containerId) {
        this.containerId = 'containerId_' + Math.ceil(Math.random() * 1000)
      }
      return this.containerId
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
    async loadMap() {
      try {
        AMapLoader.load({
          key: this.amapkey, // 申请好的Web端开发者Key，首次调用 load 时必填
          version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: [
            'AMap.ToolBar',
            'AMap.MouseTool',
            'AMap.Geocoder',
            'AMap.Geolocation',
            'AMap.MapType',
            'AMap.HawkEye',
            'AMap.PolygonEditor',
            'AMap.PolylineEditor',
            'AMap.Scale',
            'AMap.PlaceSearch',
            'AMap.AutoComplete',
          ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
          AMapUI: {
            // 是否加载 AMapUI，缺省不加载
            version: '1.1', // AMapUI 缺省 1.1
            plugins: ['misc/PoiPicker'], // 需要加载的 AMapUI ui插件
          },
          Loca: {
            // 是否加载 Loca， 缺省不加载
            version: '2.0.0', // Loca 版本，缺省 1.3.2
          },
        })
          .then((AMap) => {
            this.AMap = AMap
            if (!this.map) {
              this.map = new AMap.Map(this.uuid(), {
                zoom: 12,
              })
            } else {
              return
            }
            this.map.addControl(new AMap.Scale())
            this.map.addControl(new AMap.Geolocation())
            this.map.addControl(new AMap.MapType())
            this.map.addControl(new AMap.HawkEye({ isOpen: false }))
            this.map.addControl(new AMap.ToolBar({ position: 'LT' }))

            // 地图点击
            this.map.on('click', function(ev) {
              console.log('map click ev:', ev)
              // 触发事件的对象
              let target = ev.target
              // 触发事件的地理坐标，AMap.LngLat 类型
              let lnglat = ev.lnglat
              console.log('map click lnglat:', lnglat)
              // 触发事件的像素坐标，AMap.Pixel 类型
              let pixel = ev.pixel
              // 触发事件类型
              let type = ev.type
            })

            // 自动搜索
            // AMap.plugin(['AMap.AutoComplete', 'AMap.PlaceSearch'], () => {
            //   let autoOptions = {
            //     // 城市，默认全国
            //     city: '全国',
            //     // 使用联想输入的input的id
            //     input: 'tipinput',
            //   }
            //   this.autocomplete = new AMap.AutoComplete(autoOptions)
            //   //搜索返回的数据
            //   this.autocomplete.on('complete', (e) => {
            //     console.log('autocomplete complete', e)
            //   })
            //   this.autocomplete.on('select', (e) => {
            //     console.log('autocomplete select', e)
            //     if (e && e.poi && e.poi.location) {
            //       let lnglat = e.poi.location
            //       this.map.setCenter(lnglat)
            //     }
            //   })
            // })

            //加载PoiPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
              console.log('ui PoiPicker')
              let poiPicker = new PoiPicker({
                input: 'tipinput', //输入框id
              })
              //监听poi选中信息
              poiPicker.on('poiPicked', (poiResult) => {
                //用户选中的poi点信息
                console.log('poiPicked select', poiResult)
                if (poiResult && poiResult.item && poiResult.item.location) {
                  let lnglat = [poiResult.item.location.lng, poiResult.item.location.lat]
                  this.map.setCenter(lnglat)

                  // 创建一个 Marker 实例：
                  let marker = new AMap.Marker({
                    zIndex: 10000,
                    position: lnglat, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                  })
                  // 绑定事件-双击清除点标记
                  marker.on('dblclick', (ev) => {
                    console.log('marker dblclick ev:', ev)
                    this.map.remove(ev.target)
                  })
                  // 将创建的点标记添加到已有的地图实例：
                  this.map.add(marker)
                }
              })
            })

            // 加载多边形
            let pathArr = []
            let paths = []
            if (this.value) {
              paths = (this.value || '').split(';') || []
            }
            // 组合path
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
            console.log('paths ', paths, pathArr)
            if (paths && pathArr && pathArr.length > 0) {
              // 初始化多边形
              this.polygon = new AMap.Polygon({
                path: pathArr,
                zIndex: 50,
              })
              this.polygon.setOptions(this.polygonStyle)
              this.polygon.on('dblclick', () => {
                this.polyEditor.setTarget(this.polygon)
                this.polyEditor.open()
              })
              // 多边形添加到地图
              this.map.add(this.polygon)
              //自适应地图视角
              this.map.setFitView([this.polygon])
              console.log('polygon 1')
            }

            // 加载围栏区域多边形
            this.loadAllArea()

            // 创建多边形编辑器
            this.polyEditor = new AMap.PolygonEditor(this.map)
            if (this.polygon) {
              // 添加多边形到编辑器
              this.polyEditor.addAdsorbPolygons(this.polygon)
            }
            this.polyEditor.on('add', (data) => {
              console.log('polyEditor add', data)
              this.polygon = data.target
              this.polygon.setOptions(this.polygonStyle)
              this.polyEditor.addAdsorbPolygons(this.polygon)
              this.polygon.on('dblclick', () => {
                this.polyEditor.setTarget(this.polygon)
                this.polyEditor.open()
              })
              this.polygon.on('rightclick', () => {
                this.polyEditor.close()
              })
            })
            console.log('polyEditor 1')

            // 自适应地图视角
            // this.map.setFitView()
          })
          .catch((err) => {
            console.log('loadmap catch', err)
          })
      } catch (error) {
        console.log('loadmap error', error)
      }
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
                if(!this.value){
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
              strokeStyle: 'dashed',  // 	轮廓线样式，实线:solid，虚线:dashed
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
    // 添加多边形
    addPoly() {
      if (this.polygon) {
        this.polyEditor.setTarget(this.polygon)
        this.polyEditor.addAdsorbPolygons(this.polygon)
      } else {
        this.polyEditor.setTarget()
      }
      this.polyEditor.open()
    },
    // 清理多边形
    clearPoly() {
      let that = this
      that.$Modal.confirm({
        title: '清理区域',
        content: '是否清理区域',
        okText: '清理',
        cancelText: '取消',
        onOk: () => {
          // 清理所有多边形
          if (that.polyEditor) {
            that.polyEditor.removeAdsorbPolygons(that.polygon)
            that.polyEditor.clearAdsorbPolygons()
            that.polyEditor.close()
            that.map.remove(that.polyEditor)
            if (that.polygon) {
              that.map.remove(that.polygon)
              that.polygon = null
              //清楚区域时 经纬度为空
              let points = ''
              this.$emit('input', points)
            }
          }
        },
        onCancel: () => {
          // that.$Message.info('Clicked cancel')
        },
      })
    },

    // 保存数据
    savePath() {
      this.polyEditor.close()
      let points = ''
      if (this.polygon) {
        let path = this.polygon.getPath() || []
        let pots = path.join(';')
        if (pots) {
          points = pots
        }
      }
      console.log('savePath points', points)
      this.$emit('input', points)
      this.modal = false
    },
    search(keyword = '') {
      if (!keyword) {
        keyword = this.keywordName
      }
      // 根据关键字进行搜索
      // 自动搜索
      this.AMap.plugin(['AMap.PlaceSearch'], () => {
        let placeSearch = new this.AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: '全国',
        })
        placeSearch.search(keyword, (status, result) => {
          // 查询成功时，result即对应匹配的POI信息
          if (status === 'complete' && result.info === 'OK') {
            // result中对应详细地理坐标信息
            let poi = (result.poiList && result.poiList.pois && result.poiList.pois[0]) || {}
            console.log(status, result, poi)
            let lnglat = poi && poi.location
            if (lnglat) {
              this.map.setCenter(lnglat)
            }
          }
        })
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
