import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.scss";
import { TextInput, ScrollView } from "react-native";
import { ComButton } from "@component";
import Taro from "@tarojs/taro";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  state = {
    smsmsg: "获取验证码"
  };
  changeVal = e => {
    let val = e.detail.value || "";
    this.props.onInput(val);
  };
  sendSms = (mobile, scene) => {
    if (!mobile) {
      return $utils.toast.text("请先输入手机号");
    }
    if (global.sendSmsNum != 1) {
      return;
    }
    Taro.showLoading({
      title: "loading"
    });
    global.sendSmsNum = 2;
    let d = {};
    let url = "authSendsms";
    if (scene == "register") {
      url = "registerAuthSendsms";
    }
    d.mobile = mobile;
    $utils.api
      .load(url, d, "post", { loading: false })
      .then(result => {
        if (result.code == 0) {
          let ii = 60;
          this.tt = setInterval(() => {
            this.setState({
              smsmsg: "等待" + ii + "秒",
              smsdisable: true
            });
            ii--;
            if (ii <= 0) {
              clearInterval(this.tt);
              this.setState(
                {
                  smsmsg: "获取验证码",
                  smsdisable: false
                },
                () => {
                  global.sendSmsNum = 1;
                }
              );
            }
          }, 1000);
        }
        $utils.toast.text(result.message);
      })
      .catch(e => {
        global.sendSmsNum = 1;
        console.log("sendsms ", e);
        $utils.toast.text("短信发送异常[" + e.name + ":" + e.message + "]");
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };

  render() {
    const {
      title,
      placeholder,
      style,
      type,
      maxLength,
      value,
      disabled,
      className,
      icon,
      isCode,
      tel,
      loginType,
      password
    } = this.props;
    return (
      <View className="loginInput" style={style}>
        <View className="loginInput-left">
          <Image className="loginInput-icon" src={icon} mode="aspectFill" />
          {/* <Input
            className='loginInput-text'
            type={type}
            placeholder={placeholder}
            onInput={this.changeVal.bind(this)}
            maxlength={maxlength}
            value={value}
            disabled={disabled}
            password={password}
          /> */}
          <TextInput
            className={"loginInput-text " + (isCode ? "loginInput-texts" : "")}
            clearButtonMode="always"
            autoCapitalize="none"
            maxLength={maxLength}
            keyboardType={type}
            placeholder={placeholder}
            value={value}
            secureTextEntry={password}
            onChangeText={username => {
              this.props.onInput(username);
            }}
            placeholderTextColor="#C1C1C1"
          />
        </View>
        {isCode ? (
          <ComButton
            className="loginInput-codeBtn"
            handleSubmit={() => {
              if (this.state.smsdisable) {
                return;
              }
              this.sendSms(tel, loginType);
            }}
            title={this.state.smsmsg}
          />
        ) : null}
      </View>
    );
  }
}
