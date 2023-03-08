import React, { Component } from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";

import "./index.scss";
import { Checkbox } from "@antmjs/vantui";

export default class Index extends Component {
  state = {
    checked: false
  };
  componentDidMount() {}
  componentDidShow() {}
  onChange = event => {
    console.log(event);
    this.setState(
      {
        checked: event.detail
      },
      () => {
        this.props.onChangeChecked(event.detail);
      }
    );
  };
  render() {
    const { value } = this.state;
    let { maxNum, disabled, defaultValue } = this.props;
    return (
      <Checkbox
        value={this.state.checked}
        shape='square'
        onChange={this.onChange}
        checkedColor='#2fd7bd'
        iconSize={25}
      >
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
      </Checkbox>
    );
  }
}
