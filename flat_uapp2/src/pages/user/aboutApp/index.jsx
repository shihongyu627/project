import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";

import "./index.scss";
import icon_app from "@assets/image/icon_app.png";
import { setConsole } from "../../../store/actions/VConsole";
import store from "../../../store";
export default class Index extends Component {
  state = {
    num: 0
  };

  componentDidMount() {
    let ss = store.getState().VConsole.VConsole;
    console.log("store", ss);
  }

  //提现
  handleSubmit = () => {
    // Taro.navigateBack();
  };

  render() {
    let VConsole = null;
    if (process.env.TARO_ENV === "rn") {
      VConsole = require("@kafudev/react-native-vconsole").default;
    }
    let { num } = this.state;
    return (
      <View className="userAboutApp">
        <View className="userAboutApp-iconBox">
          <Image
            className="userAboutApp-iconBox-icon"
            src={icon_app}
            mode="aspectFill"
          />
        </View>
        <View className="userAboutApp-title">{global.company_title}</View>
        <View className="userAboutApp-desrc">
          象寓，是一家为青年人才提供长租服务和休闲空间的品牌公寓，同时也是集青年公寓和青创中心为一体的现代青年人才发展社区。
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
            {$utils.app.getVersion() || ""}
          </View>
          <View className="userAboutApp-footerBox-banquan">
            CopyRight © 2022
          </View>

          <View className="userAboutApp-footerBox-gongsi">
            {global.company}
          </View>
        </View>
      </View>
    );
  }
}
