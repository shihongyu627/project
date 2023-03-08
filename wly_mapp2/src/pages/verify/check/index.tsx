import { Component } from "react";
import { View, Text, Input } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {
    width: 750,
    height: 667
  };
  componentDidMount() {
    this.onClickLogin();
  }

  componentDidShow() {}

  //登录
  onClickLogin = () => {
    let d = {};
    Taro.request({
      url: global.verifyCheck,
      data: d,
      method: "POST",
      success: function(res) {
        let v = res.data || {};
        // Taro.showToast({
        //   title: v.message || "请求错误",
        //   icon: "none",
        //   duration: 1500
        // });
        if (v.data) {
          let token = v.data.token;
          Taro.setStorageSync("verifyToken", token);
          if (token) {
            Taro.redirectTo({
              url: `/pages/verify/scan/index`
            });
          }
        } else {
          Taro.redirectTo({
            url: `/pages/verify/auth/index`
          });
        }
      },
      fail: function(res) {
        console.log(res);
      },
      header: {
        "content-type": "application/json",
        Authorization: Taro.getStorageSync("verifyToken") || ""
      }
    });
  };
  render() {
    return <View className="login_box"></View>;
  }
}
