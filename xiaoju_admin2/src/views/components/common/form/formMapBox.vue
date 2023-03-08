<template>
  <Row>
    <i-col>
      <Input v-model="value" :placeholder="placeholder" :disabled="true" style="width: 200px;margin-right:5px;">
        <div slot="append">
          <Button type="ghost" :disabled="disabled" @click="openModel">编辑</Button>
        </div>
      </Input>
    </i-col>
    <Modal class-name="vertical-center-modal" title="地图区域" v-model="modal" width="720"  :footer-hide="true" :scrollable="false" :draggable="false">
      <Row>
        <!-- <input id="tipinput" class="input_search" /> -->
        <Input element-id="tipinput" v-model="keywordName" placeholder="请输入具体地址名称" search enter-button="搜索" @on-search="search" />
      </Row>
      <br />
      <i-col style="">
        <div :id="uuid()" :style="{ height: config.height + 'px' }"></div>
      </i-col>
      <br />
      <Row justify="space-around">
        <Col :span="14">
          <Button type="success" @click="addPoly">添加区域</Button>
          <Button type="warning" @click="delPoly">删除区域</Button>
          <Button type="error" @click="clearPoly">清理区域</Button>
        </Col>
        <Col :span="10">
          <span style="margin-right:10px">一共{{ count }}个区域</span>
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
  name: 'formMapBox',
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
      AMap: null,
      map: null,
      polyEditor: null,
      // 高德地图key
      amapkey: '728738a7d077c8125905b04e7eb28715',
      autocomplete: '',
      keywordName: '',
      lnglat: '',
      address: '',
      containerId: '',
      polygonArr: [], // 多边形集合
      modal: false,
      isInit: false,
    }
  },
  computed: {
    count() {
      let count = this.polygonArr.length || 0
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
    },
    uuid() {
      if (!this.containerId) {
        this.containerId = 'containerId_' + Math.ceil(Math.random() * 1000)
      }
      return this.containerId
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
            plugins: [], // 需要加载的 AMapUI ui插件
          },
          // Loca: {
          //   // 是否加载 Loca， 缺省不加载
          //   version: '1.3.2', // Loca 版本，缺省 1.3.2
          // },
        })
          .then((AMap) => {
            this.AMap = AMap
            if (!this.map) {
              this.map = new AMap.Map(this.uuid(), {
                zoom: 12,
              })
            }
            this.map.addControl(new AMap.Scale())
            this.map.addControl(new AMap.Geolocation())
            this.map.addControl(new AMap.MapType())
            this.map.addControl(new AMap.HawkEye({ isOpen: false }))
            this.map.addControl(new AMap.ToolBar({ position: 'LT' }))

            // 地图点击
            this.map.on('click', function(ev) {
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
            AMap.plugin(['AMap.AutoComplete', 'AMap.PlaceSearch'], () => {
              let autoOptions = {
                // 城市，默认全国
                city: '全国',
                // 使用联想输入的input的id
                input: 'tipinput',
              }
              this.autocomplete = new AMap.AutoComplete(autoOptions)
              this.autocomplete.on('select', (e) => {
                //TODO 针对选中的poi实现自己的功能
                console.log('autocomplete select', e)
                let lnglat = e.poi.location
                this.map.setCenter(lnglat)
              })
            })

            // 加载多边形
            let varr = this.value.split('|')
            let poArr = []
            for (let i = 0; i < varr.length; i++) {
              const element = varr[i]
              if (element) {
                let pathArr = []
                let paths = element.split(';') || []
                // 组合path
                for (let ii = 0; ii < paths.length; ii++) {
                  const lnglat = paths[ii]
                  let lng = lnglat.split(',')[0]
                  let lat = lnglat.split(',')[1]
                  let path = new AMap.LngLat(lng, lat)
                  pathArr.push(path)
                }
                let polygon = new AMap.Polygon({
                  path: pathArr,
                  zIndex: 50,
                })
                polygon.setOptions(this.polygonStyle)
                polygon.on('dblclick', () => {
                  this.polyEditor.setTarget(polygon)
                  this.polyEditor.open()
                })
                poArr.push(polygon)
              }
            }
            this.polygonArr = poArr || []
            // 多边形添加到地图
            this.map.add(this.polygonArr)
            console.log('polygonArr', this.polygonArr)

            // 创建多边形编辑器
            this.polyEditor = new AMap.PolygonEditor(this.map)
            // 添加多边形到编辑器
            this.polyEditor.addAdsorbPolygons(this.polygonArr)
            this.polyEditor.on('add', (data) => {
              console.log('polyEditor add', data)
              let polygon = data.target
              polygon.setOptions(this.polygonStyle)
              this.polyEditor.addAdsorbPolygons(polygon)
              polygon.on('dblclick', () => {
                this.polyEditor.setTarget(polygon)
                this.polyEditor.open()
              })
              polygon.on('rightclick', () => {
                this.polyEditor.close()
              })
              this.polygonArr.push(polygon)
            })

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
    // 添加多边形
    addPoly() {
      this.polyEditor.close()
      this.polyEditor.setTarget()
      this.polyEditor.open()
    },
    // 删除多边形
    delPoly() {
      // 删除编辑的多边形
      let polygon = this.polyEditor.getTarget()
      console.log('delPoly polygon', polygon)
      if (polygon && polygon != undefined) {
        this.polyEditor.removeAdsorbPolygons(polygon)
        this.polyEditor.close()
        let xxll = []
        this.polygonArr.forEach((element) => {
          if (element == polygon) {
            this.map.remove(polygon)
          } else {
            xxll.push(element)
          }
        })
        this.polygonArr = xxll
      }
    },
    // 清理多边形
    clearPoly() {
      // 清理所有多边形
      this.polyEditor.clearAdsorbPolygons()
      this.polygonArr.forEach((element) => {
        this.map.remove(element)
      })
      this.polygonArr = []
    },

    // 保存数据
    savePath() {
      this.polyEditor.close()
      let points = ''
      this.polygonArr.forEach((element) => {
        let path = element.getPath()
        let pots = path.join(';')
        if (pots) {
          points += pots + '|'
        }
      })
      console.log('savePath', points)
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
