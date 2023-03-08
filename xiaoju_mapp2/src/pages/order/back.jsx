import Taro, { Component } from "@tarojs/taro";
import { View, Map, Image, CoverImage, Button } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  AtActivityIndicator,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction
} from "taro-ui";

import styles from "./back.module.scss";
import namedPng from "../../assets/img/unlockStatus2.png";
import errIconPng from "../../assets/img/errIcon.png";
import unlockStatusRepair from "../../assets/img/unlockStatus_repair.png";
import closeLockImg from "../../assets/img/close_lock_img.jpg";
import order_repairPng from "../../assets/img/order_repair.png";

class Safety extends Component {
  config = {
    navigationBarTitleText: "正在骑行"
  };

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      order_id: "",
      address: "",
      markers: [],
      polygons: [],
      fee_info: {},
      safety: 1,
      device_no: "",
      latitude: "",
      longitude: "",
      isOpened: false,
      closeLockText: "请先手动关车锁",
      includePoints: [],
      progressValue: 0,
      errormessage: ""
    };
  }
  //不在运营区
  safetstopBtn() {
    this.setState({
      safety: 2
    });
  }
  //不在停车点
  notSafety() {
    this.setState({
      safety: 3
    });
  }
  //都在运营区和停车点
  commonBtn() {
    this.setState({
      safety: 6
    });
  }
  succerBtn() {
    this.setState({
      safety: 5
    });
  }

  componentDidMount() {
    let params = this.$router.params;
    this.setState({
      device_no: params.device_no,
      order_id: params.order_id,
      isOpened: false
    });
  }

  componentDidShow() {
    this.getLocation();
    this.xxl = setInterval(() => {
      this.getLocation();
    }, 10000);
  }

  componentDidHide() {
    if (this.xxl) {
      clearInterval(this.xxl);
    }
    this.xxl1 && clearInterval(this.xxl1);
  }

  componentWillUnmount() {
    if (this.xxl) {
      clearInterval(this.xxl);
    }
    this.xxl1 && clearInterval(this.xxl1);
    this.setState({
      isOpened: false
    });
    // Taro.reLaunch({
    //   url: "/pages/index/index"
    // });
  }

  // 获取位置
  getLocation() {
    let that = this;
    Taro.getLocation({
      type: "gcj02",
      success(res) {
        const longitude = res.longitude;
        const latitude = res.latitude;
        console.log(latitude, longitude);
        that.setState(
          {
            longitude: longitude,
            latitude: latitude
          },
          () => {
            // 设置定位点
            that.setMap();
            // 查询设备
            that.getDeviceInfo();
            that.checkNow();
            // that.checkstoparea();
          }
        );
      },
      fail(err) {
        console.log("getLocation error", err);
        // 查询设备
        that.getDeviceInfo();
        that.checkNow();
        // that.checkstoparea();
      }
    });
  }
  // 检查当前是否有用车
  checkNow = async () => {
    let d = {};
    if (this.state.longitude && this.state.latitude) {
      d.lnglat = this.state.longitude + "," + this.state.latitude;
    }
    let result = await global.$utils.api.load("orderNow", d, "get", {
      toast: false,
      toasterror: false,
      loading: false
    });
    if (result) {
      if (result.code == -50) {
        global.$utils.toast.text(result.message);
      }
      if (result.code == -1) {
        Taro.reLaunch({
          url: "/pages/index/index"
        });
        return
      }
      // 判断订单
      if (result.code >= 1) {
        let order_info = result.data || {};
        if (order_info.run_area_in != 1) {
          this.safetstopBtn();
          return;
        }
        if (order_info.stop_area_in != 1) {
          this.notSafety();
          return;
        }
        this.commonBtn();
      }
    }
  };
  // 获取位置，设置标记点
  setMap() {}
  // 检查是否在停车区域
  checkstoparea() {
    let d = {};
    d.device_no = this.state.device_no;
    if (this.state.longitude && this.state.latitude) {
      d.lnglat = this.state.longitude + "," + this.state.latitude;
    }
    global.$utils.api.load("userCheckstoparea", d).then(res => {
      console.log(res, "判断位置");
      if (res.code == 1) {
        this.safetstopBtn();
      } else {
        this.notSafety();
      }
    });
  }

  // 车辆信息
  getDeviceInfo = () => {
    let { longitude, latitude } = this.state;

    let d = {};
    d.device_no = this.state.device_no;
    global.$utils.api
      .load("deviceInfo", d)
      .then(result => {
        let stopRuns = result.data.area_stop_points;
        let areaStop = result.data.area_stop_points_list;
        let runRuns = result.data.area_run_points;
        // 可视范围-全部设备
        let includePoints = [];
        // 停车点
        let mm = [];
        // let cc={}
        // cc.longitude =longitude;
        // cc.latitude = latitude;
        // cc.title = '推荐距您最近的停车点';
        // cc.width = "30px";
        // cc.height = "60px";
        // cc.iconPath = require("../../assets/img/line.png");
        // cc.label = {
        //   content: '推荐距您最近的停车点',
        //   textAlign: "center",
        //   anchorY: -55,
        //   color: "#000000",
        //   fontSize: 15,
        //   padding: 2,
        //   bgColor: "#ffffff88"
        // };
        // mm.push(cc);
        areaStop.map(item => {
          if (item) {
            let a = {};
            a.longitude = item.lng;
            a.latitude = item.lat;
            includePoints.push({
              longitude: item.lng,
              latitude: item.lat
            });
            a.width = "30px";
            a.height = "30px";
            a.iconPath = require("../../assets/img/stop.png");
            a.id = parseInt(item.id);
            a.title = item.name;
            let content = item.distance ? `\n（距离您${item.distance}）` : "";
            // a.label = {
            //   content: item.name + content,
            //   textAlign: "center",
            //   anchorY: -55,
            //   color: "#000000",
            //   fontSize: 15,
            //   padding: 2,
            //   bgColor: "#ffffff88"
            // };
            a.callout = {
              color: "#000000",
              content: item.name + content,
              fontSize: 12,
              borderRadius: 5,
              bgColor: "#ffffff88",
              padding: 5,
              textAlign: "center",
              display: "ALWAYS"
            };
            mm.push(a);
          }
        });
        // 停车区域
        let arr = stopRuns.split("|");
        let polygons = [];
        arr.map(item => {
          if (item) {
            let points = [];
            let array = item.split(";");

            for (let i = 0; i < array.length; i++) {
              let b = {};
              b.latitude = array[i].split(",")[1];
              b.longitude = array[i].split(",")[0];
              includePoints.push(b);
              points.push(b);
            }

            let a = {};
            a.points = points;
            a.fillColor = "#1E90FF88";
            a.strokeColor = "#147FF9";
            a.strokeWidth = 2;
            a.zIndex = 1;
            polygons.push(a);
          }
        });
        //骑行区域
        let runarr = runRuns.split("|");
        runarr.map(item => {
          if (item) {
            let points = [];
            let array = item.split(";");

            for (let i = 0; i < array.length; i++) {
              let b = {};
              b.latitude = array[i].split(",")[1];
              b.longitude = array[i].split(",")[0];
              includePoints.push(b);
              points.push(b);
            }

            let a = {};
            a.points = points;
            a.fillColor = "#40E0D088";
            a.strokeColor = "#40E0D0";
            a.strokeWidth = 2;
            a.zIndex = 1;
            polygons.push(a);
          }
        });
        let fee_info = result.data.fee_info;
        includePoints.push(...includePoints, {
          longitude: this.state.longitude,
          latitude: this.state.latitude
        });
        this.setState({
          polygons: polygons,
          markers: mm,
          fee_info: fee_info,
          includePoints: includePoints
        });
      })
      .catch(() => {
        global.$utils.toast.error("查询车辆错误");
      });
  };

  // 结束订单
  handleEnd = async () => {
    let order_id = this.state.order_id;
    let end = 8;
    this.setState({
      progressValue: 0
    });
    await this.getLocation();
    Taro.showModal({
      title: "结束用车",
      content: "是否结束用车？",
      success: res => {
        if (res.confirm) {
          let { progressValue } = this.state;
          let d = {};
          d.device_no = this.state.device_no;
          d.order_id = this.state.order_id || "";
          d.e_address = this.state.address || "";
          let lat = this.state.latitude;
          let lng = this.state.longitude;
          lat = String(lat).replace(/^(.*\..{6}).*$/, "$1");
          lat = Number(lat);
          lng = String(lng).replace(/^(.*\..{6}).*$/, "$1");
          lng = Number(lng);
          this.setState({
            safety: 4
          });
          this.xxl1 = setInterval(() => {
            if (progressValue == 75) {
              return;
            }
            progressValue = Number(progressValue) + 15;
            this.setState({
              progressValue
            });
          }, 1000);
          d.e_lnglat = lng + "," + lat;
          global.$utils.api
            .load("orderEnd", d, "get", {
              toast: false,
              toasterror: false,
              loading: false,
              loadingtext: "正在结束用车"
            })
            .then(result => {
              if (result.code == 1) {
                this.setState(
                  {
                    safety: 5
                  },
                  () => {
                    //  结束订单成功后跳到详情
                    global.$utils.toast.success(result.message);
                    Taro.navigateTo({
                      url: `/pages/order/info?order_id=${order_id}&end=${end}`
                    });
                  }
                );
              } else if (result.code == -5) {
                this.setState({
                  safety: 7,
                  errormessage: result.message
                });
                this.xxl1 && clearInterval(this.xxl1);
                this.xxl && clearInterval(this.xxl);
                Taro.showModal({
                  title: "提示",
                  content: result.message,
                  showCancel: false,
                  confirmText: "我知道了",
                  success: vres => {
                    if (vres.confirm) {
                    }
                  }
                });
              } else if (result.code == -10) {
                this.xxl1 && clearInterval(this.xxl1);
                this.xxl && clearInterval(this.xxl);
                this.setState({
                  isOpened: true,
                  closeLockText: result.message
                });
                // // 关锁等待页
                // Taro.showModal({
                //   title: "提示",
                //   content: result.message,
                //   showCancel: false,
                //   confirmText: "我知道了",
                //   success: vres => {
                //     if (vres.confirm) {
                //       Taro.navigateTo({
                //         url: `/pages/order/waiting?order_id=${order_id}&end=${end}`
                //       });
                //     }
                //   }
                // });
              } else {
                this.setState({
                  safety: 7,
                  errormessage: result.message
                });
                // global.$utils.toast.error(result.message);
                this.xxl1 && clearInterval(this.xxl1);
                this.xxl && clearInterval(this.xxl);
              }
            })
            .catch(err => {
              this.setState({
                safety: 7,
                errormessage: err.message
              });
              // global.$utils.toast.error("结束用车失败");
              this.xxl1 && clearInterval(this.xxl1);
              this.xxl && clearInterval(this.xxl);
            });
        } else if (res.cancel) {
          // 取消结束订单
        }
      }
    });
  };

  //  故障保修
  toWaitPage() {
    let order_id = this.state.order_id;
    let end = 8;
    this.setState({
      isOpened: false
    });
    Taro.navigateTo({
      url: `/pages/order/waiting?order_id=${order_id}&end=${end}`
    });
  }

  // 故障关锁
  handleRepair = () => {
    let order_id = this.state.order_id;
    let device_no = this.state.device_no;
    Taro.navigateTo({
      url: `/pages/repair/index?device_no=${device_no}&order_id=${order_id}&scene=end_order`
    });
  };

  // 地图导航事件
  markerClick = res => {
    console.log("markerClick res", res);
    let markerId = res.detail.markerId || "";
    if (!markerId) {
      return;
    }
    // 通过集合获取标注点信息
    let info = global.$utils.map.getDeviceInfo(markerId, this.state.markers);
    let name = (info && info.title) || "";
    let lat = (info && info.latitude) || "";
    let lon = (info && info.longitude) || "";
    let distance = (info && info.param && info.param.distance) || "";
    if (lat && lon) {
      lat = Number(lat);
      lon = Number(lon);
      // minle = minle / 1000;
      Taro.openLocation({
        // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
        latitude: lat,
        longitude: lon,
        name: name,
        // address: "距离" + distance + " KM",
        success: function(resv) {
          console.log(resv);
        }
      });
    }
  };
  render() {
    const { fee_info, includePoints, progressValue, errormessage } = this.state;
    return (
      <View className={styles.page}>
        <Map
          id="mapcontainer"
          className={styles.map}
          show-location
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          polygons={this.state.polygons}
          markers={this.state.markers}
          includePoints={this.state.includePoints}
          onMarkertap={this.markerClick.bind(this)}
          style="position:fixed;top:0;left:0;right:0;bottom:0;height:100%"
        ></Map>
        {/* <View className={styles.repair_bookWp}>
          <Image
            className={styles.repair_icon}
            onClick={this.toWaitPage.bind(this)}
            src={order_repairPng}
          ></Image>
        </View> */}
        <View className={styles.blues}>
          {this.state.safety == 1 ? (
            <View className={styles.blues_item}>
              <View className={styles.marks_item}>
                正在检查车况、位置，请稍后...
              </View>
              <View className={styles.tooths}>
                <View className={styles.lodeing}></View>
              </View>
              <View className={styles.endbtn}>请到达停车点后还车</View>
            </View>
          ) : (
            ""
          )}

          {this.state.safety == 6 ? (
            <View className={styles.blues_item}>
              <View className={styles.marks_item}>
                您已到达停车点，可以还车
              </View>
              <View className={styles.artic}>小驹游乐提醒您带好随身物品</View>
              <View
                className={styles.confirm}
                onClick={this.handleEnd.bind(this)}
              >
                确定还车
              </View>
            </View>
          ) : (
            ""
          )}

          {/* {this.state.safety == 3 ? (
            <View className={styles.newblues_item}>
              <View className={styles.notarrive}>您还未抵达停车点</View>
              <View className={styles.arrtiveBtn}>
                <View>强制还车会收取</View>
                <View className={styles.arrcove}>
                  {fee_info.fee_dispatch ? fee_info.fee_dispatch + "元" : ""}
                </View>
                <View>非定点还车费哦</View>
              </View>
              <View
                className={styles.confirm}
                onClick={this.handleEnd.bind(this)}
              >
                确定关锁、还车
              </View>
            </View>
          ) : (
            ""
          )} */}
          {this.state.safety == 3 ? (
            <View className={styles.newblues_item}>
              <View className={styles.notarrive}>
                您不在停车点，确定要强制还车吗？
              </View>
              <View className={styles.notarrive_text}>
                地图上的P点蓝色区域是停车点
              </View>
              <View
                className={styles.goAddress}
                onClick={this.handleEnd.bind(this)}
              >
                支付调度费还车
              </View>
              <View
                className={styles.payBtn}
                onClick={() => {
                  Taro.navigateBack();
                }}
              >
                返回上一步查看停车点并前往
              </View>
            </View>
          ) : (
            ""
          )}
          {this.state.safety == 2 ? (
            <View className={styles.newblues_item}>
              <View className={styles.notarrive}>
                您已超出运营区，确定要强制还车吗？
              </View>
              <View className={styles.notarrive_text}>
                地图上绿色区域是运营区范围
              </View>
              <View
                className={styles.goAddress}
                onClick={this.handleEnd.bind(this)}
              >
                支付超区调度费还车
              </View>
              <View
                className={styles.payBtn}
                onClick={() => {
                  Taro.navigateBack();
                }}
              >
                骑回运营区
              </View>
            </View>
          ) : (
            ""
          )}
          {this.state.safety == 4 ? (
            <View className={styles.blues_item}>
              <View className={styles.marks_item}>
                正在关锁还车中 {progressValue}%...
              </View>
              <View className={styles.tooths}>
                <AtActivityIndicator size={64}></AtActivityIndicator>
              </View>
              {/* <View className={styles.endbtn}>请到达停车点后还车</View> */}
            </View>
          ) : (
            ""
          )}

          {this.state.safety == 5 ? (
            <View className={styles.blues_item}>
              <View className={styles.correct}>关锁成功</View>
              <View className={styles.tooths}>
                <CoverImage
                  className={styles.imgsBtn}
                  src={namedPng}
                ></CoverImage>
              </View>
            </View>
          ) : (
            ""
          )}
          {this.state.safety == 7 ? (
            <View className={styles.blues_item}>
              <View className={styles.correct}>关锁失败</View>
              <View className={styles.correcterrormessage}>{errormessage}</View>
              <View className={styles.orderOver}>
                <View
                  className={styles.orderOverback}
                  onClick={() => {
                    Taro.navigateBack();
                  }}
                >
                  暂不还车
                </View>
                <View
                  className={styles.orderOverOk}
                  onClick={this.handleEnd.bind(this)}
                >
                  重新还车
                </View>
              </View>
              {/* <View className={styles.tooths}>
                <CoverImage
                  className={styles.imgsBtn}
                  src={errIconPng}
                ></CoverImage>
              </View> */}
              <View
                className={styles.unlockStatus_flex}
                onClick={() => {
                  this.handleRepair();
                }}
              >
                <CoverImage
                  className={styles.unlockStatus_repair}
                  src={unlockStatusRepair}
                ></CoverImage>
                <View className={styles.unlockStatus_txt}>
                  故障问题快捷处理
                </View>
              </View>
            </View>
          ) : (
            ""
          )}
          {this.state.safety == 1 ? (
            <View className={styles.atactive}>
              <AtActivityIndicator
                color="#13CE66"
                size={100}
              ></AtActivityIndicator>
            </View>
          ) : (
            ""
          )}
        </View>
        <AtModal isOpened={this.state.isOpened} closeOnClickOverlay={false}>
          <AtModalHeader>{this.state.closeLockText}</AtModalHeader>
          <AtModalContent style={{ textAlign: "center" }}>
            <Image
              className={styles.imgsBtn}
              src={closeLockImg}
              style="display:flex;"
            ></Image>
            <View style="text-align: center;">(车锁在左侧后车轮)</View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.toWaitPage.bind(this)}>我知道了</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}

const mapStoreToProps = store => ({
  user: store.user,
  config: store.config
});
const mapDispatchToProps = dispatch => ({
  dispatch: dispatch
});
export default connect(mapStoreToProps, mapDispatchToProps)(Safety);
