import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input, Text } from "@tarojs/components";
import "./index.scss";
import { BoxEmpty, LifeCostList } from "@component";
import lifeCost_bg from "@assets/image/lifeCost_bg.png";
import lifeCost_icon from "@assets/image/lifeCost_icon.png";
import lifeCost_bgTwo from "@assets/image/lifeCost_bgTwo.png";
import lifeCost_iconTwo from "@assets/image/lifeCost_iconTwo.png";
import { getWindowHeight } from "@utils/style";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [
      {
        title: "水费充值",
        type: "1",
        bgImg: lifeCost_bg,
        icon: lifeCost_icon
      },
      {
        title: "电费充值",
        type: "2",
        bgImg: lifeCost_bgTwo,
        icon: lifeCost_iconTwo
      }
    ],
    dataTotal: 0
  };

  componentDidMount() {
    // Taro.setNavigationBarColor({
    //   frontColor: "#000000",
    //   backgroundColor: "#ffffff"
    // });
  }
  //滑动加载
  onReachBottom = () => {};
  getOnClick = data => {
    Taro.navigateTo({
      url: `/pages/user/lifeCost/create/index?type=${data.type}&title=${data.title}`
    });
  };
  render() {
    let { list, dataTotal } = this.state;
    return (
      <View className='lifeCostBox'>
        <View className='lifeCostBox-list'>
          {list.map((item, index) => (
            <LifeCostList
              info={item}
              goInfo={this.getOnClick}
              key={index}
            ></LifeCostList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无缴费'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
