import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.scss";

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
    d.scene = scene;
    let url = "findMobileCode";
    if (this.props.codeType == "bindMoble") {
      url = "bindmobliecode";
    }
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
          <Input
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
          />
        </View>

        {isCode ? (
          <View
            className="PasswordInput-codeBtn"
            onClick={() => {
              if (this.state.smsdisable) {
                return;
              }
              this.sendSms(tel);
            }}
          >
            {this.state.smsmsg}
          </View>
        ) : null}
      </View>
    );
  }
}
