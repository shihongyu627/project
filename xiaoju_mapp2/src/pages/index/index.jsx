import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Map,
  Button,
  CoverView,
  CoverImage,
  Image,
  Swiper,
  SwiperItem
} from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { setQrcodeDeviceNo } from "../../actions/device";
import styles from "./index.module.scss";
import { CommonModal, PhotoModal, CommonToast } from "../components";
import refreshPng from "../../assets/img/refresh.png";
import unlockStatus2 from "../../assets/img/unlockStatus2.png";
import errIcon from "../../assets/img/errIcon.png";
import jingbao from "../../assets/img/jingbao.png";

class Index extends Component {
  config = {
    navigationBarTitleText: "小驹游乐"
  };

  checkLocationChange = false;

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      order_info: {},
      check_now_order: 0,
      device_no: "",
      order_id: "",
      markers: [],
      polygons: [],
      isuse: false,
      time: 0,
      battery: 0,
      mile: 0,
      is_pause: 0,
      money: 0,
      lng: "",
      lat: "",
      device_type: "",
      fee_dispatch: "",
      scan_redirec_is: false, // 入口扫码跳转次数
      bannerList: [],
      checkLocationChange: false,
      is_ele: 0,
      title: "该车辆故障暂不可用",
      content: "可尝试使用其他车辆",
      picImgSrc:
        "https://img.static.idocore.com/upload/xiaoju/2022-12-31/3344919721354.png", //图片链接 https://img.static.idocore.com/upload/xiaoju/2022-12-31/3344919721354.png  https://img.static.idocore.com/upload/xiaoju/2022-12-31/3344919760843.png
      isImgOpened: false, // 入口图片弹窗
      isOpened: false, // 入口提示弹窗
      isStopValue: false, //不在停车点弹窗
      isOperateValue: false, //不在运营区弹窗
      isCommonToast: false, //是否提示
      CommonToastTitle: "正在锁车中", //提示语
      atActivityIndicator: false, //加载动画loading
      CommonToastIcon: "", //图标
      guideType: 1, //1停车点类型导航，2运营区
      isOk: false //车辆停稳确认弹窗
    };
  }

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: "小驹游乐",
      path: "/pages/index/index"
    };
  }

  componentDidMount() {
    let params = this.$router.params || {};
    console.log("index params", params);
    // 判断是否扫码进入
    let qrcode_device_no = "";
    if (params.q) {
      // 扫码进入，识别二维码，判断车辆deviceo_no
      qrcode_device_no = global.$utils.url.getUrlKey(params.q, "m");
      console.log("扫码进入设备二维码编号", qrcode_device_no);
      if (qrcode_device_no) {
        this.props.dispatch(setQrcodeDeviceNo(qrcode_device_no));
      }
    }
    this.setState({
      device_no: params.device_no || ""
    });
    // 轮播图
    this.banner();
  }

  componentDidShow() {
    this.setState({
      check_now_order: 0
    });
    this.getLocation();
    this.xxl = setInterval(async () => {
      await this.checkNow();
    }, 1000);
    setTimeout(() => {
      this.onMove({ type: "end", causedBy: "drag" });
    }, 2000);
  }

  componentDidHide() {
    this.xxl && clearInterval(this.xxl);
  }

  componentWillUnmount() {
    this.xxl && clearInterval(this.xxl);
  }

  // 轮播图
  banner = async () => {
    let d = {};
    d.place = "home_banner";
    let res = await global.$utils.api.load("devicebanner", d);
    if (res && res.data) {
      this.setState({
        bannerList: res.data
      });
    }
  };

  // 检查当前是否有用车
  checkNow = async () => {
    let d = {};
    if (this.state.lng && this.state.lat) {
      d.lnglat = this.state.lng + "," + this.state.lat;
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
      // 判断订单
      if (result.code >= 1) {
        let order_info = result.data || {};
        // 返回device_no
        this.setState(
          {
            isuse: true,
            order_info: order_info,
            order_id: order_info.order_id,
            device_no: order_info.device_no,
            device_type: parseInt(order_info.device_type) || 0,
            battery: order_info.battery || 0,
            time: order_info.time || 0,
            money: order_info.money || 0,
            mile: order_info.mile || 0,
            is_ele: order_info.is_ele || 0,
            is_pause: order_info.is_pause || 0,
            fee_dispatch: order_info.device_info.fee_info.fee_dispatch || 0
          },
          () => {
            console.log("order_info info", order_info);
            console.log("order_info battery", this.state.battery);
            Taro.setNavigationBarTitle({
              title: "骑行中"
            });
          }
        );

        // 开启监听位置变化监听
        this.startLocationChange();
      } else {
        let check_now_order = this.state.check_now_order || 1;
        console.log("订单检查次数check_now_order", check_now_order);
        this.setState(
          {
            isuse: false,
            order_id: null,
            device_type: null,
            device_no: null,
            check_now_order: check_now_order + 1
          },
          () => {
            if (check_now_order > 2) {
              if (this.xxl) {
                this.xxl && clearInterval(this.xxl);
                // 关闭监听位置变化监听
                this.stopLocationChange();
                // 判断是否通过二维码扫码进入
                if (
                  this.props.device.qrcode_device_no &&
                  !this.state.scan_redirec_is
                ) {
                  this.setState(
                    {
                      scan_redirec_is: true
                    },
                    () => {
                      // 直接跳转到扫码支付页面
                      if (
                        !this.props.user.isLogin ||
                        !this.props.user.user_mobile
                      ) {
                        global.$utils.url.push({
                          url: "/pages/auth/index"
                        });
                        return false;
                      }
                      // 扫码跳转
                      this.qrcodeDeviceToPay(
                        this.props.device.qrcode_device_no
                      );
                    }
                  );
                }
              }
            }
          }
        );

        // 关闭监听位置变化监听
        this.stopLocationChange();
      }

      if (result.code == 1 && this.state.polygons.length == 0) {
        let areaStop = result.data.device_info.area_stop_points_list;
        let areaRun = result.data.device_info.area_run_points_list;
        // 停车点
        let mm = this.state.markers || [];
        areaStop.map(item => {
          if (item) {
            let a = {};
            a.longitude = item.lng;
            a.latitude = item.lat;
            a.width = "30px";
            a.height = "30px";
            a.iconPath = require("../../assets/img/stop.png");
            a.id = parseInt(item.id);
            a.title = item.name;
            // a.label = {
            //   content: item.name,
            //   textAlign: "center",
            //   anchorY: -55,
            //   color: "#000000",
            //   fontSize: 15,
            //   padding: 2,
            //   bgColor: "#ffffff88"
            // };
            a.callout = {
              color: "#000000",
              content: item.name,
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
        let polygons = [];
        areaStop.map(item => {
          if (item) {
            let points = [];
            let array = item.points.split(";");
            for (let i = 0; i < array.length; i++) {
              if (array[i]) {
                let b = {};
                b.latitude = array[i].split(",")[1];
                b.longitude = array[i].split(",")[0];
                points.push(b);
              }
            }

            let c = {};
            c.points = points;
            c.fillColor = "#1E90FF88";
            c.strokeColor = "#147FF9";
            c.strokeWidth = 2;
            c.zIndex = 1;
            polygons.push(c);
          }
        });
        // 骑行区域
        areaRun.map(items => {
          if (items) {
            let points = [];
            let arraysf = items.points.split(";");
            for (let i = 0; i < arraysf.length; i++) {
              if (arraysf[i]) {
                let f = {};
                f.latitude = arraysf[i].split(",")[1];
                f.longitude = arraysf[i].split(",")[0];
                points.push(f);
              }
            }
            let dd = {};
            dd.points = points;
            dd.fillColor = "#40E0D088";
            dd.strokeColor = "#40E0D0";
            dd.strokeWidth = 2;
            dd.zIndex = 1;
            polygons.push(dd);
          }
        });

        this.setState({
          markers: mm,
          polygons: polygons
        });
      }
    }
  };

  // 拖动
  onMove = async e => {
    // 骑行期间，不查询附近车辆
    if (this.state.isuse) {
      // this.setState({
      //   markers: []
      // });
      return;
    }
    if (e.type == "end" && (e.causedBy == "scale" || e.causedBy == "drag")) {
      console.log(e);
      this.mapCtx = Taro.createMapContext("map4select");
      this.mapCtx.getCenterLocation({
        type: "gcj02",
        success: async res => {
          const lng = res.longitude.toFixed(6);
          const lat = res.latitude.toFixed(6);
          let q = {};
          q.lnglat = lng + "," + lat;
          q.max_distance = 5000;
          q.page = 1;
          q.psize = 50;
          q.scene = "index_map";
          let mm = await this.searchDevice(q);
          this.setState({
            markers: mm
          });
        }
      });
    }
  };

  // 搜索设备
  searchDevice = async (params = {}) => {
    try {
      let res = await global.$utils.api.load(
        "deviceListsBylnglat",
        params,
        "get",
        {
          toast: false,
          toasterror: false,
          loading: false
        }
      );
      if (res) {
        console.log(res, "查询设备");
        let results = (res.data && res.data.list) || [];
        let mm = [];
        results.map(item => {
          let a = {};
          a.id = parseInt(item.device_no);
          a.latitude = item.lat;
          a.longitude = item.lng;
          a.width = "48px";
          a.height = "48px";
          a.title = item.device_no;
          a.ariaLabel = item.device_no;
          a.iconPath = require("../../assets/icons/bicycle.png");
          a.param = {
            device_no: item.device_no,
            lng: item.lng,
            lat: item.lat,
            distance: item.distance
          };
          mm.push(a);
        });
        return mm;
      } else {
        return [];
      }
    } catch (error) {
      console.log("map searchDevice error", error);
      // global.$utils.toast.error('查询车辆错误')
      return [];
    }
  };

  // 获取位置
  getLocation = async () => {
    let that = this;
    // 回到原来位置
    let mpCtx = Taro.createMapContext("map4select");
    mpCtx.moveToLocation();
    Taro.getLocation({
      type: "gcj02",
      success: async res => {
        console.log("getLocation success", res);
        if (!res) {
          return;
        }
        if (res.longitude && res.latitude) {
          const lng = res.longitude.toFixed(6);
          const lat = res.latitude.toFixed(6);
          this.setState(
            {
              lng: lng,
              lat: lat
            },
            () => {
              // 设置定位点
              // that.setMap(lng, lat);
            }
          );
        }

        // 检查当前订单
        await this.checkNow();
        // 骑行期间，不查询附近车辆
        if (this.state.isuse) {
          // this.setState({
          //   markers: []
          // });
          return;
        }
      },
      fail: err => {
        console.log("getLocation fail", err);
        Taro.getSetting({
          success(res) {
            console.log(res.authSetting);
            if (!res.authSetting["scope.userLocation"]) {
              Taro.showModal({
                title: "请允许定位授权",
                content: "位置-使用小程序时和离开后允许",
                success: result => {
                  console.log("关闭弹窗[请允许定位授权]", result);
                  if (result.confirm) {
                    Taro.openSetting();
                  }
                }
              });
            }
          }
        });
      }
    });
  };
  // 获取位置，设置标记点
  setMap(longitude, latitude) {
    let { markers, includePoints } = this.state;
    let mm = [
      {
        id: 627,
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
        customCallout: {
          display: "ALWAYS"
        },
        callout: {
          color: "#147FF9",
          content: `${"推荐您最近停车点"}` + " 丨 导航",
          fontSize: 14,
          borderRadius: 5,
          bgColor: "#fff",
          padding: 6,
          textAlign: "center",
          display: "ALWAYS"
        }
      }
    ];
    console.log(markers, 9999999999999);
    markers.push(...mm);
    includePoints.push({
      longitude: longitude,
      latitude: latitude
    });
    this.setState({
      markers: markers
    });
  }
  // 开启位置监听位置
  startLocationChange = async () => {
    let that = this;
    // 防止重复弹窗
    if (this.checkLocationChange || this.state.checkLocationChange) {
      return;
    }
    this.checkLocationChange = true;
    this.setState(
      {
        checkLocationChange: true
      },
      () => {}
    );
    console.log(
      "检测位置更新监听checkLocationChange",
      that.state.checkLocationChange
    );
    if (!this.state.startLocationUpdate) {
      Taro.startLocationUpdate({
        success: async res => {
          this.setState(
            {
              startLocationUpdate: true
            },
            () => {
              this.onLocationChange();
            }
          );
          console.log("startLocationUpdate success", res);
        },
        fail: err => {
          console.log("startLocationUpdate fail", err);
          if (
            err.errMsg ==
            "startLocationUpdate:fail 开发者工具暂时不支持此 API 调试，请使用真机进行开发"
          ) {
            this.setState({
              startLocationUpdate: true
            });
            return;
          }
          Taro.getSetting({
            success(res) {
              console.log(res.authSetting);
              if (!res.authSetting["scope.userLocation"]) {
                Taro.showModal({
                  title: "请允许定位授权",
                  content: "位置-使用小程序时和离开后允许",
                  success: result => {
                    console.log("关闭弹窗[请允许定位授权]", result);
                    if (result.confirm) {
                      Taro.openSetting();
                    }
                  }
                });
              }
            }
          });
        }
      });
    }
    if (!this.state.startLocationUpdateBackground) {
      Taro.startLocationUpdateBackground({
        success: async res => {
          this.setState(
            {
              startLocationUpdateBackground: true
            },
            () => {
              this.onLocationChange();
            }
          );
          console.log("startLocationChange success", res);
        },
        fail: err => {
          console.log("startLocationChange fail", err);
          if (
            err.errMsg ==
            "startLocationUpdateBackground:fail 开发者工具暂时不支持此 API 调试，请使用真机进行开发"
          ) {
            this.setState({
              startLocationUpdateBackground: true
            });
            return;
          }
          Taro.getSetting({
            success(res) {
              console.log(res.authSetting);
              if (!res.authSetting["scope.userLocationBackground"]) {
                Taro.showModal({
                  title: "请允许定位授权",
                  content: "位置-使用小程序时和离开后允许",
                  success: result => {
                    console.log("关闭弹窗[请允许定位授权]", result);
                    if (result.confirm) {
                      Taro.openSetting();
                    }
                  }
                });
              }
            }
          });
        }
      });
    }
  };

  // 关闭位置监听位置
  stopLocationChange = async () => {
    this.setState(
      {
        startLocationUpdate: false,
        startLocationUpdateBackground: false
      },
      () => {
        // 取消监听位置变化
        Taro.stopLocationUpdate();
      }
    );
  };

  // 监听位置变化
  onLocationChange = async () => {
    Taro.onLocationChange(res => {
      console.log("onLocationChange res", res);
      if (!res) {
        this.setState({
          lng: "",
          lat: ""
        });
        return;
      }
      if (!this.state.order_id) {
        this.setState({
          lng: "",
          lat: ""
        });
        return;
      }
      if (res.longitude && res.latitude) {
        const lng = res.longitude.toFixed(6);
        const lat = res.latitude.toFixed(6);
        this.setState({
          lng: lng,
          lat: lat
        });
      } else {
        this.setState({
          lng: "",
          lat: ""
        });
      }
    });
  };

  handleUrl(url) {
    // 个人中心
    if (url === "/pages/user/index") {
      if (!this.props.user.isLogin || !this.props.user.user_mobile) {
        return global.$utils.url.push({ url: "/pages/auth/index" });
      }
    }
    global.$utils.url.push({ url: url });
  }

  // 立即用车
  handleSubmit = async () => {
    // 检查车辆-扫码
    this.qrcodeDevice();
  };

  // 扫码用车
  qrcodeDevice = async () => {
    let device_no = await global.$utils.qrcode.scan();
    if (device_no) {
      // 检查车辆-支付跳转
      this.qrcodeDeviceToPay(device_no);
    }
  };
  // 扫码用车-去支付
  qrcodeDeviceToPay = async device_no => {
    if (device_no) {
      try {
        // 查询车辆是否使用中
        let d = {};
        d.device_no = device_no;
        if (this.state.lng && this.state.lat) {
          d.lnglat = this.state.lng + "," + this.state.lat;
        }
        let result = await global.$utils.api.load("deviceCheck", d);
        if (result) {
          if (result.code == 1) {
            global.$utils.url.push({
              url: `/pages/order/pay?device_no=${device_no}`
            });
          }
          if (result.code !== 1) {
            // 弹窗显示
            this.setState({
              isOpened: true,
              title: result.message,
              content: result.smessage
            });
            // Taro.showModal({
            //   title: "",
            //   content: result.message,
            //   showCancel: false,
            //   confirmText: "我知道了",
            //   success: vres => {
            //     if (vres.confirm) {
            //       this.qrcodeDevice();
            //     }
            //   }
            // });
          }
        }
      } catch (error) {
        global.$utils.toast.error("用车失败");
      }
    }
  };
  //推荐最近停车点
  onControlTapClick = res => {
    let { order_info, guideType } = this.state;
    let last_stop_point = order_info.last_stop_point || {};
    let last_run_point = order_info.last_run_point || {};
    console.log("onControlTapClick res", res);
    let name = "";
    let lat = "";
    let lon = "";
    if (guideType == 1) {
      lat = (last_stop_point && last_stop_point.lat) || "";
      lon = (last_stop_point && last_stop_point.lng) || "";
      name = (order_info && order_info.last_stop_name) || "";
    }
    if (guideType == 2) {
      lat = (last_run_point && last_run_point.lat) || "";
      lon = (last_run_point && last_run_point.lng) || "";
      name = (order_info && order_info.last_run_name) || "";
    }
    if (lat && lon) {
      lat = Number(lat);
      lon = Number(lon);
      // minle = minle / 1000;
      Taro.openLocation({
        // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
        latitude: lat,
        longitude: lon,
        name: name,
        success: function(resv) {
          console.log(resv);
        }
      });
    }
  };
  // 地图导航事件
  markerClick = res => {
    this.back();
    console.log("markerClick res", res);
    let markerId = res.detail.markerId || "";
    if (!markerId) {
      return;
    }
    if (markerId == "627") {
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
  // 找附近的车辆
  handleFind = () => {
    this.back();
    if (this.state.isuse) {
      return true;
    }
    global.$utils.toast.success("寻找附近车辆");
    let e = {};
    e.end = true;
    this.onMove(e);
  };

  // 结束用车
  handleEnd() {
    this.setState({
      isOk: false
    });
    let { order_info } = this.state;
    console.log(order_info.run_area_in, order_info.stop_area_in);
    //判断是否再运营区
    if (order_info.run_area_in != 1) {
      this.setState({
        isOperateValue: true
      });
      return;
    }
    //判断是否在停车点
    if (order_info.stop_area_in != 1) {
      this.setState({
        isStopValue: true
      });
      return;
    }
    this.goHandleEnd();
  }
  goOk() {
    this.setState({
      isOk: true
    });
  }
  back() {
    this.setState({
      isOk: false
    });
  }
  goHandleEnd() {
    this.setState(
      {
        isStopValue: false,
        isOperateValue: false
      },
      () => {
        Taro.navigateTo({
          url: `/pages/order/back?device_no=${this.state.device_no}&order_id=${this.state.order_id}`
        });
      }
    );
  }
  // 计价规则
  handleRule = device_no => {
    this.back();
    Taro.navigateTo({
      url: `/pages/order/rule?device_no=${device_no}`
    });
  };
  // 寻铃找车
  handleFindLock = async () => {
    this.back();
    try {
      this.setState({
        isCommonToast: true,
        atActivityIndicator: true,
        CommonToastTitle: "正在寻车中",
        CommonToastIcon: ""
      });
      let d = {};
      d.device_no = this.state.device_no;
      d.action = "FIND_DEVICE";
      let result = await global.$utils.api.load("orderSendPush", d);
      if (result) {
        this.setState(
          {
            isCommonToast: false,
            atActivityIndicator: false
          },
          () => {
            if (result.code >= 1) {
              if (d.action == "FIND_DEVICE") {
                // global.$utils.toast.success("寻车中");
                this.setState(
                  {
                    isCommonToast: true,
                    CommonToastIcon: unlockStatus2,
                    CommonToastTitle: "寻车成功"
                  },
                  () => {
                    setTimeout(() => {
                      this.setState({
                        isCommonToast: false
                      });
                    }, 2000);
                  }
                );
              }
            } else {
              // global.$utils.toast.error(result.message);
              this.setState(
                {
                  isCommonToast: true,
                  CommonToastIcon: errIcon,
                  CommonToastTitle: result.message
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      isCommonToast: false
                    });
                  }, 2000);
                }
              );
            }
          }
        );
      }
    } catch (error) {
      // global.$utils.toast.error("寻车失败" + (error.message || ""));
      this.setState(
        {
          isCommonToast: true,
          CommonToastIcon: errIcon,
          CommonToastTitle: "寻车失败" + (error.message || "")
        },
        () => {
          setTimeout(() => {
            this.setState({
              isCommonToast: false
            });
          }, 2000);
        }
      );
    }
  };

  // 开启锁车和临时锁车
  handleLock = is_pause => {
    this.back();
    console.log("handleLock", is_pause);
    if (is_pause) {
      // 解锁车辆
      Taro.showModal({
        title: "解锁车辆",
        content: "解锁车辆后可正常骑行！",
        success: res => {
          if (res.confirm) {
            this.handleRequestLock(is_pause);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    } else {
      // 临时锁车
      Taro.showModal({
        title: "临时锁车规则",
        content: "使用临时锁车时，将持续计费哦！",
        confirmText: "继续锁车",
        confirmColor: "#ffc821",
        success: res => {
          if (res.confirm) {
            this.handleRequestLock(is_pause);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  };
  handleRequestLock = async is_pause => {
    this.back();
    let device_no = this.state.device_no;
    let d = {};
    d.device_no = this.state.device_no;
    // 锁车状态
    if (is_pause) {
      // 开启锁车
      d.action = "PAUSE_UNLOCK";
    } else {
      // 临时锁车
      d.action = "PAUSE_LOCK";
    }
    // 判断是否可以蓝牙开锁
    if (d.action == "PAUSE_UNLOCK") {
      // lot_d蓝牙开锁
      let devInfo = this.state.order_info.device_info || {};
      if (devInfo.lot_name == "lot_d") {
        let bluetooth_mac = devInfo.bluetooth_mac;
        let bluetooth_key = devInfo.bluetooth_key;
        let bluetooth_pass = devInfo.bluetooth_pass;
        // 获取锁信息
        let dd = await global.$utils.bluetooth.lineDeviceConnect(bluetooth_mac);
        console.log("蓝牙数据：", dd);
        if (dd) {
          global.$utils.bluetooth.sendOpenLockLotd(
            device_no,
            dd.deviceId, // 兼容android和ios
            dd.serviceId,
            dd.write_uuidId,
            dd.read_uuidId,
            bluetooth_key,
            bluetooth_pass,
            async xxres => {
              console.log("PAUSE_UNLOCK: sendOpenLockLotd res:", xxres);
              // 蓝牙开锁成功上报
              if (xxres) {
                // gprs上报
                global.$utils.bluetooth.sendGprsLockUpLotd(
                  device_no,
                  dd.deviceId, // 兼容android和ios
                  dd.serviceId,
                  dd.write_uuidId,
                  dd.read_uuidId,
                  bluetooth_key,
                  bluetooth_pass,
                  xxres1 => {
                    console.log(
                      "PAUSE_UNLOCK: sendGprsLockUpLotd res:",
                      xxres1
                    );
                  }
                );
              }
            }
          );
        }
      }
    }
    // 网络开锁-会进行订单状态变更，不管单车、电动车都是必须的发送的
    try {
      if (d.action == "PAUSE_LOCK") {
        this.setState({
          isCommonToast: true,
          atActivityIndicator: true,
          CommonToastTitle: "正在锁车中",
          CommonToastIcon: ""
        });
      }
      if (d.action == "PAUSE_UNLOCK") {
        this.setState({
          isCommonToast: true,
          atActivityIndicator: true,
          CommonToastTitle: "正在解锁中",
          CommonToastIcon: ""
        });
      }
      let result = await global.$utils.api.load("orderSendPush", d);
      if (result) {
        this.setState(
          {
            isCommonToast: false,
            atActivityIndicator: false
          },
          () => {
            if (result.code >= 1) {
              if (d.action == "PAUSE_LOCK") {
                // global.$utils.toast.success("已锁车");
                this.setState(
                  {
                    isCommonToast: true,
                    CommonToastIcon: unlockStatus2,
                    CommonToastTitle: "锁车成功"
                  },
                  () => {
                    setTimeout(() => {
                      this.setState({
                        isCommonToast: false
                      });
                    }, 2000);
                  }
                );
              }
              if (d.action == "PAUSE_UNLOCK") {
                // global.$utils.toast.success("已解锁");
                this.setState(
                  {
                    isCommonToast: true,
                    CommonToastIcon: unlockStatus2,
                    CommonToastTitle: "解锁成功"
                  },
                  () => {
                    setTimeout(() => {
                      this.setState({
                        isCommonToast: false
                      });
                    }, 2000);
                  }
                );
              }
            } else {
              // global.$utils.toast.error(result.message);
              this.setState(
                {
                  isCommonToast: true,
                  CommonToastIcon: errIcon,
                  CommonToastTitle: result.message
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      isCommonToast: false
                    });
                  }, 2000);
                }
              );
            }
          }
        );
      }
    } catch (error) {
      this.setState(
        {
          isCommonToast: true,
          CommonToastIcon: errIcon,
          CommonToastTitle: "锁车失败" + error.message || ""
        },
        () => {
          setTimeout(() => {
            this.setState({
              isCommonToast: false
            });
          }, 2000);
        }
      );
      // global.$utils.toast.error("锁车失败" + (error.message || ""));
    }
  };

  // 跳转到页面
  toUrl = (title = "", url = "") => {
    if (url) {
      Taro.navigateTo({
        url: `/pages/web/index?title=${title}&url=${encodeURIComponent(url)}`
      });
    }
  };
  comfirmOnClick = () => {
    this.back();
    this.setState({
      isOpened: false,
      isImgOpened: false,
      title: "",
      content: "",
      picImgSrc: ""
    });
  };
  //拨打电话
  makePhoneCall = () => {
    this.back();
    if (!this.props.config.kefu_mobile) {
      return;
    }
    Taro.makePhoneCall({
      phoneNumber: this.props.config.kefu_mobile //仅为示例，并非真实的电话号码
    });
  };
  render() {
    let {
      title,
      content,
      isOpened,
      picImgSrc,
      isImgOpened,
      isCommonToast,
      CommonToastTitle,
      atActivityIndicator,
      CommonToastIcon,
      order_info,
      guideType
    } = this.state;
    return (
      <View className={styles.page}>
        <Map
          id="map4select"
          className={styles.map}
          show-location
          longitude={this.state.lng || 0}
          latitude={this.state.lat || 0}
          polygons={this.state.polygons || []}
          markers={this.state.markers || []}
          // onTap={this.tapsd}
          onMarkertap={this.markerClick.bind(this)}
          onCalloutTap={this.onControlTapClick.bind(this)}
          style="position:absolute;z-index:1;top:0;left:0;right:0;bottom:0;width:100%;height:100%"
          onRegionChange={this.onMove.bind(this)}
        >
          <CoverView slot="callout">
            <CoverView marker-id={627} className={styles.callout}>
              <CoverView className={styles.callout_main}>
                {guideType == 1 ? (
                  <CoverView className={styles.nameBox}>
                    {order_info && order_info.last_stop_text ? (
                      <CoverView className={styles.distance}>
                        {order_info.last_stop_text}
                      </CoverView>
                    ) : null}
                    {order_info && order_info.last_stop_text2 ? (
                      <CoverView className={styles.distance}>
                        {order_info.last_stop_text2}
                      </CoverView>
                    ) : null}
                  </CoverView>
                ) : null}
                {guideType == 2 ? (
                  <CoverView className={styles.nameBox}>
                    {order_info && order_info.last_run_text ? (
                      <CoverView className={styles.distance}>
                        {order_info.last_run_text}
                      </CoverView>
                    ) : null}
                    {order_info && order_info.last_run_text2 ? (
                      <CoverView className={styles.distance}>
                        {order_info.last_run_text2}
                      </CoverView>
                    ) : null}
                  </CoverView>
                ) : null}
                <CoverView className={styles.brLine}></CoverView>
                <CoverView className={styles.guideBtnBox}>
                  <CoverImage
                    className={styles.guideIcon}
                    src={require("../../assets/img/guideIcon.png")}
                  ></CoverImage>
                  <CoverView className={styles.guideBtn}>导航</CoverView>
                </CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        </Map>

        {!this.state.isuse ? (
          <CoverView className={styles.icons}>
            <CoverImage
              src={require("../../assets/img/weiss.png")}
            ></CoverImage>
          </CoverView>
        ) : (
          ""
        )}

        {!this.state.isuse ? (
          <View className={styles.ad_box}>
            <Swiper
              className="test-h"
              indicatorColor="#999"
              indicatorActiveColor="#333"
              circular="true"
              autoplay
            >
              {this.state.bannerList.map((item, index) => (
                <SwiperItem key={index}>
                  <Image
                    src={item.image}
                    className={styles.ad_icon}
                    onClick={this.toUrl.bind(this, item.title, item.linkurl)}
                  />
                </SwiperItem>
              ))}
            </Swiper>
          </View>
        ) : (
          ""
        )}

        {this.state.isuse && this.state.device_type == 1 ? (
          <CoverView className={styles.use_box}>
            <CoverView className={styles.use_t}>
              正在用车：
              <CoverView style="color:#666;width: 150px">
                {this.state.device_no}
              </CoverView>
            </CoverView>
            <CoverView className={styles.show_box}>
              <CoverView className={styles.num_box}>
                {/* <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.mile}
                  </CoverView>
                  <CoverView className={styles.num_t2}>骑行里程(km) </CoverView>
                </CoverView> */}
                <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.time}
                  </CoverView>
                  <CoverView className={styles.num_t2}>使用时长(min)</CoverView>
                </CoverView>
                <CoverView
                  className={styles.num_b}
                  onClick={this.handleRule.bind(this, this.state.device_no)}
                >
                  <CoverView className={styles.num_t}>
                    {this.state.money}
                  </CoverView>
                  <CoverView className={styles.num_t2}>骑行费用(元)</CoverView>
                </CoverView>
              </CoverView>
            </CoverView>
            <CoverView className={styles.btn_box_line}></CoverView>
            <CoverView className={styles.btn_box}>
              <CoverView
                className={styles.btn_b}
                style="flex:1;"
                onClick={this.handleLock.bind(this, this.state.is_pause)}
              >
                <CoverImage
                  src={require("../../assets/icons/i_use_2.png")}
                  className={styles.btn_img}
                />
                <CoverView className={styles.btn_t}>
                  {this.state.is_pause ? "解锁骑行" : "临时锁车"}
                </CoverView>
              </CoverView>
              <CoverView
                className={styles.btn_b}
                style="flex:2;background:#ffc40f;align-self: stretch;"
                onClick={this.goOk.bind(this)}
              >
                <CoverView className={styles.btn_t2}>我要还车</CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        ) : (
          ""
        )}
        {this.state.isOk ? (
          <CoverView className={styles.okModal_box}>
            <CoverView className={styles.ok_box}>
              <CoverView className={styles.jingbao_iconBox}>
                <CoverImage src={jingbao} className={styles.jingbao_icon} />
              </CoverView>
              <CoverView className={styles.show_box}>
                请确认车辆已停稳
              </CoverView>
              <CoverView className={styles.show_text1}>
                行驶中的车辆无法关锁还车
              </CoverView>
              <CoverView className={styles.show_text}>
                请下车将车辆停稳后再还车
              </CoverView>
              <CoverView className={styles.orderOver}>
                <CoverView
                  className={styles.orderOverback}
                  onClick={() => {
                    this.back();
                  }}
                >
                  暂不还车
                </CoverView>
                <CoverView
                  className={styles.orderOverOk}
                  onClick={this.handleEnd.bind(this)}
                >
                  车已停稳 继续还车
                </CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        ) : (
          ""
        )}

        {this.state.isuse &&
        (this.state.device_type == 2 || this.state.device_type == 3) ? (
          <CoverView className={styles.use_box}>
            <CoverView className={styles.use_t}>
              正在用车：
              <CoverView style="color:#666;width: 150px">
                {this.state.device_no}
              </CoverView>
            </CoverView>
            <CoverView className={styles.show_box}>
              <CoverView className={styles.num_box}>
                {/* <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.battery}
                  </CoverView>
                  <CoverView className={styles.num_t2}>剩余电量(%) </CoverView>
                </CoverView> */}
                {/* {this.state.device_type == 2 ? ( */}
                <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.mile || "-"}
                  </CoverView>
                  <CoverView className={styles.num_t2}>
                    {this.state.is_ele == 1 ? "骑行" : "可骑行"}里程(km){" "}
                  </CoverView>
                </CoverView>
                {/* ) : null} */}
                <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.time}
                  </CoverView>
                  <CoverView className={styles.num_t2}>使用时长(min)</CoverView>
                </CoverView>
                <CoverView
                  className={styles.num_b}
                  onClick={this.handleRule.bind(this, this.state.device_no)}
                >
                  <CoverView className={styles.num_t}>
                    {this.state.money}
                  </CoverView>
                  <CoverView className={styles.num_t2}>骑行费用(元)</CoverView>
                </CoverView>
              </CoverView>
            </CoverView>
            <CoverView className={styles.btn_box_line}></CoverView>
            <CoverView className={styles.btn_box}>
              <CoverView
                className={styles.btn_b}
                style="flex:1;"
                onClick={this.handleFindLock.bind(this)}
              >
                <CoverImage
                  src={require("../../assets/icons/i_use_1.png")}
                  className={styles.btn_img}
                />
                <CoverView className={styles.btn_t}>寻车铃</CoverView>
              </CoverView>
              <CoverView
                className={styles.btn_b}
                style="flex:1;"
                onClick={this.handleLock.bind(this, this.state.is_pause)}
              >
                <CoverImage
                  src={require("../../assets/icons/i_use_2.png")}
                  className={styles.btn_img}
                />
                <CoverView className={styles.btn_t}>
                  {this.state.is_pause ? "解锁骑行" : "临时锁车"}
                </CoverView>
              </CoverView>
              <CoverView
                className={styles.btn_b}
                style="flex:2;background:#ffc40f;align-self: stretch;"
                onClick={this.goOk.bind(this)}
              >
                <CoverView className={styles.btn_t2}>我要还车</CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        ) : (
          ""
        )}
        <CoverView className={styles.tool_box}>
          <CoverImage
            src={require("../../assets/icons/i_tool_0.png")}
            className={styles.icon}
            onClick={this.handleFind.bind(this)}
          />
          <CoverImage
            src={require("../../assets/icons/i_tool_1.png")}
            className={styles.icon}
            onClick={this.getLocation.bind(this)}
          />
          <CoverImage
            src={require("../../assets/icons/i_tool_2.png")}
            className={styles.icon}
            onClick={this.handleUrl.bind(
              this,
              "/pages/repair/index?" +
                "device_no=" +
                (this.state.device_no || "")
            )}
          />
          {this.props.config.share_third_url ? (
            <CoverImage
              src={require("../../assets/icons/i_tool_4.png")}
              className={styles.icon}
              onClick={() => {
                if (this.props.config.share_third_url) {
                  this.handleUrl(
                    "/pages/web/index?url=" +
                      this.props.config.share_third_url +
                      "&title=小驹游乐"
                  );
                }
              }}
            />
          ) : (
            ""
          )}
          <CoverView className={styles.iconwp}>
            <Button className={styles.home_content} plain open-type="contact">
              <CoverImage
                src={require("../../assets/icons/i_tool_3.png")}
                className={styles.icon_kefu}
              />
            </Button>
          </CoverView>
          <CoverView
            className={styles.iconwp}
            onClick={() => {
              this.makePhoneCall();
            }}
          >
            <CoverImage
              src={require("../../assets/icons/i_tool_5.png")}
              className={styles.icon_kefu}
            />
          </CoverView>
        </CoverView>
        <CoverView
          className={styles.user_box}
          onClick={this.handleUrl.bind(this, "/pages/user/index")}
        >
          <CoverImage
            src={require("../../assets/icons/i_home_user.png")}
            className={styles.user_icon}
          />
        </CoverView>

        {this.state.isuse ? (
          <CoverView className={styles.submit_box_stop}>
            <CoverView className={styles.submit_btn_stop}>
              {/* <CoverView>
                <CoverImage
                  src={require("../../assets/icons/stopc.png")}
                  className={styles.stopImg}
                />
              </CoverView> */}

              <CoverView>
                <CoverView className={styles.stop_item}>
                  请在地图上的绿色范围内骑行，蓝色区域内还车
                </CoverView>
                <CoverView className={styles.stop_wp}>
                  违规还车将额外加收调度费哦
                  {/* 违规还车最高收取{this.state.fee_dispatch}元调度费 */}
                </CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        ) : (
          <CoverView className={styles.submit_box}>
            <Button
              size="normal"
              type="primary"
              circle
              className={styles.submit_btn}
              onClick={this.handleSubmit.bind(this)}
            >
              扫码开锁
            </Button>
          </CoverView>
        )}
        {isOpened ? (
          <CommonModal
            title={title}
            content={content}
            comfirmOnClick={this.comfirmOnClick}
          ></CommonModal>
        ) : null}
        {isImgOpened ? (
          <PhotoModal
            title={title}
            picImgSrc={picImgSrc}
            comfirmOnClick={this.comfirmOnClick}
          ></PhotoModal>
        ) : null}
        {this.state.isStopValue ? (
          <CoverView className={styles.blues}>
            <CoverView className={styles.newblues_item}>
              <CoverView className={styles.notarrive}>
                您不在停车点，还车请前往停车点
              </CoverView>
              <CoverView className={styles.notarrive_text}>
                地图上的P点蓝色区域是停车点
              </CoverView>
              <CoverView
                className={styles.goAddress}
                onClick={() => {
                  this.setState(
                    {
                      isStopValue: false,
                      guideType: 1
                    },
                    () => {
                      this.setMap(this.state.lng, this.state.lat);
                    }
                  );
                }}
                // onClick={this.handleEnd.bind(this)}
              >
                查看停车点并前往
              </CoverView>
              <CoverView
                className={styles.payBtn}
                onClick={this.goHandleEnd.bind(this)}
              >
                支付调度费还车
              </CoverView>
              <CoverView
                className={styles.stopAddress}
                onClick={() => {
                  this.getLocation();
                }}
              >
                <CoverImage
                  className={styles.refreshPng}
                  src={refreshPng}
                  style="display:flex;"
                ></CoverImage>
                已在停车点？刷新定位试试
              </CoverView>
            </CoverView>
          </CoverView>
        ) : (
          ""
        )}
        {this.state.isOperateValue ? (
          <CoverView className={styles.blues}>
            <CoverView className={styles.newblues_item}>
              <CoverView className={styles.notarrive}>
                您已超出运营区，附近无停车点
              </CoverView>
              <CoverView className={styles.notarrive_text}>
                地图上绿色区域是运营区范围
              </CoverView>
              <CoverView
                className={styles.goAddress}
                onClick={() => {
                  this.setState(
                    {
                      isOperateValue: false,
                      guideType: 2
                    },
                    () => {
                      this.setMap(this.state.lng, this.state.lat);
                    }
                  );
                }}
              >
                骑回运营区
              </CoverView>
              <CoverView
                className={styles.payBtn}
                onClick={this.goHandleEnd.bind(this)}
              >
                支付超区调度费还车
              </CoverView>
              <CoverView
                className={styles.stopAddress}
                onClick={() => {
                  this.getLocation();
                }}
              >
                <CoverImage
                  className={styles.refreshPng}
                  src={refreshPng}
                  style="display:flex;"
                ></CoverImage>
                已在停车点？刷新定位试试
              </CoverView>
            </CoverView>
          </CoverView>
        ) : (
          ""
        )}
        <CommonToast
          title={CommonToastTitle}
          icon={CommonToastIcon}
          isOpened={isCommonToast}
          atActivityIndicator={atActivityIndicator}
        />
      </View>
    );
  }
}

const mapStoreToProps = store => ({
  user: store.user,
  config: store.config,
  device: store.device
});
const mapDispatchToProps = dispatch => ({
  dispatch: dispatch
});
export default connect(mapStoreToProps, mapDispatchToProps)(Index);
