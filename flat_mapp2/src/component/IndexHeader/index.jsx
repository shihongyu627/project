import React, { Component } from "react";

import { Image, View, Text, Picker } from "@tarojs/components";
import "./index.scss";
import searchPng from "@assets/image/search.png";
import weissPng from "@assets/image/address_icon.png";
import bottomPng from "@assets/image/bottom.png";
import TextLabel from "../TextLabel";
import Taro from "@tarojs/taro";
export default class Index extends Component {
  state = {
    name: "",
    height: "",
    index: 0 //显示日期
  };
  componentDidMount() {
    const info = Taro.getSystemInfoSync();
    const { statusBarHeight, platform } = info;
    let height = "";
    if (platform == "android") {
      height = statusBarHeight + 8;
    } else {
      height = statusBarHeight + 5;
    }
    this.setState({
      height
    });
  }
  onChange = e => {
    let index = e.detail.value;
    this.props.selectIndex(index);
  };

  render() {
    const { title } = this.props;
    let { height } = this.state;
    return (
      <View className="header" style={{ marginTop: `${height}px` }}>
        <View className="header-address">
          <Image
            className="header-address-box-icon"
            mode="aspectFill"
            src={weissPng}
          />
          <Picker
            className="header-address-box"
            mode="selector"
            range={this.props.listName}
            onChange={this.onChange}
          >
            <View className="header-address-box-title">
              <TextLabel
                className="header-address-box-title-text"
                num={1}
                content={title}
              ></TextLabel>
            </View>
          </Picker>
          <Image
            className="header-address-box-bottomPng"
            mode="aspectFill"
            src={bottomPng}
          />
        </View>
      </View>
    );
  }
}
