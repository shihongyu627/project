import React, { Component } from "react";
import { View, Text, Input, Navigator } from "@tarojs/components";

import "./index.scss";
import { Dialog } from "@antmjs/vantui";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {
    value: 1,
    show: true
  };
  componentDidMount() {}
  componentDidShow() {}
  onChange = event => {
    console.log(event.detail);
    this.setState(
      {
        value: event.detail
      },
      () => {
        this.props.onChangeRate(event.detail, this.props.info);
      }
    );
  };
  changeValPassWord = e => {
    console.log(e);
    let value = e.detail.value;
    this.props.onChangeVal(value);
  };
  render() {
    const { content, title, type, leftBtnTxt, rightBtnTxt, show } = this.props;
    return (
      <Dialog
        show={show}
        showCancelButton={false}
        showConfirmButton={false}
        // onClose={this.onClose}
      >
        <View className='AgreementModal'>
          <View className='AgreementModal-title'>{title}</View>
          <View className='AgreementModal-input_box'>
            <View className='AgreementModal-input_box-size'>
              欢迎使用象寓管理！我们非常重视您的隐私保护和个人
              信息保护，使用本软件的过程中，我们会严格按照法
              律规定和使用您的个人信息，未经您同意，我们不会
              提供给任何第三方进行使用。您可以阅读
            </View>
            <Text
              className='AgreementModal-input_boxColor'
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/richText/index?keyword=USER_AGREEMENT&title=用户协议`
                });
              }}
            >
              《用户协议》
            </Text>
            <View className='AgreementModal-input_box-size'>和</View>
            <Text
              className='AgreementModal-input_boxColor'
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/richText/index?keyword=USER_AGREEMENT&title=隐私政策`
                });
              }}
            >
              《隐私政策》
            </Text>
            <View className='AgreementModal-input_box-size'>
              全文了解详细信息。如您同意，请点 击“同意”开始接受我们的服务。
            </View>
          </View>
          <View className='AgreementModal-btn_box'>
            <Navigator
              className='AgreementModal-btn_box-leftBtn'
              target='miniProgram'
              openType='exit'
              // onClick={() => {
              //   this.props.onLeftBtn();
              // }}
            >
              {leftBtnTxt}
            </Navigator>
            <View
              className='AgreementModal-btn_box-rightBtn'
              onClick={() => {
                this.props.onRightBtn();
              }}
            >
              {rightBtnTxt}
            </View>
          </View>
        </View>
      </Dialog>
    );
  }
}
