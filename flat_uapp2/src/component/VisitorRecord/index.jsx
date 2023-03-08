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
      <View className='VisitorRecord'>
        <View className='VisitorRecord-top'>
          <View className='VisitorRecord-top-header'>
            <View className='VisitorRecord-top-header-left'>
              <Image
                className='VisitorRecord-top-header-left-img'
                src={global.$utils.loadimg.load(info.icon)}
                mode='aspectFill'
              />
              <View className='VisitorRecord-top-header-left-title'>
                {info.title}
              </View>
            </View>
            <View className='VisitorRecord-top-header-right'>
              <View
                className={
                  "VisitorRecord-top-header-right-raido " +
                  (info.state == 1
                    ? "VisitorRecord-top-header-right-color1"
                    : info.state == 2
                    ? "VisitorRecord-top-header-right-color1"
                    : info.state == 3
                    ? "VisitorRecord-top-header-right-color3"
                    : "")
                }
              ></View>
              <View
                className={
                  "VisitorRecord-top-header-right-title " +
                  (info.state == 1
                    ? "VisitorRecord-top-header-right-title1"
                    : info.state == 2
                    ? "VisitorRecord-top-header-right-title1"
                    : info.state == 3
                    ? "VisitorRecord-top-header-right-title3"
                    : "")
                }
              >
                {info.stateName}
              </View>
            </View>
          </View>
          <View className='VisitorRecord-top-content'>创建日期：{info.time}</View>
          <View className='VisitorRecord-top-content'>
            房间号：{info.address}
          </View>
          <View className='VisitorRecord-top-content'>
            预约需求：{info.content}
          </View>
          <View className='VisitorRecord-top-content'>
            到访时间：{info.time}
          </View>
          <View className='VisitorRecord-top-btnBox'>
            {info.state == 2 || info.state == 3 ? (
              <View
                className='VisitorRecord-top-btnBox-btn VisitorRecord-top-btnBox-btnDel'
                onClick={() => {
                  this.props.getOnClick(info,'del');
                }}
              >
                删除
              </View>
            ) : null}
            {info.state == 1 ? (
              <View
                className='VisitorRecord-top-btnBox-btn'
                onClick={() => {
                  this.props.getOnClick(info,'back');
                }}
              >
                撤销申请
              </View>
            ) : null}
            {info.state == 2 || info.state == 3 ? (
              <View
                className='VisitorRecord-top-btnBox-btn VisitorRecord-top-btnBox-btnAgain'
                onClick={() => {
                  this.props.getOnClick(info,'again');
                }}
              >
                再次邀请
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}
