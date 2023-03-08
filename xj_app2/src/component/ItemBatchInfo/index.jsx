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
  state = {};

  render() {
    let { info, user_type, detail } = this.props;
    console.log(info.pass_time);
    return (
      <View className="ItemBatchInfo">
        <View style={{ backgroundColor: "#fff" }}>
          {(info.reply_list || []).map((menu, mindex) => {
            return (
              <View style={{ backgroundColor: "#fff" }} key={mindex}>
                <View className="ItemBatchInfo-itemBox">
                  <View className="ItemBatchInfo-item">
                    <View className="ItemBatchInfo-item-title">整改时间：</View>
                    <View className="ItemBatchInfo-item-content">
                      {$utils.datetime.format(menu.create_time)}
                    </View>
                  </View>
                  <View className="ItemBatchInfo-item">
                    <View className="ItemBatchInfo-item-title">整改描述：</View>
                    <View className="ItemBatchInfo-item-content">
                      {menu.content}
                    </View>
                  </View>
                  {menu.gallery ? (
                    <View className="ItemBatchInfo-item">
                      <View className="ItemBatchInfo-item-title">照片：</View>
                    </View>
                  ) : null}
                  {menu.gallery ? (
                    <View className="ItemBatchInfo-itemArr">
                      {((menu && menu.gallery?.split(",")) || []).map(
                        (item, index) => {
                          return (
                            <Image
                              className="ItemBatchInfo-itemArr-image"
                              src={$utils.loadimg.load(item)}
                              key={index}
                              mode="aspectFill"
                              onClick={() => {
                                let arr = menu.gallery?.split(",") || [];
                                $utils.image.preview(arr, index);
                              }}
                            />
                          );
                        }
                      )}
                    </View>
                  ) : null}
                  {/* <View className="ItemBatchInfo-item">
               <View className="ItemBatchInfo-item-title">签名：</View>
               <Image
                 className="ItemBatchInfo-itemArr-images"
                 src={info.image}
                 mode="aspectFill"
               />
             </View> */}
                </View>
              </View>
            );
          })}
          {info.pass_status == 2 ? (
            <View className="ItemBatchInfo-itemBox">
              <View className="ItemBatchInfo-item">
                <View className="ItemBatchInfo-item-title">复核时间：</View>
                <View className="ItemBatchInfo-item-content">
                  {info.pass_time}
                </View>
              </View>
              <View className="ItemBatchInfo-item">
                <View className="ItemBatchInfo-item-title">拒绝原因：</View>
                <View className="ItemBatchInfo-item-content">
                  {info.pass_content}
                </View>
              </View>
              {info.pass_gallery ? (
                <View>
                  <View className="ItemBatchInfo-item">
                    <View className="ItemBatchInfo-item-title">照片：</View>
                  </View>
                  <View className="ItemBatchInfo-itemArr">
                    {((info && info.pass_gallery?.split(",")) || []).map(
                      (item, index) => {
                        return (
                          <Image
                            className="ItemBatchInfo-itemArr-image"
                            src={$utils.loadimg.load(item)}
                            mode="aspectFill"
                            key={index}
                            onClick={() => {
                              let arr = info.pass_gallery?.split(",") || [];
                              $utils.image.preview(arr, index);
                            }}
                          />
                        );
                      }
                    )}
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
