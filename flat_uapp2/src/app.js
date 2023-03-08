import React, { Component } from "react";
import "./app.scss";
import utils from "./utils";
import config from "./config";
import Taro from "@tarojs/taro";
import { Provider } from "react-redux";
import Vconsole from "./component/Vconsole";
import store from "./store";
global.$utils = utils;
global.$config = config;
class App extends Component {
  async componentDidMount() {
    await $utils.auth.getInfo();
    await $utils.auth.messageAll("customer"); //统计消息未读数量
    let WechatSDK = null;
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
                  sequence: 6,
                  alias: "uid" + global.uid + ""
                });
                console.log("JPush setAlias", "uid" + global.uid + "");
              }
            }
          }
        }
      });
      let { LogBox } = require("react-native");
      // 去除黄屏警告
      LogBox.ignoreAllLogs();
      // 初始化热更新
      let CodePush = require("./utils/update").default;
      CodePush.check();
      // 检测是否iOS在审核中
      $utils.app.init();
      $utils.app.checkIosStatus();
      // 推送初始化
      // $utils.push.init();
      // 初始化微信appid
      WechatSDK = require("react-native-wechat-lib");
      WechatSDK.registerApp(global.wechat_appid, global.wechat_universalLink)
        .then(res => {
          console.log("wechat registerApp", res);
        })
        .catch(e => {
          console.log("wechat registerApp error", e);
        });
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}
  // this.props.children 是将要会渲染的页面
  render() {
    let VConsole = null;
    if (process.env.TARO_ENV === "rn") {
      VConsole = require("@kafudev/react-native-vconsole").default;
    }
    return (
      <>
        {/* this.props.children 是将要被渲染的页面 */}
        <Provider store={store}>
          {this.props.children}
          {/* 调试控制板 */}
          <Vconsole></Vconsole>
        </Provider>
        {/* {process.env.TARO_ENV === "rn" ? (
          <VConsole
            showBtn={process.env.NODE_ENV === "development" ? true : false}
          />
        ) : null} */}
      </>
    );
  }
}

export default App;
