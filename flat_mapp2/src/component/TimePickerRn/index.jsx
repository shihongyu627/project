import React, { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.scss";
import dayjs from "dayjs";

export default class Index extends Component {
  state = {
    time: "" //显示日期
  };
  componentDidMount() {}
  //app选择时间
  onTimeChange = e => {
    let timeVal = e.detail.value;
    if (!this.props.date) {
      return global.$utils.toast.text("请选择日期");
    }
    if (dayjs().format("YYYY-MM-DD") == this.props.date) {
      if (dayjs().format("HH:mm") > timeVal) {
        return global.$utils.toast.text("不能低于当前时间");
      }
    }
    timeVal = timeVal + ":00";
    this.setState(
      {
        time: timeVal
      },
      () => {
        this.props.selectTime(timeVal);
      }
    );
  };
  render() {
    let { title, className } = this.props;
    return (
      <View className="DatepickerRn_list">
        <View className={className + " DatepickerRn_list_l"}>{title}</View>
        <Picker mode="time" onChange={this.onTimeChange}>
          <View className="DatepickerRn_list_r">
            {this.state.time ? (
              <View className="DatepickerRn_list_r_txt">{this.state.time}</View>
            ) : (
              <View className="DatepickerRn_list_r_txts">请选择</View>
            )}
          </View>
        </Picker>
      </View>
    );
  }
}
