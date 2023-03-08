import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Button, Image } from "@tarojs/components";
import "./index.scss";
import { RichText } from "@component";

export default class Index extends Component {
  state = {
    richHtml: "",
    height: 667
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let title = params.title;
    let type = params.type;
    const { windowHeight } = Taro.getSystemInfoSync();
    Taro.setNavigationBarTitle({
      title: title
    });
    this.setState(
      {
        id,
        type,
        height: windowHeight
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
    d.id = this.state.id;
    let url = "";
    //首页消息文本
    if (type == "homeNews") {
      url = `${global.base_host}/customer/customer/announcement/${this.state.id}`;
    }
    if (type == "dailyAsk") {
      url = `${global.base_host}/customer/customer/issue/${this.state.id}`;
    }
    if (type == "flatInfo") {
      url = `${global.base_host}/customer/flat/flat/${this.state.id}`;
    }
    if (type == "AGREEMENT") {
      url = `${global.base_host}/customer/customer/config/configKey/AGREEMENT`;
    }
    if (type == "PRIVACY") {
      url = `${global.base_host}/customer/customer/config/configKey/PRIVACY`;
    }
    if (type == "ABOUT") {
      url = `${global.base_host}/customer/customer/config/configKey/ABOUT`;
    }
    global.$utils.api
      .load(url, d, "get", false)
      .then(res => {
        if (res.code == 200) {
          console.log(res);
          let data = res.data;
          let html = (data && data.content) || res.msg;
          if (type == "dailyAsk") {
            html = data.descr;
          }
          if (type == "flatInfo") {
            html = data.richText;
          }
          let richHtml = html;
          if (html && type !== "homeNews") {
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
            richHtml = richHtml.replace(/<p/g, `<div`);
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
    let { height, richHtml, type } = this.state;
    return (
      <View className="RichTextBox">
          {type == "homeNews" && richHtml ? (
            <View className="RichTextBox-content">{richHtml}</View>
          ) : (
            <RichText html={richHtml}></RichText>
          )}
      </View>
    );
  }
}
