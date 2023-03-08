import Taro from "@tarojs/taro";

let DeviceInfo = null;
if (process.env.TARO_ENV === "rn") {
  DeviceInfo = require("react-native-device-info").default;
}
// app信息
const app = {
  name: "",
  icon: "",
  version: "",
  platform: "",
  type: "",
  device: {},
  package: "",
  iosCheckStatus: false,
  // 初始化
  init: function() {
    // 获取名称
    this.getName();
    // 获取图标
    this.getIcon();
    // 获取版本
    this.getVersion();
    // 获取包名
    this.getPackage();
    // 获取类型
    this.getType();
    // 获取平台
    this.getPlatform();
    // 获取设备 device-info
    this.getDevice();
    console.log("app base ", this);
  },
  // 名称
  getName: function() {
    this.name = "";
    return this.name;
  },
  // 图标
  getIcon: function() {
    this.icon = "";
    return this.icon;
  },
  // 版本
  getVersion: function() {
    if (process.env.TARO_ENV === "rn") {
      this.version = "v" + DeviceInfo.getVersion();
    } else {
      this.version = "";
    }
    return this.version;
  },
  // 包名
  getPackage: function() {
    this.package = "";
    return this.package;
  },
  // 类型
  getType: function() {
    let etype = Taro.getEnv();
    switch (etype) {
      case Taro.ENV_TYPE.WEAPP:
      case Taro.ENV_TYPE.SWAN:
      case Taro.ENV_TYPE.WEAPP:
      case Taro.ENV_TYPE.ALIPAY:
        this.type = "mapp";
        break;
      case Taro.ENV_TYPE.RN:
        this.type = "app";
        break;
      case Taro.ENV_TYPE.WEB:
      default:
        this.type = "wap";
        break;
    }
    return this.type;
  },
  // 平台
  getPlatform: function() {
    this.platform = Taro.getSystemInfoSync().platform;
    return this.platform;
  },
  // 设备
  getDevice: function() {
    this.device = Taro.getSystemInfoSync();
    return this.device;
  },
  // 功能暂停
  close: function() {
    global.$utils.toast.text("正在开发调试中,请稍后再试");
    return true;
  },
  // 检测是否ios是否在审核中
  checkIosStatus: async function() {
    try {
      let d = {};
      d.platform = Taro.getSystemInfoSync().platform;
      if (process.env.TARO_ENV === "rn") {
        d.version = DeviceInfo.getVersion();
      }
      let res = await global.$utils.api.load("checkIosStatus", d, "get", false);
      if (res) {
        // 正在审核中
        if (res.code == 200) {
          this.iosCheckStatus = true;
        } else {
          this.iosCheckStatus = false;
        }
      }
    } catch (error) {
      console.log('checkIosStatus', error);
    }
  }
};
export default app;
