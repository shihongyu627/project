import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.less";
import gradeUserPng from "@assets/image/gradeUser.png";
import gradeNumPng from "@assets/image/gradeNum.png";
import gradetimePng from "@assets/image/gradetime.png";
import TextLabel from "../TextLabel";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  state = {};
  render() {
    let { info } = this.props;
    return (
      <View
        className="ItemGradeList"
        onClick={() => {
          this.props.goInfo(info);
        }}
      >
        <View className="ItemGradeList-item">
          <Image
            className="ItemGradeList-item-image"
            src={gradetimePng}
            mode="aspectFill"
          />
          <View className="ItemGradeList-item-title">评分时间：</View>
          <View className="ItemGradeList-item-name">{info.create_time}</View>
        </View>
        <View className="ItemGradeList-item">
          <Image
            className="ItemGradeList-item-image"
            src={gradeUserPng}
            mode="aspectFill"
          />
          <View className="ItemGradeList-item-title">检查人员：</View>
          <View className="ItemGradeList-item-name">{info.user_nick}</View>
        </View>
        <View className="ItemGradeList-item">
          <Image
            className="ItemGradeList-item-image"
            src={gradeNumPng}
            mode="aspectFill"
          />
          <View className="ItemGradeList-item-title">评估得分：</View>
          <View
            className="ItemGradeList-item-name"
            style={{ color: "#0A75E8" }}
          >
            {info.month_left_score}
          </View>
        </View>
      </View>
    );
  }
}
