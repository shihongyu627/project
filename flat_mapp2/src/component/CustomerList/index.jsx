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
      <View className='CustomerList'>
        <View className='CustomerList-top'>
          <View
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <View className='CustomerList-top-header'>
              <View className='CustomerList-top-header-left'>
                <Image
                  className='CustomerList-top-header-left-img'
                  src={global.$utils.loadimg.load(info.avatar)}
                  mode='aspectFill'
                />
                <View className='CustomerList-top-header-left-title'>
                  {info.cusName}
                </View>
              </View>
              {/* <View className='CustomerList-top-header-right'>
                <View
                  className={
                    "CustomerList-top-header-right-raido " +
                    (info.state == 0
                      ? "CustomerList-top-header-right-color1"
                      : info.state == 4
                      ? "CustomerList-top-header-right-color2"
                      : info.state == 1
                      ? "CustomerList-top-header-right-color3"
                      : "")
                  }
                ></View>
                <View
                  className={
                    "CustomerList-top-header-right-title " +
                    (info.state == 0
                      ? "CustomerList-top-header-right-title1"
                      : info.state == 4
                      ? "CustomerList-top-header-right-title2"
                      : info.state == 1
                      ? "CustomerList-top-header-right-title3"
                      : "")
                  }
                >
                  {info.stateName}
                </View>
              </View> */}
            </View>
            <View className='CustomerList-top-content'>
              租赁房间：{info.flatRoomResponse && info.flatRoomResponse.name}
            </View>
            <View className='CustomerList-top-content'>
              租赁时间： {info.beginTime}至{info.endTime}
            </View>

            {info.state == 4 || info.state == 1 ? (
              <View className='CustomerList-top-content'>
                签约时间： {info.cusTime}
              </View>
            ) : null}
          </View>
          <View className='CustomerList-top-btnBox'>
            <View
              className='CustomerList-top-btnBox-btn'
              onClick={() => {
                this.props.telPhoneOnClick(info);
              }}
            >
              拨打电话
            </View>
          </View>
        </View>
      </View>
    );
  }
}
