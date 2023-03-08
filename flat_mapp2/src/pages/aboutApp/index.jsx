import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";

import "./index.scss";
import icon_app from "@assets/image/icon_app.png";

export default class Index extends Component {
  state = {};

  componentDidMount() {}
  render() {
    return (
      <View className='userAboutApp'>
        <View className='userAboutApp-iconBox'>
          <Image
            className='userAboutApp-iconBox-icon'
            src={icon_app}
            mode='aspectFill'
          />
        </View>
        <View className='userAboutApp-title'>{global.company_title}</View>
        <View className='userAboutApp-titleTwo'>{global.seo_description}</View>
        <View className='userAboutApp-footerBox'>
          <View className='userAboutApp-footerBox-banquan'>
            {$utils.app.getVersion() || ""}
          </View>
          <View className='userAboutApp-footerBox-banquan'>
            CopyRight © 2022
          </View>
          <View className='userAboutApp-footerBox-gongsi'>
            {global.company}
          </View>
        </View>
      </View>
    );
  }
}
