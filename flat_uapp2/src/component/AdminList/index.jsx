import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import telPng from "@assets/image/tel.png";
import Taro from "@tarojs/taro";

import TextLabel from "../TextLabel";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className='AdminList'>
        <View className='AdminList-header'>
          <Image
            className='AdminList-header-img'
            src={global.$utils.loadimg.load(info.avatar)}
            mode='aspectFill'
          />
          <View className='AdminList-header-right'>
            <View className='AdminList-header-right-title'>
              <TextLabel
                className='AdminList-header-right-title-text'
                num={2}
                content={info.name}
              ></TextLabel>
            </View>
            <TextLabel
              className='AdminList-header-right-content'
              num={2}
              content={info.content}
            ></TextLabel>
            <View
              className='AdminList-header-right-telBox'
              onClick={() => {
                if (!info.phone) {
                  return;
                }
                Taro.makePhoneCall({
                  phoneNumber: info.phone //仅为示例，并非真实的电话号码
                });
              }}
            >
              <Image
                className='AdminList-header-right-telBox-img'
                src={telPng}
                mode='aspectFill'
              />
              <View className='AdminList-header-right-telBox-text'>联系ta</View>
            </View>
          </View>
        </View>
        <View className='AdminList-bottom'>
          <View className='AdminList-bottom-title'>管理物业地址：</View>
          <View className='AdminList-bottom-address'>{info.site}</View>
        </View>
      </View>
    );
  }
}
