<template>
  <Card class="data-card-box">
    <p slot="title">{{ title }}</p>
    <p slot="extra">
      <DatePicker @on-change="onChangeData" :options="optionsData" class="dataPicker" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px" v-model="data"></DatePicker>
      <Select v-model="shop_name" @on-change="onChangeShop" placeholder="请选择商家" style="width:120px">
        <Option v-for="item in shopList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Select v-model="store_name" @on-change="onChangeStore" style="width:120px" placeholder="请选择区域">
        <Option v-for="item in storeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Button icon="ios-search" type="success" @click="search" style="width:100px">搜索</Button>
      <Button icon="ios-close-circle" type="default" @click="clearFilter" style="width:100px">重置</Button>
    </p>
    <div :style="{ width: '100%', height: height }" id="containers"></div>

  </Card>
</template>

<script>
export default {
  name: 'trend',
  data() {
    return {
      amap: null,
      layer: null,
      shopList: [],
      storeList: [],
      shop_name: '',
      store_name: '',
      // 设置日期
      optionsData: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        },
        shortcuts: [
          {
            text: '本周',
            value() {
              const end = new Date()
              const start = new Date()
              const weekday = start.getDay() || 7 //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
              start.setDate(start.getDate() - weekday + 1) //往前算（weekday-1）天，年份、月份会自动变化
              console.log(start, '本周的第一天')
              // if (start.getDay() == 0) {
              //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              // }
              // if (start.getDay() == 1) {
              //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
              // }
              // if (start.getDay() == 2) {
              //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              // }
              // if (start.getDay() == 3) {
              //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              // }
              // if (start.getDay() == 4) {
              //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              // }
              // if (start.getDay() == 5) {
              //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
              // }
              // if (start.getDay() == 6) {
              //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
              // }
              return [start, end]
            },
          },
          {
            text: '本月',
            value() {
              // const end = new Date();
              const end = new Date()
              var nowMonth = end.getMonth() //当前月
              var nowYear = end.getFullYear() //当前年
              const start = new Date(nowYear, nowMonth, 1)
              console.log(end, '本月开始')
              return [start, end]
            },
          },
          {
            text: '上个月',
            value() {
              const data = new Date()
              var nowMonth = data.getMonth() //当前月
              var nowYear = data.getFullYear() //当前年
              const start = new Date(nowYear, nowMonth - 1, 1)
              const end = new Date(nowYear, nowMonth, 0)
              console.log(start, end, '上个月')
              return [start, end]
            },
          },
        ],
      },
      data: null,
    }
  },
  props: {
    title: {
      type: String,
      default: '骑行热点图',
    },
    extra: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '480px',
    },
  },
  created() {},
  mounted() {
    this.loadMap()
    this.shopDropList()
    let month = new Date().getMonth()
  },
  methods: {
    // 地图显示点
    loadMap() {
       let _this = this;
      window.onLoad = () => {
        _this.amap = new AMap.Map("containers", {
            pitch: 0,
            zoom: 6,
            viewMode: '2D',
        });
        // 尺寸
        AMap.plugin("AMap.ToolBar", function() {
          let toolbar = new AMap.ToolBar();
          _this.amap.addControl(toolbar);
          toolbar.doLocation();
          
        });
        // 下面的小地图
        AMap.plugin("AMap.OverView", function() {
          let OverView = new AMap.OverView();
          _this.amap.addControl(OverView);
        });
        // 卫星  路况
        AMap.plugin("AMap.MapType", function() {
          let MapType = new AMap.MapType();
          _this.amap.addControl(MapType);
        });
        
      };
      let url = "https://webapi.amap.com/maps?v=1.4.14&key=74b2753eb3294de148b0ef3dca8a8a14&callback=onLoad";
      let jsapi = document.createElement("script");
      jsapi.charset = "utf-8";
      jsapi.src = url;
      document.head.appendChild(jsapi);

       let url_two = 'https://webapi.amap.com/loca?v=1.3.2&key=d2fbfcef125c13291212be2337c5f2bf'
      let jsapi_two = document.createElement('script')
      jsapi_two.charset = 'utf-8'
      jsapi_two.src = url_two
      document.head.appendChild(jsapi_two)

      setTimeout(()=>{
        this.loadLayer()
        this.search()
      }, 2000)
      
      // let url_two = 'https://webapi.amap.com/loca?v=1.3.2&key=d2fbfcef125c13291212be2337c5f2bf'
      // let jsapi_two = document.createElement('script')
      // jsapi_two.charset = 'utf-8'
      // jsapi_two.src = url_two
      // document.head.appendChild(jsapi_two)
      // this.amap = new AMap.Map('containers', {
      //   // features: ['bg', 'road'],
      //   // mapStyle: 'amap://styles/1de318cbb8d12c02303a22c550b9ccc9',
      //   // center: [116.397475, 39.908668],
      //   pitch: 0,
      //   zoom: 6,
      //   viewMode: '2D',
      // })
      // setTimeout(()=>{
      //   this.loadLayer()
      //   this.search()
      // }, 2000)
    },
    loadLayer(list = []) {
      if (!window.Loca) {
        console.warn('Amap Loca 未加载')
        return
      }
      this.layer = new Loca.HeatmapLayer({
        map: this.amap,
      })
      // var list = []
      // var i = -1
      // var length = heatmapData.length
      // while (++i < length) {
      //   var item = heatmapData[i]
      //   list.push({
      //     lnglat: [item.lng, item.lat],
      //     count: item.count,
      //   })
      // }

      this.layer.setData([], {
        lnglat: 'lnglat',
        value: 'count',
      })
      this.layer.setOptions({
        style: {
          radius: 16,
          color: {
            0.5: '#2c7bb6',
            0.6: '#abd9e9',
            0.7: '#ffffbf',
            0.9: '#fde468',
            1.0: '#d7191c',
          },
        },
      })
      this.layer.render()
    },
    // 商家下拉
    shopDropList() {
      let q = {}
      $utils.api.load('shopDropList', q).then((res) => {
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
          this.shopList = dropList
          console.log(this.shopList, '商家下拉')
        }
      })
    },
    onChangeShop(val) {
      console.log(val, '选择商家')
      this.shop_id = val
      this.shopStoreDropList(val)
    },
    onChangeStore(val) {
      this.store_id = val
      console.log(val, '选择区域')
    },
    // 区域下拉
    shopStoreDropList(shop_id) {
      let q = {}
      q.shop_id = shop_id
      $utils.api.load('shopStoreDropList', q).then((res) => {
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
          console.log(this.storeList, '区域下拉')
        }
      })
    },
    // 选择时间
    onChangeData(val) {
      let startData = val[0] || 0
      let endData = val[1] || 0
      let s_time = $utils.time.timestamp(startData)
      let e_time = $utils.time.timestamp(endData)
      this.s_time = s_time
      this.e_time = e_time
    },
    //重置
    clearFilter() {
      this.s_time = 0
      this.e_time = 0
      this.shop_id = ''
      this.store_id = ''
      this.store_name = ''
      this.shop_name = ''
      this.data = null
      this.search()
    },
    // 搜索
    search() {
      let q = {}
      q.starttime = this.s_time
      q.endtime = this.e_time
      q.shop_id = this.shop_id
      q.store_id = this.store_id
      $utils.api
        .load('analysisHotDataTotal', q, 'post', {
          toast: false,
          toasterror: false,
          loading: false,
          loadingtext: 'Loading',
          login: false,
        })
        .then((res) => {
          let ll = res.data || []
          let list = []
          for (let index = 0; index < ll.length; index++) {
            let e = ll[index]
            e.lnglat = [e.lng, e.lat]
            e.count = 1
            list.push(e)
          }
          if (this.layer) {
            this.layer.setData(list, {
              lnglat: 'lnglat',
              value: 'count',
            })
            this.layer.render()
          } else {
            this.loadLayer()
          }
        })
    },
  },
}
</script>

<style lang="less" scoped>
.data-card-box {
  border-radius: 0px;
  background: #f9f9f9;
  border: 0px solid #efefef;
  margin-top: 20px;
  margin-bottom: 10px;
  .ivu-card-head {
    border-bottom: 1px solid #e8e8e8;
  }
}
</style>
