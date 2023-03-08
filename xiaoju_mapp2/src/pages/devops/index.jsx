import Taro, { Component } from "@tarojs/taro";
import { View, Image, Button, Switch, Text } from "@tarojs/components";
import styles from "./index.module.scss";
import { connect } from "@tarojs/redux";
import { getAuthInfo } from "../../actions/devops";
import vehicle from "../../assets/icons/vehicle.png";
import i_use_2 from "../../assets/icons/suo.png";
import repairs from "../../assets/icons/repairs.png";
import maintain from "../../assets/icons/maintain.png";
import vihice from "../../assets/icons/vihice.png";
// import binging from "../../assets/icons/bicycle.png";
import right_icon from "../../assets/img/right_icon.png";

class Operatiom extends Component {
  config = {
    navigationBarTitleText: "智能运维"
  };
  constructor(props) {
    super(props);
    this.state = {
      top_list: [
        {
          title: "扫码开关锁",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223160397000.png",
          id: 1,
          auth: "/devops/control"
        },
        {
          title: "故障申报",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-27/3223523424658.png",
          id: 2,
          auth: "/devops/device/upfeedback"
        }
      ],
      list: [
        {
          title: "车辆监控",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226441000.png",
          id: 1,
          auth: "/devops/map"
        },
        {
          title: "监控列表",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226484000.png",
          id: 3,
          auth: "/devops/map"
        },
        {
          title: "维修管理",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226464000.png",
          id: 2,
          auth: "/devops/repair"
        },
        {
          title: "车辆标记",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226546000.png",
          id: 6,
          auth: "/devops/tag"
        },
        {
          title: "车辆调度",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226558000.png",
          id: 7,
          auth: "/devops/dispatch"
        },
        {
          title: "车辆操作",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226574000.png",
          id: 9,
          auth: "/devops/control"
        },
        {
          title: "巡检上报",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226590000.png",
          id: 11,
          auth: "/devops/patrol"
        },
        {
          title: "智能充电",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226566000.png",
          id: 8,
          auth: "/devops/recharge"
        },
        {
          title: "运维数据",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226536000.png",
          id: 4,
          auth: "/devops/data"
        },
        {
          title: "区域管理",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226507000.png",
          id: 5,
          auth: "/devops/storemanage"
        },
        {
          title: "车辆绑定",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226582000.png",
          id: 10,
          auth: "/devops/bind"
        },
        {
          title: "强制关锁",
          img:
            "http://xiaoju.static.idocore.com/upload/xiaoju/2021-01-26/3223226603000.png",
          id: 12,
          auth: "/devops/closelock"
        }
      ],
      idArr: []
    };
  }

  async componentDidShow() {
    // 查询权限信息
    await this.getAuthInfo();
  }

  getAuthInfo = async () => {
    // 查询权限信息
    try {
      let d = {};
      let result = await global.$utils.api.load(
        "devopsAuthInfo",
        d,
        "get",
        false
      );
      if (result) {
        if (result.code == 1) {
          // 组装权限
          let auth_list = result.data || [];
          let auth_info = [];
          for (let index = 0; index < auth_list.length; index++) {
            const element = auth_list[index];
            auth_info.push(element.url);
          }
          this.props.dispatch(
            getAuthInfo({
              auth_list,
              auth_info
            })
          );
        } else {
          global.$utils.toast.error(result.message);
        }
      }
    } catch (error) {
      global.$utils.toast.error("查询权限失败");
    }
  };

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

  suoClick = type => {
    global.$utils.qrcode.scan().then(res => {
      let device_no = res;
      if (device_no) {
        // 查询车辆是否使用中
        let d = {};
        d.device_no = device_no;
        global.$utils.api
          .load("devopscheckdevice", d)
          .then(result => {
            if (result.code == 1) {
              if (type == "open") {
                global.$utils.url.push({
                  url: "/pages/devops/device?" + "device_no=" + device_no
                });
              }
              if (type == "chongdian") {
                global.$utils.url.push({
                  url: "/pages/devops/recharge?" + "device_no=" + device_no
                });
              }
              if (type == "caozuo") {
                global.$utils.url.push({
                  url: "/pages/devops/device?" + "device_no=" + device_no
                });
              }
            } else {
              global.$utils.toast.error(result.message);
            }
          })
          .catch(() => {
            global.$utils.toast.error("扫码失败");
          });
      }
    });
  };
  vehicleTopClick = id => {
    //扫码开关锁
    if (id == 1) {
      this.suoClick("open");
    }
    //故障申报
    if (id == 2) {
      Taro.navigateTo({
        url: "/pages/repair/index"
      });
    }
  };
  vehicleClick = id => {
    console.log(id);
    //车辆监控
    if (id == 1) {
      Taro.navigateTo({
        url: "/pages/devops/map"
      });
    }
    //维修管理
    if (id == 2) {
      Taro.navigateTo({
        url: "/pages/devops/repair"
      });
    }
    //监控列表
    if (id == 3) {
      Taro.navigateTo({
        url: "/pages/devops/vehicle"
      });
    }
    //运维数据
    if (id == 4) {
      Taro.navigateTo({
        url: "/pages/devops/yunWei"
      });
    }
    //区域管理
    if (id == 5) {
      global.$utils.toast.error("暂未开放");
      // Taro.navigateTo({
      //   url: "/pages/devops/map"
      // });
    }
    //车辆标记
    if (id == 6) {
      Taro.navigateTo({
        url: "/pages/devops/mark"
      });
    }
    //车辆调度
    if (id == 7) {
      Taro.navigateTo({
        url: "/pages/devops/dispatchList"
      });
    }
    //智能充电
    if (id == 8) {
      this.suoClick("chongdian");
    }
    //车辆操作
    if (id == 9) {
      this.suoClick("caozuo");
    }
    //车辆绑定
    if (id == 10) {
      Taro.navigateTo({
        url: "/pages/devops/binging"
      });
    }
    //巡检上报
    if (id == 11) {
      Taro.navigateTo({
        url: "/pages/devops/checkReport"
      });
    }
    //强制关锁
    if (id == 12) {
      Taro.navigateTo({
        url: "/pages/devops/closeLock"
      });
    }
  };
  // // 车辆扫码
  // handleQrcode = async () => {
  //   let device_no = await global.$utils.qrcode.scan();
  //   if (device_no) {
  //     this.setState({
  //       device_no: device_no
  //     });
  //   }
  // };
  // repairsClick() {
  //   Taro.navigateTo({
  //     url: "/pages/repair/index"
  //   });
  // }

  // maintainClick() {
  //   Taro.navigateTo({
  //     url: "/pages/devops/repair"
  //   });
  // }

  // devopsvehicleClick() {
  //   Taro.navigateTo({
  //     url: "/pages/devops/vehicle"
  //   });
  // }

  // devopsvehiclebindingClick() {
  //   Taro.navigateTo({
  //     url: "/pages/devops/binging"
  //   });
  // }

  render() {
    let { list, top_list, idArr } = this.state;
    return (
      <View className={styles.page}>
        <View className={styles.fault_body}>
          <View className={styles.top_list}>
            {top_list.map((item, index) => {
              return this.checkAuth(item.auth) ? (
                <View
                  className={[
                    styles.top_list_item,
                    index == 1 && styles.topOnActive
                  ]}
                  onClick={this.vehicleTopClick.bind(this, item.id)}
                >
                  <View className={styles.top_list_l}>
                    <View className={styles.top_title}>{item.title}</View>
                    <Image
                      src={right_icon}
                      className={styles.right_icon}
                    ></Image>
                  </View>
                  <Image src={item.img} className={styles.top_img}></Image>
                </View>
              ) : null;
            })}
          </View>
          <View className={styles.opers}>
            {list.map(item => {
              return this.checkAuth(item.auth) ? (
                <View
                  className={[
                    styles.fault_list,
                    idArr.includes(item.id) && styles.onActive
                  ]}
                  onClick={this.vehicleClick.bind(this, item.id)}
                >
                  <View className={styles.atioms}>
                    <Image src={item.img} className={styles.imdsd}></Image>
                    <View className={styles.fault}>{item.title}</View>
                  </View>
                </View>
              ) : null;
            })}
          </View>
        </View>
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
export default connect(mapStoreToProps, mapDispatchToProps)(Operatiom);
