import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import rightPng from "@assets/image/right.png";

export default class Index extends Component {
  state = {};

  render() {
    const { info, type } = this.props;
    return (
      <View
        className="AdvList"
        onClick={() => {
          this.props.goInfo(info);
        }}
      >
        <View className="AdvList-top">
          <View>
            <View className="AdvList-top-header">
              <View className="AdvList-top-header-left">
                <View className="AdvList-top-header-left-title">
                  {info.title}
                </View>
              </View>
            </View>
            <TextLabel
              className="AdvList-top-content"
              num={2}
              content={info.content}
            ></TextLabel>
          </View>
          <View className="AdvList-top-btnBox">
            <Text className="AdvList-top-btnBox-btn">
              发布时间：{info.createTime}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
