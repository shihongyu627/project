<!--
 * @Author: your name
 * @Date: 2021-04-20 14:43:52
 * @LastEditTime: 2021-04-24 10:08:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gitee-ai-platform/src/views/business/home/editor/index.vue
-->
<template>
  <div
    style="margin-top: 10px;"
    class="main organ"
  >
    <!--主内容区-->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="Content">
          <h3>服务资源监控</h3>
          <div class="tableStyle">
            <el-form-item label="服务应用">
              <el-select v-model="value1" multiple placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="Content">
          <h3>今日预警信号数：189</h3>
          <div class="tableStyle">
            <div v-for="(i,k) in 5" :key="k" class="lineStyle">
              <span class="icon"><svg-icon icon-class="menu" class="iconStyle" /></span>
              <span class="serverTime">服务有效期预警</span>
              <span class="channelName">渠道名称：公共服务子系统</span>
              <span class="serverName">服务名称：人脸验证服务版本：人脸验证1:N</span>
              <span class="warningTime">预警时间：2020年01月20日  9：12:56</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="Content caseSon">
          <h3>服务预警分布占比</h3>
          <div class="chartStyle">
            <div>
              <div class="radioStyle">
                <el-radio-group v-model="radio4" size="mini">
                  <el-radio-button label="服务异常预警" />
                  <el-radio-button label="服务有效期预警" />
                  <el-radio-button label="服务并发预警" />
                </el-radio-group>
              </div>
              <div class="timeDateStyle">
                <el-date-picker
                  v-model="region"
                  size="mini"
                  style="float: right; width: 150px;"
                  type="datetime"
                  placeholder="选择日期时间"
                />
              </div>
            </div>
            <div id="pie" ref="AEAnalysis" class="AEAnalysis" />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="Content caseSon">
          <h3>渠道预警top5</h3>
          <div class="chartStyle">
            <div>
              <div class="radioStyle">
                <el-radio-group v-model="radio4" size="mini">
                  <el-radio-button label="服务异常预警" />
                  <el-radio-button label="服务有效期预警" />
                  <el-radio-button label="服务并发预警" />
                </el-radio-group>
              </div>
              <div class="timeDateStyle">
                <el-date-picker
                  v-model="region"
                  size="mini"
                  style="float: right; width: 150px;"
                  type="datetime"
                  placeholder="选择日期时间"
                />
              </div>
            </div>
            <div id="AEAnalysis" ref="AEAnalysis" class="AEAnalysis" />
          </div>
        </div>
      </el-col>
    </el-row>
    <!--主内容区 end-->
  </div>
</template>
<script>
export default {
  name: 'OCRIDCardRecognitionCenter',
  components: {
  },

  data() {
    return {
      radio4: '服务异常预警',
      region: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value1: []
    }
  },
  mounted() {
    this.chartsFunction()
  },
  methods: {
    // 图标初始化
    chartsFunction() {
      const ball = document.getElementById('AEAnalysis')
      const ballChart = this.echarts.init(ball)
      ballChart.setOption({
        dataset: {
          source: [
            ['score', 'amount', 'product'],
            [89.3, 58212, 'Matcha Latte'],
            [57.1, 78254, 'Milk Tea'],
            [74.4, 41032, 'Cheese Cocoa'],
            [50.1, 12755, 'Cheese Brownie'],
            [89.7, 20145, 'Matcha Cocoa'],
            [68.1, 79146, 'Tea'],
            [19.6, 91852, 'Orange Juice'],
            [10.6, 101852, 'Lemon Juice'],
            [32.7, 20112, 'Walnut Brownie']
          ]
        },
        grid: {
          left: '5%',
          right: '10%',
          bottom: '10%',
          top: '10%',
          containLabel: true
        },
        xAxis: { name: 'amount' },
        yAxis: { type: 'category' },
        visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 10,
          max: 100,
          text: ['High Score', 'Low Score'],
          // Map the score column to color
          dimension: 0,
          inRange: {
            color: ['#65B581', '#FFCE34', '#FD665F']
          }
        },
        series: [
          {
            type: 'bar',
            encode: {
              // Map the "amount" column to X axis.
              x: 'amount',
              // Map the "product" column to Y axis
              y: 'product'
            }
          }
        ]
      })
      window.addEventListener('resize', function() {
        ballChart.resize()
      })

      const pie = document.getElementById('pie')
      const pieChart = this.echarts.init(pie)
      pieChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '5%',
          right: '10%',
          bottom: '10%',
          top: '20%',
          containLabel: true
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            center: ['50%', '60%'],
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      window.addEventListener('resize', function() {
        pieChart.resize()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tableStyle{
  overflow: auto;
  width: 100%;
  height: 20vh;
  border: 1px solid #f1f1f1;
  @media screen and (max-width:1440px){
    width: 100%;
    height: 20vh;
  }
  .lineStyle{
    margin: 5px;
    padding: 10px;
    background-color: #f1f1f1;
    .icon{
      .iconStyle{
        color: #E6A23C;
      }
    }
    .serverTime{
      margin-left: 10px;
      border-radius: 5px;
      padding: 5px 10px 5px 10px;
      background-color: #E6A23C;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
    .channelName{
      margin-left: 20px;
      color: #409EFF;
      font-size: 14px;
      font-weight: bold;
    }
    .serverName{
      margin-left: 50px;
      border-radius: 5px;
      padding: 5px 10px 5px 10px;
      background-color: #409EFF;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
    .warningTime{
      float: right;
      margin-right: 30px;
      color: #666;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
.chartStyle{
  padding: 10px;
  width: 100%;
  height: 55.5vh;
  background-color: #f1f1f1;
  @media screen and (max-width:1440px){
    width: 100%;
    height: 46vh;
  }
  .AEAnalysis{
    height: 50vh;
    @media screen and (max-width:1440px){
      height: 39.5vh;
    }
  }
  .radioStyle{
    padding-top: 15px;
    display:inline
  }
  .timeDateStyle{
    display:inline;
    ::v-deep .el-date-editor {
      width: 30% !important;
    }
  }
}
.caseSon{
  margin-top: 15px;
}
</style>
