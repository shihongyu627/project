import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.scss";
import { TextInput } from "react-native";
import { ComButton } from "@component";

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
    let d = {};
    d.mobile = mobile;
    d.scene = "changepassword";
    let url = "sendsms";
    $utils.api
      .load(url, d, "post", { loading: false })
      .then(result => {
        if (result.code == 1) {
          let ii = 60;
          this.tt = setInterval(() => {
            this.setState({
              smsmsg: "等待" + ii + "秒",
              smsdisable: true
            });
            ii--;
            if (ii <= 0) {
              clearInterval(this.tt);
              this.setState({
                smsmsg: "获取验证码",
                smsdisable: false
              });
            }
          }, 1000);
        }
        $utils.toast.text(result.message);
      })
      .catch(e => {
        console.log("sendsms ", e);
        $utils.toast.text("短信发送异常[" + e.name + ":" + e.message + "]");
      });
  };

  render() {
    const {
      title,
      placeholder,
      style,
      type,
      maxlength,
      value,
      disabled,
      className,
      icon,
      isCode,
      password,
      tel,
      is_width
    } = this.props;
    return (
      <View className="PasswordInput" style={style}>
        <View className="PasswordInput-left">
          <View className={className + " PasswordInput-title"} style={style}>
            {title}
          </View>
          <TextInput
            className={
              "PasswordInput-text " + (is_width ? "PasswordInput-texts" : "")
            }
            clearButtonMode="always"
            keyboardType={type}
            autoCapitalize="none"
            maxLength={maxlength}
            placeholder={placeholder}
            value={value}
            secureTextEntry={password}
            onChangeText={username => {
              this.props.onInput(username);
            }}
            placeholderTextColor="#C1C1C1"
          />
          {/* <Input
            className={
              "PasswordInput-text " + (is_width ? "PasswordInput-texts" : "")
            }
            type={type}
            placeholder={placeholder}
            onInput={this.changeVal.bind(this)}
            maxlength={maxlength}
            value={value}
            disabled={disabled}
            password={password}
          /> */}
        </View>

        {isCode ? (
          <ComButton
            className="PasswordInput-codeBtn"
            handleSubmit={() => {
              if (this.state.smsdisable) {
                return;
              }
              this.sendSms(tel);
            }}
            title={this.state.smsmsg}
          />
        ) : null}
      </View>
    );
  }
}
