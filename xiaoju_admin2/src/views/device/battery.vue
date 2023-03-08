<template>
  <div style="width:100%;height:450px;margin-top:0px">
    <Card class="data-card-box">
      <p slot="title">{{ '' }}</p>
      <p slot="extra">
        <DatePicker @on-change="onChangeData" class="dataPicker" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px" :options="optionsData" v-model="data"></DatePicker>
        <Button type="success" @click="syncBatteryData" style="width:100px">同步数据</Button>
      </p>
      <div :style="{ width: '100%', height: height }" :id="uuid"></div>
    </Card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'battery',
  components: {},
  props: {
    device_id: {
      type: String,
      value: '',
    },
    device_no: {
      type: String,
      value: '',
    },
    device_type: {
      type: Number,
      value: '',
    },
    title: {
      type: String,
      default: '电量趋势图',
    },
    height: {
      type: String,
      default: '340px',
    },
  },
  data() {
    return {
      id: 'xxx',
      chart: null,
      xAxisArr: [],
      battery_list: [], // 全部
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
  watch: {
    device_id(val) {
      if (val) {
        this.syncBatteryData()
      }
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
  created() {},
  mounted() {
    //当前日期
    this.$nextTick(() => {
      this.syncBatteryData()
    })
  },
  methods: {
    async syncBatteryData() {
      let q = {}
      q.starttime = this.s_time
      q.endtime = this.e_time
      q.device_id = this.device_id
      let res = await $utils.api.load('deviceBatteryRecordDataSync', q)
      if (res) {
        this.search()
      }
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
    //搜索
    search() {
      // s_time = 0, e_time = 0  store_id store_id
      let q = {}
      q.starttime = this.s_time
      q.endtime = this.e_time
      q.device_id = this.device_id
      this.chart && this.chart.showLoading()
      $utils.api
        .load('deviceBatteryRecordDataTotal', q, 'post', {
          toast: false,
          toasterror: false,
          loading: false,
          loadingtext: 'Loading',
          login: false,
        })
        .then((res) => {
          if (res) {
            let obj = res.data || []
            Object.keys(obj)
            let vvv_arr = []
            let rrr_arr = []
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const element = obj[key]
                vvv_arr.push(element.vvv)
                rrr_arr.push(element.rrr)
              }
            }
            this.xAxisArr = Object.keys(obj)
            if (!this.chart) {
              this.chart = echarts.init(document.getElementById(this.uuid), 'light')
            }
            this.chart.setOption({
              title: {
                text: this.title,
                subtext: '',
              },
              tooltip: {
                trigger: 'axis',
              },
              legend: {
                data: ['电量', '电压'],
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
                  dataView: { readOnly: false },
                  saveAsImage: {},
                },
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                triggerEvent: true,
                data: this.xAxisArr || [],
              },
              yAxis: [
                {
                  type: 'value',
                  name: ' 电量',
                  min: 0,
                  max: 100,
                  axisLabel: {
                    formatter: '{value} %',
                  },
                },
                {
                  type: 'value',
                  name: ' 电压',
                  min: 0,
                  max: this.device_type == 1 ? 6 : 60,
                  axisLabel: {
                    formatter: '{value} v',
                  },
                },
              ],
              series: [
                {
                  name: '电量',
                  type: 'line',
                  stack: '',
                  yAxisIndex: 0,
                  data: rrr_arr,
                },
                {
                  name: '电压',
                  type: 'line',
                  stack: '',
                  yAxisIndex: 1,
                  data: vvv_arr,
                },
              ],
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
  destroyed() {},
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
