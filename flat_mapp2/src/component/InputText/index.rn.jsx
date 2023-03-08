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
    console.log(value,998);
    return (
      <View className='InputText' style={style}>
        <View className={className + " InputText-title"} style={style}>
          {title}
        </View>
        <TextInput
          className='InputText-text'
          clearButtonMode='always'
          keyboardType={
            type == "number" || type == "idcard" || type == "digit"
              ? "decimal-pad"
              : "default"
          }
          autoCapitalize='none'
          maxLength={maxlength}
          placeholder={placeholder}
          value={value}
          onChangeText={username => {
            this.props.onInput(username);
          }}
          editable={!disabled}
          placeholderTextColor='#888'
        />
        {/* <Input
          className="InputText-text"
          type={type}
          placeholder={placeholder}
          onInput={this.changeVal.bind(this)}
          maxlength={maxlength}
          value={value}
          disabled={disabled}
        /> */}
      </View>
    );
  }
}
