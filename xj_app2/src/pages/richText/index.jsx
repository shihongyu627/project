import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Button, Image } from "@tarojs/components";
import "./index.scss";
import { RichText } from "@component";

export default class Index extends Component {
  state = {
    richHtml: "",
    height: 667,
    key: ""
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let key = params.key;
    let title = params.title;
    const { windowHeight } = Taro.getSystemInfoSync();
    Taro.setNavigationBarTitle({
      title: title
    });
    this.setState(
      {
        key,
        title,
        height: windowHeight
      },
      () => {
        this.load();
      }
    );
  }
  load = () => {
    let { key } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.key = key;
    //首页消息文本
    global.$utils.api
      .load("aboutContent", d, "get", false)
      .then(res => {
        if (res.data) {
          this.setState({
            richHtml: res.data.detail || ""
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  render() {
    let { height, richHtml } = this.state;
    return (
      <View className="RichTextBox">
        <ScrollView
          className="RichTextBox-wreapp"
          scrollY
          lowerThreshold={90}
          // style={{ height: height - 10 }}
        >
          {richHtml ? <RichText html={richHtml}></RichText> : null}
        </ScrollView>
      </View>
    );
  }
}
