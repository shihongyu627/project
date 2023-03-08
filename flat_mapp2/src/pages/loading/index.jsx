import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  state = {};

  componentDidMount() {
    Taro.showLoading({
      title: "加载中"
    });
    if (process.env.TARO_ENV === "rn") {
      let { NativeModules } = require("react-native");
      setTimeout(
        () => {
          NativeModules.RNBootSplash.hide(true); // 隐藏启动屏
        },
        process.env.NODE_ENV === "development" ? 200 : 1500
      );
    }
    this.load();
  }
  load = () => {
    let d = {};
    global.$utils.api
      .load("getInfo", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let userInfo = res.user || {};
          $utils.data.set("userInfo", userInfo || {});
          $utils.data.set("isLogin", true);
          global.isLogin = true;
          $utils.data.set("userType", userInfo.userType || "");
          setTimeout(function() {
            Taro.hideLoading();
            if (userInfo.userType == "BUTLER") {
              Taro.switchTab({
                url: "/pages/tabbar/index/index"
              });
            } else {
              Taro.redirectTo({
                url: "/pages/property/home/index"
              });
            }
          }, 1000);
        } else {
          Taro.navigateTo({
            url: "/pages/auth/index"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };

  render() {
    return <View className='loadingBox'></View>;
  }
}
