import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
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
      className
    } = this.props;
    return (
      <View className='InputText' style={style}>
        <View className={className + " InputText-title"} style={style}>
          {title}
        </View>
        <Input
          className='InputText-text'
          type={type}
          placeholder={placeholder}
          onInput={this.changeVal.bind(this)}
          maxlength={maxlength}
          value={value}
          disabled={disabled}
          placeholderStyle={{color:"#333"}}
        />
      </View>
    );
  }
}
