import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";

import "./index.scss";
import { SubmitBtn } from "@component";
import headerBg from "@assets/image/headerBg.png";
import rightPng from "@assets/image/right.png";
import about_weibo from "@assets/image/about_weibo.png";
import about_weixin from "@assets/image/about_weixin.png";
import aboutTel from "@assets/image/aboutTel.png";
import store from "../../../store";
export default class Index extends Component {
  state = {
    list: [
      {
        name: "关于应用",
        url: "/pages/user/aboutApp/index",
        image: rightPng
      },
      {
        name: "隐私条例",
        url: "/pages/richText/index?key=PRIVACY_ARGEEMENT&title=隐私协议",
        image: rightPng
      },
      {
        name: "意见反馈",
        url: "/pages/user/feedBack/index",
        image: rightPng
      }
    ],
    height: 667,
    siteInfo: {}
  };

  componentDidMount() {
    const info = Taro.getSystemInfoSync();
    let siteInfo = $utils.data.get("siteInfo") || {};
    this.setState({
      height: info.windowHeight,
      siteInfo
    });
  }

  //提现
  handleSubmit = () => {
    // Taro.navigateBack();
    Taro.showModal({
      title: "提示",
      content: "是否退出登录",
      confirmText: "确认",
      confirmColor: "#0A74E9"
    }).then(res1 => {
      if (res1.confirm) {
        global.$utils.data.remove("token");
        global.$utils.data.remove("userInfo");
        $utils.auth.logout();
        $utils.auth.checklogin();
      } else if (res1.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  render() {
    let { height, list, menuList, siteInfo } = this.state;
    console.log(store.getState().VConsole, 999);
    return (
      <View className="userAbout">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: height - 113 }}
        >
          <View className="userAbout-iconBox">
            <Image
              className="userAbout-iconBox-icon"
              src={$utils.loadimg.load(siteInfo.app_logo?.value)}
              mode="aspectFill"
            />
          </View>

          <View className="userAbout-title">{siteInfo.app_name?.value}</View>
          <View className="userAbout-menuBox">
            {list.map((item, index) => (
              <View
                className={
                  index == 0
                    ? "userAbout-menuBox-items"
                    : "userAbout-menuBox-item"
                }
                key={index}
                onClick={() => {
                  Taro.navigateTo({
                    url: item.url
                  });
                }}
              >
                <View className="userAbout-menuBox-item-left">
                  <View className="userAbout-menuBox-item-left-text">
                    {item.name}
                  </View>
                </View>
                {item.image ? (
                  <Image
                    className="userAbout-menuBox-item-right"
                    src={item.image}
                    mode="aspectFill"
                  />
                ) : null}
                {item.text ? (
                  <View className="userAbout-menuBox-item-text">
                    {item.text}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </ScrollView>
        <SubmitBtn
          title="安全退出"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}
