import React, { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.scss";
import dayjs from "dayjs";

export default class Index extends Component {
  state = {
    selectData: null,
    startTime: dayjs(new Date()).format("YYYY-MM-DD"),
    date: "" //显示日期
  };
  componentDidMount() {}
  //app选择日期
  onDateChange = e => {
    let selectData = e.detail.value;
    this.setState(
      {
        date: selectData
      },
      () => {
        this.props.selectData(selectData);
      }
    );
  };
  render() {
    let { title,className } = this.props;
    return (
      <View className="DatepickerRn_list">
        <View className={className + " DatepickerRn_list_l"}>{title}</View>
        <Picker
          start={this.state.startTime}
          mode="date"
          onChange={this.onDateChange}
        >
          <View className="DatepickerRn_list_r">
            {this.state.date ? (
              <View className="DatepickerRn_list_r_txt">{this.state.date}</View>
            ) : (
              <View className="DatepickerRn_list_r_txts">请选择</View>
            )}
          </View>
        </Picker>
      </View>
    );
  }
}
