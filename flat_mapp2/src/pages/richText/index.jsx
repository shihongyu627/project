import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Button, Image } from "@tarojs/components";
import "./index.scss";
import { RichText } from "@component";

export default class Index extends Component {
  state = {
    richHtml: "",
    height: 667,
    keyword: ""
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let title = params.title;
    let type = params.type;
    let keyword = params.keyword;
    const { windowHeight } = Taro.getSystemInfoSync();
    Taro.setNavigationBarTitle({
      title: title
    });
    this.setState(
      {
        type,
        height: windowHeight,
        keyword
      },
      () => {
        this.load();
      }
    );
  }
  load = () => {
    let { type } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let url = "";
    if (type == "AGREEMENT") {
      url = `${global.base_host}/maintainer/maintainer/config/configKey/AGREEMENT`;
    }
    if (type == "PRIVACY") {
      url = `${global.base_host}/maintainer/maintainer/config/configKey/PRIVACY`;
    }
    if (type == "ABOUT") {
      url = `${global.base_host}/maintainer/maintainer/config/configKey/ABOUT`;
    }
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          console.log(res);
          let html = res.msg;
          let richHtml = "";
          if (html) {
            richHtml = html.replace(
              /src="/g,
              `style="width:100% !important;overflow:hidden;" src="`
            );
            richHtml = richHtml.replace(/<img[^>]*>/gi, function(match) {
              var match = match.replace(
                /style\s*?=\s*?([‘"])[\s\S]*?\1/gi,
                'style="width:100%;height:auto;"'
              );
              return match;
            });
            richHtml = richHtml.replace(
              /style=""/g,
              `style="width:100% !important;overflow:hidden;"`
            );
            richHtml = richHtml.replace(/<p/g, `<div style=""`);
            richHtml = richHtml.replace(/p>/g, `div>`);
            richHtml =
              '<div style="width:100%;overflow:hidden;">' + richHtml + "</div>";
          }
          this.setState({
            richHtml
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
          className="scrollDom"
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
