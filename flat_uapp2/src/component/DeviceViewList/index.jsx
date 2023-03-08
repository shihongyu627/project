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
      <View className='DeviceViewList'>
        <View className='DeviceViewList-top'>
          <View className='DeviceViewList-top-header'>
            <View className='DeviceViewList-top-header-left'>
              <Image
                className='DeviceViewList-top-header-left-img'
                src={info.image}
                mode='aspectFill'
              />
              <View className='DeviceViewList-top-header-left-title'>
                {info.title}
              </View>
            </View>
            <View className='DeviceViewList-top-header-right'>
              <View
                className={
                  "DeviceViewList-top-header-right-raido " +
                  (info.status == 1
                    ? "DeviceViewList-top-header-right-color1"
                    : info.status == 2
                    ? "DeviceViewList-top-header-right-color2"
                    : info.status == "-1"
                    ? "DeviceViewList-top-header-right-color3"
                    : "")
                }
              ></View>
              <View
                className={
                  "DeviceViewList-top-header-right-title " +
                  (info.status == 1
                    ? "DeviceViewList-top-header-right-title1"
                    : info.status == 2
                    ? "DeviceViewList-top-header-right-title2"
                    : info.status == "-1"
                    ? "DeviceViewList-top-header-right-title3"
                    : "")
                }
              >
                {info.statusName}
              </View>
            </View>
          </View>
          <View className='DeviceViewList-top-content'>
            联系电话：{info.time}
          </View>
          <View className='DeviceViewList-top-content'>
            预约类型：{info.typeName}
          </View>
          <View className='DeviceViewList-top-content'>
            预约需求：{info.content}
          </View>

          <View className='DeviceViewList-top-btnBox'>
            <View
              className='DeviceViewList-top-btnBox-btn'
              onClick={() => {
                this.props.getOnClick(info);
              }}
            >
              {info.status == 1
                ? "撤销申请"
                : info.status == 2
                ? "删除"
                : info.status == "-1"
                ? "再次申请"
                : null}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
