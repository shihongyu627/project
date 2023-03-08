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
      <View className="RetreatRentList">
        <View className="RetreatRentList-top">
          <View
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <View className="RetreatRentList-top-header">
              <View className="RetreatRentList-top-header-left">
                {/* <Image
                  className="RetreatRentList-top-header-left-img"
                  src={global.$utils.loadimg.load(info.icon)}
                  mode="aspectFill"
                /> */}
                <View className="RetreatRentList-top-header-left-title">
                  {info.name}
                </View>
              </View>
              <View className="RetreatRentList-top-header-right">
                <View className={"RetreatRentList-top-header-right-title "}>
                  {info.stateName}
                </View>
              </View>
            </View>
            <View className="RetreatRentList-top-content">
              退租时间：{info.surrenderTime}
            </View>
            <View className="RetreatRentList-top-content">
              房&nbsp;&nbsp;间&nbsp;&nbsp;号：
              {info.flatRoomResponse && info.flatRoomResponse.name}
            </View>
          </View>
          {/* {info.state == 5 ? null : (
            <View className="RetreatRentList-top-br"></View>
          )}
          {info.state == 5 ? (
            <View className="RetreatRentList-top-btnBox">
              <Text
                className="RetreatRentList-top-btnBox-btn"
                onClick={() => {
                  this.props.getOnClick(info);
                }}
              >
                去评价
              </Text>
            </View>
          ) : null} */}
        </View>
      </View>
    );
  }
}
