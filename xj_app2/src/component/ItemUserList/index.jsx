import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.scss";
import newPng from "@assets/image/new.png";
import rightPng from "@assets/image/right.png";
import TextLabel from "../TextLabel";
import Taro from "@tarojs/taro";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  state = {};
  render() {
    let { info, index } = this.props;
    return (
      <View className="ItemUserList">
        <View
          className={
            "ItemUserList-item " + (index == 0 ? "ItemUserList-items" : "")
          }
          key={index}
          onClick={() => {
            if (info.is_login && !global.isLogin) {
              $utils.toast.loginModal();
              return;
            }
            if (info.phone) {
              Taro.makePhoneCall({
                phoneNumber: info.phone || "" //仅为示例，并非真实的电话号码
              });
            }
            if (!info.url) {
              return;
            }
            Taro.navigateTo({
              url: info.url
            });
          }}
        >
          <View className="ItemUserList-item-left">
            <Image
              className="ItemUserList-item-left-icon"
              src={info.image}
              mode="aspectFill"
            />

            <View className="ItemUserList-item-left-titleBox">
              <View className="ItemUserList-item-left-titleBox-title">
                {info.title}
              </View>
            </View>
          </View>
          <Image
            className="ItemUserList-item-right-icon"
            src={rightPng}
            mode="aspectFill"
          />
        </View>
      </View>
    );
  }
}
