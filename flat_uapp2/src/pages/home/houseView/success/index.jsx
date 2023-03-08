import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Image,
  Textarea,
  ScrollView,
  Input
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { AtNavBar, CommonSelect } from "@component";
import { getWindowHeight } from "@utils/style";
import commonBgPng from "@assets/image/common_bg.png";
import houseSuccess from "@assets/image/houseSuccess.png";
import houseSuccess_bgPng from "@assets/image/houseSuccess_bg.png";
import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      time: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let name = params.name;
    let address = params.address;
    let time = params.time;
    console.log(name, time, address, "传过来的值");
    this.setState({
      name,
      address,
      time
    });
  }

  async componentWillUnmount() {}
  componentDidShow() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("light-content");
    }
  }
  componentDidHide() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("dark-content");
    }
  }
  render() {
    let { name, address, time } = this.state;
    return (
      <View className="houseSuccess">
        <View className="houseSuccess-header">
          <Image
            className="houseSuccess-header-img"
            src={commonBgPng}
            mode="aspectFill"
          />
          <View className="houseSuccess-header-content">
            <AtNavBar
              background="rgba(0, 0, 0, 0)"
              color="#fff"
              onClick={() => {
                Taro.navigateBack();
              }}
            ></AtNavBar>
            <View className="houseSuccess-contentbox">
              <Image
                className="houseSuccess-contentbox-bgPng"
                src={houseSuccess_bgPng}
                mode="heightFix"
              />
              <View className="houseSuccess-contentbox-infoBox">
                <Image
                  className="houseSuccess-contentbox-infoBox-icon"
                  src={houseSuccess}
                  mode="aspectFill"
                />
                <View className="houseSuccess-contentbox-infoBox-title">
                  预约成功
                </View>
                <View className="houseSuccess-contentbox-infoBox-text">
                  感谢您的预约，稍后小金刚管家将会联系您
                </View>
                <View className="houseSuccess-contentbox-infoBox-text">
                  请注意接听电话
                </View>
                <View className="houseSuccess-contentbox-infoBox-box">
                  <View className="houseSuccess-contentbox-infoBox-box-item">
                    <View className="houseSuccess-contentbox-infoBox-box-item-title">
                      姓名
                    </View>
                    <View className="houseSuccess-contentbox-infoBox-box-item-text">
                      {name}
                    </View>
                  </View>
                  <View className="houseSuccess-contentbox-infoBox-box-item">
                    <View className="houseSuccess-contentbox-infoBox-box-item-title">
                      预约地址
                    </View>
                    <View className="houseSuccess-contentbox-infoBox-box-item-text">
                      {address}
                    </View>
                  </View>
                  <View className="houseSuccess-contentbox-infoBox-box-item houseSuccess-contentbox-infoBox-box-items">
                    <View className="houseSuccess-contentbox-infoBox-box-item-title">
                      预约时间
                    </View>
                    <View className="houseSuccess-contentbox-infoBox-box-item-text">
                      {time}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
