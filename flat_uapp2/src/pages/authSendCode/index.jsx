import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, Image } from "@tarojs/components";
import "./index.scss";
import { Checkbox, LoginInput } from "@component";
import login_tel from "@assets/image/login_tel.png";
import login_code from "@assets/image/login_code.png";
import auth_phone from "@assets/image/auth_phone.png";

export default class Index extends Component {
  state = {
    style: "sms",
    phone: "",
    smscode: "",
    password: "",
    checked: false,
    iosIsCheck: false
  };

  componentDidMount() {
    if (process.env.TARO_ENV === "rn") {
      let { Platform } = require("react-native");
      // 判断ios是否在审核中
      if (Platform.OS == "ios") {
        if ($utils.app.iosCheckStatus) {
          // 切换出密码登录用作测试
          this.setState({
            iosIsCheck: true,
          });
        }
      }
    }
  }

  onChageTel = data => {
    this.setState({
      phone: data
    });
  };
  onChageCode = data => {
    console.log(data, "验证码");
    this.setState({
      smscode: data
    });
  };
  onChagePassword = data => {
    console.log(data, "密码");
    this.setState({
      password: data
    });
  };
  onChageStyle = () => {
    this.setState({
      style: this.state.style == "sms" ? "pwd" : "sms"
    });
  };
  authLogin = async () => {
    if (!this.state.checked) {
      return $utils.toast.text("请先阅读并同意用户服务协议");
    }
    let d = {};
    d.phone = this.state.phone;
    d.style = this.state.style;
    d.smscode = this.state.smscode;
    d.password = this.state.password;
    let res = await $utils.auth.login(d);
    console.log(res);
    console.log("提交数据");
  };
  onChangeChecked = data => {
    console.log(data, "是否同意协议");
    this.setState({
      checked: data
    });
  };
  render() {
    let { phone, style, iosIsCheck } = this.state;
    return (
      <View className='authSendCode'>
        <Image
          className='authSendCode-icon'
          src={auth_phone}
          mode='aspectFill'
        />
        <View className='authSendCode-box'>
          <LoginInput
            placeholder='请输入手机号码'
            onInput={this.onChageTel}
            value={phone}
            icon={login_tel}
            type='number'
          ></LoginInput>
          {style == "sms" ? (
            <LoginInput
              placeholder='请输入验证码'
              onInput={this.onChageCode}
              icon={login_code}
              type='number'
              isCode
              tel={phone}
              value={this.state.smscode}
              scene='login'
            ></LoginInput>
          ) : null}
          {style == "pwd" ? (
            <LoginInput
              placeholder='请输入密码'
              onInput={this.onChagePassword}
              icon={login_code}
              type='password'
              password
              value={this.state.password}
            ></LoginInput>
          ) : null}
          {/* 暂时不支持切换密码登录,ios审核期间可以临时使用 */}
          {iosIsCheck ? (
            <View className='authSendCode-box-switch'>
              <View
                className='authSendCode-box-switch-text'
                onClick={this.onChageStyle.bind(this)}
              >
                {style == "sms" ? "密码登录" : "验证码登录"}
              </View>
            </View>
          ) : null}
        </View>
        <View
          className='authSendCode-login_btn'
          onClick={this.authLogin.bind(this)}
        >
          <View className='authSendCode-login_btn-text'>立即登录</View>
        </View>
        <View className='authSendCode-contentBox'>
          <Checkbox onChangeChecked={this.onChangeChecked}></Checkbox>
        </View>
      </View>
    );
  }
}
