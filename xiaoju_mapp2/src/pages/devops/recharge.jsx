import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";

import styles from "./recharge.module.scss";
import namePng from "../../assets/img/devops_repair_1.png";

class Recharge extends Component {
  config = {
    navigationBarTitleText: "智能充电"
  };

  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
      list: [],
      device_no: "",
      isChecking: false
    };
  }

  //  导航栏的头部
  onActive = (index, val) => {
    this.setState(
      {
        active_index: index,
        active_status: val.status
      },
      () => {
        this.repairList(val.status);
      }
    );
  };

  componentDidMount() {
    let params = this.$router.params;
    console.log(params, params.device_no, "智能充电");
    this.setState({
      device_no: params.device_no
    });
    this.getDeviceInfo(params.device_no);
  }
  // 查询车辆是否使用中
  getDeviceInfo = device_no => {
    let d = {};
    d.device_no = device_no;
    global.$utils.api.load("devopsbatteryinfo", d).then(result => {
      let devInfo = result.data || {};
      let list = [
        {
          title: "车辆名称",
          name: devInfo.name
        },
        {
          title: "车辆编号",
          name: devInfo.device_no
        },
        {
          title: "硬件编号",
          name: devInfo.imei
        },
        {
          title: "电池BMS控制",
          name: devInfo.is_bms == 1 ? "有" : "无"
        },
        {
          title: "是否充电状态",
          name: devInfo.battery_charge_status_name
        },
        {
          title: "内置电池电压",
          name: devInfo.battery_iv
        },
        {
          title: "内置电池电量",
          name: devInfo.battery_ir
        },
        {
          title: "外接电池电压",
          name: devInfo.battery_ov
        },
        {
          title: "外接电池电量",
          name: devInfo.battery_or
        },
        {
          title: "末次定位时间",
          name: devInfo.location_time
        },
        {
          title: "末次定位位置",
          name: devInfo.address
        },
        {
          title: "当前请求时间",
          name: global.$utils.time.now()
        }
      ];
      this.setState({
        devInfo: devInfo,
        list
      });
    });
  };
  faultSubmit = () => {
    if (this.state.isChecking) {
      return;
    }
    global.$utils.loading.show("刷新中");
    this.setState({
      isChecking: true
    });
    this.handleNowLocation(this.state.device_no);
    setTimeout(() => {
      this.getDeviceInfo(this.state.device_no);
      global.$utils.loading.hide();
      this.setState({
        isChecking: false
      });
    }, 2500);
  };
  // 立即定位
  handleNowLocation = device_no => {
    let d = {};
    d.device_no = device_no;
    d.action = "NOW_LOCATION";
    global.$utils.api
      .load("devopsdevicesendLock", d)
      .then(result => {
        if (result.code >= 1) {
          // global.$utils.toast.success("查询成功");
        } else {
          // global.$utils.toast.error(result.message);
        }
      })
      .catch(error => {
        global.$utils.toast.error("查询失败" + (error.message || ""));
      });
  };
  // 复制内容
  setCopyText = (txt = "") => {
    Taro.setClipboardData({
      data: txt,
      success: function(res) {
        console.log("setClipboardData res", res, txt);
      }
    });
  };
  render() {
    const { list } = this.state;
    return (
      <View className={styles.page}>
        <View className={styles.Recharge_box}>
          {list.map(item => (
            <View className={styles.Recharge_item}>
              <View className={styles.Recharge_title}>{item.title}</View>
              <View
                className={styles.Recharge_name}
                onClick={this.setCopyText.bind(this, item.name)}
              >
                {item.name}
              </View>
            </View>
          ))}
        </View>
        <View className={styles.fault_submit_box}>
          <View className={styles.fault_submit} onClick={this.faultSubmit}>
            {this.state.isChecking ? "刷新中" : "立即刷新"}
          </View>
        </View>
      </View>
    );
  }
}

export default Recharge;
