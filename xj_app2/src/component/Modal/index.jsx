import React, { Component } from "react";
import { View, Text, Input } from "@tarojs/components";

import "./index.scss";
import { Dialog } from "@antmjs/vantui";
export default class Index extends Component {
  state = {
    value: 1,
    show: true
  };
  componentDidMount() {}
  componentDidShow() {}
  onChange = event => {
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
    let value = e.detail.value;
    this.props.onChangeVal(value);
  };
  render() {
    const {
      content,
      title,
      type,
      leftBtnTxt,
      rightBtnTxt,
      show,
      placeholder
    } = this.props;
    return (
      <Dialog
        show={show}
        showCancelButton={false}
        showConfirmButton={false}
        // onClose={this.onClose}
      >
        <View className="modal_box">
          <View className="modal_box-title">{title}</View>
          <View className="modal_box-input_box">
            <Input
              className="modal_box-input_box-input_wp"
              onInput={this.changeValPassWord.bind(this)}
              type="text"
              placeholder={placeholder ? placeholder : "请输入标签"}
              value={content}
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
