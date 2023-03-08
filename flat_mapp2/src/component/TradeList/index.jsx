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
      <View className="TradeList">
        <View className="TradeList-top">
          <View className="TradeList-top-header">
            <View className="TradeList-top-header-left">
              <Image
                className="TradeList-top-header-left-img"
                src={global.$utils.loadimg.load(info.icon)}
                mode="aspectFill"
              />
              <View className="TradeList-top-header-left-title">
                {info.typeName}
              </View>
            </View>
            <View className="TradeList-top-header-right">
              <View
                className={
                  "TradeList-top-header-right-title " +
                  (info.state == 2 ? "TradeList-top-header-right-titles" : "")
                }
              >
                {info.stateName}
              </View>
              <Image
                className="TradeList-top-header-right-icon"
                src={rightPng}
                mode="aspectFill"
              />
            </View>
          </View>
          <View className="TradeList-top-content">
            房&nbsp;&nbsp;间&nbsp;号：{info.roomName}
          </View>
          <View className="TradeList-top-content">
            缴费金额：￥{info.money}
          </View>
          <View className="TradeList-top-content">
            付&nbsp;&nbsp;款&nbsp;人：{info.cusName}
          </View>
          <View className="TradeList-top-content">
            缴费时间：{info.payTime}
          </View>
          <View className="TradeList-top-content">
            付款方式：{info.payTypeName}
          </View>
        </View>
      </View>
    );
  }
}
