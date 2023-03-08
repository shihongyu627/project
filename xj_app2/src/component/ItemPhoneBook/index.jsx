import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.less";
import namePng from "@assets/image/name.png";
import unitPng from "@assets/image/unit.png";
import telPng from "@assets/image/tel.png";
import projectPng from "@assets/image/project.png";
import TextLabel from "../TextLabel";
import MapLinking from "react-native-map-linking";
import Taro, { getCurrentInstance } from "@tarojs/taro";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  state = {};
  render() {
    let { info } = this.props;
    return (
      <View className="ItemPhoneBook">
        <View className="ItemPhoneBook-item">
          <Image
            className="ItemPhoneBook-item-image"
            src={namePng}
            mode="aspectFill"
          />
          <View className="ItemPhoneBook-item-title">姓名：</View>
          <View className="ItemPhoneBook-item-name">{info.linkman_name}</View>
        </View>
        <View className="ItemPhoneBook-item">
          <Image
            className="ItemPhoneBook-item-image"
            src={unitPng}
            mode="aspectFill"
          />
          <View className="ItemPhoneBook-item-title">单位：</View>
          <View className="ItemPhoneBook-item-name">{info.team_name}</View>
        </View>
        <View
          className="ItemPhoneBook-item"
          onClick={() => {
            if (!info.linkman_mobile) {
              return;
            }
            Taro.makePhoneCall({
              phoneNumber: info.linkman_mobile || "" //仅为示例，并非真实的电话号码
            });
          }}
        >
          <Image
            className="ItemPhoneBook-item-image"
            src={telPng}
            mode="aspectFill"
          />
          <View className="ItemPhoneBook-item-title">电话：</View>
          <View
            className="ItemPhoneBook-item-name"
            style={{ color: "#0A75E8" }}
          >
            {info.linkman_mobile}
          </View>
        </View>
        <View
          className="ItemPhoneBook-item"
          onClick={() => {
            let lnglat = [];
            if (info.lnglat) {
              lnglat = info.lnglat.split(",");
              MapLinking.markLocation(
                { lat: lnglat[1], lng: lnglat[0], type: "gcj02" },
                info.title,
                info.address
              );
            }
          }}
        >
          <Image
            className="ItemPhoneBook-item-image"
            src={projectPng}
            mode="aspectFill"
          />
          <View className="ItemPhoneBook-item-title">工程：</View>
          <View
            className="ItemPhoneBook-item-name"
            style={{ color: "#0A75E8" }}
          >
            {info.title}
          </View>
        </View>
      </View>
    );
  }
}
