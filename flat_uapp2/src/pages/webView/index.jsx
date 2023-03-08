import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Button, Image } from "@tarojs/components";
import "./index.scss";
import { WebView } from "@component";

export default class Index extends Component {
  state = {
    richHtml: "",
    height: 667,
    url: ""
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let url = params.url;
    let title = params.title || "";
    Taro.setNavigationBarTitle({
      title: title
    });
    this.setState({
      url
    });
  }

  render() {
    let { url } = this.state;
    return (
      <View className="RichTextBox">
        <WebView url={url}></WebView>
      </View>
    );
  }
}
