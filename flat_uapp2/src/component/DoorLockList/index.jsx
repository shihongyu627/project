import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import lockPng from "@assets/image/lock.png";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className='DoorLockList'>
        <View className='DoorLockList-top'>
          <Image
            className='DoorLockList-top-img'
            src={global.$utils.loadimg.load(
              info.room && info.room.themeUrl
            )}
            mode='aspectFill'
          />
        </View>
        <View className='DoorLockList-right'>
          <View className='DoorLockList-right-title'>
            <TextLabel
              className='DoorLockList-right-title-text'
              num={2}
              content={info.room && info.room.name}
            ></TextLabel>
          </View>
          <View className='DoorLockList-right-content'>
            <Image
              className='DoorLockList-right-content-img'
              src={lockPng}
              mode='aspectFill'
            />
            <View className='DoorLockList-right-content-txt'>
              门锁密码：{info.passwork}
            </View>
          </View>
            <View className='DoorLockList-right-bottom'>
              <View
                className='DoorLockList-right-bottom-btn'
                onClick={() => {
                  this.props.getOnClick(info);
                }}
              >
                更改密码
              </View>
            </View>
        </View>
      </View>
    );
  }
}
