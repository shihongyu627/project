<template>
  <div style="margin-top:2px">
    <Row :gutter="1" style="margin:10px;" class="map_header">
      <Col span="8">
        <FormAddress
          @on-change="
            (val) => {
              onAddressChange(val, '')
            }
          "
        ></FormAddress>
      </Col>
      <Col span="4">
        <Input placeholder="车辆编号" v-model="query.device_no" clearable></Input>
      </Col>
      <Col span="4">
        <Select v-model="query.shop_id" @on-change="onChangeShop" placeholder="所属商家" clearable>
          <Option v-for="item in shopList" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Select v-model="query.store_id" @on-change="onChangeStore" placeholder="投放区域" clearable>
          <Option v-for="item in storeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Button type="primary" icon="search" @click="search(0)">搜索</Button>
      </Col>
    </Row>
    <Row style="position:absolute;margin: 15px 80px; z-index:8888; border: 1px solid #ddd; border-radius: 4px;width: auto;background: #cccccc90;flex-direction: column;padding: 4px;padding-left: 8px;">
      <div style="display: flex;align-items: center;">
        <Tag type="" color="#41b59a" style="width:100px;">单&nbsp;&nbsp; &nbsp;车：{{ searchInfo.device1_count_sum }}</Tag>
        <Tag type="dot" color="#41b59a" style="width:100px;">在线：{{ searchInfo.device1_count_online_sum }}</Tag>
        <Tag type="dot" color="#707070" style="width:100px;">离线：{{ searchInfo.device1_count_offline_sum }}</Tag>
        <Tag type="dot" color="#ddd" style="width:100px;">零电：{{ searchInfo.device1_count_battery0_sum }}</Tag>
      </div>
      <div style="display: flex;align-items: center;">
        <Tag type="" color="#fb9924" style="width:100px;">电动车：{{ searchInfo.device2_count_sum }}</Tag>
        <Tag type="dot" color="#fb9924" style="width:100px;">在线：{{ searchInfo.device2_count_online_sum }}</Tag>
        <Tag type="dot" color="#707070" style="width:100px;">离线：{{ searchInfo.device2_count_offline_sum }}</Tag>
        <Tag type="dot" color="#ddd" style="width:100px;">零电：{{ searchInfo.device2_count_battery0_sum }}</Tag>
      </div>
    </Row>
    <Row>
      <Col :style="{ width: '100%', height: config.height + 'px' }">
        <div
          :id="uuid()"
          :style="{
            height: config.height + 'px',
            width: '100%',
            position: 'initial',
          }"
        ></div>
      </Col>
    </Row>
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import FormAddress from '../components/common/form/formAddress'
import { Switch, Tag } from 'view-design'
export default {
  components: {
    FormAddress,
  },
  data() {
    return {
      amap: null,
      map: null,
      // 高德地图key
      amapkey: '728738a7d077c8125905b04e7eb28715',
      infoWindow: null,
      shopList: [],
      storeList: [],
      query: {
        keywords: '',
        device_no: '',
        shop_id: '',
        store_id: '',
        store_name: '',
      },
      config: {
        height: '',
      },
      searchArr: [],
      searchInfo: {},
      device_no: '',
    }
  },
  created() {},
  async mounted() {
    // 获取屏幕尺寸
    let box = document.querySelector('.single-page-con').getBoundingClientRect()
    let map_header = document.querySelector('.map_header').getBoundingClientRect()
    console.log(box)
    height = box.height
    width = box.width
    this.config = {
      height: height - map_header.height - 100,
    }
    await this.loadMap()
  },
  methods: {
    onAddressChange(val, field) {
      console.log(val, 'xxxxxx')
      let province = val.province || {}
      let city = val.city || {}
      let district = val.area || {}
      console.log(val.province)
      this.query.province_code = province.code || ''
      this.query.city_code = city.code || ''
      this.query.district_code = district.code || ''
      console.log('addressChange fieldobj', this.query)
    },
    search(style = 1) {
      console.log('query', this.query)
      let d = {}
      d.shop_id = this.query.shop_id || ''
      d.store_id = this.query.store_id || ''
      d.device_no = this.query.device_no || ''
      d.province_code = this.query.province_code || ''
      d.city_code = this.query.city_code || ''
      d.district_code = this.query.district_code || ''
      d.page = 1
      d.psize = 1000
      $utils.api.load('searchDevice', d).then((res) => {
        if (res.data) {
          let arr = []
          this.searchInfo = res.data || {}
          let results = res.data.list || []
          results.map((item) => {
            if (item && item.lng) {
              let a = {}
              a.location = [item.lng, item.lat]
              a.name = item.name
              a.device_no = item.device_no
              a.type = item.type
              a.online_status = item.online_status
              arr.push(a)
            }
          })
          console.log('searchArr', arr)
          this.searchArr = arr
          // let device_no = results || []
          // if (device_no.length > 0) {
          //   this.device_no = device_no[0].name || ''
          // }
          this.loadMarker()
        }
      })
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
            'AMap.Geolocation',
            'AMap.MapType',
            //'AMap.HawkEye',
            'AMap.PolygonEditor',
            'AMap.PolylineEditor',
            'AMap.Scale',
            'AMap.PlaceSearch',
            'AMap.Autocomplete',
          ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
          AMapUI: {
            // 是否加载 AMapUI，缺省不加载
            version: '1.1', // AMapUI 缺省 1.1
            plugins: [], // 需要加载的 AMapUI ui插件
          },
        })
          .then((AMap) => {
            this.AMap = AMap
            if (!this.map) {
              this.map = new AMap.Map(this.uuid(), {
                zoom: 12,
                center: [112, 30],
              })
            }
            this.map.addControl(new AMap.Scale())
            this.map.addControl(new AMap.Geolocation())
            this.map.addControl(new AMap.MapType())
            //this.map.addControl(new AMap.HawkEye({ isOpen: false }))
            this.map.addControl(new AMap.ToolBar({ position: 'LT' }))

            AMap.plugin('AMap.Geolocation', () => {
              let geolocation = new AMap.Geolocation({
                // 是否使用高精度定位，默认：true
                enableHighAccuracy: true,
                // 设置定位超时时间，默认：无穷大
                timeout: 10000,
                // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                buttonOffset: new AMap.Pixel(10, 20),
                //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                zoomToAccuracy: true,
                //  定位按钮的排放位置,  RB表示右下
                buttonPosition: 'RB',
              })
              geolocation.getCurrentPosition((status, result) => {
                if (status == 'complete') {
                  // data是具体的定位信息
                  let position = result.position
                  this.map.setCenter([position.lng, position.lat])
                  this.search(2, position.lat + ',' + position.lng)
                } else {
                  // 定位出错
                  // onError(result)
                }
              })
            })
            this.search()
            this.shopDropList()
          })
          .catch((err) => {
            console.log('loadmap catch', err)
          })
      } catch (error) {
        console.log('loadmap error', error)
      }
    },
    loadMarker() {
      let _this = this
      // 加载锚点
      var lnglats = this.searchArr || []
      let oldMarkerArr = []
      // 移除旧点
      _this.map.remove(this.oldMarkerArr || [])
      for (var i = 0, marker; i < lnglats.length; i++) {
        let device_info = lnglats[i]
        if (!device_info.location) {
          continue
        }
        if (!device_info.location[0] || !device_info.location[1]) {
          continue
        }
        if (parseFloat(device_info.location[0] + '') == 0 || parseFloat(device_info.location[1] + '') == 0) {
          continue
        }
        let icon = require('../../assets/icon/icon_map1.png')
        switch (device_info.type) {
          case 1:
            if (device_info.online_status == 1) {
              icon = require('../../assets/icon/car_type1.png')
            } else {
              icon = require('../../assets/icon/car_type1_no.png')
            }
            break
          case 2:
            if (device_info.online_status == 1) {
              icon = require('../../assets/icon/car_type2.png')
            } else {
              icon = require('../../assets/icon/car_type2_no.png')
            }
            break
          default:
            break
        }
        var marker = new AMap.Marker({
          position: device_info.location,
          icon: new this.AMap.Icon({
            // 图标尺寸
            size: new this.AMap.Size(42, 42),
            // 图标的取图地址
            image: icon,
            // 图标所用图片大小
            imageSize: new this.AMap.Size(42, 42),
          }),
          offset: new AMap.Pixel(-21, -42),
          map: _this.map,
          extData: { device_no: device_info.device_no, name: device_info.name, location: device_info.location },
        })
        marker.on('click', (e) => {
          console.log(e.target.getExtData().device_no, '123465')
          let q = {}
          q.device_id = ''
          q.device_no = e.target.getExtData().device_no || ''
          $utils.api
            .load('deviceQuery', q)
            .then((res) => {
              console.log(res)
              if (res.data) {
                //在指定位置打开信息窗体
                var infoWindow
                //构建信息窗体中显示的内容
                var info = []
                let data = res.data
                info.push(
                  `<div style="margin-top:5px;display:flex;justify-content: flex-start;width:480px"><div style="flex:1">车辆编号 : ${data.device_no}</div><div style="flex:1">车辆名称 : ${data.name}</div></div>`
                )
                info.push(
                  `<div style="margin-top:5px;display:flex;justify-content: flex-start;width:480px"><div style="flex:1">产品名称 : ${data.product_name}</div><div style="flex:1">车辆类型 : ${data.device_type_name}</div></div>`
                )
                info.push(
                  `<div style="margin-top:5px;display:flex;justify-content: flex-start;width:480px"><div style="flex:1">所属商家 : ${data.shop.shop_name}</div><div style="flex:1">投放区域 : ${data.store.store_name}</div></div>`
                )
                info.push(
                  `<div style="margin-top:5px;display:flex;justify-content: flex-start;width:480px"><div style="flex:1">车辆状态 : ${data.online_status_name}</div><div style="flex:1">车锁状态 : ${data.lock_status_name}</div></div>`
                )
                info.push(
                  `<div style="margin-top:5px;display:flex;justify-content: flex-start;width:480px"><div style="flex:1">GPS信号 : ${data.gps_s}</div><div style="flex:1">车辆电量 : ${data.battery_vv}V/${data.battery_rr}</div></div>`
                )
                info.push(
                  `<div style="margin-top:5px;display:flex;justify-content: flex-start;width:480px"><div style="flex:1">骑行次数 : ${
                    data.order_count
                  }</div><div style="flex:1;">末次定位 : ${data.location_time || ''}</div></div>`
                )
                info.push(
                  `<div style="margin-top:5px;display:flex;justify-content: flex-start;width:480px"><div style="flex:1">经纬度 : ${data.lng + ',' + data.lat}</div><div style="flex:1">当前位置 : ${
                    data.address
                  }</div></div>`
                )
                infoWindow = new this.AMap.InfoWindow({
                  content: info.join(''), //使用默认信息窗体框样式，显示信息内容
                  offset: new AMap.Pixel(16, -20),
                })
                console.log(e.target.getExtData().location, 5555)
                infoWindow.open(_this.map, e.target.getExtData().location)
                function closeInfo() {
                  console.log(123465)
                  infoWindow.close()
                }
              }
            })
            .catch((e) => {
              console.log(e)
              $utils.toast.error('数据异常')
            })
        })
        oldMarkerArr.push(marker)
      }
      // 保存旧点
      this.oldMarkerArr = oldMarkerArr || []
      _this.map.setFitView(oldMarkerArr)
    },
    //查询商家
    shopDropList() {
      let q = {}
      let apiname = 'shopDropList'
      $utils.api.load(apiname, q).then((res) => {
        if (res && res.data) {
          let ll = res.data
          let dropList = []
          let shop_id_arr = []
          for (let index = 0; index < ll.length; index++) {
            const element = ll[index]
            let xx = {}
            xx.value = element.value
            xx.name = element.name
            dropList.push(xx)
            shop_id_arr.push(element.value)
          }
          this.shopList = dropList
          console.log(this.shopList, '查询商家')
          // !查询所有商家的区域骑行/停车区域
          this.loadAllArea({
            shop_id: shop_id_arr.join(','),
          })
        }
      })
    },
    //商家变化
    onChangeShop(val) {
      this.query.shop_id = val
      console.log(val, '商家store_id')
      this.shopStoreDropList(val)
    },
    //区域变化
    onChangeStore(val) {
      this.query.store_id = val
      for (let index = 0; index < this.storeList.length; index++) {
        const element = this.storeList[index]
        if (element.value == val) {
          this.query.store_name = element.name
        }
      }
      if (!val) {
        this.query.store_name = ''
      }
      console.log(val, '区域')
    },
    //查询区域
    shopStoreDropList(shop_id) {
      let q = {}
      let apiname = ''
      q.shop_id = shop_id
      apiname = 'shopStoreDropList'
      this.storeList = []
      $utils.api.load(apiname, q).then((res) => {
        if (res && res.data) {
          let ll = res.data
          let dropList = []
          for (let index = 0; index < ll.length; index++) {
            const element = ll[index]
            let xx = {}
            xx.value = element.value
            xx.name = element.name
            dropList.push(xx)
          }
          this.storeList = dropList
          console.log(this.storeList, '区域列表')
        }
      })
    },
    // 查询商家区域
    async getAllArea(query = {}) {
      // 获取全部围栏区域
      let area_list = []
      let d = query || {}
      let res = await $utils.api.load('storeAreaAllArea', d)
      if (res) {
        area_list = res.data || []
        console.log('storeAreaAllArea ll:', area_list)
        this.area_list = area_list
      }
      return area_list
    },
    async loadAllArea(query = {}) {
      let area_list = await this.getAllArea(query)
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
}
</script>
<style lang="less" scoped>
.map_header {
  position: initial;
  padding: 0px;
  background-color: #fff;
  width: 100%;
  z-index: 888;
}
.box-item {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid #f20;
  margin: 10px;
  text-align: center;
  line-height: 32px;
}
</style>
