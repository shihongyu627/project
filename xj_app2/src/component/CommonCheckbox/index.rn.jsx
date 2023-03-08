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
      <View className="checkboxContent2">
        {this.props.title}
      </View>
    );
  };
  render() {
    let { value } = this.props;
    return (
      <Checkbox
        title={this.titleTag()}
        checked={value}
        checkedIconStyle={{ tintColor: "#2fd7bd" }}
        onChange={checked => {
          this.setState({
            checked
          },()=>{
             this.props.onChangeChecked(checked)
          });
        }}
      />
    );
  }
}
