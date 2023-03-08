import React, { Component } from "react";
import Taro from "@tarojs/taro";

import {
  View,
  ScrollView,
  Button,
  Image,
  Text,
  Input
} from "@tarojs/components";
import "./index.scss";
import { BoxEmpty, ShareSheet } from "@component";
import login_bg from "@assets/image/login_bg.png";
import loginTel from "@assets/image/loginTel.png";
import loginIcon from "@assets/image/loginIcon.png";
import loginPassWord from "@assets/image/loginPassWord.png";
import loginDisable from "@assets/image/loginDisable.png";
import loginOpen from "@assets/image/loginOpen.png";

export default class Index extends Component {
  state = {
    passwordVal: true,
    password: "", //密码
    username: "" //用户名
  };

  componentDidMount() {}

  authLogin = () => {
    Taro.showLoading({
      title: "loading"
    });
    let { username, password } = this.state;
    if (!username) {
      return $utils.toast.text("请输入正确的用户名");
    }
    if (!password) {
      return $utils.toast.text("请输入正确的密码");
    }
    let d = {};
    d.username = username;
    d.password = password;
    $utils.api
      .load("loginAuth", d, "post", false)
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          console.log(res);
          let userInfo = res.user || {};
          $utils.data.set("MaintainerToken", res.token || "");
          $utils.data.set("userInfo", userInfo || {});
          $utils.data.set("isLogin", true);
          global.isLogin = true;
          $utils.data.set("userType", userInfo.userType || "");
          global.$utils.auth.getInfo();
          setTimeout(function() {
            Taro.hideLoading();
            Taro.eventCenter.trigger("refreshMenuList", true); //菜单列表
            Taro.switchTab({
              url: "/pages/tabbar/index/index"
            });
          }, 500);
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  changeNameVal = e => {
    let val = e.detail.value || "";
    this.setState({
      username: val
    });
  };
  changePassWordVal = e => {
    let val = e.detail.value || "";
    this.setState({
      password: val
    });
  };
  render() {
    let { passwordVal } = this.state;
    let TextInput = null;
    if (process.env.TARO_ENV === "rn") {
      let RN = require("react-native");
      TextInput = RN.TextInput;
    }
    return (
      <View className='loginWp'>
        <Image className='loginWp-login_bg' src={login_bg} mode='aspectFill' />
        <Image className='loginWp-icon' src={loginIcon} mode='aspectFill' />
        <View className='loginWp-text'>您好，欢迎使用</View>
        <View className='loginWp-inputBox'>
          <View className='loginWp-inputBox-item'>
            <View className='loginWp-inputBox-item-left'>
              <Image
                className='loginWp-inputBox-item-left-icon'
                src={loginTel}
                mode='aspectFill'
              />
              {process.env.TARO_ENV === "rn" ? (
                <TextInput
                  className='loginWp-inputBox-item-left-input'
                  clearButtonMode='always'
                  keyboardType='default'
                  autoCapitalize='none'
                  placeholder='请输入用户名'
                  onChangeText={username => {
                    this.setState({
                      username: username
                    });
                  }}
                  placeholderTextColor='#888'
                />
              ) : (
                <Input
                  type='text'
                  className='loginWp-inputBox-item-left-input'
                  placeholder='请输入用户名'
                  onInput={this.changeNameVal.bind(this)}
                />
              )}
            </View>
          </View>
          <View className='loginWp-inputBox-item'>
            <View className='loginWp-inputBox-item-left'>
              <Image
                className='loginWp-inputBox-item-left-icon'
                src={loginPassWord}
                mode='aspectFill'
              />
              {process.env.TARO_ENV === "rn" ? (
                <TextInput
                  className='loginWp-inputBox-item-left-input'
                  clearButtonMode='always'
                  keyboardType='default'
                  autoCapitalize='none'
                  placeholder='请输入密码'
                  onChangeText={username => {
                    this.setState({
                      password: username
                    });
                  }}
                  secureTextEntry={passwordVal}
                  placeholderTextColor='#888'
                />
              ) : (
                <Input
                  type={passwordVal ? "password" : "text"}
                  className='loginWp-inputBox-item-left-input'
                  placeholder='请输入密码'
                  onInput={this.changePassWordVal.bind(this)}
                />
              )}
            </View>
            <Image
              className='loginWp-inputBox-item-right'
              src={!passwordVal ? loginOpen : loginDisable}
              mode='aspectFill'
              onClick={() => {
                this.setState({
                  passwordVal: !passwordVal
                });
              }}
            />
          </View>
        </View>
        <Text className='loginWp-login_btn' onClick={this.authLogin.bind(this)}>
          登录
        </Text>
      </View>
    );
  }
}
