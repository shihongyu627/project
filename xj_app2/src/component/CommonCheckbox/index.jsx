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
    // const { value } = this.state;
    let {title ,value} = this.props;
    return (
      <Checkbox
        value={value}
        shape="square"
        onChange={this.onChange}
        checkedColor="#2fd7bd"
        iconSize={25}
      >
        <View className="checkboxContent2">
            {title}
        </View>
      </Checkbox>
    );
  }
}
