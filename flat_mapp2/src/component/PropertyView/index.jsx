import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import rightPng from "@assets/image/right.png";

export default class Index extends Component {
  state = {};

  render() {
    const { info, type } = this.props;
    //type   1保洁预约  2报修预约  3公共设施预约  4拜访预约
    return (
      <View className='PropertyView'>
        <View className='PropertyView-top'>
          <View
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <View className='PropertyView-top-header'>
              <View className='PropertyView-top-header-left'>
                <Image
                  className='PropertyView-top-header-left-img'
                  src={global.$utils.loadimg.load(info.icon)}
                  mode='aspectFill'
                />
                <View className='PropertyView-top-header-left-title'>
                  {info.title}
                </View>
              </View>
              <View className='PropertyView-top-header-right'>
                <View
                  className={
                    "PropertyView-top-header-right-raido " +
                    (info.state == 1
                      ? "PropertyView-top-header-right-color1"
                      : info.state == 2
                      ? "PropertyView-top-header-right-color2"
                      : info.state == 3
                      ? "PropertyView-top-header-right-color3"
                      : "")
                  }
                ></View>
                <View
                  className={
                    "PropertyView-top-header-right-title " +
                    (info.state == 1
                      ? "PropertyView-top-header-right-title1"
                      : info.state == 2
                      ? "PropertyView-top-header-right-title2"
                      : info.state == 3
                      ? "PropertyView-top-header-right-title3"
                      : "")
                  }
                >
                  {info.stateName}
                </View>
                <Image
                  className='PropertyView-top-header-right-rightPng'
                  src={rightPng}
                  mode='aspectFill'
                />
              </View>
            </View>

            {type == 1 ? (
              <View>
                <View className='PropertyView-top-content'>
                  预约时间：{info.makeTime}
                </View>
                <View className='PropertyView-top-content'>
                  房&nbsp;&nbsp;间&nbsp;&nbsp;号：
                  {info.flatRoomResponse && info.flatRoomResponse.name}
                </View>
                <View className='PropertyView-top-content'>
                  保洁类型：{info.cleanName}
                </View>
              </View>
            ) : null}
            {type == 2 ? (
              <View>
                <View className='PropertyView-top-content'>
                  预约时间：{info.makeTime}
                </View>
                <View className='PropertyView-top-content'>
                  房&nbsp;&nbsp;间&nbsp;&nbsp;号：
                  {info.flatRoomResponse && info.flatRoomResponse.name}
                </View>
                <View className='PropertyView-top-content'>
                  报修类型：{info.repairsName}
                </View>
              </View>
            ) : null}
            {type == 3 ? (
              <View>
                <View className='PropertyView-top-content'>
                  预约时间：{info.makeTime}
                </View>
                <View className='PropertyView-top-content'>
                  姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：{info.name}
                </View>
                <View className='PropertyView-top-content'>
                  预约类型：{info.publicName}
                </View>
              </View>
            ) : null}
            {type == 4 ? (
              <View>
                <View className='PropertyView-top-content'>
                  预约时间：{info.visitorTime}
                </View>
                <View className='PropertyView-top-content'>
                  房&nbsp;&nbsp;间&nbsp;&nbsp;号：
                  {info.flatRoomResponse && info.flatRoomResponse.name}
                </View>
                <View className='PropertyView-top-content'>
                  代预约人：{info.cusName}
                </View>
                <View className='PropertyView-top-content'>
                  拜访人员：{info.visitorName}
                </View>
              </View>
            ) : null}
          </View>
          {info.state == 3 && (type == 2 || type == 1) ? (
            <View className='PropertyView-top-btnBox'>
              <View
                className='PropertyView-top-btnBox-btn2'
                onClick={() => {
                  this.props.onClickConfrim(info);
                }}
              >
                拍照上传
              </View>
            </View>
          ) : null}
          {/* {info.state == 2 ? (
            <View className="PropertyView-top-btnBox">
              <Text
                className="PropertyView-top-btnBox-btn"
                onClick={() => {
                  this.props.onClickConfrim(info);
                }}
              >
                已完成
              </Text>
            </View>
          ) : null} */}
          {info.evaluate == 1 ? (
            <View className='PropertyView-top-btnBox'>
              <View
                className='PropertyView-top-btnBox-btn'
                onClick={() => {
                  this.props.goInfo(info);
                }}
              >
                查看评价
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
