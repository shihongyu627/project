import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import rightPng from "@assets/image/right.png";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className='AgreementOrder'>
        <View className='AgreementOrder-headerBox'>
          <View
            onClick={() => {
              this.props.goInfoClick(info);
            }}
          >
            <View className='AgreementOrder-header'>
              <Image
                className='AgreementOrder-header-img'
                src={global.$utils.loadimg.load(
                  info.flatRoomResponse && info.flatRoomResponse.themeUrl
                )}
                mode='aspectFill'
              />
              <View className='AgreementOrder-header-right'>
                <View className='AgreementOrder-headerBox-top'>
                  <View className='AgreementOrder-headerBox-top-left'>
                    {info.contractNo}
                  </View>
                  <View className='AgreementOrder-headerBox-top-right'>
                    <View
                      className={
                        "AgreementOrder-headerBox-top-right-radio " +
                        (info.state == 0
                          ? "AgreementOrder-headerBox-top-right-radioOne"
                          : info.state == 4
                          ? "AgreementOrder-headerBox-top-right-radioTwo"
                          : info.state == 1
                          ? "AgreementOrder-headerBox-top-right-radioThree"
                          : "AgreementOrder-headerBox-top-right-radioFour")
                      }
                    ></View>
                    <View
                      className={
                        "AgreementOrder-headerBox-top-right-txt " +
                        (info.state == 0
                          ? "AgreementOrder-headerBox-top-right-txtOne"
                          : info.state == 4
                          ? "AgreementOrder-headerBox-top-right-txtTwo"
                          : info.state == 1
                          ? "AgreementOrder-headerBox-top-right-txtThree"
                          : "AgreementOrder-headerBox-top-right-txtFour")
                      }
                    >
                      {info.stateName}
                    </View>
                  </View>
                </View>
                <View className='AgreementOrder-header-right-title'>
                  <TextLabel
                    className='AgreementOrder-header-right-title-text'
                    num={2}
                    content={
                      info.flatRoomResponse && info.flatRoomResponse.name
                    }
                  ></TextLabel>
                </View>
              </View>
            </View>
            <View className='AgreementOrder-headerBox-infoBox'>
              <View className='AgreementOrder-headerBox-infoBox-title'>
                租赁时间：
              </View>
              <View className='AgreementOrder-headerBox-infoBox-text'>
                {info.beginTime}至{info.endTime}
              </View>
            </View>
            <View className='AgreementOrder-headerBox-infoBox'>
              <View className='AgreementOrder-headerBox-infoBox-title'>
                客户姓名：
              </View>
              <View className='AgreementOrder-headerBox-infoBox-text'>
                {info.cusName}
              </View>
            </View>
          </View>
          {info.state == 4 || info.state == 1 ? (
            <View className='AgreementOrder-headerBox-infoBox'>
              <View className='AgreementOrder-headerBox-infoBox-title'>
                签约时间：
              </View>
              <View className='AgreementOrder-headerBox-infoBox-text'>
                {info.cusTime}
              </View>
            </View>
          ) : null}
          {info.state == 0 ? (
            <View className='AgreementOrder-headerBox-btnBox'>
              <View
                className='AgreementOrder-headerBox-btnBox-btn1'
                onClick={() => {
                  this.props.getOnClick(info);
                }}
              >
                撤回
              </View>
            </View>
          ) : null}
          {info.state == 2 ? (
            <View className='AgreementOrder-headerBox-btnBox'>
              <View
                className='AgreementOrder-headerBox-btnBox-btn2'
                onClick={() => {
                  this.props.getOnClick(info);
                }}
              >
                发送催缴
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
