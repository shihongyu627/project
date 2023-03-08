import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.scss";
import useravatar from "@assets/image/useravatar.png";
import TextLabel from "../TextLabel";
import Accordion from "react-native-collapsible/Accordion";
import Taro from "@tarojs/taro";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  state = {};

  render() {
    let { info, user_type, detail, index, list } = this.props;
    console.log(info, 777);
    return (
      <View className="ItemLogList-stepsBox-item">
        <View className="ItemLogList-stepsBox-item-top">
          <Image
            className="ItemLogList-stepsBox-item-top-avatar"
            src={info.user_head || useravatar}
            mode="aspectFill"
          />
          <View className="ItemLogList-stepsBox-item-top-right">
            <View className="ItemLogList-stepsBox-item-top-right-nameBox">
              <View className="ItemLogList-stepsBox-item-top-right-name">
                {info.user_nick}
              </View>
              <View
                className="ItemLogList-stepsBox-item-top-right-status_name"
                style={{ color: info.pass_status == 1 ? "#0a75e8" : "#FC5943" }}
              >
                {info.status_name}
              </View>
            </View>
            <View className="ItemLogList-stepsBox-item-top-right-title">
              {info.team_name || ""}
            </View>
          </View>
        </View>
        <View className="ItemLogList-stepsBox-item-bottom">
          <View
            className={
              "ItemLogList-stepsBox-item-bottom-contentStart " +
              (index + 1 == list.length
                ? "ItemLogList-stepsBox-item-bottom-contents"
                : index == 0
                ? "ItemLogList-stepsBox-item-bottom-content"
                : "ItemLogList-stepsBox-item-bottom-contentes")
            }
          ></View>
          <View className="ItemLogList-stepsBox-item-bottom-right">
            <View className="ItemLogList-stepsBox-item-top-right-time">
              {info.create_time}
            </View>
            {info.content ? (
              <View className="ItemLogList-stepsBox-item-bottom-contentStart-text">
                {info.content}
              </View>
            ) : null}
            {info.gallery ? (
              <View className="ItemLogList-stepsBox-item-bottom-contentStart-imgBox">
                {(info.gallery?.split(",") || []).map((item, index) => {
                  return (
                    <Image
                      className="ItemLogList-stepsBox-item-bottom-contentStart-imgBox-img"
                      src={global.$utils.loadimg.load(item)}
                      onClick={() => {
                        $utils.image.preview(info.gallery?.split(","), index);
                      }}
                    />
                  );
                })}
              </View>
            ) : null}
            <View className="ItemLogList-stepsBox-item-bottom-contentStart-imgBox">
              <Image
                className="ItemLogList-stepsBox-item-bottom-contentStart-imgBox-sign_img"
                src={global.$utils.loadimg.load(info.sign_img)}
                onClick={() => {
                  $utils.image.preview([info.sign_img], 0);
                }}
              />
              <Image
                className="ItemLogList-stepsBox-item-bottom-contentStart-imgBox-sign_img"
                src={global.$utils.loadimg.load(info.sign_img2)}
                onClick={() => {
                  $utils.image.preview([info.sign_img2], 0);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
