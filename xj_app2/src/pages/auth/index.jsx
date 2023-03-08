import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, Text, Button, Image } from "@tarojs/components";
import "./index.scss";
import { ComButton, LoginInput, Checkbox, AgreementModal } from "@component";
import login_tel from "@assets/image/authTel.png";
import login_password from "@assets/image/authPassWork.png";
import login_number from "@assets/image/login_number.png";
import authAsk from "@assets/image/authAsk.png";

export default class Index extends Component {
  state = {
    title: "登录",
    btnText: "立即登录",
    checked: false,
    mobile: "",
    password: "",
    siteInfo: {},
    showModal: false, //协议弹窗控制
    agreeModal: false //协议弹窗控制
  };

  componentDidMount() {
    let siteInfo = $utils.data.get("siteInfo") || {};
    this.setState({
      siteInfo
    });
  }
  componentDidShow() {
    // await this.loadData();
    this.setState({
      showModal: true,
      agreeModal: $utils.data.get("showModal")
    });
  }
  authLogin = () => {
    global.$utils.auth.wechat();
  };
  onChageTel = data => {
    this.setState({
      mobile: data
    });
  };
  onChagePassWord = data => {
    console.log(data, "密码");
    this.setState({
      password: data
    });
  };
  onChangeChecked = data => {
    console.log(data, "是否同意协议");
    this.setState({
      checked: data
    });
  };
  onClickLogin = () => {
    let { checked, mobile } = this.state;
    if (!this.state.checked) {
      return $utils.toast.text("请先阅读并同意用户服务协议");
    }
    if (!this.state.mobile) {
      return $utils.toast.text("手机号码不能为空");
    }
    Taro.showLoading({
      title: "loading"
    });
    let dd = {
      username: this.state.mobile,
      password: this.state.password
    };
    $utils.auth.login(dd).then(result => {
      if (result) {
        $utils.auth.checklogin();
        setTimeout(() => {
          Taro.eventCenter.trigger("refreshMessageBadge", true);
          Taro.switchTab({
            url: "/index"
          });
        }, 600);
      }
      // this.state.btnText = submit
    });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  //弹窗
  onLeftBtn = () => {
    this.setState({
      showModal: false
    });
  };
  onRightBtn = () => {
    this.setState(
      {
        showModal: false
      },
      () => {
        $utils.data.set("showModal", true);
      }
    );
  };
  render() {
    let {
      title,
      btnText,
      checked,
      mobile,
      siteInfo,
      showModal,
      agreeModal
    } = this.state;
    return (
      <View className="loginWp">
        <View className="loginWp-box">
          <Image
            className="loginWp-box-icon"
            src={$utils.loadimg.load(siteInfo.app_logo?.value)}
            mode="aspectFill"
          />
          <View className="loginWp-box-title">欢迎登录{siteInfo.app_name?.value}</View>
          <View className="loginWp-box-contentBox">
            <LoginInput
              placeholder="请输入手机号码"
              onInput={this.onChageTel}
              value={this.state.mobile}
              icon={login_tel}
              maxLength={11}
              type="phone-pad"
            ></LoginInput>
            <LoginInput
              placeholder="请输入密码"
              onInput={this.onChagePassWord}
              icon={login_password}
              type="password"
              value={this.state.password}
              password
            ></LoginInput>
            <ComButton
              className="loginWp-box-contentBox-btnText"
              handleSubmit={this.onClickLogin}
              title={btnText}
            />
            <View className="loginWp-box-contentBox-btnBox">
              <View
                className="loginWp-box-contentBox-btnBox-btnLeft"
                onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/forgetPassword/index"
                  });
                }}
              >
                <View className="loginWp-box-contentBox-btnBox-btnLeft_title">
                  忘记密码
                </View>
                <Image
                  className="loginWp-box-contentBox-btnBox-btnLeft_icon"
                  src={authAsk}
                  mode="aspectFill"
                />
              </View>
            </View>
          </View>
        </View>
        <View className="loginWp-box-Checkbox">
          <Checkbox onChangeChecked={this.onChangeChecked}></Checkbox>
        </View>
        {!agreeModal && global.firstModal == 1 ? (
          <AgreementModal
            title="用户协议和隐私政策"
            leftBtnTxt="不同意并退出"
            rightBtnTxt="同意"
            type="input"
            onRightBtn={this.onRightBtn}
            onLeftBtn={this.onLeftBtn}
            show={showModal}
          ></AgreementModal>
        ) : null}
      </View>
    );
  }
}
