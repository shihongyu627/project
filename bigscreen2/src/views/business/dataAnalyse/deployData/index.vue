<template>
  <div class="deployData-warp">
    <el-row :gutter="10" :span="24" style="padding-left:24px;margin-top:24px">
      <el-col :span="10" style="padding-right:20px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-row>
              <el-col :span="12" style="padding-right:10px">
                <el-card
                  class="sum-card-box"
                  style="border-left: 9px solid #3B7FF6;"
                >
                  <img class="PartIcon" src="./assets/image/num.png" />
                  <div class="PartWord">
                    <div class="item1">
                      机构已部署总数 (家)
                    </div>
                    <div class="item2">
                      {{ this.deployData.deployMedinsNum }}
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12" style="padding-left:10px">
                <el-card
                  class="sum-card-box"
                  :padding="0"
                  style="border-left: 9px solid #2BA245;"
                >
                  <img class="PartIcon" src="./assets/image/rate.png" />
                  <div class="PartWord">
                    <div class="item1">
                      机构部署覆盖率
                    </div>
                    <div class="item2">
                      {{ this.deployData.deployCoverPercent }}%
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top:20px;margin-bottom:20px">
          <el-col :span="24">
            <div class="deployData-box">
              <div class="deployData-Rate">机构部署覆盖率</div>
              <div class="deployData-content mechanism">
                <div style="width:300px" class="mechanism-progress">
                  <el-progress
                    type="circle"
                    :width="130"
                    stroke-linecap="square"
                    :stroke-width="20"
                    color="#3B7FF6"
                    :percentage="this.deployCoverPercent"
                  ></el-progress>
                </div>
                <div class="right">
                  <div class="right-left">
                    <div class="right-item">
                      <div class="title">
                        <div class="radio"></div>
                        已部署机构 (家)
                        <img class="rightIcon" src="./assets/image/right.png" />
                      </div>
                      <div class="num" style="color:#2176FF">
                        {{ this.deployData.deployMedinsNum }}
                      </div>
                    </div>
                    <div class="right-item">
                      <div class="title">
                        <div class="radio"></div>
                        机构部署覆盖率
                      </div>
                      <div class="num">{{ this.deployCoverPercent }}%</div>
                    </div>
                  </div>
                  <div class="right-left">
                    <div class="right-item">
                      <div class="title">
                        <div class="radio"></div>
                        机构总数 (家)
                      </div>
                      <div class="num">{{ this.deployData.medinsTotal }}</div>
                    </div>
                    <div class="right-item">
                      <div class="title">
                        <div class="radio color"></div>
                        未部署机构 (家)
                      </div>
                      <div class="num">
                        {{ this.deployData.unDeployMedinsNum }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- <div class="grid-content bg-purple"></div
    > -->
      </el-col>
      <el-col :span="14" style="padding-right:29px;">
        <el-row :gutter="10">
          <el-col :span="24">
            <div class="deployData-box" style="height:200px">
              <div
                class="deployData-Rate"
                style="border-left: 4px solid #2BA245"
              >
                定点医疗机构覆盖率
              </div>
              <div class="deployData-content" style="margin-top:30px">
                <div style="width:220px" class="medical-progress">
                  <el-progress
                    type="circle"
                    :width="110"
                    stroke-linecap="square"
                    :stroke-width="15"
                    color="#2BA245"
                    :percentage="this.ylDeployCoverPercent"
                    style="margin-left:15px"
                  ></el-progress>
                </div>
                <div class="right">
                  <div class="right-item">
                    <div class="title">
                      <div class="radio" style="background:#2BA245"></div>
                      已部署机构 (家)
                      <img class="rightIcon" src="./assets/image/right.png" />
                    </div>
                    <div class="num-size" style="color:#2BA245">
                      {{ this.deployData.ylDeployMedinsNum }}
                    </div>
                  </div>
                  <div class="right-item">
                    <div class="title">
                      <div class="radio" style="background:#2BA245"></div>
                      机构部署覆盖率
                    </div>
                    <div class="num-size">{{ this.ylDeployCoverPercent }}</div>
                  </div>
                  <div class="right-item">
                    <div class="title">
                      <div class="radio" style="background:#2BA245"></div>
                      机构总数 (家)
                    </div>
                    <div class="num-size">
                      {{ this.deployData.ylMedinsTotal }}
                    </div>
                  </div>
                  <div class="right-item">
                    <div class="title">
                      <div class="radio color" style="background:#2BA245"></div>
                      未部署机构 (家)
                    </div>
                    <div class="num-size">
                      {{ this.deployData.ylUnDeployMedinsNum }}
                    </div>
                  </div>
                </div>
              </div>
            </div></el-col
          >
        </el-row>
        <el-row :gutter="10" style="margin-top:20px">
          <el-col :span="24">
            <div class="deployData-box" style="height:200px">
              <div class="deployData-Rate">定点零售药店覆盖率</div>
              <div class="deployData-content" style="margin-top:30px">
                <div style="width:220px" class="pharmacy-progress">
                  <el-progress
                    type="circle"
                    :width="110"
                    stroke-linecap="square"
                    :stroke-width="15"
                    color="#2EA8A9"
                    :percentage="this.ydDeployCoverPercent"
                    style="margin-left:15px"
                  ></el-progress>
                </div>
                <div class="right">
                  <div class="right-item">
                    <div class="title">
                      <div class="radio" style="background:#2BA245"></div>
                      已部署机构 (家)
                      <img class="rightIcon" src="./assets/image/right.png" />
                    </div>
                    <div class="num-size" style="color:#2BA245">
                      {{ this.deployData.ydDeployMedinsNum }}
                    </div>
                  </div>
                  <div class="right-item">
                    <div class="title">
                      <div class="radio" style="background:#2BA245"></div>
                      机构部署覆盖率
                    </div>
                    <div class="num-size">{{ this.ydDeployCoverPercent }}</div>
                  </div>
                  <div class="right-item">
                    <div class="title">
                      <div class="radio" style="background:#2BA245"></div>
                      机构总数 (家)
                    </div>
                    <div class="num-size">
                      {{ this.deployData.ydMedinsTotal }}
                    </div>
                  </div>
                  <div class="right-item">
                    <div class="title">
                      <div class="radio color" style="background:#2BA245"></div>
                      未部署机构 (家)
                    </div>
                    <div class="num-size">
                      {{ this.deployData.ydUnDeployMedinsNum }}
                    </div>
                  </div>
                </div>
              </div>
            </div></el-col
          >
        </el-row>
      </el-col>
    </el-row>
    <!-- 趋势图 -->
    <el-row :gutter="10" style="padding-left:24px;padding-right:24px">
      <el-col :span="24">
        <mechanism></mechanism>
      </el-col>
    </el-row>
    <el-row :gutter="25" style="margin-top:20px;padding-left:24px;padding-right:24px">
      <el-col :span="24">
        <terminal></terminal>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import mechanism from "./chart/mechanism.vue"; // 机构部署覆盖率统计
import terminal from "./chart/terminal.vue"; // 终端部署统计
// import Pagination from '@/components/Pagination'
import echarts from "echarts";
import api_list from "@/views/business/dataAnalyse/deployData/api/deployData";
export default {
  name: "DeployData",
  components: {
    // Pagination
    mechanism,
    terminal
  },
  data() {
    return {
      deployData: {},
      deployCoverPercent: 0, //机构部署覆盖率
      ydDeployCoverPercent: 0, //定点零售药店部署覆盖率
      ylDeployCoverPercent: 0 //定点医疗机构部署覆盖率
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    initData() {
      api_list.getorDeployOverview({}).then(res => {
        if (res.code > 0) {
          console.log(res.data, "部署概览");
          this.deployData = res.data || {};
          this.deployCoverPercent = Number(res.data.deployCoverPercent) || 0;
          this.ydDeployCoverPercent =
            Number(res.data.ydDeployCoverPercent) || 0;
          this.ylDeployCoverPercent =
            Number(res.data.ylDeployCoverPercent) || 0;
          // this.$message({
          //   message: res.message,
          //   type: "success",
          //   offset: 100
          // });
        } else {
          this.$message({
            message: res.message,
            type: "error",
            offset: 100
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.deployData-warp {
  .sum-card-box {
    float: left;
    width: 100%;
    height: 141px;
    box-sizing: border-box;
    background-color: #fff;
    transition: 0.2s all ease;
    position: relative;
    padding: 20px 24px 8px;
    display: flex;
    align-items: center;
    .PartIcon {
      width: 46px;
      height: 54px;
      // margin: 10px 0 10px 10px;
      float: left;
      text-align: center;
      border-radius: 5px;
    }
    .PartWord {
      position: relative;
      display: inline-block;
      color: #353535;
      margin-left: 25px;
    }
    .item1 {
      font-family: PingFang SC;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      text-align: left;
      color: #979cb2;
      .tip {
        float: right;
      }
    }
    .item2 {
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      margin-top: 15px;
      font-family: PingFang SC;
      font-size: 30px;
      font-style: normal;
      font-weight: 600;
      letter-spacing: 0px;
      text-align: left;
      color: #232731;
    }
    .item3 {
      height: 0px;
      margin-bottom: 2px;
      width: 100%;
    }
  }
  .deployData-box {
    background: #fff;
    float: left;
    width: 100%;
    height: 260px;
    box-sizing: border-box;
    transition: 0.2s all ease;
    position: relative;
    padding: 20px 24px;
    .deployData-Rate {
      border-left: 4px solid #3b7ff6;
      height: 15px;
      line-height: 15px;
      text-indent: 5px;
      font-family: PingFang SC;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      letter-spacing: 0px;
      text-align: left;
      width: 100%;
    }
    .deployData-content {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 40px;
      justify-content: space-around;
      .right {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        .right-left {
          display: flex;
          width: 100%;
          flex-direction: column;
          justify-content: center;
        }
        .right-item {
          height: 75px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .title {
            font-family: PingFang SC;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            letter-spacing: 0px;
            text-align: left;
            color: #979cb2;
            display: flex;
            align-items: center;
          }
          .rightIcon {
            width: 9px;
            height: 11px;
            margin-left: 8px;
          }
          .num {
            font-family: PingFang SC;
            font-size: 22px;
            font-style: normal;
            font-weight: 600;
            letter-spacing: 0px;
            text-align: left;
            color: #232731;
            margin-top: 10px;
            text-indent: 16px;
          }
          .num-size {
            font-family: PingFang SC;
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            letter-spacing: 0px;
            text-align: left;
            color: #232731;
            margin-top: 22px;
            text-indent: 16px;
          }
          .radio {
            height: 6px;
            width: 6px;
            border-radius: 6px;
            background: #3b7ff6;
            margin-right: 10px;
          }
          .color {
            background: #ff5e5a;
          }
        }
      }
      svg .el-progress-circle__track {
        stroke: red !important;
      }
    }
    .mechanism {
      .el-progress-circle__track {
        stroke: red;
      }
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: red;
  }
  .bg-purple-light {
    background: #ccc;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
}
.mechanism-progress {
  ::v-deep .el-progress-circle__track {
    stroke: rgba(59, 127, 246, 0.3);
  }
  ::v-deep .el-progress__text {
    font-weight: 600;
    color: #000000;
  }
}
.medical-progress {
  ::v-deep .el-progress-circle__track {
    stroke: rgba(43, 162, 69, 0.3);
  }
  ::v-deep .el-progress__text {
    font-weight: 600;
    color: #000000;
  }
}
.pharmacy-progress {
  ::v-deep .el-progress-circle__track {
    stroke: rgba(46, 168, 169, 0.3);
  }
  ::v-deep .el-progress__text {
    font-weight: 600;
    color: #000000;
  }
}
</style>
<style lang="scss"></style>
