import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className='AgreementList'>
        <View
          onClick={() => {
            this.props.goInfo(info);
          }}
        >
          <View className='AgreementList-top'>
            <View
              className={
                "AgreementList-top-tag " +
                (info.state == 0
                  ? "AgreementList-top-tagOne"
                  : info.state == 1
                  ? "AgreementList-top-tagTwo"
                  : "AgreementList-top-tagFour")
              }
            >
              {info.stateName}
            </View>
            <Image
              className='AgreementList-top-img'
              src={global.$utils.loadimg.load(
                info.flatRoomResponse && info.flatRoomResponse.themeUrl
              )}
              mode='aspectFill'
            />
          </View>
        </View>
        <View className='AgreementList-right'>
          <View
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <View className='AgreementList-right-title'>
              <TextLabel
                className='AgreementList-right-title-text'
                num={1}
                content={info.flatRoomResponse && info.flatRoomResponse.name}
              ></TextLabel>
            </View>
            <View className='AgreementList-right-tag'>
              {info.beginTime} 至 {info.endTime}
            </View>
            <View className='AgreementList-right-bottom'>
              <View className='AgreementList-right-bottom-price'>
                <Text className='AgreementList-right-bottom-price-size'>
                  ￥
                </Text>
                {info.price}
                <Text className='AgreementList-right-bottom-price-size'>
                  /月
                </Text>
                <Text className='AgreementList-right-bottom-price-typeName'>
                  ·{info.payMoisName}
                </Text>
              </View>
            </View>
          </View>
          {info.state == 3 ? (
            <View className='AgreementList-right-bottomBtn'>
              {/* <Text
                className="AgreementList-right-bottomBtn-btn AgreementList-right-bottomBtn-btncancel"
                onClick={() => {
                  this.props.getOnClick(info,3);
                }}
              >
                取消
              </Text> */}
              <View
                className='AgreementList-right-bottomBtn-btn AgreementList-right-bottomBtn-btnView'
                onClick={() => {
                  this.props.getOnClick(info, 1);
                }}
              >
                立即签约
              </View>
            </View>
          ) : info.relet == 1 ? (
            <View className='AgreementList-right-bottomBtn'>
              <View
                className='AgreementList-right-bottomBtn-btn AgreementList-right-bottomBtn-btnView'
                onClick={() => {
                  this.props.getOnClick(info, 2);
                }}
              >
                续租
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
