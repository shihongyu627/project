import { Component } from "react";

import { Image, View } from "@tarojs/components";
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
    return (
      <View className='InputText' style={style}>
        <View className={className + " InputText-title"} style={style}>
          {title}
        </View>
        {/* <Input
          className="InputText-text"
          type={type}
          placeholder={placeholder}
          onInput={this.changeVal.bind(this)}
          maxlength={maxlength}
          value={value}
          disabled={disabled}
          placeholderStyle={{ color: "#333" }}
        /> */}
        <TextInput
          className='InputText-text'
          clearButtonMode='always'
          keyboardType='default'
          autoCapitalize='none'
          maxLength={maxlength}
          placeholder={placeholder}
          value={value}
          onChangeText={username => {
            this.props.onInput(username);
          }}
          placeholderTextColor='#888'
        />
      </View>
    );
  }
}
