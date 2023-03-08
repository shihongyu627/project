import React, { Component } from "react";

import { Picker, View, Text } from "@tarojs/components";
import "./index.scss";
import dayjs from "dayjs";

export default class Index extends Component {
  state = {
    index: 0 //显示日期
  };
  componentDidMount() {}
  //小程序选择类型
  onChangeType = e => {
    let index = e.detail.value;
    this.props.selectIndex(index);
  };
  render() {
    let { title, typeName, listName, className } = this.props;
    return (
      <View>
        <Picker mode="selector" range={listName} onChange={this.onChangeType}>
          <View className="SelectType_texts" className={className}>
            {title}
          </View>
        </Picker>
      </View>
    );
  }
}
