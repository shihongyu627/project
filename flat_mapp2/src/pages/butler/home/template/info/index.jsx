import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image, WebView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/image/empty_box1.png";
import telPng from "@assets/image/tel.png";
import rightPng from "@assets/image/right.png";
import { TextLabel, SubmitBtn } from "@component";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      height: 667,
      url: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let url = params.url;
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState({
      url,
      height: windowHeight
    });
  }

  async componentWillUnmount() {}
  //下拉刷新
  onPullDownRefresh = () => {};
  render() {
    let { detail, height, url } = this.state;
    return (
      <View className='agreement'>
        <WebView src={url} />
      </View>
    );
  }
}

export default Index;
