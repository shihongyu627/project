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
      <View className='RepairRecord'>
        <View className='RepairRecord-top'>
          <View
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <View className='RepairRecord-top-header'>
              <View className='RepairRecord-top-header-left'>
                <Image
                  className='RepairRecord-top-header-left-img'
                  src={global.$utils.loadimg.load(info.icon)}
                  mode='aspectFill'
                />
                <View className='RepairRecord-top-header-left-title'>
                  {info.title}
                </View>
              </View>
              <View className='RepairRecord-top-header-right'>
                <View
                  className={
                    "RepairRecord-top-header-right-raido " +
                    (info.state == 1
                      ? "RepairRecord-top-header-right-color1"
                      : info.state == 2
                      ? "RepairRecord-top-header-right-color2"
                      : info.state == 3
                      ? "RepairRecord-top-header-right-color3"
                      : "")
                  }
                ></View>
                <View
                  className={
                    "RepairRecord-top-header-right-title " +
                    (info.state == 1
                      ? "RepairRecord-top-header-right-title1"
                      : info.state == 2
                      ? "RepairRecord-top-header-right-title2"
                      : info.state == 3
                      ? "RepairRecord-top-header-right-title3"
                      : "")
                  }
                >
                  {info.stateName}
                </View>
              </View>
            </View>
            {type == 1 ? (
              <View>
                <View className='RepairRecord-top-content'>
                  预约时间：{info.makeTime}
                </View>
                <View className='RepairRecord-top-content'>
                  房&nbsp;&nbsp;间&nbsp;&nbsp;号：
                  {info.flatRoomResponse && info.flatRoomResponse.name}
                </View>
                <View className='RepairRecord-top-content'>
                  保洁类型：{info.cleanName}
                </View>
                <View className='RepairRecord-top-content'>
                  支付金额：￥{info.price || 0}
                </View>
              </View>
            ) : null}
            {type == 2 ? (
              <View>
                <View className='RepairRecord-top-content'>
                  预约时间：{info.makeTime}
                </View>
                <View className='RepairRecord-top-content'>
                  房&nbsp;&nbsp;间&nbsp;&nbsp;号：
                  {info.flatRoomResponse && info.flatRoomResponse.name}
                </View>
                <View className='RepairRecord-top-content'>
                  报修类型：{info.repairsName}
                </View>
              </View>
            ) : null}
            {type == 3 ? (
              <View>
                <View className='RepairRecord-top-content'>
                  预约时间：{info.makeTime}
                </View>
                <View className='RepairRecord-top-content'>
                  姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：{info.name}
                </View>
                <View className='RepairRecord-top-content'>
                  预约类型：{info.publicName}
                </View>
              </View>
            ) : null}
            {type == 4 ? (
              <View>
                <View className='RepairRecord-top-content'>
                  预约时间：{info.visitorTime}
                </View>
                <View className='RepairRecord-top-content'>
                  房&nbsp;&nbsp;间&nbsp;&nbsp;号：
                  {info.flatRoomResponse && info.flatRoomResponse.name}
                </View>
                {/* <View className="RepairRecord-top-content">
                  代预约人：{info.visitorName}
                </View> */}
                <View className='RepairRecord-top-content'>
                  拜访人员：{info.visitorName}
                </View>
              </View>
            ) : null}
          </View>
          {info.state == 5 && info.evaluate != 1 ? null : (
            <View className='RepairRecord-top-br'></View>
          )}
          {info.state == 5 && info.evaluate != 1 ? (
            <View className='RepairRecord-top-btnBox'>
              <Text
                className='RepairRecord-top-btnBox-btn'
                onClick={() => {
                  this.props.getOnClick(info);
                }}
              >
                去评价
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
