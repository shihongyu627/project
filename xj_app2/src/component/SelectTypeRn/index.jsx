import React, { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.scss";
import dayjs from "dayjs";

export default class Index extends Component {
  state = {
    index: 0, //显示日期
    selectName: ""
  };
  componentDidMount() {}
  //小程序选择类型
  onChangeType = e => {
    let { listName } = this.props;
    let index = e.detail.value;
    let selectName = listName[index];
    this.setState(
      {
        selectName
      },
      () => {
        this.props.selectIndex(index);
      }
    );
  };
  render() {
    let { title, typeName, listName, className } = this.props;
    let { selectName } = this.state;
    return (
      <Picker mode="selector" range={listName} onChange={this.onChangeType}>
        <View className="SelectType-text">{selectName || title}</View>
      </Picker>
    );
  }
}
