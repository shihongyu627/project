import Taro, { Component } from "@tarojs/taro";
import { View, Map, Button, CoverView, CoverImage } from "@tarojs/components";

import styles from "./unlock.module.scss";

import namedPng1 from "../../assets/img/userCar_right.png";
import namedPng3 from "../../assets/img/dian.png";
import namedPng4 from "../../assets/img/p.png";
import namedPng5 from "../../assets/img/white.png";
import namedPng6 from "../../assets/img/succer.png";

class Unlocking extends Component {
  config = {
    navigationBarTitleText: "小驹游乐"
  };

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      device_no: "",
      markers: [],
      polygons: [],
      devInfo: "",
      imgs: "",
      latitude: "",
      longitude: "",
      unlocde: 1
    };
  }

  componentWillMount() {
    this.getLocation();
    let params = this.$router.params;
    console.log(params);
    this.setState({
      device_no: params.device_no
    });
  }

  // 查询车辆信息
  getDeviceInfo = () => {
    let d = {};
    d.device_no = this.state.device_no;
    global.$utils.api
      .load("deviceInfo", d)
      .then(result => {
        console.log(result, "车辆信息");

        if (result.code <= 0) {
          global.$utils.toast.error("车辆信息错误");
          return;
        }
        let arreaRun = result.data.area_run_points;
        let arreaStop = result.data.area_stop_points;
        // 多个区域用 | 分隔
        let arr = arreaRun.split("|");
        let arrstop = arreaStop.split("|");
        // 停车点
        let mm = [];
        arrstop.map(item => {
          let g = {};
          g.longitude = Number(item.split(";")[0].split(",")[0]);
          g.latitude = Number(item.split(";")[0].split(",")[1]);
          g.width = "30px";
          g.height = "30px";
          g.iconPath = require("../../assets/img/stop.png");
          mm.push(g);
        });

        // 骑行区域
        let polygons = [];
        arr.map(item => {
          let points = [];
          // ; 分隔 每个区域的值
          let array = item.split(";");
          for (let i = 0; i < array.length; i++) {
            let b = {};
            b.latitude = array[i].split(",")[1];
            b.longitude = array[i].split(",")[0];
            points.push(b);
          }
          let a = {};
          a.points = points;
          a.fillColor = "#40E0D088";
          a.strokeColor = "#40E0D0";
          a.strokeWidth = 2;
          a.zIndex = 1;
          polygons.push(a);
        });
        // 停车区域
        arrstop.map(item => {
          let points = [];
          let array = item.split(";");

          for (let i = 0; i < array.length; i++) {
            let dd = {};
            dd.latitude = array[i].split(",")[1];
            dd.longitude = array[i].split(",")[0];
            points.push(dd);
          }

          let c = {};
          c.points = points;
          c.fillColor = "#1E90FF88";
          c.strokeColor = "#147FF9";
          c.strokeWidth = 2;
          c.zIndex = 1;
          polygons.push(c);
        });
        let devInfo = result.data;
        let imgs = result.data.product_image;
        this.setState({
          polygons: polygons,
          markers: mm,
          devInfo: devInfo,
          imgs: imgs
        });
      })
      .catch(() => {
        global.$utils.toast.error("查询车辆错误");
      });
  };

  // 确定开锁
  handleSubmit() {
    let that = this;
    Taro.showLoading({
      title: "开锁中"
    });
    setTimeout(function() {
      Taro.hideLoading();
      that.setState(
        {
          unlocde: 2
        },
        () => {
          that.indexBtn();
        }
      );
    }, 1500);
  }
  indexBtn() {
    setTimeout(() => {
      // 骑行页面
      Taro.reLaunch({
        url: `/pages/index/index?device_no=${this.state.device_no}`
      });
    }, 1000);
  }

  // 计价规则
  ruleBtn(devInfo) {
    let device_no = devInfo.device_no;
    let imei = devInfo.imei;
    Taro.navigateTo({
      url: `/pages/order/rule?device_no=${device_no}&imei=${imei}`
    });
  }
  // 获取位置
  getLocation() {
    let that = this;
    Taro.getLocation({
      type: "gcj02",
      success(resv) {
        const longitude = resv.longitude;
        const latitude = resv.latitude;
        that.setState(
          {
            longitude: longitude,
            latitude: latitude
          },
          () => {
            that.getDeviceInfo();
            that.setMap();
          }
        );
      },
      fail: function(res) {
        global.$utils.toast.error(res.message);
        setTimeout(() => {
          global.$utils.url.back();
        }, 1000);
      }
    });
  }

  // 获取位置，设置标记点
  setMap() {}

  render() {
    const { devInfo, imgs, unlocde } = this.state;
    return (
      <View className={styles.page}>
        <Map
          className={styles.map}
          show-location
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          polygons={this.state.polygons}
          markers={this.state.markers}
          style='position:fixed;top:0;left:0;right:0;bottom:0;height:100%'
        ></Map>
        {unlocde == 1 ? (
          <CoverView className={styles.blues}>
            <CoverView className={styles.blues_item}>
              <CoverView className={styles.imgsBtn}>
                {imgs ? (
                  <CoverImage
                    className={styles.imgsBtn}
                    src={imgs}
                  ></CoverImage>
                ) : (
                  <CoverImage
                    className={styles.imgsBtn}
                    src={namedPng5}
                  ></CoverImage>
                )}
              </CoverView>
              <CoverView className={styles.marks_item}>
                {devInfo.name} {devInfo.device_no}
              </CoverView>
              <CoverView className={styles.cars}>
                请在绿色范围内骑行，蓝色区域内还车
              </CoverView>
              <CoverView className={styles.tooths}>
                <CoverView className={styles.timesbtn}>
                  {devInfo.fee_info.min_next}分钟/
                  {devInfo.fee_info.fee_next_min}元
                </CoverView>
                <CoverView
                  className={styles.guizebtn}
                  onClick={this.ruleBtn.bind(this, devInfo)}
                >
                  计价规则
                  <CoverImage
                    className={styles.iconimgbtn}
                    src={namedPng1}
                  ></CoverImage>
                </CoverView>
              </CoverView>

              <CoverView className={styles.kilometre_item}>
                {devInfo.type_name == "电动车" ? (
                  <CoverView className={styles.payDianChe}>
                    <CoverView>
                      <CoverImage
                        className={styles.imgDian}
                        src={namedPng3}
                      ></CoverImage>
                    </CoverView>
                    <CoverView className={styles.qixing}>
                      电量{devInfo.battery_or}{" "}
                    </CoverView>
                    {/* <CoverView className={styles.kilometre}>{devInfo.mileage ? devInfo.mileage + '公里' : ''}</CoverView> */}
                  </CoverView>
                ) : (
                  <CoverView className={styles.payDianChe}>
                    <CoverView className={styles.qixing}>
                      {devInfo.mileage ? "" : ""}
                    </CoverView>
                    {/* <CoverView className={styles.kilometre}>{devInfo.mileage ? devInfo.mileage + '公里' : ''}</CoverView> */}
                  </CoverView>
                )}
                <CoverView className={styles.stopBtn}>
                  <CoverView>
                    <CoverImage
                      className={styles.imgDian}
                      src={namedPng4}
                    ></CoverImage>
                  </CoverView>
                  <CoverView className={styles.stopCar}>
                    请在停车点内还车
                  </CoverView>
                </CoverView>
              </CoverView>

              <CoverView className={styles.right}></CoverView>
            </CoverView>
          </CoverView>
        ) : (
          ""
        )}
        {unlocde == 1 ? (
          <CoverView className={styles.boxBtn}>
            <Button
              size='normal'
              type=''
              circle
              className={styles.submit_btn}
              onClick={this.handleSubmit.bind(this)}
            >
              确认开锁
            </Button>
          </CoverView>
        ) : (
          ""
        )}

        {unlocde == 2 ? (
          <CoverView className={styles.blues_wp}>
            <CoverView className={styles.blues_item_wp}>
              <CoverView className={styles.marks_item_wp}>开锁成功</CoverView>
              <CoverView className={styles.tooths_wps}>
                <CoverImage
                  className={styles.imgsBtn_wp}
                  src={namedPng6}
                ></CoverImage>
              </CoverView>
              <CoverView className={styles.cars_wps}>
                <CoverView className={styles.endbtn} onClick={this.endlocking}>
                  {/* 用车结束 */}
                </CoverView>
                <CoverView className={styles.unlode} onClick={this.lockBtn}>
                  {/* 手动关锁 */}
                </CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        ) : (
          ""
        )}
      </View>
    );
  }
}

export default Unlocking;
