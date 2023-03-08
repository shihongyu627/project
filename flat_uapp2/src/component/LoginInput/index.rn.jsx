import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.scss";
import { TextInput } from "react-native";

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
    let url = "authSendSms";
    d.phone = mobile;
    d.scene = "login";
    $utils.api
      .load(url, d, "get", { loading: false })
      .then(result => {
        $utils.toast.text(result.msg);
        if (result.code == 200) {
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
      })
      .catch(e => {
        console.log("sendsms ", e);
        $utils.toast.text("短信发送异常[" + e.name + ":" + e.msg + "]");
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
      tel,
      scene,
      password
    } = this.props;
    return (
      <View className="loginInput" style={style}>
        <View className="loginInput-left">
          <Image className="loginInput-icon" src={icon} mode="aspectFill" />
          <TextInput
            className="loginInput-text"
            clearButtonMode="always"
            keyboardType={type == "number" ? "decimal-pad" : "default"}
            autoCapitalize="none"
            maxLength={maxlength}
            placeholder={placeholder}
            value={value + ""}
            onChangeText={username => {
              this.props.onInput(username);
            }}
            editable={!disabled}
            placeholderTextColor="#888"
            secureTextEntry={password}
          />
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
        </View>

        {isCode ? (
          <View
            className="loginInput-codeBtn"
            onClick={() => {
              if (this.state.smsdisable) {
                return;
              }
              this.sendSms(tel, scene);
            }}
          >
            {this.state.smsmsg}
          </View>
        ) : null}
      </View>
    );
  }
}
