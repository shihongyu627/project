import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import rightPng from "@assets/image/right.png";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className='houseViewRecord'>
        <View className='houseViewRecord-top'>
          <View
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <View className='houseViewRecord-top-header'>
              <View className='houseViewRecord-top-header-left'>
                <Image
                  className='houseViewRecord-top-header-left-img'
                  src={global.$utils.loadimg.load(info.avatar)}
                  mode='aspectFill'
                />
                <View className='houseViewRecord-top-header-left-title'>
                  {info.name}
                </View>
              </View>
              <View className='houseViewRecord-top-header-right'>
                <View
                  className='houseViewRecord-top-header-right-color1 '
                ></View>
                <View className='houseViewRecord-top-header-right-title1 '>
                  {info.stateName}
                </View>
              </View>
            </View>
            <View className='houseViewRecord-top-content'>
              预约日期：{info.seeTime}
            </View>
            <View className='houseViewRecord-top-content'>
              预约房间：{info.flatRoomResponse && info.flatRoomResponse.name}
            </View>
            <Text className='houseViewRecord-top-content'>
              详细需求：{info.descr}
            </Text>
          </View>
          <View className='houseViewRecord-top-btnBox'>
            {info.state == 0 ? (
              <View
                className='houseViewRecord-top-btnBox-btn2'
                onClick={() => {
                  this.props.onClickConfrim(info);
                }}
              >
                取消预约
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}
