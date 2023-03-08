import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import cardInfo_edit from "@assets/image/cardInfo_edit.png";
import cardInfo_del from "@assets/image/cardInfo_del.png";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className='CardInfoList'>
        <View className='CardInfoList-left'>
          <View className='CardInfoList-left-title'>
            {info.name}
            {info.phonenumber ? `（${info.phonenumber}）` : null}
          </View>
          <View className='CardInfoList-left-text'>{info.idCard}</View>
        </View>
        {/* type 1 用户自己 */}
        {info.type != 1 ? (
          <View className='CardInfoList-right'>
            <Image
              className='CardInfoList-right-edit'
              src={cardInfo_edit}
              mode='aspectFill'
              onClick={() => {
                this.props.getOnClick(info, "edit");
              }}
            />
            <Image
              className='CardInfoList-right-del'
              src={cardInfo_del}
              mode='aspectFill'
              onClick={() => {
                this.props.getOnClick(info, "del");
              }}
            />
          </View>
        ) : null}
      </View>
    );
  }
}
