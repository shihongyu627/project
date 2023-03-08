<!--
 * @Author: your name
 * @Date: 2021-04-20 14:43:52
 * @LastEditTime: 2021-04-28 09:32:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gitee-ai-platform/src/views/business/home/editor/index.vue
-->
<template>
  <div class="main organ">
    <!--主内容区-->
    <el-row>
      <el-col :span="24">
        <div class="Content">
          <el-row style="margin-bottom: -20px;">
            <el-col :span="8"><h3>服务资源监控</h3></el-col>
            <el-col :span="8">
              <el-form
                :model="formInline"
                label-width="120px"
                size="mini"
              >
                <el-form-item label="服务名称：">
                  <el-select v-model="value1" multiple placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <el-form
                :model="formInline"
                label-width="120px"
                size="mini"
              >
                <el-form-item label="服务版本：">
                  <el-select v-model="value1" multiple placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div class="Content">
          <h3>服务资源并发</h3>
          <div>
            <span class="text">服务资源总并发 <b>1000</b></span>
            <span class="text2">已使用并发 <b>600</b></span>
          </div>
          <div id="pieId" ref="pieId" :style="{width: '100%', height: '32.6vh'}" />
        </div>
      </el-col>
      <el-col :span="18">
        <div class="Content">
          <h3>服务器运行情况</h3>
          <div :style="{width: '100%', height: '35vh'}">
            <el-row>
              <el-col :span="6">
                <div class="caseSon">
                  <div class="title">服务运行时间</div>
                  <div class="number"><b>100</b> <span>天</span></div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="caseSon">
                  <div class="title">CPU核心数</div>
                  <div class="number"><b>8</b></div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="caseSon">
                  <div class="title">内存总量</div>
                  <div class="number"><b>50.0</b> <span> G</span></div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="caseSon">
                  <div class="title">系统平均负载</div>
                  <div class="number"><b>0.08</b></div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="chartSpace">
                  <div class="chartTitle">CPU使用率（1m）</div>
                  <div id="trashStatus" ref="trashStatus" class="trashStatus" />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="chartSpace">
                  <div class="chartTitle">内存使用率</div>
                  <div id="trashStatusA" ref="trashStatusA" class="trashStatusA" />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="chartSpace">
                  <div class="chartTitle">系统平均负载（1m）</div>
                  <div id="trashStatusB" ref="trashStatusB" class="trashStatusB" />
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="Content">
          <el-row>
            <el-col :span="8"><h3>授权渠道系统服务并发监控</h3></el-col>
            <el-col :span="8">
              <el-form
                :model="formInline"
                label-width="120px"
                size="mini"
              >
                <el-form-item label="服务名称：">
                  <el-select v-model="value1" multiple placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <el-form
                :model="formInline"
                label-width="120px"
                size="mini"
              >
                <el-form-item label="服务版本：">
                  <el-select v-model="value1" multiple placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <div class="chartStyle">
            <div>
              <div class="radioStyle">
                <el-radio-group v-model="radio4" size="mini">
                  <el-radio-button label="一周" />
                  <el-radio-button label="一月" />
                  <el-radio-button label="一年" />
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
    <el-row>
      <el-col :span="12">
        <div class="Content">
          <el-row>
            <el-col :span="12"><h3>服务异常统计</h3></el-col>
            <el-col :span="12">
              <el-date-picker
                v-model="region"
                size="mini"
                style="float: right; width: 150px;"
                type="datetime"
                placeholder="选择日期时间"
              />
            </el-col>
          </el-row>
          <div class="chartStyle">
            <el-row>
              <el-col :span="12">
                <el-form
                  :model="formInline"
                  label-width="120px"
                  size="mini"
                >
                  <el-form-item label="服务名称：">
                    <el-select v-model="value1" multiple placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form
                  :model="formInline"
                  label-width="120px"
                  size="mini"
                >
                  <el-form-item label="服务版本：">
                    <el-select v-model="value1" multiple placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <div id="pie" ref="AEAnalysis" class="AEAnalysis" />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="Content">
          <h3>今日预警信号数：189</h3>
          <div class="chartStyle">
            <div>
              <div class="radioStyle">
                <el-radio-group v-model="radio4" size="mini">
                  <el-radio-button label="7天" />
                  <el-radio-button label="30天" />
                  <el-radio-button label="60天" />
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
            <div class="tableStyle">
              <div v-for="(i,k) in 15" :key="k" class="lineStyle">
                <span class="icon"><svg-icon icon-class="menu" class="iconStyle" /></span>
                <span class="serverTime">服务有效期预警</span>
                <span class="serverName">2020年01月20日 9:12:56</span>
                <span class="warningTime">操作</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="Content">
          <el-col :span="8"><h3>授权渠道系服务有效期监控</h3></el-col>
          <el-col :offset="10" :span="4">
            <el-radio-group v-model="radio4" size="mini">
              <el-radio-button label="7天" />
              <el-radio-button label="30天" />
              <el-radio-button label="60天" />
            </el-radio-group>
          </el-col>
          <el-col :span="2">
            <el-button type="success" size="mini">下载表格</el-button>
          </el-col>
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%;position:relative"
          >
            <el-table-column
              label="序号"
              type="index"
              show-overflow-tooltip
            />

            <el-table-column
              prop="date"
              label="服务名称"
            />
            <el-table-column
              prop="name"
              label="服务版本"
            />
            <el-table-column
              prop="address"
              label="渠道系统"
            />
            <el-table-column
              prop="address"
              label="应用渠道"
            />
            <el-table-column
              prop="address"
              label="授权期限"
            />
            <el-table-column
              prop="address"
              label="已服务时长"
            />
            <el-table-column
              prop="address"
              label="剩余有效期"
            />
          </el-table>

          <!-- 分页 开始 -->
          <el-pagination
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <!-- 分页 结束 -->
        </div>
      </el-col>
    </el-row>
    <!--主内容区 end-->
  </div>
</template>
<script>
var scroe = 60 / 100
export default {
  name: 'OCRIDCardRecognitionCenter',
  components: {
  },

  data() {
    return {
      formInline: {},
      currentPage4: 0,
      radio4: '服务异常预警',
      region: '',
      options: [{
        value: '选项1',
        label: '数据1'
      }, {
        value: '选项2',
        label: '数据2'
      }],
      value1: [],
      tableData: [
        {}
      ]
    }
  },
  mounted() {
    this.chartsFunction()
    this.chartsFunction2()
    this.chartsFunction3(10, 0, 17)
  },
  methods: {
    // 图标初始化
    chartsFunction() {
      const ball = document.getElementById('AEAnalysis')
      const ballChart = this.echarts.init(ball)
      ballChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['数据1', '数据2', '数据3', '数据4', '数据5']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '数据1',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '数据2',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '数据3',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '数据4',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '数据5',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
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
          containLabel: true
        },
        series: [
          {
            name: '数据源',
            type: 'pie',
            radius: '50%',
            center: ['50%', '60%'],
            data: [
              { value: 1048, name: '数据1' },
              { value: 735, name: '数据2' },
              { value: 580, name: '数据3' },
              { value: 484, name: '数据4' },
              { value: 300, name: '数据5' }
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
    },
    // 图标初始化
    chartsFunction2() {
      const ball = document.getElementById('pieId')
      const ballChart = this.echarts.init(ball)
      ballChart.setOption({
        title: {
          top: '55%',
          left: 'center',
          text: (scroe * 10000 / 100) + '%',
          textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 24
          }
        },
        series: [{
          type: 'liquidFill',
          itemStyle: {
            opacity: 0.8, // 波浪的透明度
            shadowBlur: 10, // 波浪的阴影范围
            shadowColor: '#fff' // 阴影颜色
          },
          radius: '80%',
          // 水波
          color: [new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#00cefc'
          },
          {
            offset: 1,
            color: '#367bec'
          }
          ])],
          data: [{
            value: scroe
          }, {
            value: scroe - 0.1
          }, {
            value: scroe - 0.2
          }],
          // background: '#000',
          center: ['50%', '50%'],
          backgroundStyle: {
            color: '#fff'
          },
          label: {
            normal: {
              formatter: '服务并发剩余400',
              left: 'center',
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: 14
              }
            }
          },
          outline: {
            itemStyle: {
              borderColor: 'transparent',
              borderWidth: 5
            },
            borderDistance: 0
          }
        }]
      })
      window.addEventListener('resize', function() {
        ballChart.resize()
      })
    },
    // 图标初始化
    chartsFunction3(e, d, f) {
      // 球
      const trashStatus = document.getElementById('trashStatus')
      const trashStatusChart = this.echarts.init(trashStatus)
      trashStatusChart.setOption({
        title: {
          text: e + '%',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            color: '#0580f2',
            fontSize: '20'
          }
        },
        color: ['rgba(176, 212, 251, 1)'],

        series: [{
          name: 'Line 1',
          type: 'pie',
          clockWise: true,
          radius: ['50%', '66%'],
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          data: [{
            value: e,
            name: '01',
            itemStyle: {
              normal: {
                color: { // 完成的圆环的颜色
                  colorStops: [{
                    offset: 0,
                    color: '#00cefc' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#367bec' // 100% 处的颜色
                  }]
                },
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            }
          }, {
            name: '02',
            value: 100 - e
          }]
        }]
      })

      const trashStatusA = document.getElementById('trashStatusA')
      const trashStatusAChart = this.echarts.init(trashStatusA)
      trashStatusAChart.setOption({
        title: {
          text: d + '%',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            color: '#0580f2',
            fontSize: '20'
          }
        },
        color: ['rgba(176, 212, 251, 1)'],

        series: [{
          name: 'Line 1',
          type: 'pie',
          clockWise: true,
          radius: ['50%', '66%'],
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          data: [{
            value: d,
            name: '01',
            itemStyle: {
              normal: {
                color: { // 完成的圆环的颜色
                  colorStops: [{
                    offset: 0,
                    color: '#00cefc' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#367bec' // 100% 处的颜色
                  }]
                },
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            }
          }, {
            name: '02',
            value: 100 - d
          }]
        }]
      })

      const trashStatusB = document.getElementById('trashStatusB')
      const trashStatusBChart = this.echarts.init(trashStatusB)
      trashStatusBChart.setOption({
        title: {
          text: f + '%',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            color: '#0580f2',
            fontSize: '20'
          }
        },
        color: ['rgba(176, 212, 251, 1)'],

        series: [{
          name: 'Line 1',
          type: 'pie',
          clockWise: true,
          radius: ['50%', '66%'],
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          data: [{
            value: f,
            name: '01',
            itemStyle: {
              normal: {
                color: { // 完成的圆环的颜色
                  colorStops: [{
                    offset: 0,
                    color: '#00cefc' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#367bec' // 100% 处的颜色
                  }]
                },
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            }
          }, {
            name: '02',
            value: 100 - f
          }]
        }]
      })
      window.addEventListener('resize', function() {
        trashStatusChart.resize()
        trashStatusAChart.resize()
        trashStatusBChart.resize()
      })
    },
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>
<style lang="scss" scoped>
.text{
  font-size: 14px;
  color: #666;
  b{
    color: #409EFF;
  }
}
.text2{
  float: right;
  margin-right: 5px;
  font-size: 14px;
  color: #666;
  b{
    color: #409EFF;
  }
}
.caseSon{
  padding: 10px;
  background-color: #f1f1f1;
  margin-right: 10px;
  margin-bottom: 10px;
  .title{
    text-align: center;
    font-size: 12px;
    color: #666;
  }
  .number{
    padding-top: 10px;
    text-align: center;
    font-size: 18px;
    b{
      color: #409EFF;
    }
    span{
      font-size: 12px;
      color: #666;
    }
  }
}

.chartSpace{
  padding-top: 10px;
  background-color: #f1f1f1;
  margin-right: 10px;
  text-align: center;
  .chartTitle{
    font-size: 12px;
    color: #666;
  }
  .trashStatus,.trashStatusA,.trashStatusB{
    padding-left: 8px;
    height: 20vh;
    @media screen and (max-width:1440px){
      height: 20.5vh;
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
  .tableStyle{
    overflow: auto;
    margin-top: 10px;
    width: 100%;
    height: 90%;
    border: 1px solid #f1f1f1;
    @media screen and (max-width:1440px){
      width: 100%;
      height: 87%;
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
        margin-right: 30px;
        color: #666;
        font-size: 12px;

      }
      .warningTime{
        float: right;
        margin-right: 30px;
        color: #409EFF;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
.caseSon{
  margin-top: 15px;
}
</style>
