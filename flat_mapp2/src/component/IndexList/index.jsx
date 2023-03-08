import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View
        className="IndexList"
        onClick={() => {
          this.props.goInfo(info);
        }}
      >
        <Image
          className="IndexList-img"
          src={global.$utils.loadimg.load(info.themeUrl)}
          mode="aspectFill"
        />
        <View className="IndexList-right">
          <View className="IndexList-right-title">
            <TextLabel
              className="IndexList-right-title-text"
              num={1}
              content={info.title}
            ></TextLabel>
          </View>
          <View className="IndexList-right-content">{info.content}</View>
          <View className="IndexList-right-tag">
            {info.tagArr &&
              info.tagArr.map((item, index) => (
                <View key={index} className="IndexList-right-tag-item">
                  {item}
                </View>
              ))}
          </View>
          <View className="IndexList-right-price">
            <Text className="IndexList-right-price-size">￥</Text>
            {info.price}
            <Text className="IndexList-right-price-size">/月</Text>
          </View>
        </View>
      </View>
    );
  }
}
