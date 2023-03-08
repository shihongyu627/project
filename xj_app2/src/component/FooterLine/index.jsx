import React, { Component } from "react";
import { View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

class FooterLine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let that = this;
  }

  componentDidShow() {}

  componentDidHide() {}
  render() {
    let title = this.props.title || "暂无内容";
    return (
      <View className="FooterLine">
        <View className="FooterLine-left"></View>
        <View className="FooterLine-title">{title}</View>
        <View className="FooterLine-right"></View>
      </View>
    );
  }
}

export default FooterLine;
