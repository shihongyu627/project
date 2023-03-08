import Taro, { Component } from "@tarojs/taro";
import { View, Map, CoverView, CoverImage } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import styles from "./info.module.scss";
import kefuPng from "../../assets/img/order_kefu.png";
import repairPng from "../../assets/img/order_repair.png";
import TelPng from "../../assets/img/order_tel.png";

class OrderInfo extends Component {
  config = {
    navigationBarTitleText: "订单详情"
  };

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      points: [],
      width: 2,
      strokeColor: "#3cbca3",
      borderWidth: 5,
      latitude: "",
      longitude: "",
      orderInfo: "",
      order_id: "",
      end: "",
      includePoints: [],
      polygons: []
    };
  }

  componentDidMount() {
    let params = this.$router.params;
    this.setState({
      end: params.end,
      order_id: params.order_id
    });

    //订单详情
    let d = {};
    d.order_id = params.order_id;
    global.$utils.api.load("orderInfo", d).then(result => {
      let orderInfo = result.data;
      let device_id = result.data.device_id;
      let trid = result.data.amap_trid;
      let stopRuns = orderInfo.device_info.area_stop_points;
      let arreaRuns = orderInfo.device_info.area_run_points;
      let areaStop = orderInfo.device_info.area_stop_points_list;
      let p_lnglat = result.data.p_lnglat;
      // 可视范围-全部设备
      let includePoints = [];
      // 停车点
      let mm = this.state.markers || [];
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
          includePoints.push(a);
          a.width = "30px";
          a.height = "30px";
          a.iconPath = require("../../assets/img/stop.png");
          a.id = parseInt(item.id);
          a.title = item.name;
          let content = item.distance ? `\n（距离您${item.distance}）` : "";
          // a.callout = {
          //   content: item.name + content,
          //   textAlign: "center",
          //   anchorY: -55,
          //   color: "#000000",
          //   fontSize: 15,
          //   padding: 2,
          //   bgColor: "#ffffff88"
          // };
          a.callout = {
            color: "#147FF9",
            content: item.name + content,
            fontSize: 12,
            borderRadius: 5,
            bgColor: "#fff",
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
      let arrRun = arreaRuns.split("|");
      console.log(arrRun, 123);
      // 骑行区域
      arrRun.map(items => {
        if (items) {
          let points = [];
          let array = items.split(";");
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
      // 临时锁车
      if (p_lnglat) {
        let p_lnglatArr = p_lnglat.split(",");
        let p_callout = {
          color: "#f4797a",
          content: "途中临时锁车",
          fontSize: 12,
          borderRadius: 5,
          bgColor: "#fff",
          padding: 5,
          textAlign: "center",
          display: "ALWAYS"
        };
        mm.push({
          id: 11,
          latitude: p_lnglatArr[1],
          longitude: p_lnglatArr[0],
          width: "50px",
          height: "50px",
          callout: p_callout
        });
      }

      this.setState(
        {
          polygons: polygons,
          markers: mm,
          includePoints: includePoints,
          orderInfo: orderInfo
        },
        () => {
          this.trsearch(device_id, trid);
        }
      );
    });
    this.getLocation();
  }

  componentWillUnmount() {
    if (this.state.end == 8) {
      Taro.reLaunch({
        url: "/pages/index/index"
      });
    }
  }

  // 自身位置
  getLocation() {
    let that = this;
    Taro.getLocation({
      type: "gcj02",
      success(res) {
        console.log(res, 9999);
        const longitude = res.longitude;
        const latitude = res.latitude;
        that.setState(
          {
            longitude: longitude,
            latitude: latitude
          },
          () => {
            // 设置定位点
            that.setMap(longitude, latitude);
          }
        );
      }
    });
  }

  // 获取位置，设置标记点
  setMap(longitude, latitude) {
    let { markers, includePoints } = this.state;
    let mm = [
      {
        id: 1,
        width: "30px",
        height: "30px",
        latitude: Number(latitude),
        longitude: Number(longitude),
        iconPath: require("../../assets/icons/selfAddress.png"),
        // label: {
        //   content: "您所在的位置",
        //   textAlign: "center",
        //   anchorY: -55,
        //   color: "#000000",
        //   fontSize: 15,
        //   padding: 2,
        //   bgColor: "#ffffff88"
        // }
        callout: {
          color: "#147FF9",
          content: "您所在的位置",
          fontSize: 12,
          borderRadius: 5,
          bgColor: "#fff",
          padding: 5,
          textAlign: "center",
          display: "ALWAYS"
        }
      }
    ];
    markers.push(...mm);
    includePoints.push({
      longitude: longitude,
      latitude: latitude
    });
    this.setState({
      markers: markers
    });
  }

  trsearch(device_id, trid) {
    let { markers, orderInfo, includePoints } = this.state;
    let that = this;
    let q = {};
    q.device_id = device_id;
    q.trid = trid;
    global.$utils.api.load("userTrsearch", q).then(res => {
      let tracks = res.data.tracks;
      if (tracks[0].counts !== 0) {
        let points_wp = [];

        for (let i = 0; i < tracks.length; i++) {
          tracks[i].points.map(item => {
            let obj = item.location;
            points_wp.push(obj);
          });

          let arr = tracks[i].endPoint.location;
          let endPointindex = arr.lastIndexOf(",");
          let endPointlongitude = Number(arr.substring(0, endPointindex));
          let endPointlatitude = Number(
            arr.substring(endPointindex + 1, arr.length)
          );

          let array = tracks[i].startPoint.location;
          let startPointindex = array.lastIndexOf(",");
          let startPointlongitude = Number(array.substring(0, startPointindex));
          let startPointlatitude = Number(
            array.substring(startPointindex + 1, array.length)
          );
          let callout = {
            color: "#f4797a",
            content: "停车点外还车",
            fontSize: 12,
            borderRadius: 5,
            bgColor: "#fff",
            padding: 5,
            textAlign: "center",
            display: "ALWAYS"
          };
          let mm = [
            {
              id: 2,
              latitude: endPointlatitude,
              longitude: endPointlongitude,
              width: "50px",
              height: "50px",
              iconPath: require("../../assets/icons/zhong.png"),
              callout: orderInfo.is_parking == 0 ? callout : null
            },
            {
              id: 3,
              latitude: startPointlatitude,
              longitude: startPointlongitude,
              width: "50px",
              height: "50px",
              iconPath: require("../../assets/icons/qi.png")
            }
          ];
          markers.push(...mm);
          that.setState({
            markers: markers
          });
        }

        let points = [];
        for (let i = 0; i < points_wp.length; i++) {
          let index = points_wp[i].lastIndexOf(",");
          let longitude = points_wp[i].substring(0, index);
          let latitude = points_wp[i].substring(index + 1, points_wp[i].length);
          let obj = { latitude, longitude };
          includePoints.push(obj);
          points.push(obj);
        }
        that.setState({
          points: points,
          includePoints
        });
      }
    });
  }

  // 费用规则
  feelBtn() {
    let fee_rule = this.state.orderInfo.fee_rule || {};
    let params = global.$utils.url.setUrlKey(fee_rule);
    console.log("fee_rule", fee_rule, params);
    Taro.navigateTo({
      url:
        `/pages/order/rule?isorder=1&order_id=${this.state.order_id}&` + params
    });
  }

  //  故障保修
  onClickBtn() {
    let device_no = this.state.orderInfo.device_no;
    Taro.navigateTo({
      url: `/pages/repair/index?device_no=${device_no}`
    });
  }
  // 复制订单号
  copyOrderNo(order_no) {
    Taro.setClipboardData({
      data: order_no
    });
  }
  //拨打电话
  makePhoneCall = () => {
    if (!this.props.config.kefu_mobile) {
      return;
    }
    Taro.makePhoneCall({
      phoneNumber: this.props.config.kefu_mobile //仅为示例，并非真实的电话号码
    });
  };
  render() {
    let { orderInfo, markers } = this.state;
    console.log(markers);
    return (
      <View className={styles.page}>
        <Map
          className={styles.map}
          show-location
          longitude={this.state.longitude}
          include-points={this.state.points}
          latitude={this.state.latitude}
          includePoints={this.state.includePoints}
          polygons={this.state.polygons}
          polyline={[
            {
              points: this.state.points,
              color: this.state.strokeColor,
              width: this.state.width,
              borderWidth: this.state.borderWidth
            }
          ]}
          markers={this.state.markers}
          style="position:fixed;top:0;left:0;right:0;bottom:0;height:100%"
        ></Map>
        <CoverView className={styles.blues}>
          <CoverView className={styles.blues_item}>
            <CoverView className={styles.noLeft}>
              <CoverView className={styles.noItems}>
                <Button
                  className={styles.noItems_kefu}
                  plain
                  open-type="contact"
                >
                  <CoverImage
                    className={styles.noIcon}
                    src={kefuPng}
                  ></CoverImage>
                </Button>
                <CoverView className={styles.noTitle}>在线咨询</CoverView>
              </CoverView>
              <CoverView
                className={styles.noItems}
                onClick={() => {
                  this.makePhoneCall();
                }}
              >
                <CoverImage className={styles.noIcon} src={TelPng}></CoverImage>
                <CoverView className={styles.noTitle}>客服电话</CoverView>
              </CoverView>
              <CoverView className={styles.noItem} onClick={this.onClickBtn}>
                <CoverImage
                  className={styles.noIcon}
                  src={repairPng}
                ></CoverImage>
                <CoverView className={styles.noTitle}>故障上报</CoverView>
              </CoverView>
            </CoverView>
            <CoverView className={styles.tooths_box}>
              <CoverView className={styles.tooths}>
                {orderInfo.start_time}
              </CoverView>
              <CoverView className={styles.device_no}>
                车辆编号：{orderInfo.device_no}
              </CoverView>
            </CoverView>

            <CoverView className={styles.numImg}>
              <CoverView className={styles.orderNo_box}>
                <CoverView
                  className={styles.nums}
                  onClick={this.copyOrderNo.bind(this, orderInfo.order_no)}
                >
                  订单编号 {orderInfo.order_no}
                </CoverView>
              </CoverView>
              {/* {this.state.end == 8 ? (
                ""
              ) : (
                <CoverView className={styles.justBtns}>
                  <CoverView
                    className={styles.imgsBtn}
                    onClick={this.onClickBtn}
                  >
                    <CoverImage
                      className={styles.imgsBtn}
                      src={require("../../assets/icons/i_tool_2.png")}
                    ></CoverImage>
                  </CoverView>
                  <CoverView
                    className={styles.imgsBtntwo}
                    onClick={() =>
                      Taro.makePhoneCall({
                        phoneNumber: this.props.config.kefu_mobile
                      })
                    }
                  >
                    <CoverImage
                      className={styles.imgsBtntwo}
                      src={require("../../assets/icons/i_tool_3.png")}
                    ></CoverImage>
                  </CoverView>
                </CoverView>
              )} */}
            </CoverView>
            <CoverView className={styles.xian}></CoverView>
            <CoverView className={styles.justfy}>
              <CoverView className={styles.monyuan}>
                {orderInfo.order_money}元
              </CoverView>
              <CoverView className={styles.justguize} onClick={this.feelBtn}>
                <CoverView className={styles.justguize_title}>
                  费用规则
                </CoverView>
                <CoverImage
                  className={styles.rightPng}
                  src={require("../../assets/img/order_right.png")}
                ></CoverImage>
              </CoverView>
            </CoverView>
            <CoverView className={styles.justscssd}>
              <CoverView className={styles.yyuan}>骑行时长</CoverView>
              <CoverView className={styles.yyuan} style="text-align:right;">
                {orderInfo.time}分钟
              </CoverView>
            </CoverView>
            <CoverView className={styles.justscssd} style="margin-top:5px">
              <CoverView className={styles.yyuan}>骑行车费</CoverView>
              <CoverView className={styles.yyuan} style="text-align:right;">
                {orderInfo.order_device_money}元
              </CoverView>
            </CoverView>
            <CoverView className={styles.justscssd} style="margin-top:5px">
              <CoverView className={styles.yyuan} style="color:#f4797a">
                非定点还车费用
              </CoverView>
              <CoverView
                className={styles.yyuan}
                style="text-align:right;color:#f4797a"
              >
                {orderInfo.order_dispatch_money}元
              </CoverView>
            </CoverView>
            <CoverView className={styles.justscssd} style="margin-top:5px">
              <CoverView className={styles.yyuan} style="color:#f4797a">
                超区调度费用
              </CoverView>
              <CoverView
                className={styles.yyuan}
                style="text-align:right;color:#f4797a"
              >
                {orderInfo.order_dispatch_outrun_money}元
              </CoverView>
            </CoverView>
            <CoverView className={styles.justscssdEnd} style="margin-top:10px">
              <CoverView className={styles.yyuanEnd} style="color:#f4797a">
                用车结束后从预付金中抵扣费用，剩余金额自动原路退还
              </CoverView>
            </CoverView>
            <CoverView className={styles.kongfbai}></CoverView>
          </CoverView>
        </CoverView>
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
export default connect(mapStoreToProps, mapDispatchToProps)(OrderInfo);
