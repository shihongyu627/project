import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import rightPng from "@assets/image/right.png";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    console.log(info);
    return (
      <View className='BillNoticeList'>
        <View className='BillNoticeList-top'>
          <View className='BillNoticeList-top-header'>
            <View className='BillNoticeList-top-header-left'>
              <Image
                className='BillNoticeList-top-header-left-img'
                src={global.$utils.loadimg.load(info.icon)}
                mode='aspectFill'
              />
              <View className='BillNoticeList-top-header-left-title'>
                {info.typeName}
              </View>
            </View>
            <View className='BillNoticeList-top-header-right'>
              <View
                className={
                  "BillNoticeList-top-header-right-title " +
                  (info.state == 2
                    ? "BillNoticeList-top-header-right-titles"
                    : "")
                }
              >
                {info.stateName}
              </View>
              <Image
                className='BillNoticeList-top-header-right-icon'
                src={rightPng}
                mode='aspectFill'
              />
            </View>
          </View>
          <View className='BillNoticeList-top-content'>
            缴费金额：￥{info.money}
          </View>
          {info.payTime ? (
            <View className='BillNoticeList-top-content'>
              缴费日期：{info.payTime}
            </View>
          ) : null}
          {info.payWay ? (
            <View className='BillNoticeList-top-content'>
              付款方式：{info.payWayName}
            </View>
          ) : null}
          <View className='BillNoticeList-top-content'>
            创建时间：{info.createTime}
          </View>
          {info.state == 0 ? (
            <View
              className='BillNoticeList-top-btnBox'
              onClick={() => {
                this.props.onClickPay(info);
              }}
            >
              <View className='BillNoticeList-top-btnBox-btn'>去支付</View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
