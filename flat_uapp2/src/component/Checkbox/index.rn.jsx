import React, { Component } from "react";
import Taro from "@tarojs/taro";

import "./index.scss";
import { Checkbox } from "teaset";
import { View } from "@tarojs/components";

export default class Index extends Component {
  state = {
    checked: false
  };
  componentDidMount() {}
  componentDidShow() {}
  titleTag = () => {
    return (
      <View className='checkboxContent'>
        <View className='checkboxContent_text'>登录即阅读并同意</View>
        <View
          className='checkboxContent_text checkboxContent_color'
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/richText/index?type=AGREEMENT&title=用户协议`
            });
          }}
        >
          《用户协议》
        </View>
        <View className='checkboxContent_text'>和</View>
        <View
          className='checkboxContent_text checkboxContent_color'
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/richText/index?type=PRIVACY&title=隐私政策`
            });
          }}
        >
          《隐私政策》
        </View>
      </View>
    );
  };
  render() {
    let { value } = this.state;
    let { maxNum, defaultValue } = this.props;
    console.log(defaultValue);
    return (
      <Checkbox
        title={this.titleTag()}
        checked={this.state.checked}
        checkedIconStyle={{ tintColor: "#2fd7bd" }}
        onChange={checked => {
          this.setState(
            {
              checked
            },
            () => {
              this.props.onChangeChecked(checked);
            }
          );
        }}
      />
    );
  }
}
