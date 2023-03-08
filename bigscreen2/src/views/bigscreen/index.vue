<template>
  <div class="big_box">
    <div class="nav_box">
      <div class="date_box">
        {{date}} {{week}} {{nowTime}}
      </div>
      <div class="title">青海省医保电子凭证信息数字大屏<dv-decoration-5 :color="['#4189F0', '#4189F0']" class="dv-decoration-5" /></div>
    </div>
    <div class="main_box">
      <div class="left_box">
        <div class="item item_top">
          <!-- <dv-border-box-1> -->
          <!-- <div class="t_box"><span class="h-title"><em class="e1" />两定机构终端部署排行TOP10</span></div> -->
          <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">两定机构终端部署排行TOP10</span></span></div>
          <dv-scroll-board :config="device_deploy_rank" style="width:473px;height:169px;margin: 10px auto 0;" />
          <!-- </dv-border-box-1> -->
        </div>
        <div class="item item_center">
          <!-- <dv-border-box-1> -->
          <!-- <div class="t_box"><span class="h-title"><em class="e1" />终端运行状态</span></div> -->
          <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">终端运行状态</span></span></div>
          <div class="pie_box">
            <div class="circle_small" />
            <dv-active-ring-chart :config="device_run_status" style="display:inline-block;width:65%;height:169px;text-align:center;" />
            <div class="legend_box">
              <div class="legend_item online"><span class="item_color" /><span class="item_val">在线中&nbsp;{{device_run_status.data[0] && device_run_status.data[0].value}}台</span></div>
              <div class="legend_item outline"><span class="item_color" /><span class="item_val">离线中&nbsp;{{device_run_status.data[1] && device_run_status.data[1].value}}台</span></div>
              <div />
            </div>
          </div>
          <!-- </dv-border-box-1> -->
        </div>
        <div class="item item_bottom">
          <!-- <dv-border-box-1> -->
          <!-- <div class="t_box"><span class="h-title"><em class="e1" />终端部署情况</span></div> -->
          <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">终端部署情况</span></span></div>
          <div class="data_box">
            <div class="data_case">
              <div class="case_item case_item_top">
                <div class="case1">两定机构部署总数</div>
                <div class="case2 font_def2"><countTo :start-val="0" :end-val="devDeployData[0] && devDeployData[0].value" :duration="3000" separator="," /></div>
              </div>
              <div class="case_item">
                <div class="case1">部署总覆盖率</div>
                <div class="case2 font_def2"><countTo :start-val="0" :end-val="devDeployData[3] && devDeployData[3].value" :duration="3000" separator="," />%</div>
              </div>
            </div>
            <div class="data_case">
              <div class="case_item case_item_top">
                <div class="case1">部署定点医疗机构数</div>
                <div class="case2 case3 font_def2"><countTo :start-val="0" :end-val="devDeployData[1] && devDeployData[1].value" :duration="3000" separator="," /></div>
              </div>
              <div class="case_item">
                <div class="case1">部署定点零售药店数</div>
                <div class="case2 case3 font_def2"><countTo :start-val="0" :end-val="devDeployData[2] && devDeployData[2].value" :duration="3000" separator="," /></div>
              </div>
            </div>
          </div>
          <!-- </dv-border-box-1> -->
        </div>
      </div>
      <div class="center_box">
        <div class="center_top">
          <div class="item">
            <!-- <dv-border-box-1> -->
            <!-- <div class="t_box"><span class="h-title"><em class="e1" />终端累计服务人数</span></div> -->
            <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">终端累计服务人数</span></span></div>
            <div class="count_con font_def">
              <countTo :start-val="service_person_start" :end-val="devTotalServicesPeople[0] && devTotalServicesPeople[0].value" :duration="3000" separator="," />
            </div>
            <!-- </dv-border-box-1> -->
          </div>
          <div class="item item_right">
            <!-- <dv-border-box-1> -->
            <!-- <div class="t_box"><span class="h-title"><em class="e1" />终端累计服务次数</span></div> -->
            <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">终端累计服务次数</span></span></div>
            <div class="count_con count_con2 font_def">
              <countTo :start-val="service_times_start" :end-val="devTotalServicesPeople[1] && devTotalServicesPeople[1].value" :duration="3000" separator="," />
            </div>
            <!-- </dv-border-box-1> -->
          </div>
        </div>
        <div class="center_bottom">
          <!-- <map-box :map-data="mapData" /> -->
          <div v-if="is_flag" class="loop1 loop" />
          <div v-if="!is_flag" class="loop2 loop" />
          <div class="circle_big" />
        </div>
      </div>
      <div class="right_box">
        <div class="item item_top">
          <!-- <dv-border-box-1> -->
          <!-- <div class="t_box"><span class="h-title"><em class="e1" />医保电子凭证激活总数/率</span></div> -->
          <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">医保电子凭证激活总数/率</span></span></div>
          <div class="chart_con">
            <div class="circle_small" style="right:20px;" />
            <div class="pieCon">
              <dv-charts :option="code_active_data" style="width:100%;height:169px;text-align:center;" />
            </div>
            <div class="dataCon">
              <div class="data_item item1">
                <div class="p1">医保电子凭证激活人数</div>
                <div class="p2 font_def3"><countTo :start-val="0" :end-val="ecTotalAndRates[0] && ecTotalAndRates[0].value" :duration="3000" separator="," /></div>
              </div>
              <div class="data_item">
                <div class="p1">参保人数</div>
                <div class="p2 font_def3"><countTo :start-val="0" :end-val="ecTotalAndRates[1] && ecTotalAndRates[1].value" :duration="3000" separator="," /></div>
              </div>
            </div>
          </div>
          <!-- </dv-border-box-1> -->
        </div>
        <div class="item item_center">
          <!-- <dv-border-box-1> -->
          <!-- <div class="t_box"><span class="h-title"><em class="e1" />终端设备使用数据</span></div> -->
          <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">终端设备使用数据</span></span></div>
          <div class="data_box">
            <div class="data_case">
              <div class="case_item case_item_top">
                <div class="case1">凭证激活人数</div>
                <div class="case2 font_def2"><countTo :start-val="0" :end-val="devUsingData[0] && devUsingData[0].value" :duration="3000" separator="," /></div>
              </div>
              <div class="case_item">
                <div class="case1">交易笔数</div>
                <div class="case2 font_def2"><countTo :start-val="0" :end-val="devUsingData[2] && devUsingData[2].value" :duration="3000" separator="," /></div>
              </div>
            </div>
            <div class="data_case">
              <div class="case_item case_item_top">
                <div class="case1">部署终端总数</div>
                <div class="case2 case3 font_def2"><countTo :start-val="0" :end-val="devUsingData[1] && devUsingData[1].value" :duration="3000" separator="," /></div>
              </div>
              <div class="case_item">
                <div class="case1">交易金额</div>
                <div class="case2 case3 font_def2"><countTo :start-val="0" :end-val="devUsingData[3] && devUsingData[3].value" :duration="3000" separator="," /></div>
              </div>
            </div>
          </div>
          <!-- </dv-border-box-1> -->
        </div>
        <div class="item item_bottom">
          <!-- <dv-border-box-1> -->
          <!-- <div class="t_box"><span class="h-title"><em class="e1" />医保电子凭证交易总笔数/率</span></div> -->
          <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">医保电子凭证交易总笔数/率</span></span></div>
          <div class="chart_con">
            <div class="circle_small" style="right:20px;" />
            <div class="pieCon">
              <dv-charts :option="code_deal_data" style="width:100%;height:169px;text-align:center;" />
            </div>
            <div class="dataCon">
              <div class="data_item item1">
                <div class="p1">医保电子凭证交易总笔数</div>
                <div class="p2 p3 font_def3"><countTo :start-val="0" :end-val="ecDealData[0] && ecDealData[0].value" :duration="3000" separator="," /></div>
              </div>
              <div class="data_item">
                <div class="p1">医保交易总笔数</div>
                <div class="p2 p3 font_def3"><countTo :start-val="0" :end-val="ecDealData[1] && ecDealData[1].value" :duration="3000" separator="," /></div>
              </div>
            </div>
          </div>
          <!-- </dv-border-box-1> -->
        </div>
      </div>
    </div>
    <div class="bottom_box">
      <div class="chart_left item">
        <!-- <dv-border-box-1> -->
        <!-- <div class="t_box"><span class="h-title"><em class="e1" />两定机构部署覆盖率/终端服务次数</span></div> -->
        <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">两定机构部署覆盖率/终端服务次数</span></span></div>
        <line-barc :x-data="deployData.datas" :line-data="deployData.lineData" :bar-data="deployData.barData" idstr="linbar_1" :color="lineBar_color_1" :legend-data="deploy_legend"/>
        <!-- </dv-border-box-1> -->
      </div>
      <div class="chart_right item">
        <!-- <dv-border-box-1> -->
        <!--  <div class="t_box"><span class="h-title"><em class="e1" />医保电子凭证交易笔数/交易金额统计</span></div> -->
        <div class="title_box"><span class="title_con"><span class="circle_point">•</span><span class="title_txt">医保电子凭证交易笔数/交易金额统计</span></span></div>
        <line-bar :x-data="dealData.dealDatas" :line-data="dealData.dealLineData" :bar-data="dealData.dealBarData" idstr="linbar_2" :color="lineBar_color_2" :legend-data='deal_legend'/>
        <!-- </dv-border-box-1> -->
      </div>
    </div>
  </div>
</template>

<script>
import lineBar from '@/components/lineBarMix'
import lineBarc from '@/components/lineBarMix2'
import countTo from 'vue-count-to'
import mapBox from '@/components/map'
import api_list from './api/bigScreenData'
export default {
  name: 'Bigscreen',
  components: {
    lineBar,
    lineBarc,
    countTo,
    mapBox
  },
  data() {
    return {
      is_flag: true,
      end_val: 5000,
      nowTime: '',
      week: '',
      date: '',
      timer: null,
      device_deploy_rank: { // 两定机构终端部署排行
        // header: ['医院', '终端数(台)'],
        data: [
          // ['青海大学附属医院', '80台'],
          // ['青海大学附属医院', '80台'],
          // ['青海大学附属医院', '80台'],
          // ['青海大学附属医院', '80台'],
          // ['青海大学附属医院', '80台'],
          // ['青海大学附属医院', '80台'],
          // ['青海大学附属医院', '80台'],
          // ['青海大学附属医院', '80台'],
          // ['青海大学附属医院', '80台'],
          // ['青海大学附属医院', '80台']
        ],
        columnWidth: [50, 300],
        waitTime: 3000,
        index: true,
        rowNum: 3,
        indexHeader: '排名',
        align: ['center', 'left', 'center'],
        headerBGC: '#17266a',
        oddRowBGC: '#080a40',
        evenRowBGC: '#0d1d51',
        carousel: 'page',
        headerHeight: 42
      },
      device_run_status: { // 终端运行状态
        data: [
          // { name: '在线中', value: 678 },
          // { name: '离线中', value: 234 }
        ],
        radius: '70%',
        activeRadius: '80%',
        color: ['#20C3EF', '#E17155'],
        digitalFlopStyle: {
          fontSize: 16,
          fill: '#fff'
        },
        lineWidth: 15
      },
      devDeployData: [], //终端部署情况
      ecTotalAndRates: [], // 医保电子凭证激活总数/率
      ecDealData: [], // 医保电子凭证交易总笔数/率
      devUsingData: [], // 凭证激活人数
      devTotalServicesPeople: [], // 头部终端累计
      dealData: {},
      deployData: {},
      xData: [
        '2021年第25周', '2021年第26周', '2021年第27周', '2021年第28周', '2021年第29周',
        '2021年第30周', '2021年第31周', '2021年第32周', '2021年第33周', '2021年第34周',
        '2021年第35周', '2021年第36周'
      ],
      lineData: [
        1362, 1453, 6655, 2543, 727,
        464, 1159, 8109, 5219, 2223,
        4036, 8165
      ],
      barData: [
        3425, 6985, 9098, 5113,
        921, 7883, 4442, 3553,
        8170, 1147, 1779, 5385
      ],
      lineBar_color_1: ['#C5A33A', '#61CDBD'],
      lineBar_color_2: ['#C5A33A', '#E17155'],
      deal_legend: ['交易笔数', '交易金额'],
      deploy_legend: ['部署覆盖率', '终端服务次数'],
      code_active_data: {
        series: [
          {
            type: 'gauge',
            startAngle: -Math.PI / 2,
            endAngle: Math.PI * 1.5,
            arcLineWidth: 14,
            data: [
              { name: 'itemA', value: 0, gradient: ['#20C3EF'] }
            ],
            axisLabel: {
              show: false
            },
            backgroundArc: {
              style: {
                opacity: 0.1
              }
            },
            radius: '60%',
            axisTick: {
              show: false
            },
            pointer: {
              show: false
            },
            dataItemStyle: {
              lineCap: 'solid'
            },
            details: {
              show: true,
              formatter: '{value}%',
              style: {
                fill: '#fff',
                fontSize: 15
              }
            }
          }
        ]
      },
      code_deal_data: {
        series: [
          {
            type: 'gauge',
            startAngle: -Math.PI / 2,
            endAngle: Math.PI * 1.5,
            arcLineWidth: 14,
            data: [
              { name: 'itemA', value: 70, gradient: ['#D19D03'] }
            ],
            backgroundArc: {
              style: {
                opacity: 0.1
              }
            },
            radius: '60%',
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            pointer: {
              show: false
            },
            dataItemStyle: {
              lineCap: 'solid'
            },
            details: {
              show: true,
              formatter: '{value}%',
              style: {
                fill: '#fff',
                fontSize: 15
              }
            }
          }
        ]
      },
      mapData: [
        {
          'warningType': null,
          'warningTypeStr': '移机',
          'terminalSN': 'qkelCvdgqD',
          'orgName': '重庆人民医院',
          'orgAddress': '江北区',
          'warningDate': '2021-08-12',
          'longitude': '106.5',
          'latitude': '29.1'
        },
        {
          'warningType': null,
          'warningTypeStr': '移机',
          'terminalSN': 'vApgoroDdv',
          'orgName': '重庆人民医院',
          'orgAddress': '江北区',
          'warningDate': '2021-09-09',
          'longitude': '107.5',
          'latitude': '30.1'
        },
        {
          'warningType': null,
          'warningTypeStr': '移机',
          'terminalSN': 'etnCixmgdB',
          'orgName': '重庆人民医院',
          'orgAddress': '江北区',
          'warningDate': '2021-08-26',
          'longitude': '108.5',
          'latitude': '30.1'
        }
      ],
      service_person_start: 0,
      service_times_start: 0,
    }
  },
  mounted() {
    this.autoPlay()
    this.nowTimes()
    this.getdayDataInfo()
    this.getconstantlyInfo()
    this.getbrokenLineTrend()
    setInterval(() => {
      //this.getdayDataInfo()
      this.getconstantlyInfo()
    }, 6000) 
  },
  methods: {
    timeFormate(timeStamp) { //显示当前时间
      let newDate = new Date(timeStamp);
      let year = newDate.getFullYear();
      let month = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
      let date = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate();
      let hh = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours();
      let mm = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes();
      let ss = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
      let week = newDate.getDay();
      let weeks = ['日', '一', '二', '三', '四', '五', '六'];
      let getWeek = '星期' + weeks[week];
      this.week = getWeek;
      this.date = year + '.' + month + '.' + date;
      this.nowTime = hh + ':' + mm + ':' + ss;
    },
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    clear() {
      clearInterval(this.nowTimes)
      this.nowTimes = null;
    },
    autoPlay(){
      setInterval(() => {
        this.is_flag = !this.is_flag
      }, 3000)
    },
    getdayDataInfo(){
      api_list.getdayDataInfo({}).then((res) => {
        //左侧排行TOP10
        var temp = []
        var rank_top10 = res.data.top10
        temp = rank_top10.map((item) => {
          return [item.name, item.value +'台']
        })
        this.device_deploy_rank.data = temp
        this.device_deploy_rank = { ...this.device_deploy_rank }
        //左侧终端部署情况
        this.devDeployData = res.data.devDeploy
      })
    },
    getconstantlyInfo(){
      api_list.getconstantlyInfo({}).then((res) => {
        //左侧终端运行状态
        var temp = []
        var runningState = res.data.runningState
        temp = runningState.map((item) => {
          return {name: item.name, value: Number(item.value)}
        })
        this.device_run_status.data = temp
        this.device_run_status = { ...this.device_run_status }
        //医保电子凭证激活总数/率
        this.ecTotalAndRates = res.data.ecTotalAndRates
        for(var i = 0; i < this.ecTotalAndRates.length; i++){
          this.ecTotalAndRates[i].value = Number(this.ecTotalAndRates[i].value)
        }
        this.code_active_data.series[0].data[0].value = this.ecTotalAndRates[2].value
        this.code_active_data = { ...this.code_active_data }
        //医保电子凭证交易总笔数/率
        this.ecDealData = res.data.ecDealData
        for(var i = 0; i < this.ecDealData.length; i++){
          this.ecDealData[i].value = Number(this.ecDealData[i].value)
        }
        this.code_deal_data.series[0].data[0].value = this.ecDealData[2].value
        this.code_deal_data = { ...this.code_deal_data }
        //右侧终端设备使用数据
        this.devUsingData = res.data.devUsingData
        for(var i = 0; i < this.devUsingData.length; i++){
          this.devUsingData[i].value = Number(this.devUsingData[i].value)
        }
        //头部终端累计
        this.devTotalServicesPeople = res.data.devTotalServicesPeople
        for(var i = 0; i < this.devTotalServicesPeople.length; i++){
          this.devTotalServicesPeople[i].value = Number(this.devTotalServicesPeople[i].value)
        }
        setTimeout(() => {
          this.service_person_start = this.devTotalServicesPeople[0].value
          this.service_times_start = this.devTotalServicesPeople[1].value
        },3000)
      })
    },
    getbrokenLineTrend(){
      api_list.getbrokenLineTrend({}).then((res) => {
        //底部图表
        this.dealData = res.data.deal
        this.deployData = res.data.deploy
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .big_box{
    @keyframes scale_bg{
      0%{
        transform: scale(0);
        /*opacity: 0.0;*/
      }
      25%{
        transform: scale(0.25);
       /* opacity: 0.1;*/
      }
      50%{
        transform: scale(0.5);
        /*opacity: 0.3;*/
      }
      75%{
        transform: scale(0.75);
        /*opacity: 0.5;*/
      }
      100%{
        transform: scale(1);
        /*opacity: 1;*/
      }
    }
    min-width: 1920px;
    min-height: 100%;
    background: url(../../assets/image/bigscreen_bg.png) left top no-repeat;
    .circle_small{
      width: 81px;
      height: 81px;
      background: url(../../assets/image/circle_small.png) left top no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: 60px;
      top: -30px;
      animation: scale_bg 3s infinite ease-out;
    }
    .circle_big{
      width: 110px;
      height: 110px;
      background: url(../../assets/image/circle_big.png) left top no-repeat;
      position: absolute;
      right: 60px;
      bottom: 30px;
      animation: scale_bg 3s infinite ease-out;
    }
    .font_def{
      font-family: 'bigscreen';
      font-size: 54px!important;
    }
    .font_def2{
      font-family: 'bigscreen';
      font-size: 48px!important;
    }
    .font_def3{
      font-family: 'bigscreen';
      font-size: 40px!important;
    }
    .title_box{
      height: 40px;
      color: #fff;
      padding-left: 24px;
      line-height: 40px;
      font-size: 16px;
      .circle_point{
        color: #3BBBE3;
        margin-right: 5px;
        font-size: 20px;
        vertical-align: middle;
      }
      .title_txt{
        vertical-align: middle;
      }
    }
    .nav_box{
      .date_box{
        position: absolute;
        height: 68px;
        right: 24px;
        color: #20C3EF;
        font-size: 20px;  
        top: 36px;
      }
      width: 100%;
      height: 68px;
      background: url(../../assets/image/head_nav.png) left top no-repeat;
      background-size: 100% 100%;
      position: relative;
      .title{
        text-align: center;
        font-size: 34px;
        font-weight: 800;
        letter-spacing: 10px;
        color: #20C3EF;
        line-height: 68px;
        .dv-decoration-5{
          width: 682px;
          height: 40px;
          position: absolute;
          top: 66px;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
    .main_box{
      width: 100%;
      padding: 0 24px;
      height: 725px;
      margin-top: 16px;
      display: flex;
      .left_box{
        width: 521px;
        height: 725px;
        .item{
          height: 231px;
          width: 521px;
          background: url(../../assets/image/bg_middle.png) left top no-repeat;
          background-size: 100% 100%;
          &.item_center{
            margin: 16px 0;
            .pie_box{
              width: 100%;
              height: 169px;
              margin-top: 10px;
              position: relative;
              display: flex;
              .legend_box{
                display: inline-block;
                flex: 1;
                height: 169px;
                position: relative;
                .legend_item{
                  position: absolute;
                  bottom: 30%;
                  color: #fff;
                  &.online{
                    bottom: 55%;
                    .item_color{
                      background: #20C3EF;
                    }
                  }
                  .item_color{
                    vertical-align: middle;
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: #E17155;
                    margin-right: 10px;
                  }
                  .item_val{
                    vertical-align: middle;
                    font-size: 16px;
                  }
                }
              }
            }
          }
          &.item_bottom{
            .data_box{
              width: 100%;
              height: 169px;
              /*margin-top: 10px;*/
              display: flex;
              .data_case{
                display: inline-block;
                width: 50%;
                height: 169px;
                padding-left: 24px;
                .case_item{
                  &.case_item_top{
                    margin: 14px 0 13px 0;
                  }
                  .case1{
                    color: #fff;
                    font-size: 16px;
                    margin-bottom: 5px;
                  }
                  .case2{
                    color: #20C3EF;
                    font-size: 40px;
                    &.case3{
                      color: #60C4B5;
                    }
                  }
                }
              }
            }
          }
          .t_box{
            height: 32px;
            text-align: center;
            color: #fff;
            font-size: 16px;
            font-weight: 800;
            .h-title{
              display: inline-block;
              height: 100%;
              line-height: 32px;
              padding: 0 30px;
              background: linear-gradient(90deg, #0F1A4C 0%, #26367A 50%, #0D1849 100%);
              em{
                display: inline-block;
                width: 13px;
                height: 12px;
                margin-right: 5px;
              }
            }
          }
        }
      }
      .right_box{
        width: 521px;
        height: 725px;
        .item{
          height: 231px;
          width: 521px;
          background: url(../../assets/image/bg_middle.png) left top no-repeat;
          background-size: 100% 100%;
          &.item_center{
            margin: 16px 0;
          }
          .t_box{
            height: 32px;
            text-align: center;
            color: #fff;
            font-size: 16px;
            font-weight: 800;
            .h-title{
              display: inline-block;
              height: 100%;
              line-height: 32px;
              padding: 0 30px;
              background: linear-gradient(90deg, #0F1A4C 0%, #26367A 50%, #0D1849 100%);
              em{
                display: inline-block;
                width: 13px;
                height: 12px;
                margin-right: 5px;
              }
            }
          }
          .chart_con{
            width: 100%;
            height: 169px;
            margin-top: 10px;
            position: relative;
            display: flex;
            .pieCon{
              width: 50%;
              display: inline-block;
              height: 169px;
              background: url(../../assets/image/pie_bg.png) center center no-repeat;
            }
            .dataCon{
              flex: 1;
              display: inline-block;
              height: 169px;
              padding-left: 24px;
              .data_item{
                &.item1{
                  margin: 14px 0 13px 0;
                }
                .p1{
                  color: #fff;
                  font-size: 16px;
                  margin-bottom: 5px;
                }
                .p2{
                  color: #20C3EF;
                  font-size: 40px;
                  &.p3{
                    color: #D19D03;
                  }
                }
              }
            }
          }
          .data_box{
            width: 100%;
            height: 169px;
            /*margin-top: 10px;*/
            display: flex;
            .data_case{
              display: inline-block;
              width: 50%;
              height: 169px;
              padding-left: 24px;
              .case_item{
                &.case_item_top{
                  margin: 14px 0 13px 0;
                }
                .case1{
                  color: #fff;
                  font-size: 16px;
                  margin-bottom: 5px;
                }
                .case2{
                  color: #20C3EF;
                  font-size: 40px;
                  &.case3{
                    color: #60C4B5;
                  }
                }
              }
            }
          }
        }
      }
      .center_box{
        flex: 1;
        .center_top{
          height: 103px;
          padding: 0 16px;
          display: flex;
          .item{
            width: 391px;
            background: url(../../assets/image/bg_small.png) left top no-repeat;
            background-size: 100% 100%;
            &.item_right{
              margin-left: 16px;
            }
            .t_box{
              height: 32px;
              text-align: center;
              color: #fff;
              font-size: 16px;
              font-weight: 800;
              .h-title{
                display: inline-block;
                height: 100%;
                line-height: 32px;
                padding: 0 30px;
                background: linear-gradient(90deg, #0F1A4C 0%, #26367A 50%, #0D1849 100%);
                em{
                  display: inline-block;
                  width: 13px;
                  height: 12px;
                  margin-right: 5px;
                }
              }
            }
            .count_con{
              width: 100%;
              height: 50px;
              text-align: right;
              padding-right: 24px;
              line-height: 50px;
              color: #D19D03;
              font-size: 40px;
              /*margin-top: 10px;*/
              &.count_con2{
                color: #61CDBD;
              }
            }
          }
        }
        .center_bottom{
          height: 622px;
          background: url(../../assets/image/map_demo_bg2.png) center center no-repeat;
          background-size: 90% 90%;
          position: relative;
          .loop{
            width: 308px;
            height: 226px;
            position: absolute;
            &.loop1{
              background: url(../../assets/image/loop1.png) left top no-repeat;
              right: 106px;
              top: 40px;
            }
            &.loop2{
              background: url(../../assets/image/loop2.png) left top no-repeat;
              right: 184px;
              bottom: 185px;
            }
          }
        }
      }
    }
    .bottom_box{
      width: 100%;
      padding: 0 24px;
      height: 231px;
      margin-top: 16px;
      margin-bottom: 24px;
      display: flex;
      .item{
        height: 231px;
        width: 928px;
        background: url(../../assets/image/bg_big.png) left top no-repeat;
        background-size: 100% 100%;
        .t_box{
            height: 32px;
            text-align: center;
            color: #fff;
            font-size: 16px;
            font-weight: 800;
            .h-title{
              display: inline-block;
              height: 100%;
              line-height: 32px;
              padding: 0 30px;
              background: linear-gradient(90deg, #0F1A4C 0%, #26367A 50%, #0D1849 100%);
              em{
                display: inline-block;
                width: 13px;
                height: 12px;
                margin-right: 5px;
              }
            }
          }
      }
      .chart_right{
        margin-left: 16px;
      }
    }
  }
</style>
