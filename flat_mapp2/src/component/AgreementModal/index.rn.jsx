import React, { Component } from "react";

import "./index.scss";
import { Overlay } from "teaset";
import { View, Text, Input } from "@tarojs/components";
import { BackHandler, Platform } from "react-native";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {
    value: 1
  };
  componentDidMount() {}
  componentDidShow() {}
  changeValPassWord = e => {
    console.log(e);
    let value = e.detail.value;
    this.props.onChangeVal(value);
  };
  Dialog = show => {
    const { content, title, type, leftBtnTxt, rightBtnTxt } = this.props;
    let overlayView = (
      <Overlay.View
        style={{ alignItems: "center", justifyContent: "center" }}
        modal
        animated
        overlayOpacity={0.6}
        ref={v => (this.overlayView = v)}
      >
        <View className='AgreementModal'>
          <View className='AgreementModal-title'>{title}</View>
          <View className='AgreementModal-input_box'>
            <Text className='AgreementModal-input_box-text'>
              欢迎使用象寓管理！我们非常重视您的隐私保护和个人
              信息保护，使用本软件的过程中，我们会严格按照法
              律规定和使用您的个人信息，未经您同意，我们不会
              提供给任何第三方进行使用。您可以阅读
              <Text
                className='AgreementModal-input_boxColor'
                onClick={() => {
                  this.overlayView && this.overlayView.close();
                  setTimeout(() => {
                    global.firstModal = 1;
                    Taro.navigateTo({
                      url: `/pages/richText/index?keyword=USER_AGREEMENT&title=用户协议`
                    });
                  }, 50);
                }}
              >
                《用户协议》
              </Text>
              和
              <Text
                className='AgreementModal-input_boxColor'
                onClick={() => {
                  this.overlayView && this.overlayView.close();
                  setTimeout(() => {
                    global.firstModal = 1;
                    Taro.navigateTo({
                      url: `/pages/richText/index?keyword=USER_AGREEMENT&title=隐私政策`
                    });
                  }, 50);
                }}
              >
                《隐私政策》
              </Text>
              <Text className='AgreementModal-input_box-text'>
                全文了解详细信息。如您同意，请点 击“同意”开始接受我们的服务。
              </Text>
            </Text>
          </View>
          <View className='AgreementModal-btn_box'>
            <View
              className='AgreementModal-btn_box-leftBtn'
              onClick={() => {
                this.overlayView && this.overlayView.close();
                global.firstModal = 1;
                this.props.onLeftBtn();
                if (Platform.OS == "android") {
                  BackHandler.exitApp();
                }
              }}
            >
              {leftBtnTxt}
            </View>
            <View
              className='AgreementModal-btn_box-rightBtn'
              onClick={() => {
                this.overlayView && this.overlayView.close();
                this.props.onRightBtn();
              }}
            >
              {rightBtnTxt}
            </View>
          </View>
        </View>
      </Overlay.View>
    );

    setTimeout(() => {
      if (show && global.firstModal == 1) {
        global.firstModal = 2;
        this.key = Overlay.show(overlayView);
      }
    }, 100);
  };
  render() {
    let { show } = this.props;
    return <View>{this.Dialog(show)}</View>;
  }
}
