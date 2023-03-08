import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  state = {};
  changeVal = e => {
    let val = e.detail.value || "";
    this.props.onInput(val);
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
      tag
    } = this.props;
    return (
      <View className="InputText" style={style}>
        <View className={className + " InputText-title"} style={style}>
          {title}
          {tag ? <Text style={{ color: "#FF0C0C" }}>{" " + tag}</Text> : null}
        </View>
        <Input
          className="InputText-text"
          type={type}
          placeholder={placeholder}
          onInput={this.changeVal.bind(this)}
          maxlength={maxlength}
          value={value}
          disabled={disabled}
        />
      </View>
    );
  }
}
