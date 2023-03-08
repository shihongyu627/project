import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.scss";
import downPng from "@assets/image/down.png";
import topPng from "@assets/image/top.png";
import TextLabel from "../TextLabel";
import Accordion from "react-native-collapsible/Accordion";
import Taro from "@tarojs/taro";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  state = {
    activeSections: [0]
  };
  render() {
    let { info, user_type, detail } = this.props;
    return (
      <View className="ItemRecordInfo">
        <View style={{ backgroundColor: "#fff", paddingBottom: 10 }}>
          <View className="ItemRecordInfo-item">
            <View className="ItemRecordInfo-item-title">隐患分类：</View>
            <View className="ItemRecordInfo-item-content">
              {info.category_full_name}
            </View>
          </View>
          <View className="ItemRecordInfo-item">
            <View className="ItemRecordInfo-item-title">隐患描述：</View>
            <View className="ItemRecordInfo-item-content">{info.content}</View>
          </View>
          <View className="ItemRecordInfo-item">
            <View className="ItemRecordInfo-item-title">隐患等级：</View>
            <View className="ItemRecordInfo-item-content">
              {info.level_name}
            </View>
          </View>
          <View className="ItemRecordInfo-item">
            <View className="ItemRecordInfo-item-title">是否停工：</View>
            <View className="ItemRecordInfo-item-content">
              {info.is_stop_work == 1 ? "是" : "否"}
            </View>
          </View>
          <View className="ItemRecordInfo-item">
            <View className="ItemRecordInfo-item-title">隐患状态：</View>
            <View className="ItemRecordInfo-item-content">
              {info.handle_status_name}
            </View>
          </View>
          <View className="ItemRecordInfo-item">
            <View className="ItemRecordInfo-item-title">检查时间：</View>
            <View className="ItemRecordInfo-item-content">
              {info.create_time}
            </View>
          </View>
          <View className="ItemRecordInfo-item">
            <View className="ItemRecordInfo-item-title">整改天数：</View>
            <View className="ItemRecordInfo-item-content">
              {info.handle_day}天
            </View>
          </View>
          {info.gallery ? (
            <View className="ItemRecordInfo-item">
              <View className="ItemRecordInfo-item-title">照片：</View>
            </View>
          ) : null}
          {info.gallery ? (
            <View className="ItemRecordInfo-itemArr">
              {((info && info.gallery?.split(",")) || []).map((item, index) => {
                return (
                  <Image
                    className="ItemRecordInfo-itemArr-image"
                    src={$utils.loadimg.load(item)}
                    mode="aspectFill"
                    key={index}
                    onClick={() => {
                      let arr = info.gallery?.split(",") || [];
                      $utils.image.preview(arr, index);
                    }}
                  />
                );
              })}
            </View>
          ) : null}
          {info.sign_img ? (
            <View className="ItemRecordInfo-item">
              <View className="ItemRecordInfo-item-title">签名1：</View>
              <View className="ItemRecordInfo-signBox">
                <Image
                  className="ItemRecordInfo-signBox-signNamePng"
                  src={info.sign_img}
                  mode="aspectFill"
                />
              </View>
            </View>
          ) : null}
          {info.sign_img2 ? (
            <View className="ItemRecordInfo-item">
              <View className="ItemRecordInfo-item-title">签名2：</View>
              <View className="ItemRecordInfo-signBox">
                <Image
                  className="ItemRecordInfo-signBox-signNamePng"
                  src={info.sign_img2}
                  mode="aspectFill"
                />
              </View>
            </View>
          ) : null}
          {/* 针对工地端以及巡检段，user_type为2是巡检 1是工地 */}
          {user_type == 1 ? (
            <View>
              {detail.team4_sign_status == "1" &&
              detail.team5_sign_status == "1" &&
              detail.team1_sign_status == "1" ? (
                <View>
                  {detail.handle_status == 5 ||
                  detail.handle_status == 10 ? null : (
                    <View
                      className="ItemRecordInfo-btnThree"
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/record/create/index?type=createreply&trouble_id=${info.trouble_id}&title=填写整改内容`
                        });
                      }}
                    >
                      填写整改内容
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
