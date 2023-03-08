import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import rightPng from "@assets/image/right.png";
import Taro from "@tarojs/taro";
import noCheckedPng from "@assets/image/invoice_noChecked.png";
import checkedPng from "@assets/image/invoice_checked.png";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className='TemplateList'>
        <View
          className='TemplateList-top'
          onClick={() => {
            this.props.getOnClick(info);
          }}
        >
          <View className='TemplateList-top-header'>
            <View className='TemplateList-top-header-left'>
              <View className='TemplateList-top-header-left-title'>
                {info.docTemplateName}
              </View>
            </View>
            <Image
              className='TemplateList-top-header-right'
              src={info.checked ? checkedPng : noCheckedPng}
              mode='aspectFill'
            />
          </View>
        </View>
        <View className='TemplateList-bottom'>
          <View
            className='TemplateList-bottom-br'
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <View className='TemplateList-bottom-br-title'>查看详情</View>
            <Image
              className='TemplateList-bottom-br-icon'
              src={rightPng}
              mode='aspectFill'
            />
          </View>
        </View>
      </View>
    );
  }
}
