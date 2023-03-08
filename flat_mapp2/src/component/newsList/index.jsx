import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import rightPng from "@assets/image/right.png";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View
        className="newsList"
        onClick={() => {
          this.props.goInfo(info);
        }}
      >
        <View className="newsList-top">
          <View className="newsList-top-header">
            <View className="newsList-top-header-left">
              <View className="newsList-top-header-left-imgBox">
                {info.state == 1 ? null : (
                  <View className="newsList-top-header-left-imgBox-radio" />
                )}
                <Image
                  className="newsList-top-header-left-img"
                  src={global.$utils.loadimg.load(info.icon)}
                  mode="aspectFill"
                />
              </View>
              <View className="newsList-top-header-left-title">
                {info.title}
              </View>
            </View>
            <View className="newsList-top-header-right">{info.createTime}</View>
          </View>
          <TextLabel
            className="newsList-top-content"
            num={2}
            content={info.descr}
          ></TextLabel>
          {/* <View className="newsList-top-content">
            <View className="newsList-top-content-title">
              预约时间：8月11日 14:30
            </View>
            <View className="newsList-top-content-text">
              预约地址：广东省广州市国际采购中心国贸地铁站 B口600米
            </View>
          </View> */}
        </View>
        {info.skipUrl ? (
          <View className="newsList-bottom">
            <View className="newsList-bottom-br">
              <View className="newsList-bottom-br-title">查看详情</View>
              <Image
                className="newsList-bottom-br-icon"
                src={rightPng}
                mode="aspectFill"
              />
            </View>
            {/* {info.type == 2 ? (
            <View className="newsList-bottom-brs">
              <Text className="newsList-bottom-brs-btn1" onClick={() => {}}>
                发送催缴
              </Text>
            </View>
          ) : null}
          {info.type == 3 ? (
            <View className="newsList-bottom-brs">
              <Text className="newsList-bottom-brs-btn1" onClick={() => {}}>
                发送续签
              </Text>
            </View>
          ) : null}
          {info.type == 5 || info.type == 6 ? (
            <View className="newsList-bottom-brs">
              <Text className="newsList-bottom-brs-btn1" onClick={() => {}}>
                发送通知
              </Text>
            </View>
          ) : null} */}
          </View>
        ) : null}
      </View>
    );
  }
}
