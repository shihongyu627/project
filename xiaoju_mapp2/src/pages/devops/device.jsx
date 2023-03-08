import Taro, { Component } from "@tarojs/taro";
import { View, Map, Image, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import styles from "./device.module.scss";
import namedPng from "../../assets/img/map_list.png";
import trajectoryPng from "../../assets/img/trajectory.png";

class Slow extends Component {
  config = {
    navigationBarTitleText: "车辆详情"
  };

  constructor(props) {
    super(props);
    this.state = {
      device_no: "",
      markers: [],
      devInfo: "",
      latitude: "",
      longitude: "",
      lng: "",
      lat: "",
      ploygons: [],
      includePoints: [],
      operateList: [
        {
          title: "开锁",
          id: 1,
          auth: "/devops/device/open"
        },
        {
          title: "关锁",
          id: 2,
          auth: "/devops/device/close"
        },
        {
          title: "寻车",
          id: 3,
          auth: "/devops/device/find"
        },
        {
          title: "强制关锁",
          id: 4,
          auth: "/devops/device/close"
        },
        {
          title: "故障上报",
          id: 5,
          auth: "/devops/device/upfeedback"
        },
        {
          title: "巡检上报",
          id: 6,
          auth: "/devops/patrol"
        },
        {
          title: "维修管理",
          id: 7,
          auth: "/devops/repair"
        },
        {
          title: "车辆标记",
          id: 8,
          auth: "/devops/tag"
        },
        {
          title: "车辆调度",
          id: 9,
          auth: "/devops/dispatch"
        },
        // {
        //   title: "区域管理",
        //   id: 10
        // },
        {
          title: "智能充电",
          id: 11,
          auth: "/devops/recharge"
        },
        {
          title: "激活车锁",
          id: 12,
          auth: "/devops/device/active"
        },
        // {
        //   title: "检查MQTT",
        //   id: 13
        // },
        {
          title: "重启车锁",
          id: 14,
          auth: "/devops/device/restart"
        }
      ],
      idArr: [],
      isOpen: true
    };
  }

  componentDidMount() {
    let params = this.$router.params;
    console.log(params, params.device_no, "故障");

    this.setState({
      device_no: params.device_no
    });
    this.getLocation();
    // this.searchDevice(params.device_no);
    this.getDeviceInfo(params.device_no);
  }
  componentWillUnmount() {
    // 关闭蓝牙
    global.$utils.bluetooth.closeAdapter();
  }

  // 检查权限
  checkAuth = auth => {
    let auth_ll = this.props.devops.auth_info || [];
    for (let index = 0; index < auth_ll.length; index++) {
      const element = auth_ll[index];
      if (auth == element) {
        return true;
      }
    }
    return false;
  };

  // 复制内容
  setCopyText = (txt = "") => {
    Taro.setClipboardData({
      data: txt,
      success: function(res) {
        console.log("setClipboardData res", res);
      }
    });
  };

  // 获取位置
  getLocation = async () => {
    let that = this;
    Taro.getLocation({
      type: "gcj02",
      success: async res => {
        const lng = res.longitude;
        const lat = res.latitude;
        console.log(lng, lat);
        that.setState({
          lng: lng,
          lat: lat
        });
      }
    });
  };

  searchDevice(device_no) {
    let q = {};
    q.style = 1;
    q.keywords = device_no;
    global.$utils.api.load("userSearchDevice", q).then(res => {
      let results = (res.data && res.data.results) || [];
      console.log(results, "results");
      if (results) {
        let latitude =
          (results[0] && results[0].location && results[0].location.latitude) ||
          this.state.lat;
        let longitude =
          (results[0] &&
            results[0].location &&
            results[0].location.longitude) ||
          this.state.lng;
        this.setState(
          {
            latitude: latitude,
            longitude: longitude
          },
          () => {
            this.getDeviceInfo(device_no);
          }
        );
      }
    });
  }

  // 获取骑行区域和停车区域
  storeRunStopArea = store_id => {
    let q = {};
    q.store_id = store_id;
    global.$utils.api.load("devopsopstoreArealists", q).then(res => {
      console.log(res);
      if (res.code > 0) {
        // 绘制骑行区域
        let runAreaList = res.data.run_area_list || [];
        let ploygons_run = [];
        runAreaList.map(item => {
          let points = [];
          item.points_arr.map(vv => {
            let vv_arr = vv.split(",");
            points.push({
              longitude: vv_arr[0],
              latitude: vv_arr[1]
            });
          });
          ploygons_run.push({
            points,
            zIndex: 1,
            strokeColor: "#00800040",
            fillColor: "#00800040"
          });
          this.setState({
            includePoints: points
          });
        });

        // 绘制停车区域
        let stopAreaList = res.data.stop_area_list || [];
        let ploygons_stop = [];
        stopAreaList.map(item => {
          let points = [];
          item.points_arr.map(vv => {
            let vv_arr = vv.split(",");
            points.push({
              longitude: vv_arr[0],
              latitude: vv_arr[1]
            });
          });
          ploygons_stop.push({
            points,
            zIndex: 2,
            strokeColor: "#FF450040",
            fillColor: "#FF450040"
          });
        });

        // 绘制骑行区域和停车区域
        let ploygons = [...ploygons_run, ...ploygons_stop];
        this.setState({
          ploygons
        });
      }
    });
  };

  // 查询车辆是否使用中
  getDeviceInfo = device_no => {
    let d = {};
    d.device_no = device_no;
    global.$utils.api.load("devopsdeviceinfo", d).then(result => {
      if (result.code > 0) {
        let devInfo = result.data || {};
        if (devInfo.tags) {
          let tagsArrs = devInfo.tags || "";
          devInfo.tagArr = tagsArrs.split(",");
        } else {
          devInfo.tagArr = [];
        }
        console.log("devInfo:", devInfo);
        this.setState(
          {
            devInfo: devInfo,
            latitude: devInfo.lat,
            longitude: devInfo.lng
          },
          () => {
            // 显示骑行区域
            this.storeRunStopArea(devInfo.store_id);
            this.setMarker(devInfo);
          }
        );
      }
    });
  };

  // 获取位置，设置标记点
  setMarker(devInfo = {}) {
    let mm = [];
    let m = {
      id: 1,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      width: "48px",
      height: "48px",
      iconPath: require("../../assets/icons/bicycle.png"),
      callout: {
        content:
          "" +
          "车辆编号：" +
          (this.state.devInfo.device_no || "") +
          // "\r\n" +
          // "产品名称：" +
          // (this.state.devInfo.product_name || "") +
          // "\r\n" +
          // "所属商家：" +
          // (this.state.devInfo.shop_name || "") +
          // "\r\n" +
          // "投放区域：" +
          // (this.state.devInfo.store_name || "") +
          // "\r\n" +
          // "车辆电量：" +
          // (this.state.devInfo.battery_or || "") +
          "",
        bgColor: "#fff",
        padding: "5px",
        borderRadius: "2px",
        borderWidth: "1px",
        borderColor: "#07c160",
        marginBottom: "10px",
        textAlign: "center"
      }
    };
    m.iconPath = require("../../assets/icons/car_type1.png");
    if (devInfo.type == 1) {
      m.iconPath = require("../../assets/icons/car_type1.png");
      if (devInfo.online_status == 0) {
        m.iconPath = require("../../assets/icons/car_type1_no.png");
      }
    }
    if (devInfo.type == 2) {
      m.iconPath = require("../../assets/icons/car_type2.png");
      if (devInfo.online_status == 0) {
        m.iconPath = require("../../assets/icons/car_type2_no.png");
      }
    }
    mm.push(m);
    this.setState({
      markers: mm
    });
  }
  //清楚标记
  devopscleartags = item => {
    let that = this;
    Taro.showModal({
      title: "清除标记",
      content: `是否清除${item}标记`,
      success: res => {
        if (res.confirm) {
          let d = {};
          d.device_no = that.state.device_no;
          d.tags = item;
          global.$utils.api
            .load("devopscleartags", d)
            .then(result => {
              if (result.code >= 1) {
                global.$utils.toast.success("已清除");
                this.getDeviceInfo(that.state.device_no);
              } else {
                global.$utils.toast.error(result.message);
              }
            })
            .catch(error => {
              global.$utils.toast.error(error.message || "");
            });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  };
  // 开锁
  openDevice = async (device_no, devInfo) => {
    // 检测是否有开锁权限
    let xdd = {};
    xdd.device_no = device_no;
    xdd.action = "OPEN_LOCK";
    if (this.state.lng && this.state.lat) {
      xdd.lnglat = this.state.lng + "," + this.state.lat;
    }
    let result1 = await global.$utils.api.load(
      "devopsDeviceCheckSendLock",
      xdd
    );
    if (result1) {
      if (result1.code >= 1) {
        // 有开锁权限
        Taro.showModal({
          title: "车辆开锁",
          content: "确定开锁吗？",
          success: async res => {
            if (res.confirm) {
              // lot_d蓝牙开锁
              if (devInfo.lot_name == "lot_d") {
                let bluetooth_mac = devInfo.bluetooth_mac;
                let bluetooth_key = devInfo.bluetooth_key;
                let bluetooth_pass = devInfo.bluetooth_pass;
                // 获取锁信息
                Taro.showLoading({
                  title: "车辆开锁中"
                });
                let dd = await global.$utils.bluetooth.lineDeviceConnect(
                  bluetooth_mac
                );
                console.log("蓝牙数据：", dd);
                if (!dd) {
                  Taro.hideLoading();
                  return false;
                }
                global.$utils.bluetooth.sendOpenLockLotd(
                  device_no,
                  dd.deviceId, // 兼容android和ios
                  dd.serviceId,
                  dd.write_uuidId,
                  dd.read_uuidId,
                  bluetooth_key,
                  bluetooth_pass,
                  async xxres => {
                    console.log("openDevice: sendOpenLockLotd res:", xxres);
                    // 蓝牙开锁失败再次网络开锁
                    if (!xxres) {
                      let d = {};
                      d.device_no = device_no;
                      d.action = "OPEN_LOCK";
                      if (this.state.lng && this.state.lat) {
                        d.lnglat = this.state.lng + "," + this.state.lat;
                      }
                      let result = await global.$utils.api.load(
                        "devopsdevicesendLock",
                        d
                      );
                      Taro.hideLoading();
                      if (result) {
                        if (result.code >= 1) {
                          global.$utils.toast.success("已打开");
                        } else {
                          // global.$utils.toast.error(result.message);
                          Taro.hideLoading();
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
                        }
                      }
                    } else {
                      Taro.hideLoading();
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
                            "openDevice: sendGprsLockUpLotd res:",
                            xxres1
                          );
                        }
                      );
                      // !单车开锁成功上报
                      let cdd = {};
                      cdd.device_no = device_no;
                      cdd.action = "OPEN_LOCK";
                      if (this.state.lng && this.state.lat) {
                        cdd.lnglat = this.state.lng + "," + this.state.lat;
                      }
                      global.$utils.api.load("devopsDeviceSendLockUp", cdd);
                    }
                  }
                );
              } else {
                // 获取锁信息
                Taro.showLoading({
                  title: "车辆开锁中"
                });
                let d = {};
                d.device_no = device_no;
                d.action = "OPEN_LOCK";
                if (this.state.lng && this.state.lat) {
                  d.lnglat = this.state.lng + "," + this.state.lat;
                }
                let result = await global.$utils.api.load(
                  "devopsdevicesendLock",
                  d
                );
                if (result) {
                  if (result.code >= 1) {
                    global.$utils.toast.success("已打开");
                  } else {
                    // global.$utils.toast.error(result.message);
                    Taro.hideLoading();
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
                  }
                }
              }
              // .catch(error => {
              //   global.$utils.toast.error("开锁失败" + (error.message || ""));
              // });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        // 无开锁权限
        Taro.showModal({
          title: "提示",
          content: result1.message,
          showCancel: false,
          confirmText: "我知道了"
        });
      }
    }
  };
  // 关锁
  openDeviceKey = async device_no => {
    // 检测是否有关锁权限
    let xdd = {};
    xdd.device_no = device_no;
    xdd.action = "CLOSE_LOCK";
    if (this.state.lng && this.state.lat) {
      xdd.lnglat = this.state.lng + "," + this.state.lat;
    }
    let result1 = await global.$utils.api.load(
      "devopsDeviceCheckSendLock",
      xdd
    );
    if (result1) {
      if (result1.code >= 1) {
        // 有关锁权限
        Taro.showModal({
          title: "车辆关锁",
          content: "确定关锁吗？",
          success: res => {
            if (res.confirm) {
              // 获取锁信息
              Taro.showLoading({
                title: "车辆关锁中"
              });
              let d = {};
              d.device_no = device_no;
              d.action = "CLOSE_LOCK";
              if (this.state.lng && this.state.lat) {
                d.lnglat = this.state.lng + "," + this.state.lat;
              }
              global.$utils.api
                .load("devopsdevicesendLock", d)
                .then(result => {
                  if (result.code >= 1) {
                    global.$utils.toast.success("已关闭");
                  } else {
                    // global.$utils.toast.error(result.message);
                    Taro.hideLoading();
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
                  }
                })
                .catch(error => {
                  Taro.hideLoading();
                  global.$utils.toast.error("关锁失败" + (error.message || ""));
                });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        // 无关锁权限
        Taro.showModal({
          title: "提示",
          content: result1.message,
          showCancel: false,
          confirmText: "我知道了"
        });
      }
    }
  };
  // 寻铃找车
  handleFindLock = device_no => {
    let d = {};
    d.device_no = device_no;
    d.action = "FIND_DEVICE";
    if (this.state.lng && this.state.lat) {
      d.lnglat = this.state.lng + "," + this.state.lat;
    }
    // 获取锁信息
    Taro.showLoading({
      title: "正在寻车中"
    });
    global.$utils.api
      .load("devopsdevicesendLock", d)
      .then(result => {
        if (result.code >= 1) {
          global.$utils.toast.success("寻车成功");
        } else {
          // global.$utils.toast.error(result.message);
          Taro.hideLoading();
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
        }
      })
      .catch(error => {
        global.$utils.toast.error("寻车失败" + (error.message || ""));
        Taro.hideLoading();
      });
  };
  markerClick(e) {
    console.log(e, "markerClick");
    this.setState({
      isOpen: true
    });
  }
  //选择标记
  onClickSelect = async (id, device_no) => {
    let a = [];
    a.push(id);
    await this.setState(
      {
        idArr: a
      },
      async () => {
        let devInfo = this.state.devInfo;
        //开锁
        if (id == 1) {
          this.openDevice(device_no, devInfo);
        }
        //关锁
        if (id == 2) {
          this.openDeviceKey(device_no);
        }
        //寻车
        if (id == 3) {
          this.handleFindLock(device_no);
        }
        //强制关锁
        if (id == 4) {
          Taro.navigateTo({
            url: "/pages/devops/closeLock"
          });
        }
        //故障上报
        if (id == 5) {
          global.$utils.url.push({
            url: "/pages/repair/index?" + "device_no=" + device_no
          });
        }
        //巡检上报
        if (id == 6) {
          global.$utils.url.push({
            url: "/pages/devops/checkReport?" + "device_no=" + device_no
          });
        }
        //维修管理
        if (id == 7) {
          Taro.navigateTo({
            url: "/pages/devops/repair"
          });
        }
        //车辆标记
        if (id == 8) {
          global.$utils.url.push({
            url: "/pages/devops/mark?" + "device_no=" + device_no
          });
        }
        //车辆调度
        if (id == 9) {
          global.$utils.url.push({
            url: "/pages/devops/dispatch?" + "device_no=" + device_no
          });
        }
        //区域管理
        if (id == 10) {
          global.$utils.toast.success("暂未开放");
          // Taro.navigateTo({
          //   url: "/pages/devops/map"
          // });
        }
        //智能充电
        if (id == 11) {
          global.$utils.url.push({
            url: "/pages/devops/recharge?" + "device_no=" + device_no
          });
        }
        //激活车锁
        if (id == 12) {
          if (devInfo.lot_name == "lot_d") {
            Taro.showModal({
              title: "激活车锁",
              content: "确定激活车锁吗？",
              success: async res => {
                if (res.confirm) {
                  let bluetooth_mac = devInfo.bluetooth_mac;
                  let bluetooth_key = devInfo.bluetooth_key;
                  let bluetooth_pass = devInfo.bluetooth_pass;
                  // 获取锁信息
                  let dd = await global.$utils.bluetooth.lineDeviceConnect(
                    bluetooth_mac
                  );
                  console.log("蓝牙数据：", dd);
                  if (!dd) {
                    return false;
                  }
                  global.$utils.bluetooth.sendRunLockLotd(
                    device_no,
                    dd.deviceId, // 兼容android和ios
                    dd.serviceId,
                    dd.write_uuidId,
                    dd.read_uuidId,
                    bluetooth_key,
                    bluetooth_pass,
                    xxres => {
                      console.log("runlock: sendRunLockLotd res:", xxres);
                    }
                  );
                }
              }
            });
          } else {
            global.$utils.toast.success("已激活");
          }
        }
        //检查mqtt状态
        if (id == 13) {
          if (devInfo.lot_name == "lot_d") {
            Taro.showModal({
              title: "检查MQTT状态",
              content: "确定检查MQTT状态吗？",
              success: async res => {
                if (res.confirm) {
                  let bluetooth_mac = devInfo.bluetooth_mac;
                  let bluetooth_key = devInfo.bluetooth_key;
                  let bluetooth_pass = devInfo.bluetooth_pass;
                  // 获取锁信息
                  let dd = await global.$utils.bluetooth.lineDeviceConnect(
                    bluetooth_mac
                  );
                  console.log("蓝牙数据：", dd);
                  if (!dd) {
                    return false;
                  }
                  global.$utils.bluetooth.sendCheckLockMqttLotd(
                    device_no,
                    dd.deviceId, // 兼容android和ios
                    dd.serviceId,
                    dd.write_uuidId,
                    dd.read_uuidId,
                    bluetooth_key,
                    bluetooth_pass,
                    xxres => {
                      console.log(
                        "checklockmqtt: sendCheckLockMqttLotd res:",
                        xxres
                      );
                    }
                  );
                }
              }
            });
          } else {
            global.$utils.toast.success("暂无mqtt连接");
          }
        }
        //重启车锁
        if (id == 14) {
          if (devInfo.lot_name == "lot_d") {
            Taro.showModal({
              title: "重启车锁",
              content: "确定重启车锁吗？",
              success: async res => {
                if (res.confirm) {
                  let bluetooth_mac = devInfo.bluetooth_mac;
                  let bluetooth_key = devInfo.bluetooth_key;
                  let bluetooth_pass = devInfo.bluetooth_pass;
                  // 获取锁信息
                  let dd = await global.$utils.bluetooth.lineDeviceConnect(
                    bluetooth_mac
                  );
                  if (!dd) {
                    return false;
                  }
                  global.$utils.bluetooth.sendRestartLockLotd(
                    device_no,
                    dd.deviceId, // 兼容android和ios
                    dd.serviceId,
                    dd.write_uuidId,
                    dd.read_uuidId,
                    bluetooth_key,
                    bluetooth_pass,
                    xxres => {
                      console.log(
                        "restartlock: sendRestartLockLotd res:",
                        xxres
                      );
                    }
                  );
                }
              }
            });
          } else {
            global.$utils.toast.success("已重启");
          }
        }
      }
    );
  };
  // 获取位置
  closeDetails = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };
  lookMap = () => {
    let devInfo = this.state.devInfo;
    Taro.openLocation({
      // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
      latitude: Number(devInfo.lat),
      longitude: Number(devInfo.lng),
      name: devInfo.name + "  " + devInfo.device_no,
      address: "运营区域：" + devInfo.store_name,
      success: function(resv) {
        console.log(resv);
      }
    });
  };
  trajectoryInfo = () => {
    let devInfo = this.state.devInfo;
    let device_no = this.state.device_no || "";
    let trid =
      devInfo && devInfo.last_open_lock && devInfo.last_open_lock.amap_trid;
    let device_id =
      devInfo && devInfo.last_open_lock && devInfo.last_open_lock.device_id;
    Taro.navigateTo({
      url: `/pages/devops/trsearch?device_id=${device_id}&trid=${trid}&device_no=${device_no}`
    });
  };
  render() {
    const { devInfo, isOpen } = this.state;
    console.log(isOpen);
    return (
      <View className={styles.page}>
        <Map
          className={styles.map}
          show-location
          scale={18}
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          markers={this.state.markers}
          polygons={this.state.ploygons}
          includePoints={this.state.includePoints}
          onMarkertap={this.markerClick}
          style="position:fixed;top:0;left:0;right:0;bottom:0;height:100%"
        ></Map>
        <View className={styles.tool_box}>
          <Image
            src={namedPng}
            className={styles.icon}
            onClick={this.closeDetails.bind(this)}
          />
        </View>
        {this.state.isOpen ? (
          <View className={styles.blues}>
            <View className={styles.blues_item}>
              <View className={styles.Vehicle_top_wp}>
                <View className={styles.Vehicle_top_title}>{devInfo.name}</View>
                <View className={styles.Vehicle_top_img}>
                  <Image
                    src={require("../../assets/icons/i_location.png")}
                    className={styles.icon}
                    onClick={this.lookMap.bind(this)}
                  />
                </View>
              </View>

              <View className={styles.Vehicle_item}>
                <View className={styles.Vehicle_item_txt}>
                  车辆编号： {devInfo.device_no}
                </View>
                <View className={styles.Vehicle_item_txt}>
                  产品名称： {devInfo.product_name}
                </View>
              </View>
              <View className={styles.Vehicle_item}>
                <View className={styles.Vehicle_item_txt}>
                  电源电压： {devInfo.battery_vv || ""}
                </View>
                <View className={styles.Vehicle_item_txt}>
                  电源电量：
                  {parseFloat(devInfo.battery_rr) > 0 ? (
                    devInfo.battery_rr
                  ) : (
                    <Text className={styles.Vehicle_item_txt_red}>
                      {devInfo.battery_rr}
                    </Text>
                  )}
                </View>
              </View>
              <View className={styles.Vehicle_item}>
                <View className={styles.Vehicle_item_txt}>
                  车锁状态：
                  {devInfo.lock_status == 0 ? (
                    devInfo.lock_status_name
                  ) : (
                    <Text className={styles.Vehicle_item_txt_green}>
                      {devInfo.lock_status_name}
                    </Text>
                  )}
                </View>
                <View className={styles.Vehicle_item_txt}>
                  车辆状态：
                  {devInfo.online_status == 1 ? (
                    devInfo.online_status_name
                  ) : (
                    <Text className={styles.Vehicle_item_txt_red}>
                      {devInfo.online_status_name}
                    </Text>
                  )}
                </View>
              </View>
              <View
                className={styles.Vehicle_item}
                style={{ "justify-content": "flex-start" }}
              >
                <View
                  className={styles.Vehicle_item_txt}
                  style={{ width: "100%" }}
                >
                  运营区域： {devInfo.store_name || ""}
                </View>
              </View>
              <View className={styles.Vehicle_tgb}>
                {devInfo.tagArr.map(item => (
                  <View
                    className={styles.Vehicle_tgb_item}
                    onClick={this.devopscleartags.bind(this, item)}
                  >
                    {item}
                  </View>
                ))}
              </View>
              <View
                className={styles.Vehicle_content}
                onClick={this.lookMap.bind(this)}
              >
                <View className={styles.Vehicle_content_top}>
                  <View className={styles.Vehicle_content_br}></View>
                  <View className={styles.Vehicle_content_title}>
                    末次定位 {devInfo.location_time}
                    <View className={styles.kong}></View>
                  </View>
                </View>
                <View className={styles.Vehicle_content_address}>
                  {devInfo.address}
                </View>
              </View>
              <View className={styles.fault_body}>
                <View className={styles.fault_title}>车辆操作</View>
                <View className={styles.fault_list}>
                  {this.state.operateList.map((item, index) => {
                    return this.checkAuth(item.auth) ? (
                      <View
                        className={[
                          styles.fault_item,
                          this.state.idArr.includes(item.id) && styles.onActive
                        ]}
                        key={index}
                        onClick={this.onClickSelect.bind(
                          this,
                          item.id,
                          devInfo.device_no
                        )}
                      >
                        {item.title}
                      </View>
                    ) : null;
                  })}
                </View>
              </View>
              <View className={styles.fault_body}>
                <View className={styles.fault_title}>开锁记录</View>
                <View className={styles.fault_textBox}>
                  <View className={styles.fault_text}>
                    开锁人：
                    {(devInfo &&
                      devInfo.last_open_lock &&
                      devInfo.last_open_lock.s_user_nick) ||
                      ""}
                  </View>
                </View>
                <View className={styles.fault_textBox}>
                  <View className={styles.fault_text}>
                    扫码手机号：
                    {(devInfo &&
                      devInfo.last_open_lock &&
                      devInfo.last_open_lock.user_mobile) ||
                      ""}
                  </View>
                </View>
                <View className={styles.fault_textBox}>
                  <View className={styles.fault_text}>
                    开锁时间：
                    {devInfo &&
                    devInfo.last_open_lock &&
                    devInfo.last_open_lock.open_time
                      ? $utils.time.format(devInfo.last_open_lock.open_time)
                      : ""}
                  </View>
                </View>
                <View className={styles.fault_textBox}>
                  <View className={styles.fault_text}>
                    关锁时间：
                    {devInfo &&
                    devInfo.last_open_lock &&
                    devInfo.last_open_lock.close_time
                      ? $utils.time.format(devInfo.last_open_lock.close_time)
                      : ""}
                  </View>
                </View>
                <View className={styles.fault_textBox}>
                  <View className={styles.fault_footerTitle}>骑行轨迹：</View>
                  <Image
                    src={trajectoryPng}
                    className={styles.fault_footerImg}
                    onClick={this.trajectoryInfo.bind(this)}
                  />
                </View>
              </View>
              {/* <View className={styles.slow}>
                <View className={styles.slow_item}>
                  车辆编号：{devInfo.device_no}
                </View>
                <View className={styles.slow_item_wp}>
                  车辆名称：{devInfo.name}
                </View>
              </View>
              <View className={styles.slow}>
                <View className={styles.slow_item}>
                  产品名称：{devInfo.product_name}
                </View>
                <View className={styles.slow_item_wp}>
                  投放区域：{devInfo.store_name}
                </View>
              </View>
              <View className={styles.slow}>
                <View className={styles.slow_item}>
                  所属商家：{devInfo.shop_name}
                </View>
                <View className={styles.slow_item_wp}>
                  骑行次数：{devInfo.order_count}
                </View>
              </View>
              <View className={styles.slow}>
                <View className={styles.slow_item}>
                  车辆状态：{devInfo.online_status_name}
                </View>
                <View className={styles.slow_item_wp}>
                  车锁状态：{devInfo.lock_status_name}
                </View>
              </View>
              <View className={styles.slow}>
                <View className={styles.slow_item}>
                  GPS信号：{devInfo.gps_s}
                </View>
                <View className={styles.slow_item_wp}>
                  车辆电量：{devInfo.battery_or}
                </View>
              </View>
              <View className={styles.slow}>
                <View className={styles.slow_item_wps}>
                  末次定位：{devInfo.location_time ? devInfo.location_time : ""}
                </View>
              </View>
              <View className={styles.slow}>
                <View className={styles.slow_item_wps}>
                  当前位置：{devInfo.address}
                </View>
              </View> */}
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

const mapStoreToProps = store => ({
  user: store.user,
  devops: store.devops,
  config: store.config
});
const mapDispatchToProps = dispatch => ({
  dispatch: dispatch
});
export default connect(mapStoreToProps, mapDispatchToProps)(Slow);
