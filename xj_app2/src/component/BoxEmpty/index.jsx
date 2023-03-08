import React, { Component } from "react";
import { View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import empty_box1 from "@assets/image/empty_box1.png";
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

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    let that=this
    Taro.getSystemInfo({
      success: (res) => {
        that.setState({
          width: res.screenWidth,
          height: res.screenHeight,
        });
      },
    });
  }

  componentDidShow() {}

  componentDidHide() {}
  render() {
    let title = this.props.title || '暂无内容';
    return (
      <View className='BoxEmpty'>
        <Image
          mode='aspectFill'
          className='BoxEmpty-img'
          src={empty_box1}
        ></Image>
        <View className='BoxEmpty-title'>{title}</View>
      </View>
    );
  }
}

export default Index;
