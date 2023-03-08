import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Picker,
  Map,
  CoverView,
  CoverImage
} from "@tarojs/components";
import Taro from "@tarojs/taro";

import { PasswordInput, SubmitBtn } from "@component";
import BoxUpload_1 from "@assets/image/BoxUpload_1.png";
import headerBg from "@assets/image/headerBg.png";
import dayjs from "dayjs";
import "./index.scss";
// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      smscode: "",
      password: "",
      password1: "",
      password2: "",
      code: "",
      submitVal: true
    };
  }
  componentDidMount() {}

  async componentWillUnmount() {}

  onChageTel = data => {
    this.setState({
      mobile: data
    });
  };
  onChageCode = data => {
    this.setState({
      code: data
    });
  };
  onChagePassWord = data => {
    this.setState({
      password1: data
    });
  };
  onChageAgainPassWord = data => {
    this.setState({
      password2: data
    });
  };
  handleSubmit = () => {
    let { mobile, code, password1, password2, submitVal } = this.state;
    if (!mobile) {
      return $utils.toast.text("请输入手机号");
    }
    if (!code) {
      return $utils.toast.text("请输入短信验证码");
    }
    if (!password1) {
      return $utils.toast.text("请输入新密码");
    }
    if (password2 != password1) {
      return $utils.toast.text("密码不一致，请重新输入");
    }
    let d = {};
    d.mobile = this.state.mobile;
    d.smscode = this.state.code;
    d.password = this.state.password1;
    console.log("提交", d);
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    $utils.api
      .load("authchangePassword", d, "post", false)
      .then(result => {
        if (result.code == 1) {
          $utils.toast.success("修改成功");
          // $utils.auth.sync();
          // $utils.url.pop();
          Taro.navigateBack();
        } else {
          $utils.toast.text(result.message);
          this.setState({
            submitVal: true
          });
        }
      })
      .catch(err => {
        $utils.toast.text("操作异常");
        this.setState({
          submitVal: true
        });
      });
  };
  render() {
    let { mobile, code, password2, password1 } = this.state;
    return (
      <View className="forgetPassword">
        <View className="forgetPassword-box">
          <PasswordInput
            is_width
            title="手机号："
            placeholder="请输入手机号"
            onInput={this.onChageTel}
            tel={mobile}
            value={mobile}
            type="phone-pad"
          ></PasswordInput>
          <PasswordInput
            title="验证码："
            placeholder="请输入短信验证码"
            onInput={this.onChageCode}
            value={code}
            isCode
            tel={mobile}
          ></PasswordInput>
          <PasswordInput
            title="新密码："
            placeholder="请输入新密码"
            onInput={this.onChagePassWord}
            type="password"
            value={password1}
            password
            is_width
          ></PasswordInput>
          <PasswordInput
            title="确认密码："
            placeholder="请确认新密码"
            onInput={this.onChageAgainPassWord}
            type="password"
            className="forgetPassword-box-border"
            style={{ border: 0 }}
            is_width
            value={password2}
            password
          ></PasswordInput>
        </View>
        <SubmitBtn
          title="确认提交"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
