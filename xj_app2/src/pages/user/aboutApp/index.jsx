import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";

import "./index.scss";
import { SubmitBtn } from "@component";
import headerBg from "@assets/image/headerBg.png";
import { setConsole } from "../../../store/actions/VConsole";
import store from "../../../store";

export default class Index extends Component {
  state = {
    siteInfo: {},
    num: 0
  };

  componentDidMount() {
    let ss = store.getState().VConsole.VConsole;
    let siteInfo = $utils.data.get("siteInfo") || {};
    console.log("store", siteInfo);
    this.setState({
      siteInfo
    });
  }

  //下拉刷新
  onPullDownRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  //提现
  handleSubmit = () => {
    // Taro.navigateBack();
  };
  render() {
    let { siteInfo, num } = this.state;
    return (
      <View className="userAboutApp">
        <View className="userAboutApp-iconBox">
          <Image
            className="userAboutApp-iconBox-icon"
            src={$utils.loadimg.load(siteInfo.app_logo?.value)}
            mode="aspectFill"
          />
        </View>
        <View className="userAboutApp-title">{siteInfo.app_name?.value}</View>
        <View className="userAboutApp-titleTwo">
          {siteInfo.app_desc?.value}
        </View>
        <View
          className="userAboutApp-footerBox"
          onClick={() => {
            this.setState(
              {
                num: num + 1
              },
              () => {
                if (num >= 10) {
                  store.dispatch(setConsole(true));
                } else {
                  store.dispatch(setConsole(false));
                }
              }
            );
          }}
        >
          <View className="userAboutApp-footerBox-banquan">
            {$utils.app.version}
          </View>
          <View className="userAboutApp-footerBox-banquan">
            CopyRight © 2022
          </View>
          <View className="userAboutApp-footerBox-gongsi">
            {siteInfo.app_copyright?.value}
          </View>
        </View>
      </View>
    );
  }
}
