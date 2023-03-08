import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className="LifeCostItem">
        <Image
          className="LifeCostItem-img"
          src={info.bgImg}
          mode="aspectFill"
        />
        <View className="LifeCostItem-box">
          <Image
            className="LifeCostItem-box-icon"
            src={info.icon}
            mode="aspectFill"
          />
          <View className="LifeCostItem-box-content">
            <View className="LifeCostItem-box-content-left">
              <View className="LifeCostItem-box-content-left-title">
                {info.title}
              </View>
              <View className="LifeCostItem-box-content-left-address">
                {info.address}
              </View>
            </View>
            <View
              className="LifeCostItem-box-content-right"
              onClick={() => {
                this.props.goInfo(info);
              }}
            >
              充值
            </View>
          </View>
        </View>
      </View>
    );
  }
}
