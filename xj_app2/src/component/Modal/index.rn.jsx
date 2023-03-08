import React, { Component } from "react";

import "./index.scss";
import { Overlay } from "teaset";
import { View, Text, Input } from "@tarojs/components";
import { TextInput } from "react-native";

export default class Index extends Component {
  state = {
    contentText: "",
    contentVal: false
  };
  componentDidMount() {}
  componentDidShow() {}
  changeValPassWord = e => {
    let value = e.detail.value;
    this.setState({
      contentText: value,
      contentVal: true
    });
    this.props.onChangeVal(value);
  };
  render() {
    const { content, title, leftBtnTxt, rightBtnTxt ,placeholder} = this.props;
    let { contentText, contentVal } = this.state;
    return (
      <View>
        <View className="modal_box">
          <View className="modal_box-title">{title}</View>
          <View className="modal_box-input_box">
            {/* <Input
              className='modal_box-input_box-input_wp'
              onInput={this.changeValPassWord.bind(this)}
              type='text'
              placeholder='请输入标签'
              value={contentVal ? contentText : content}
            /> */}
            <TextInput
              className="modal_box-input_box-input_wp"
              clearButtonMode="always"
              keyboardType="default"
              autoCapitalize="none"
              placeholder={placeholder ? placeholder : "请输入标签"}
              value={contentVal ? contentText : content}
              onChangeText={username => {
                this.setState({
                  contentText: username,
                  contentVal: true
                });
                this.props.onChangeVal(username);
              }}
              placeholderTextColor="#666"
            />
          </View>
          <View className="modal_box-btn_box">
            <View
              className="modal_box-btn_box-leftBtn"
              onClick={() => {
                this.props.onLeftBtn();
              }}
            >
              {leftBtnTxt}
            </View>
            <View
              className="modal_box-btn_box-rightBtn"
              onClick={() => {
                this.overlayView && this.overlayView.close();
                this.props.onRightBtn();
              }}
            >
              {rightBtnTxt}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
