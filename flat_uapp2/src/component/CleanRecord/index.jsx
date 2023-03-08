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
      <View className='CleanRecord'>
        <View className='CleanRecord-top'>
          <View className='CleanRecord-top-header'>
            <View className='CleanRecord-top-header-left'>
              <Image
                className='CleanRecord-top-header-left-img'
                src={info.image}
                mode='aspectFill'
              />
              <View className='CleanRecord-top-header-left-title'>
                {info.title}
              </View>
            </View>
            <View className='CleanRecord-top-header-right'>
              <View
                className={
                  "CleanRecord-top-header-right-raido " +
                  (info.status == 1
                    ? "CleanRecord-top-header-right-color1"
                    : info.status == 2
                    ? "CleanRecord-top-header-right-color2"
                    : info.status == 3
                    ? "CleanRecord-top-header-right-color3"
                    : "")
                }
              ></View>
              <View
                className={
                  "CleanRecord-top-header-right-title " +
                  (info.status == 1
                    ? "CleanRecord-top-header-right-title1"
                    : info.status == 2
                    ? "CleanRecord-top-header-right-title2"
                    : info.status == 3
                    ? "CleanRecord-top-header-right-title3"
                    : "")
                }
              >
                {info.statusName}
              </View>
            </View>
          </View>
          <View className='CleanRecord-top-content'>
            提交日期：{info.time}
          </View>
          <View className='CleanRecord-top-content'>
            房间号：{info.address}
          </View>
          <View className='CleanRecord-top-content'>
            保洁项目：{info.typeName}
          </View>
          <View className='CleanRecord-top-content'>
            预约需求：{info.content}
          </View>

          <View className='CleanRecord-top-btnBox'>
            <View
              className='CleanRecord-top-btnBox-btn'
              onClick={() => {
                this.props.getOnClick(info);
              }}
            >
              {info.status == 1
                ? "撤销申请"
                : info.status == 2
                ? "去评价"
                : info.status == 3
                ? "去评价"
                : null}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
