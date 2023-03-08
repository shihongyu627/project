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
        className='CleanList'
        onClick={() => {
          this.props.getOnClick(info);
        }}
      >
        <View className='CleanList-top'>
          {info.payType == 0 ? (
            <View className='CleanList-top-tag'>免费</View>
          ) : null}
          <Image
            className='CleanList-top-img'
            src={global.$utils.loadimg.load(info.themeUrl)}
            mode='aspectFill'
          />
        </View>
        <View className='CleanList-right'>
          <View className='CleanList-right-title'>
            <TextLabel
              className='CleanList-right-title-text'
              num={1}
              content={info.title}
            ></TextLabel>
          </View>
          <View className='CleanList-right-tag'>
            {info.tagArr &&
              info.tagArr.map((item, index) => (
                <View
                  key={index}
                  className={
                    index == 0
                      ? "CleanList-right-tag-items"
                      : "CleanList-right-tag-item"
                  }
                >
                  {item}
                </View>
              ))}
          </View>
          <View className='CleanList-right-bottom'>
            <View className='CleanList-right-bottom-price'>
              <Text className='CleanList-right-bottom-price-size'>￥</Text>
              {info.price}
            </View>
            <Text className='CleanList-right-bottom-btn'>立即预约</Text>
          </View>
        </View>
      </View>
    );
  }
}
