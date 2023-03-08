import React, { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.scss";
import dayjs from "dayjs";

export default class Index extends Component {
  state = {
    selectData: null,
    startTime: dayjs(new Date()).format("YYYY-MM-DD"),
    date: dayjs(new Date()).format("YYYY-MM")//显示日期
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
      <Picker
        end={this.state.startTime}
        mode="date"
        onChange={this.onDateChange}
        fields="month"
      >
        <View className={className}>{this.state.date}</View>
      </Picker>
    );
  }
}
