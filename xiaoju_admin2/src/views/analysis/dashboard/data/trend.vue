<template>
  <Card class="data-card-box">
    <p slot="title">{{ title }}</p>
    <p slot="extra">
      <DatePicker @on-change="onChangeData" class="dataPicker" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px" :options="optionsData" v-model="data"></DatePicker>
      <Select v-model="shop_name" @on-change="onChangeShop" placeholder="请选择商家" style="width:120px" clearable>
        <Option v-for="item in shopList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Select v-model="store_name" @on-change="onChangeStore" style="width:120px" placeholder="请选择区域" clearable>
        <Option v-for="item in storeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Button icon="ios-search" type="success" @click="search" style="width:100px">搜索</Button>
      <Button icon="ios-close-circle" type="default" @click="clearFilter" style="width:100px">重置</Button>
    </p>
    <div :style="{ width: '100%', height: height }" :id="uuid"></div>
  </Card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'trend',
  data() {
    return {
      id: null,
      chart: null,
      xAxisArr: [],
      shopList: [],
      storeList: [],
      shop_name: '',
      store_name: '',
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
      default: '骑行统计图',
    },
    height: {
      type: String,
      default: '340px',
    },
  },
  computed: {
    uuid() {
      if (!this.id) {
        this.id = 'chart_data_id' + Math.ceil(Math.random() * 1000)
      }
      return this.id
    },
  },
  mounted() {
    this.search()
    this.shopDropList()
    //当前日期
    this.$nextTick(() => {
      this.chart = echarts.init(document.getElementById(this.uuid), 'light')
      const option = {
        title: {
          text: '',
          subtext: '',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['骑行次数', '订单费用', '单车数量', '电动车数量', '商家数量', '区域数量'],
          left: 'center',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        // dataset: {
        //   // 提供一份数据。
        //   source: [
        //     ["value", "PV"],
        //     ["ios", 2103456],
        //     ["android", 1305923],
        //     ["pc", 543250],
        //     ["web", 798403],
        //     ["others", 302340],
        //   ],
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisArr || [],
        },
        // 声明一个 Y 轴，数值轴。
        yAxis: [{ type: 'value' }],
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [
          // {
          //   name: "骑行次数",
          //   type: "line",
          //   stack: "总量",
          //   data: [120, 132, 101, 134, 90, 230, 210],
          // },
          // {
          //   name: "订单费用",
          //   type: "line",
          //   stack: "总量",
          //   data: [120, 132, 101, 134, 90, 230, 210],
          // },
          // {
          //   name: "单车数量",
          //   type: "line",
          //   stack: "总量",
          //   data: [120, 132, 101, 134, 90, 230, 210],
          // },
          // {
          //   name: "商家数量",
          //   type: "line",
          //   stack: "总量",
          //   data: [120, 132, 101, 134, 90, 230, 210],
          // },
          // {
          //   name: "区域数量",
          //   type: "line",
          //   stack: "总量",
          //   data: [120, 132, 101, 134, 90, 230, 210],
          // },
        ],
      }
      this.chart.setOption(option)
      window.addEventListener('resize', () => {
        this.chart.resize()
      })
    })
  },
  methods: {
    initData() {
      // c
    },
    //查询商家
    shopDropList() {
      let q = {}
      let apiname = 'shopDropList'
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
          this.shopList = dropList
          console.log(this.shopList, '查询商家')
        }
      })
    },
    //日期变化
    onChangeData(val) {
      let startData = val[0] || 0
      let endData = val[1] || 0
      let s_time = $utils.time.timestamp(startData)
      let e_time = $utils.time.timestamp(endData)
      this.s_time = s_time
      this.e_time = e_time
      console.log('日期变化', val)
    },
    //商家变化
    onChangeShop(val) {
      this.shop_id = val
      console.log(val, '商家store_id')
      this.shopStoreDropList(val)
    },
    //区域变化
    onChangeStore(val) {
      this.store_id = val
      console.log(val, '区域')
    },
    //查询区域
    shopStoreDropList(shop_id) {
      let q = {}
      let apiname = ''
      q.shop_id = shop_id
      apiname = 'shopStoreDropList'
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
    //搜索
    search() {
      // s_time = 0, e_time = 0  store_id store_id
      let q = {}
      q.starttime = this.s_time
      q.endtime = this.e_time
      q.shop_id = this.shop_id
      q.store_id = this.store_id
      this.chart && this.chart.showLoading()
      $utils.api
        .load('analysisCountDataTotal', q, 'post', {
          toast: false,
          toasterror: false,
          loading: false,
          loadingtext: 'Loading',
          login: false,
        })
        .then((res) => {
          if (res.code > 0) {
            let obj = res.data
            Object.keys(obj)
            let order_money_arr = []
            let order_count_arr = []
            let device1_count_arr = []
            let device2_count_arr = []
            let shop_count_arr = []
            let store_count_arr = []
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const element = obj[key]
                order_money_arr.push(element.order_money)
                order_count_arr.push(element.order_count)
                device1_count_arr.push(element.device1_count)
                device2_count_arr.push(element.device2_count)
                shop_count_arr.push(element.shop_count)
                store_count_arr.push(element.store_count)
              }
            }
            this.xAxisArr = Object.keys(obj)
            this.chart.setOption({
              xAxis: {
                type: 'category',
                boundaryGap: false,
                triggerEvent: true,
                data: this.xAxisArr || [],
              },
              series: [
                {
                  name: '骑行次数',
                  type: 'line',
                  stack: '',
                  data: order_count_arr,
                },
                {
                  name: '订单费用',
                  type: 'line',
                  stack: '',
                  data: order_money_arr,
                },
                {
                  name: '单车数量',
                  type: 'line',
                  stack: '',
                  data: device1_count_arr,
                },
                {
                  name: '电动车数量',
                  type: 'line',
                  stack: '',
                  data: device2_count_arr,
                },
                {
                  name: '商家数量',
                  type: 'line',
                  stack: '',
                  data: shop_count_arr,
                },
                {
                  name: '区域数量',
                  type: 'line',
                  stack: '',
                  data: store_count_arr,
                },
              ],
            })
            // 折现设置点击事件，点击查询当天日期的每小时数据
            this.chart.on('click', (params) => {
              console.log(params.name, params)
              // 日期
              if (params.name.length == 10) {
                this.s_time = $utils.time.timestamp(params.name)
                this.e_time = $utils.time.timestamp(params.name)
                this.search()
              }
              // 当componentType == "xAxis"或者 ==“yAxisx”时，取被点击时坐标轴的值params.value
              // alert("单击了"+params.componentType+"x轴标签"+params.value);
              // if(params.componentType == "xAxis"){
              //     alert("单击了"+params.value+"x轴标签");
              // }else if (params.componentType == "yAxis") {
              //     alert("单击了"+params.value+"y轴标签");
              // }
              // else{
              //     alert("单击了"+params.name+"柱状图"+params.value);
              // }
            })
          }
          this.chart && this.chart.hideLoading()
        })
        .catch((e) => {
          console.log(e)
          $utils.toast.error('数据异常' + e.message)
          this.chart && this.chart.hideLoading()
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
