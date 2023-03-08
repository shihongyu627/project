import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Button, Image, ScrollView } from "@tarojs/components";

import "./index.scss";
import { SubmitBtn } from "@component";
import kefuImg from "@assets/image/kefuImg.png";
import icon_app from "@assets/image/icon_app.png";

export default class Index extends Component {
  state = {
    height: 667
  };

  componentDidMount() {
    const info = Taro.getSystemInfoSync();
    this.setState({
      height: info.windowHeight
    });
  }

  //提现
  handleSubmit = () => {
    $utils.toast.islogoutModal();
  };
  render() {
    let { height } = this.state;
    return (
      <View className='kefuBox'>
        <ScrollView
          className='scrollDom'
          scrollY
          lowerThreshold={90}
          style={{ height: height - 113 }}
        >
          <View className='kefuBox-iconBox'>
            <Image
              className='kefuBox-iconBox-icon'
              src={icon_app}
              mode='aspectFill'
            />
          </View>

          <View className='kefuBox-title'>{global.company_title}</View>
          <View className='kefuBox-desrc'>
            象寓，是一家为青年人才提供长租服务和休闲空间的品牌公寓，同时也是集青年公寓和青创中心为一体的现代青年人才发展社区。
          </View>
          <View className='kefuBox-btn'>
            <Image
              className='kefuBox-btn-icon'
              src={kefuImg}
              mode='aspectFill'
            />
            <View className='kefuBox-btn-title'>联系客服</View>
            <Button
              className='kefuBox-btn-contact'
              open-type='contact'
            ></Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}
