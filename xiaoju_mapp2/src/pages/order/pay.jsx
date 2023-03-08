import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Map,
  Image,
  Picker,
  CoverView,
  CoverImage
} from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { delQrcodeDeviceNo } from "../../actions/device";
import { CommonModal, PhotoModal } from "../components";
import styles from "./pay.module.scss";
// import namedPng from "../../assets/img/ditu.png";
// import namedPng1 from "../../assets/img/userCar_right.png";
// import namedPng2 from "../../assets/img/hicon.png";
// import namedPng3 from "../../assets/img/dian.png";
// import namedPng4 from "../../assets/img/p.png";
// import namedPng5 from "../../assets/img/white.png";
// import namedPng6 from "../../assets/icons/pices.png";
import namedPng7 from "../../assets/img/address.png";
import namedPng8 from "../../assets/img/order_dianliang.png";
import namedPng9 from "../../assets/img/pay_right.png";
import book from "../../assets/img/book.png";
import search from "../../assets/img/search.png";
import namedPng10 from "../../assets/img/right.png";
import unlockStatus2 from "../../assets/img/unlockStatus2.png";
import unlockStatusRepair from "../../assets/img/unlockStatus_repair.png";
import { AtActivityIndicator } from "taro-ui";
import { async } from "regenerator-runtime";

class Payment extends Component {
  _reConnect = 0; // 重试次数
  config = {
    navigationBarTitleText: "确认开锁"
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
      isSubmit: false,
      address: "",
      devInfo: "",
      imgs: "",
      latitude: 0,
      longitude: 0,
      address_value: [0, 0],
      store_id: "",
      store_name: "",
      AreaDroplist: [],
      isImgOpened: false, // 入口图片弹窗
      title: "",
      unlockStatus: "0", //0 未开锁  1，开锁中，2已开锁，3开锁失败
      progressValue: 0,
      order_id: "",
      refundValue: false,
      picImgSrc:
        "https://img.static.idocore.com/upload/xiaoju/2022-12-31/3344919721354.png" //图片链接 https://img.static.idocore.com/upload/xiaoju/2022-12-31/3344919721354.png  https://img.static.idocore.com/upload/xiaoju/2022-12-31/3344919760843.png
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

  componentDidHide() {
    // 通过扫码跳转直接取消qrcode_uuid
    this.xxl && clearInterval(this.xxl);
    this.props.dispatch(delQrcodeDeviceNo());
  }

  componentWillUnmount() {
    // 通过扫码跳转直接取消qrcode_uuid
    this.xxl && clearInterval(this.xxl);
    this.props.dispatch(delQrcodeDeviceNo());
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
        let areaRun = result.data.area_run_points_list;
        let arrStop = result.data.area_stop_points_list;
        // 多个区域用 | 分隔
        // let arr = arreaRun.split("|");
        // let arrstop = arreaStop.split("|");
        // 停车点
        let mm = [];
        arrStop.map(item => {
          if (item) {
            let g = {};
            g.longitude = item.lng;
            g.latitude = item.lat;
            g.width = "30px";
            g.height = "30px";
            g.iconPath = require("../../assets/img/stop.png");
            g.id = parseInt(item.id);
            g.name = item.name;
            mm.push(g);
          }
        });

        // 骑行区域
        let polygons = [];
        areaRun.map(item => {
          if (item) {
            let points = [];
            // ; 分隔 每个区域的值
            let array = item.points.split(";");
            for (let i = 0; i < array.length; i++) {
              if (array[i]) {
                let b = {};
                b.latitude = array[i].split(",")[1];
                b.longitude = array[i].split(",")[0];
                points.push(b);
              }
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
        // 停车区域
        arrStop.map(item => {
          if (item) {
            let points = [];
            let array = item.points.split(";");
            for (let i = 0; i < array.length; i++) {
              if (array[i]) {
                let dd = {};
                dd.latitude = array[i].split(",")[1];
                dd.longitude = array[i].split(",")[0];
                points.push(dd);
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
        let devInfo = result.data;
        let imgs = result.data.image
          ? result.data.image
          : result.data.product_image
          ? result.data.product_image
          : "";
        this.setState(
          {
            polygons: polygons,
            markers: mm,
            devInfo: devInfo,
            imgs: imgs
          },
          () => {
            // 查询停车区域
            this.storeStopLists();
          }
        );
      })
      .catch(() => {
        global.$utils.toast.error("查询车辆错误");
      });
  };

  // 查询车辆是否使用中
  checkDevice = () => {
    $utils.loading.show("支付中");
    let d = {};
    d.device_no = this.state.device_no;
    global.$utils.api
      .load("deviceCheck", d, "post", { loading: false })
      .then(result => {
        if (result.code == 1) {
          // 创建订单
          this.crederBtn();
          return;
        }
        $utils.loading.hide();
        // 弹窗显示
        Taro.showModal({
          title: "",
          content: result.message,
          showCancel: false,
          confirmText: "我知道了"
        });
      })
      .catch(() => {
        $utils.loading.hide();
        global.$utils.toast.error("查询车辆错误");
      });
  };

  // 创建订单
  crederBtn() {
    let that = this;
    let d = {};
    d.device_no = this.state.device_no;
    d.s_address = this.state.address || "";
    let lat = this.state.latitude;
    let lng = this.state.longitude;
    lat = String(lat).replace(/^(.*\..{6}).*$/, "$1");
    lat = Number(lat);
    lng = String(lng).replace(/^(.*\..{6}).*$/, "$1");
    lng = Number(lng);
    if (lng && lat) {
      d.s_lnglat = lng + "," + lat;
    }
    global.$utils.api
      .load("orderCreate", d, "post", { loading: false })
      .then(result => {
        if (result.code == 1) {
          let order_id = result.data.order_id;
          if (order_id) {
            // 判断是否支付跳转页面
            if (result.data.is_pay == 1) {
              this.setState(
                {
                  order_id
                },
                () => {
                  this.outTrade(result.data.out_trade_no);
                }
              );
            } else {
              $utils.loading.hide();
              // 支付成功跳转
              this._reConnect = 0;
              that.setState(
                {
                  order_id,
                  unlockStatus: 1
                },
                () => {
                  that.paySuccess();
                }
              );
              // that.paySuccess();
              // Taro.navigateTo({
              //   url: `/pages/order/unlock?order_id=${order_id}&device_no=${this.state.device_no}`
              // });
            }
          }
        } else {
          $utils.loading.hide();
          Taro.showModal({
            title: "",
            content: result.message,
            showCancel: false,
            confirmText: "我知道了",
            success: vres => {
              if (vres.confirm) {
                // global.$utils.url.back();
              }
            }
          });
          // global.$utils.toast.error(result.message);
        }
      })
      .catch(error => {
        $utils.loading.hide();
        global.$utils.toast.error("下单错误" + (error.message || ""));
      });
  }

  // 支付
  handleSubmit() {
    // 防止重复提交
    if (this.state.isSubmit) {
      return;
    }
    this.setState(
      {
        isSubmit: true
      },
      () => {
        console.log("提交订单handleSubmit isSubmit", true);
      }
    );
    setTimeout(() => {
      this.setState({
        isSubmit: false
      });
    }, 2500);
    // 获取定位
    this.getLocation();
    // return
    let that = this;
    let devInfo = this.state.devInfo || {};
    // 检查网络
    Taro.getNetworkType({
      success: res => {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        let networkType = res.networkType;
        if (networkType == "none") {
          global.$utils.toast.error("请检查网络");
        } else {
          // 非电动车需要检查蓝牙
          if (devInfo.lot_name == "lot_c" || devInfo.lot_name == "lot_e") {
            // 检查车辆-下单-支付
            that.checkDevice();
          } else {
            // 检查蓝牙
            Taro.openBluetoothAdapter({
              success: res1 => {
                console.log("handleSubmit", res1);
                // 检查车辆-下单-支付
                that.checkDevice();
              },
              fail: error => {
                console.log(error);
                // !此时小程序蓝牙模块已经初始化完成
                // if (error.errCode == 10001) {
                //   // 跳过打开蓝牙-检查车辆-下单-支付
                //   that.checkDevice();
                //   return;
                // }
                // 弹窗显示
                that.setState({
                  isImgOpened: true,
                  title: "请先打开蓝牙"
                });
                // Taro.showModal({
                //   title: "温馨提示",
                //   content:
                //     "开启蓝牙失败，请尝试:\n(1)重新打开手机蓝牙 \n(2)进入设置-微信应用-授权蓝牙权限 \n(3)点击重试",
                //   confirmText: "重试",
                //   success: sres => {
                //     if (sres.cancel) {
                //       return false;
                //     } else {
                //       this.handleSubmit();
                //     }
                //   }
                // });
                if (
                  error.errMsg ==
                  "openBluetoothAdapter:fail 目前蓝牙调试功能暂不支持 Mac 以外的平台"
                ) {
                  // 跳过打开蓝牙-检查车辆-下单-支付
                  // that.checkDevice();
                  return;
                }
              }
            });
          }
        }
      },
      fail: () => {
        // 检查蓝牙
        Taro.openBluetoothAdapter({
          success: res => {
            console.log("handleSubmit", res);
            // 检查车辆-下单-支付
            that.checkDevice();
          },
          fail: error => {
            console.log(error);
            // 弹窗显示
            that.setState({
              isImgOpened: true,
              title: "请先打开蓝牙"
            });
            // Taro.showModal({
            //   title: "温馨提示",
            //   content:
            //     "开启蓝牙失败，请尝试:\n(1)重新打开手机蓝牙 \n(2)进入设置-微信应用-授权蓝牙权限 \n(3)点击重试",
            //   confirmText: "重试",
            //   success: sres => {
            //     if (sres.cancel) {
            //       return false;
            //     } else {
            //       this.handleSubmit();
            //     }
            //   }
            // });
            if (
              error.errMsg ==
              "openBluetoothAdapter:fail 目前蓝牙调试功能暂不支持 Mac 以外的平台"
            ) {
              // 跳过打开蓝牙-检查车辆-下单-支付
              that.checkDevice();
              return;
            }
            global.$utils.toast.error("请先开启蓝牙");
          }
        });
      }
    });
  }
  outTrade(out_trade_no) {
    let that = this;
    let d = {};
    d.out_trade_no = out_trade_no;
    if (process.env.TARO_ENV === "weapp") {
      d.pay_ment = "wechat";
    }
    if (process.env.TARO_ENV === "alipay") {
      d.pay_ment = "alipay";
    }
    d.pay_type = "mini";
    global.$utils.api
      .load("orderPay", d, "post", { loading: false })
      .then(result => {
        console.log(result, "555555");
        $utils.loading.hide();
        if (result.code == 1) {
          let payinfo = result.data.paydata;
          console.log(payinfo, "支付");
          // 微信支付
          if (process.env.TARO_ENV === "weapp") {
            Taro.requestPayment({
              timeStamp: payinfo.timeStamp,
              nonceStr: payinfo.nonceStr,
              package: payinfo.package,
              signType: "MD5",
              paySign: payinfo.paySign,
              success: res => {
                console.log(res, "res");
                // 支付成功跳转
                this._reConnect = 0;
                that.setState(
                  {
                    unlockStatus: 1
                  },
                  () => {
                    that.paySuccess();
                  }
                );
                // that.paySuccess();
              },
              fail: err => {
                // 取消支付
                // global.$utils.toast.error("取消支付" + (err.message || ""));
                let errMsg = "支付错误";
                if (err.errMsg == "requestPayment:fail cancel") {
                  errMsg = "取消支付";
                } else {
                  errMsg += "\n" + err.errMsg;
                }
                Taro.showModal({
                  title: "",
                  content: errMsg,
                  showCancel: false,
                  confirmText: "我知道了",
                  success: vres => {
                    if (vres.confirm) {
                      // todo;
                    }
                  }
                });
              }
            });
          }
          // 支付宝支付
          if (process.env.TARO_ENV === "alipay") {
            Taro.tradePay({
              tradeNO: "",
              success: res => {
                Taro.alert({
                  content: JSON.stringify(res)
                });
              },
              fail: res => {
                Taro.alert({
                  content: JSON.stringify(res)
                });
              }
            });
          }
        } else {
          // global.$utils.toast.error(result.message);
          Taro.showModal({
            title: "",
            content: result.message,
            showCancel: false,
            confirmText: "我知道了",
            success: vres => {
              if (vres.confirm) {
                // global.$utils.url.back();
              }
            }
          });
        }
      })
      .catch(err => {
        $utils.loading.hide();
        global.$utils.toast.error("支付请求错误" + (err.message || ""));
      });
  }
  // 检查当前是否有用车
  checkPushResult = async () => {
    let d = {};
    d.order_id = this.state.order_id;
    global.$utils.api.load("orderInfo", d).then(result => {
      // 判断订单
      if (result.code >= 1) {
        let dd = result.data || {};
        if (dd.f_m_id && dd.device_no) {
          this.getPushResult(dd.device_no || "", dd.f_m_id || "");
          return;
        }
        this.toRunHome();
      } else {
        this.toRunHome();
      }
    });
  };
  getPushResult = async (device_no, f_m_id) => {
    let { progressValue } = this.state;
    let that = this;
    this.xxl = setInterval(() => {
      if (progressValue == 75) {
        return;
      }
      progressValue = Number(progressValue) + 15;
      this.setState({
        progressValue
      });
    }, 1000);
    let d = {};
    d.device_no = device_no;
    d.m_id = f_m_id;
    let result = await global.$utils.api.load("getPushResult", d, "get", {
      toast: false,
      toasterror: false,
      loading: false
    });
    if (result) {
      // 判断订单
      if (result.code == 1) {
        this.setState(
          {
            unlockStatus: 2
          },
          () => {
            this.toRunHome();
          }
        );
      } else {
        this.setState({
          unlockStatus: 3
        });
        if (result.code == "-39") {
          this.setState({
            refundValue: true
          });
          return;
        }
        Taro.showModal({
          title: "提示",
          content: result.message,
          showCancel: false,
          confirmText: "确认",
          success: vres => {
            if (vres.confirm) {
              if (result.code == "-37" || result.code == "-38") {
                that.setState({
                  unlockStatus: 0
                });
                return;
              }
              that.toRunHome();
            }
          }
        });
      }
    }

    //unlockStatus 2 开锁成功  3开锁失败
  };
  // 计价规则
  ruleBtn(devInfo) {
    let device_no = devInfo.device_no;
    let imei = devInfo.imei;
    Taro.navigateTo({
      url: `/pages/order/rule?device_no=${device_no}&imei=${imei}`
    });
  }
  // 计价规则
  handleToStoreUrl = () => {
    let store_info =
      (this.state.devInfo && this.state.devInfo.store_info) || {};
    if (store_info) {
      if (store_info["linkurl_out"]) {
        let title = store_info["store_name"];
        let url = encodeURIComponent(store_info["linkurl_out"]);
        Taro.navigateTo({
          url: `/pages/web/index?url=${url}&title=${title}`
        });
      }
    }
  };
  // 获取位置
  getLocation() {
    let that = this;
    Taro.getLocation({
      type: "gcj02",
      success(res) {
        console.log("getLocation success", res);
        if (!res) {
          return;
        }
        const longitude = res.longitude;
        const latitude = res.latitude;
        that.setState(
          {
            lng: longitude,
            lat: latitude
          },
          () => {
            global.qqmapsdk.reverseGeocoder({
              location: {
                latitude: latitude,
                longitude: longitude
              },
              success: function(resv) {
                console.log(res, "2222222");
                let address = resv.result.address;
                if (address) {
                  that.setState(
                    {
                      address: address,
                      longitude: longitude,
                      latitude: latitude,
                      lng: longitude,
                      lat: latitude
                    },
                    () => {
                      that.getDeviceInfo();
                      that.setMap();
                    }
                  );
                }
              },
              fail: function(resv) {
                global.$utils.toast.error(resv.message);
                setTimeout(() => {
                  global.$utils.url.back();
                }, 1000);
              }
            });
          }
        );
        // that.setState(
        //   {
        //     longitude: longitude,
        //     latitude: latitude,
        //     lng: longitude,
        //     lat: latitude
        //   },
        //   () => {
        //     that.getDeviceInfo();
        //     that.setMap();
        //   }
        // );
      },
      fail: function(err) {
        console.log("getLocation fail");
        if (
          err.errMsg ==
          "getLocation:fail 频繁调用会增加电量损耗，可考虑使用 wx.onLocationChange 监听地理位置变化"
        ) {
        } else {
          // 弹窗显示
          Taro.showModal({
            title: "",
            content: "定位失败，请检查手机定位",
            showCancel: false,
            confirmText: "我知道了",
            success: vres => {
              if (vres.confirm) {
                // global.$utils.url.back();
              }
            }
          });
        }
      }
    });
  }

  // 获取位置，设置标记点
  setMap() {}

  // 支付成功跳转
  paySuccess = async () => {
    // !提示开锁中，然后跳转到骑行页面
    // !如果需要修改，请先确认需求
    // Taro.showLoading({
    //   title: "开锁中"
    // });

    // 重试次数+1
    this._reConnect++;
    // 如果重试次数>5，则跳转到骑行页面
    if (this._reConnect > 5) {
      // !跳转到骑行页面
      this.toRunPage();
      return;
    }

    try {
      // !判断lot_d蓝牙开锁
      // lot_d蓝牙开锁
      let devInfo = this.state.devInfo;
      let device_no = devInfo.device_no;
      if (devInfo.lot_name == "lot_d") {
        let bluetooth_mac = devInfo.bluetooth_mac;
        let bluetooth_key = devInfo.bluetooth_key;
        let bluetooth_pass = devInfo.bluetooth_pass;
        // 获取锁信息
        let dd = await global.$utils.bluetooth.lineDeviceConnect(bluetooth_mac);
        if (!dd) {
          // !重试开锁
          Taro.hideLoading();
          this.paySuccess();
          return false;
        }
        console.log("蓝牙数据：", dd);
        global.$utils.bluetooth.sendOpenLockLotd(
          device_no,
          dd.deviceId, // 兼容android和ios
          dd.serviceId,
          dd.write_uuidId,
          dd.read_uuidId,
          bluetooth_key,
          bluetooth_pass,
          async xxres => {
            console.log("paySuccess: sendOpenLockLotd res:", xxres);
            // 蓝牙开锁失败再次网络开锁
            if (!xxres) {
              // 二次蓝牙开锁
              global.$utils.bluetooth.sendOpenLockLotd(
                device_no,
                dd.deviceId, // 兼容android和ios
                dd.serviceId,
                dd.write_uuidId,
                dd.read_uuidId,
                bluetooth_key,
                bluetooth_pass,
                async xxres2 => {
                  console.log("paySuccess: sendOpenLockLotd2 res:", xxres2);
                  if (!xxres2) {
                    let dx = {};
                    dx.device_no = device_no;
                    dx.action = "OPEN_LOCK";
                    let resultx = await global.$utils.api.load(
                      "deviceOpenLock",
                      dx
                    );
                    if (resultx) {
                      if (resultx.code >= 1) {
                        // global.$utils.toast.success("已开锁");
                        // !跳转到骑行页面
                        this.toRunPage();
                      } else {
                        global.$utils.toast.error(resultx.message);
                        // !重试开锁
                        Taro.hideLoading();
                        this.paySuccess();
                      }
                    } else {
                      // !重试开锁
                      Taro.hideLoading();
                      this.paySuccess();
                    }
                  } else {
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
                          "paySuccess: sendGprsLockUpLotd2 res:",
                          xxres1
                        );
                      }
                    );
                  }
                  // !跳转到骑行页面
                  this.toRunPage();
                }
              );
            } else {
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
                  console.log("paySuccess: sendGprsLockUpLotd res:", xxres1);
                }
              );
              // !跳转到骑行页面
              this.toRunPage();
            }
          }
        );

        // 超时跳转到骑行页面
        setTimeout(() => {
          // !跳转到骑行页面
          this.toRunPage();
        }, 10000);
      } else {
        // 网络开锁
        let dx = {};
        dx.device_no = device_no;
        dx.action = "OPEN_LOCK";
        let resultx = await global.$utils.api.load("deviceOpenLock", dx);
        if (resultx) {
          if (resultx.code >= 1) {
            // global.$utils.toast.success("已开锁");
            // !跳转到骑行页面
            this.toRunPage();
          } else {
            global.$utils.toast.error(resultx.message);
            // !重试开锁
            Taro.hideLoading();
            this.paySuccess();
          }
        } else {
          // !重试开锁
          Taro.hideLoading();
          this.paySuccess();
        }
      }
    } catch (error) {
      // !重试开锁
      Taro.hideLoading();
      this.paySuccess();
    }
  };
  // 跳转到骑行页面
  toRunPage = () => {
    this.checkPushResult();
  };
  // 跳转到骑行页面
  toRunHome = () => {
    setTimeout(() => {
      // 骑行页面
      Taro.reLaunch({
        url: `/pages/index/index?device_no=${this.state.device_no}`
      });
      Taro.hideLoading();
    }, 1000);
  };
  // 获取停车点
  storeStopLists = () => {
    Taro.showNavigationBarLoading();
    let devInfo = this.state.devInfo || {};
    let d = {};
    d.device_no = devInfo.device_no;
    d.store_id = devInfo.store_id;
    global.$utils.api
      .load("deviceStoreStopLists", d, "get", {
        toast: false,
        toasterror: false,
        loading: false
      })
      .then(result => {
        if (result.code > 0) {
          let datas = result.data || [];
          if (datas.length > 0) {
            let a = datas[0];
            this.setState(
              {
                c_id: a.id,
                c_name: a.name,
                AreaDroplist: datas
              },
              () => {
                this.pickerSetRange();
              }
            );
          }
          Taro.hideNavigationBarLoading();
        }
      })
      .catch(err => {
        console.log("deviceStoreStopLists error", err);
      });
  };
  // 弹出弹窗选择地址
  pickerClick = () => {
    console.log("pickerClick");
    let address_value = this.state.address_value || [0, 0];
    this.pickerSetRange(address_value);
  };
  // 选择器设置选择范围
  pickerSetRange = (value = [0, 0]) => {
    console.log("pickerSetRange");
    let areaDroplist = this.state.AreaDroplist || [];
    // 更新range范围
    let range = [];
    areaDroplist.map(e => {
      let x = {};
      x.id = e.id;
      x.name = e.name;
      x.center = e.center;
      x.lng = e.lng;
      x.lat = e.lat;
      x.tree = [];
      if (e.tree) {
        e.tree.map(ee => {
          let xx = {};
          xx.id = ee.id;
          xx.name = ee.name;
          xx.center = ee.center;
          xx.lng = ee.lng;
          xx.lat = ee.lat;
          x.tree.push(xx);
        });
      }
      range.push(x);
    });
    console.log("pickerSetRange range", range);
    let pickerRange = range; //, range[value[0]].tree
    this.setState(
      {
        ranges: pickerRange
      },
      () => {
        // 触发选择器
        let e = {};
        e.detail = {};
        e.column = value[0];
        e.value = value[1];
        this.pickerColumnChange(e);
      }
    );
    console.log("pickerSetRange ranges", pickerRange);
  };

  // 选择器列变化
  pickerColumnChange = e => {
    console.log("pickerColumnChange", e);
  };
  // 选择器确认
  pickerChange = e => {
    console.log("pickerChange", e);
    let value = e.detail.value;
    console.log("pickerChange value", value);
    // 获取选中项
    let pickerRange = this.state.ranges;
    let v1 = pickerRange[value[0]]; // 第一列值
    console.log("pickerChange v1 v2", v1);
    this.setState(
      {
        address_value: value,
        c_id: v1.id,
        c_name: v1.name,
        c_center: v1.center,
        longitude: v1.lng,
        latitude: v1.lat
      },
      () => {
        // !跳转到停车点
        console.log("address_value", this.state.address_value);
      }
    );
  };
  // 选择器取消区
  pickerCancel = () => {
    console.log("pickerCancel");
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
    let name = (info && info.name) || "";
    let lat = (info && info.latitude) || "";
    let lon = (info && info.longitude) || "";
    if (lat && lon) {
      lat = Number(lat);
      lon = Number(lon);
      // minle = minle / 1000;
      Taro.openLocation({
        // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
        latitude: lat,
        longitude: lon,
        name: name,
        // address: "距离" + minle + " KM",
        success: function(resv) {
          console.log(resv);
        }
      });
    }
  };
  comfirmOnClick = () => {
    this.setState(
      {
        isImgOpened: false
      },
      () => {
        this.handleSubmit();
      }
    );
  };
  //  故障保修
  onClickBtn() {
    // let device_no = this.state.device_no;
    // Taro.navigateTo({
    //   url: `/pages/repair/index?device_no=${device_no}&scene=end_order`
    // });
    let order_id = this.state.order_id;
    let device_no = this.state.device_no;
    Taro.navigateTo({
      url: `/pages/repair/index?device_no=${device_no}&order_id=${order_id}&scene=end_order`
    });
  }
  //退预付金
  onRefund = () => {
    let that = this;
    let title = `确定要退回预付金吗？`;
    Taro.showModal({
      title: title,
      // content: content,
      confirmText: "确定",
      cancelText: "再想想",
      confirmColor: "#ffc821",
      success: vres => {
        if (vres.confirm) {
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
          d.e_lnglat = lng + "," + lat;
          d.is_full_back= 1 // 结束订单退全款
          global.$utils.api
            .load("orderEnd", d, "get", {
              toast: false,
              toasterror: false,
              loading: false,
              loadingtext: "正在结束用车"
            })
            .then(result => {
              if (result.code == 1) {
                Taro.showModal({
                  title: "退款申请提交成功",
                  content: "预计1个工作日返还原支付账户",
                  showCancel: false,
                  confirmText: "我知道了",
                  confirmColor: "#ffc821",
                  success: vres1 => {
                    if (vres1.confirm) {
                      that.setState({
                        unlockStatus: 0
                      });
                      // global.$utils.url.back();
                    }
                  }
                });
              } else {
                global.$utils.toast.error(result.message);
              }
            })
            .catch(() => {
              global.$utils.toast.error("结束用车失败");
            });
          // global.$utils.url.back();
        }
      }
    });
  };
  goHome = () => {
    Taro.reLaunch({
      url: "/pages/index/index"
    });
  };
  render() {
    const {
      devInfo,
      address,
      isImgOpened,
      title,
      picImgSrc,
      unlockStatus,
      refundValue
    } = this.state;
    console.log(this.state.progressValue);
    return (
      <View className={styles.page}>
        <Map
          id='map4select'
          className={styles.map}
          show-location
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          polygons={this.state.polygons}
          markers={this.state.markers}
          onMarkertap={this.markerClick.bind(this)}
          style='position:fixed;top:0;left:0;right:0;bottom:0;height:100%'
        ></Map>
        <CoverView className={styles.address}>
          <CoverView className={styles.address_title}>
            <CoverImage
              className={styles.address_icon}
              src={namedPng7}
            ></CoverImage>
            {devInfo && devInfo.is_bms == 1 && devInfo.lot_name == "lot_c" ? (
              <CoverView className={styles.address_title_b}>
                {devInfo.store_name || ""}
              </CoverView>
            ) : (
              <CoverView className={styles.address_stitle_b}>
                {devInfo.store_name || ""}
              </CoverView>
            )}
          </CoverView>
          {devInfo && devInfo.is_bms == 1 && devInfo.lot_name == "lot_c" ? (
            <CoverView className={styles.address_content}>
              <CoverImage
                className={styles.address_content_icon}
                src={namedPng8}
              ></CoverImage>
              <CoverView className={styles.address_content_txtwp}>
                <CoverView>可行驶</CoverView>
                <CoverView className={styles.kong}> </CoverView>
                <CoverView className={styles.address_content_txts}>
                  {devInfo.mileage || "-"}
                  <CoverView className={styles.kong}></CoverView>
                </CoverView>
                <CoverView>公里</CoverView>
              </CoverView>
            </CoverView>
          ) : null}
          <CoverView className={styles.address_txt}>
            (请在绿色服务区内行驶，在P点停车区内还车)
          </CoverView>
        </CoverView>
        <View className={styles.searchWp}>
          <View className={styles.search_bookWp}>
            <Image
              className={styles.search_book}
              onClick={this.handleToStoreUrl.bind(this)}
              src={book}
            ></Image>
          </View>
          <View className={styles.search_l}>
            <View className={styles.search_iconwp}>
              <Image className={styles.search_icon} src={search}></Image>
            </View>
            <View className={styles.search_txtwp}>
              <Picker
                mode='selector'
                range={this.state.ranges}
                rangeKey='name'
                value={this.state.address_value}
                onCancel={this.pickerCancel.bind(this)}
                onChange={this.pickerChange.bind(this)}
                onColumnChange={this.pickerColumnChange.bind(this)}
              >
                <View className={styles.search_txt}>搜索停车地点</View>
              </Picker>

              <Image className={styles.search_right} src={namedPng10}></Image>
            </View>
          </View>
        </View>
        <View className={styles.blues}>
          {unlockStatus == 0 ? (
            <CoverView className={styles.blues_item}>
              <CoverView className={styles.blues_header}></CoverView>
              <CoverView className={styles.blues_content}>
                <CoverView className={styles.blues_content_l}>
                  <CoverView className={styles.blues_name}>
                    {devInfo.product_name + " "}
                  </CoverView>
                  <CoverView className={styles.blues_content_titlewp}>
                    <CoverView className={styles.blues_content_title}>
                      {(devInfo.fee_info &&
                        devInfo.fee_info.fee_recharge &&
                        parseFloat(devInfo.fee_info.fee_recharge).toFixed(1)) ||
                        "-"}
                      <CoverView className={styles.kong}></CoverView>
                    </CoverView>
                    <CoverView className={styles.blues_content_stitle}>
                      元
                    </CoverView>
                  </CoverView>
                  <CoverView className={styles.blues_content_txt}>
                    预付金
                  </CoverView>
                </CoverView>
                <CoverView className={styles.blues_content_l}>
                  <CoverView className={styles.blues_name}>
                    车辆编号：{devInfo.device_no + " "}
                  </CoverView>
                  <CoverView className={styles.blues_content_titlewp}>
                    <CoverView className={styles.blues_content_title}>
                      {(devInfo.fee_info &&
                        devInfo.fee_info.fee_base &&
                        parseFloat(devInfo.fee_info.fee_base).toFixed(1)) ||
                        "-"}
                      <CoverView className={styles.kong}></CoverView>
                    </CoverView>
                    <CoverView className={styles.blues_content_stitle}>
                      元
                    </CoverView>
                  </CoverView>
                  <CoverView className={styles.blues_content_txt}>
                    起步价({devInfo.fee_info.min_base || "-"}分钟内)
                    <CoverView className={styles.kong}></CoverView>
                  </CoverView>
                </CoverView>
              </CoverView>
              <CoverView
                className={styles.boxBtn}
                onClick={this.handleSubmit.bind(this)}
              >
                支付预付金并确认开锁
              </CoverView>
              <CoverView
                className={styles.blues_textwp}
                onClick={this.ruleBtn.bind(this, devInfo)}
              >
                <CoverView className={styles.blues_txt}>
                  {devInfo.fee_info.min_base || "-"}分钟内
                  {(devInfo.fee_info &&
                    parseFloat(devInfo.fee_info.fee_base).toFixed(1)) ||
                    "-"}
                  元， 超出后
                  {(devInfo.fee_info &&
                    parseFloat(devInfo.fee_info.fee_next_min).toFixed(1)) ||
                    "-"}
                  元 /{devInfo.fee_info.min_next || "-"}分钟
                  <CoverView className={styles.kong}></CoverView>
                </CoverView>
                <CoverImage
                  className={styles.address_txt_icon}
                  src={namedPng9}
                ></CoverImage>
              </CoverView>
              <CoverView className={styles.blues_text}>
                （预付金直接抵扣车费 还车后原路返还剩余金额）
              </CoverView>
            </CoverView>
          ) : null}
          {unlockStatus == 1 || unlockStatus == 2 ? (
            <View className={styles.blues_item}>
              <CoverView className={styles.blues_header}></CoverView>
              <CoverView className={styles.blues_content}>
                <CoverView className={styles.blues_content_l}>
                  <CoverView className={styles.blues_name}>
                    {devInfo.product_name + " "}
                  </CoverView>
                </CoverView>
                <CoverView className={styles.blues_content_l}>
                  <CoverView className={styles.blues_name}>
                    车辆编号：{devInfo.device_no + " "}
                  </CoverView>
                </CoverView>
              </CoverView>
              <CoverView className={styles.unlockStatus_title}>
                {unlockStatus == 2
                  ? "开锁成功"
                  : `开锁中 ${this.state.progressValue}%...`}
              </CoverView>
              {unlockStatus == 2 ? (
                <CoverImage
                  className={styles.unlockStatus_icon}
                  src={unlockStatus2}
                ></CoverImage>
              ) : (
                <View className={styles.unlockStatus_AtProgress}>
                  <AtActivityIndicator size={64}></AtActivityIndicator>
                </View>
              )}
              <CoverView
                className={styles.unlockStatus_flex}
                onClick={() => {
                  this.onClickBtn();
                }}
              >
                <CoverImage
                  className={styles.unlockStatus_repair}
                  src={unlockStatusRepair}
                ></CoverImage>
                <CoverView className={styles.unlockStatus_txt}>
                  故障问题快捷处理
                </CoverView>
              </CoverView>
            </View>
          ) : null}
          {unlockStatus == 3 ? (
            <CoverView className={styles.blues_item}>
              <CoverView className={styles.blues_header}></CoverView>
              <CoverView className={styles.blues_content}>
                <CoverView className={styles.blues_content_l}>
                  <CoverView className={styles.blues_name}>
                    {devInfo.product_name + " "}
                  </CoverView>
                </CoverView>
                <CoverView className={styles.blues_content_l}>
                  <CoverView className={styles.blues_name}>
                    车辆编号：{devInfo.device_no + " "}
                  </CoverView>
                </CoverView>
              </CoverView>
              <CoverView className={styles.unlockStatus_titles}>
                开锁失败
              </CoverView>
              {refundValue ? (
                <CoverView className={styles.unlockStatus_btnBox}>
                  <CoverView
                    className={styles.unlockStatus_btn1}
                    onClick={() => {
                      this.onRefund();
                    }}
                  >
                    退预付金
                  </CoverView>
                  {/* <CoverView
                  className={styles.unlockStatus_btn2}
                  onClick={() => {
                    this.goHome();
                  }}
                >
                  换一辆
                </CoverView> */}
                </CoverView>
              ) : null}
            </CoverView>
          ) : null}
        </View>
        {isImgOpened ? (
          <PhotoModal
            title={title}
            picImgSrc={picImgSrc}
            comfirmOnClick={this.comfirmOnClick}
          ></PhotoModal>
        ) : null}
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
export default connect(mapStoreToProps, mapDispatchToProps)(Payment);
