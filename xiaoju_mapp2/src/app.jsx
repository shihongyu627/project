import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
// 统计
// import "./lib/ald-stat/ald-stat.js";
// import './lib/mtj/mtj-wx-sdk.js';
import config from "./config";
import utils from "./utils";
import Index from "./pages/index";
import configStore from "./store";
import { loginSuccess, logoutSuccess } from "./actions/user";
import { setConfig } from "./actions/config";
import QQMapWX from "./assets/js/qqmap-wx-jssdk.min";
// app.js
import "./app.scss";

const logger = Taro.getRealtimeLogManager();
console.log = (...args) => {
  console.info(...args);
  logger.info(...args);
};
let qqmapsdk = new QQMapWX({
  key: "JMDBZ-5C53P-VWNDM-VNL5P-CA7YK-SOFCX"
});
global.qqmapsdk = qqmapsdk;
console.log("app start.");
console.log("app config.", config);
global.$utils = utils;
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class _App extends Component {
  async componentDidMount() {
    await this.siteConfig();
    await this.getUserLogin();
  }

  config = {
    pages: [
      "pages/index/index", // 首页
      "pages/index/test", // 测试页面
      "pages/repair/index", // 维修申请页
      "pages/help/info", // 帮助详情
      "pages/help/class", // 帮助分类
      // "pages/order/rule", // 订单计价规则
      // "pages/order/info", // 订单详情
      // "pages/user/index", // 用户中心
      "pages/auth/index", // 登录页
      "pages/auth/useauth", // 用户教育
      // "pages/user/card",
      // "pages/user/wallet",
      // "pages/user/order",
      // "pages/user/feedback",
      // "pages/user/about",
      // "pages/user/agree",
      // "pages/user/service",
      "pages/web/index",
      // "pages/order/pay", //  订单支付
      // "pages/order/unlock", //  车辆开锁
      // "pages/order/back", //  关锁还车
      // "pages/devops/index", //  运维入口
      // "pages/devops/map", //  车辆分布
      // "pages/devops/mark", //  车辆标记
      // "pages/devops/repair", //  故障列表
      // "pages/devops/device", //  车辆详情
      // "pages/devops/record", //  故障处理
      // "pages/devops/vehicle", //  车辆列表
      // "pages/devops/dispatch", //  车辆调度
      // "pages/devops/dispatchList", //  车辆调度
      // "pages/devops/closeLock", //  强制关锁
      // "pages/devops/checkReport", //  巡检上报
      // "pages/devops/recharge", //  智能充电
      // "pages/devops/binging", //  车辆绑定
      // "pages/devops/yunWei", //  运维数据
      // "pages/order/waiting" //  关锁等待页
    ],
    subpackages: [
      {
        root: "pages/devops/",
        pages: [
          "index", // 运维入口
          "map", //车辆分布
          "repair", //故障列表
          "device", //车辆详情
          "record", //故障处理
          "vehicle", //车辆列表
          "dispatch", //车辆调度
          "dispatchList", //车辆调度
          "closeLock", //强制关锁
          "checkReport", //巡检上报
          "recharge", //智能充电
          "binging", //车辆绑定
          "yunWei", //运维数据
          "trsearch" //运维数据
        ]
      },
      {
        root: "pages/user/",
        pages: [
          "index", // 用户中心
          "card",
          "order",
          "wallet",
          "agree",
          "service",
          "about"
        ]
      },
      {
        root: "pages/order/",
        pages: [
          "rule", // 订单计价规则
          "info",//订单详情
          "pay",//订单支付
          "unlock",//车辆开锁
          "back",//关锁还车
          "waiting",//关锁还车
        ]
      }
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "小驹游乐",
      navigationBarTextStyle: "black"
    },
    requiredBackgroundModes: ["location"],
    requiredPrivateInfos: [
      "getLocation",
      "onLocationChange",
      "startLocationUpdate",
      "startLocationUpdateBackground",
      "chooseLocation"
    ],
    permission: {
      "scope.userLocation": {
        desc: "你的位置信息将用于地图展示"
      },
      "scope.userLocationBackground": {
        desc: "你的位置信息将用于骑行展示"
      }
    }
  };

  // 微信检测登录
  async getUserLogin() {
    // 重新登录
    try {
      let res = await Taro.login();
      if (res.code) {
        // 发起网络请求
        let d = {
          code: res.code
        };
        let r = await global.$utils.api.load("weappCheck", d, "get", {
          toast: false,
          toasterror: false,
          loading: false
        });
        if (r.code === 1 && r.data) {
          if (r.data.user_mobile) {
            store.dispatch(loginSuccess(r.data));
          } else {
            store.dispatch(logoutSuccess());
          }
          global.token = (r.data && r.data.token) || "";
          Taro.setStorageSync("token", global.token);
          if (r.data.openid) {
            // Taro.getApp() && Taro.getApp().aldstat.sendOpenid(r.data.openid);
          }
        }
      } else {
        global.$utils.toast.error("登录授权过期" + res.errMsg);
        console.log("登录失败！" + res.errMsg);
      }
    } catch (error) {
      console.log("登录失败！" + error.message);
    }
  }

  // 站点配置
  async siteConfig() {
    let result = await global.$utils.api.load(
      "userConfig",
      { out: "simple" },
      "get",
      {
        toast: false,
        toasterror: false,
        loading: false
      }
    );
    if (result && result.data) {
      store.dispatch(setConfig(result.data));
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<_App />, document.getElementById("app"));
