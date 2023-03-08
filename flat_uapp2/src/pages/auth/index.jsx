import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, Button, Image } from "@tarojs/components";
import "./index.scss";
import { Checkbox } from "@component";
import login_bg from "@assets/image/login_bg.png";
import weapp_icon from "@assets/image/weapp_icon.png";
import auth_icon from "@assets/image/auth_icon.png";

export default class Index extends Component {
  state = {
    checked: false
  };

  componentDidMount() {}

  authLogin = async () => {
    if (!this.state.checked) {
      return $utils.toast.text("请先阅读并同意用户服务协议");
    }
    let type = "wxmapp";
    if (process.env.TARO_ENV === "rn") {
      type = "wxapp";
    }
    let res = await $utils.auth.oauth(type);
    console.log(res, 3333);
  };
  //获取手机号
  getPhoneNumber = e => {
    if (!this.state.checked) {
      return $utils.toast.text("请先阅读并同意用户服务协议");
    }
    console.log(e, 55555);
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
      return;
    }
    let that = this;
    // 拿到用户数据
    Taro.login({
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      success(res3) {
        //获取code 发送code
        if (res3.code) {
          console.log(res3, "code");
          let loginData = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          };
          console.log(loginData);
          that.phoneLogin(res3, loginData);
        } else {
          console.log("登录失败！" + res3.errMsg);
        }
      }
    });
  };
  phoneLogin = (dd, loginData) => {
    let data = {};
    data.code = dd.code;
    data.type = "wxmapp";
    data.encryptedData = loginData.encryptedData;
    data.iv = loginData.iv;
    console.log(data, 9999);
    global.$utils.api.load("loauthAuth", data, "post").then(async result => {
      if (result.code === 200) {
        $utils.toast.success("登录成功");
        // 设置登录
        $utils.data.set("CustomerToken", result.data.token);
        // global.$utils.data.set("login", true);
        global.isLogin = true;
        await $utils.auth.getInfo();
        // global.$utils.data.set("userInfo", result.data);
        setTimeout(() => {
          Taro.navigateBack();
        }, 500);
      } else {
        global.$utils.toast.error(result.msg);
      }
      // this.back(result)
    });
  };
  onChangeChecked = data => {
    console.log(data, "是否同意协议");
    this.setState({
      checked: data
    });
  };

  // 判断石佛需要显示微信按钮
  isShowWechat = () => {
    if (process.env.TARO_ENV === "rn") {
      let { Platform } = require("react-native");
      // 判断ios是否在审核中
      if (Platform.OS == "ios") {
        if ($utils.app.iosCheckStatus) {
          return false;
        }
      }
    }
    return true;
  };
  render() {
    return (
      <View className='loginWp'>
        <Image className='loginWp-icon' src={auth_icon} mode='aspectFill' />
        <View className='loginWp-titlebox'>
          <View className='loginWp-titlebox-title'>欢迎使用</View>
          <View className='loginWp-titlebox-titleOne'>象寓</View>
        </View>
        <View className='loginWp-text'>账号一键登录，无需注册</View>
        <Image className='loginWp-login_bg' src={login_bg} mode='aspectFill' />

        {this.isShowWechat() ? (
          <View
            className='loginWp-login_btn'
            onClick={this.authLogin.bind(this)}
          >
            <Image
              className='loginWp-login_btn-icon'
              src={weapp_icon}
              mode='aspectFill'
            />
            <View className='loginWp-login_btn-text'>微信用户一键登录</View>
          </View>
        ) : null}

        <View
          className='loginWp-phonetext'
          onClick={() => {
            if (process.env.TARO_ENV === "rn") {
              Taro.redirectTo({
                url: "/pages/authPhone/index"
              });
            }
          }}
        >
          {process.env.TARO_ENV !== "rn" ? (
            <Button
              className='loginWp-phonetext-phone'
              openType='getPhoneNumber'
              onGetPhoneNumber={this.getPhoneNumber.bind(this)}
            />
          ) : null}
          手机号登录
        </View>
        <View className='loginWp-contentBox'>
          <Checkbox onChangeChecked={this.onChangeChecked}></Checkbox>
          {/* <View className='loginWp-contentBox-one'>登录代表您已同意</View>
          <View className='loginWp-contentBox-two'>移动和小区用户</View>
          <View className='loginWp-contentBox-two'>《服务协议》</View>
          <View className='loginWp-contentBox-two'>《隐私政策》</View> */}
        </View>
      </View>
    );
  }
}
