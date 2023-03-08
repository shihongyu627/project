import React, { Component } from "react";
import Vconsole from "./component/Vconsole";
import "./app.scss";
import utils from "./utils";
import config from "./config";
import { Provider } from "react-redux";
import Taro from "@tarojs/taro";
import store from "./store";

global.$utils = utils;
global.$config = config;
class App extends Component {
  async componentDidMount() {
    global.isLogin = true;
    global.VConsole = false;
    await $utils.auth.siteInfo();
    if (process.env.TARO_ENV === "rn") {
      // 推送初始化
      $utils.push.init(registrationID => {
        if (registrationID) {
          // 绑定用户 设置极光推送别名
          if (global.uid) {
            if (process.env.TARO_ENV === "rn") {
              let JPush = require("@kafudev/jpush-react-native").default;
              if (JPush) {
                JPush.setAlias({
                  sequence: 8,
                  alias: "uid" + global.uid + ""
                });
                console.log("JPush setAlias", "uid" + global.uid + "");
              }
            }
          }
        }
      });
      let { LogBox, StatusBar } = require("react-native");
      // 去除黄屏警告
      LogBox.ignoreAllLogs();
      // 初始化热更新
      let CodePush = require("./utils/update").default;
      CodePush.check();
      //app设置状态栏字体颜色
      StatusBar.setBarStyle("dark-content");
      // 初始化微信appid
      // WechatSDK = require("react-native-wechat-lib");
      // WechatSDK.registerApp(global.wechat_appid, global.wechat_universalLink)
      //   .then(res => {
      //     console.log("wechat registerApp", res);
      //   })
      //   .catch(e => {
      //     console.log("wechat registerApp error", e);
      //   });
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}
  // this.props.children 是将要会渲染的页面
  render() {
    let StatusBar = null;
    if (process.env.TARO_ENV === "rn") {
      let rn = require("react-native");
      StatusBar = rn.StatusBar;
    }
    return (
      <>
        {/* this.props.children 是将要被渲染的页面 */}
        <Provider store={store}>
          {this.props.children}
          {/* 调试控制板 */}
          <Vconsole></Vconsole>
        </Provider>

        {process.env.TARO_ENV === "rn" ? (
          <StatusBar
            backgroundColor="rgba(0, 0, 0, 0)"
            translucent
            barStyle="dark-content"
            animated
          />
        ) : null}
      </>
    );
  }
}

export default App;
