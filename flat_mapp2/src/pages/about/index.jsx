import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";

import "./index.scss";
import { SubmitBtn } from "@component";
import rightPng from "@assets/image/right.png";
import icon_app from "@assets/image/icon_app.png";

export default class Index extends Component {
  state = {
    list: [
      {
        name: "关于应用",
        url: "/pages/aboutApp/index",
        image: rightPng
      },
      {
        name: "关于我们",
        url: "/pages/richText/index?type=ABOUT&title=关于我们",
        image: rightPng
      },
      {
        name: "隐私条例",
        url: "/pages/richText/index?type=PRIVACY&title=隐私协议",
        image: rightPng
      },
    ],
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
    let { height, list, menuList } = this.state;
    return (
      <View className='userAbout'>
        <ScrollView
          className='scrollDom'
          scrollY
          lowerThreshold={90}
          style={{ height: height - 113 }}
        >
          <View className='userAbout-iconBox'>
            <Image
              className='userAbout-iconBox-icon'
              src={icon_app}
              mode='aspectFill'
            />
          </View>

          <View className='userAbout-title'>{global.company_title}</View>
          <View className='userAbout-menuBox'>
            {list.map((item, index) => (
              <View
                className={
                  index == 0
                    ? "userAbout-menuBox-items"
                    : "userAbout-menuBox-item"
                }
                key={index}
                onClick={() => {
                  Taro.navigateTo({
                    url: item.url
                  });
                }}
              >
                <View className='userAbout-menuBox-item-left'>
                  <View className='userAbout-menuBox-item-left-text'>
                    {item.name}
                  </View>
                </View>
                {item.image ? (
                  <Image
                    className='userAbout-menuBox-item-right'
                    src={item.image}
                    mode='aspectFill'
                  />
                ) : null}
                {item.text ? (
                  <View className='userAbout-menuBox-item-text'>
                    {item.text}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
          <View className='userAbout-bottomBr'></View>
        </ScrollView>
      </View>
    );
  }
}
