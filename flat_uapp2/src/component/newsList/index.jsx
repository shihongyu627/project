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
          </View>
        ) : null}
      </View>
    );
  }
}
