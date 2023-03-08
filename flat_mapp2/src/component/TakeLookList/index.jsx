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
      <View className='TakeLookList'>
        <View className='TakeLookList-top'>
          <View
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <View className='TakeLookList-top-header'>
              <View className='TakeLookList-top-header-left'>
                <Image
                  className='TakeLookList-top-header-left-img'
                  src={global.$utils.loadimg.load(info.avatar)}
                  mode='aspectFill'
                />
                <View className='TakeLookList-top-header-left-title'>
                  {info.name}
                </View>
              </View>
              <View className='TakeLookList-top-header-right'>
                <View className='TakeLookList-top-header-right-color1 '></View>
                <View className='TakeLookList-top-header-right-title1 '>
                  {info.stateName}
                </View>
              </View>
            </View>
            <View className='TakeLookList-top-content'>
              预约日期：{info.seeTime}
            </View>
            <View className='TakeLookList-top-content'>
              预约房间：{info.flatRoomResponse && info.flatRoomResponse.name}
            </View>
            <View className='TakeLookList-top-content'>
              详细需求：{info.descr}
            </View>
          </View>
          <View className='TakeLookList-top-btnBox'>
            <View
              className='TakeLookList-top-btnBox-btn'
              onClick={() => {
                this.props.telPhoneOnClick(info);
              }}
            >
              拨打电话
            </View>
            {info.state == 4 ? null : // <View
            //   className='TakeLookList-top-btnBox-btn2'
            //   onClick={() => {
            //     this.props.onClickConfrim(info);
            //   }}
            // >
            //   发起签约
            // </View>
            info.state == 2 ? (
              <View
                className='TakeLookList-top-btnBox-btn2'
                onClick={() => {
                  this.props.onClickConfrim(info);
                }}
              >
                确认带看
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}
