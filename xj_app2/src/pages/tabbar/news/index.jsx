import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";
import "./index.scss";
import { BoxEmpty, ItemNews, TextLabel } from "@component";
import newsTwoPng from "@assets/image/newsTwo.png";
import newsOnePng from "@assets/image/newsOne.png";
import { Badge } from "beeshell";
export default class News extends Component {
  state = {
    detail: {},
    type1_latest_info: {},
    type2_latest_info: {}
  };

  componentDidMount() {
    Taro.eventCenter.on("refreshMessageBadge", val => {
      this.loadData();
    });
    this.loadData();
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshMessageBadge");
  }
  componentDidShow() {}
  loadData = async () => {
    let d = {};
    let result = {};
    d.type = "";
    try {
      result = await $utils.api.load("messageBadge", d, "get", {
        loading: false,
        login: true
      });
      if (result.data) {
        let v = result.data;
        this.setState({
          detail: result.data || {},
          type1_latest_info: v.type1_latest_info || {},
          type2_latest_info: v.type2_latest_info || {}
        });
      }
    } catch (error) {
    }
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.loadData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  render() {
    let { detail, type1_latest_info, type2_latest_info } = this.state;
    return (
      <View className="newsBox">
        <View
          className="newsBox-item"
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/news/index?type=1`
            });
          }}
        >
          <View className="newsBox-item-left">
            {detail.type1_no_read_count ? (
              <View className="newsBox-item-Badge">
                <Badge label={detail.type1_no_read_count} />
              </View>
            ) : null}
            <Image
              className="newsBox-item-left"
              src={newsOnePng}
              mode="aspectFill"
            />
          </View>
          <View className="newsBox-item-right">
            <View className="newsBox-item-right-top">
              <View className="newsBox-item-right-title">消息通知</View>
              <View className="newsBox-item-right-time">
                {type1_latest_info?.send_time || ""}
              </View>
            </View>
            <TextLabel
              content={type1_latest_info?.notice_title || "暂无消息"}
              className="newsBox-item-right-content"
              num={1}
            />
          </View>
        </View>
        <View
          className="newsBox-item"
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/news/index?type=2`
            });
          }}
        >
          <View className="newsBox-item-left">
            {detail.type2_no_read_count ? (
              <View className="newsBox-item-Badge">
                <Badge label={detail.type2_no_read_count} />
              </View>
            ) : null}
            <Image
              className="newsBox-item-left"
              src={newsTwoPng}
              mode="aspectFill"
            />
          </View>
          <View className="newsBox-item-right">
            <View className="newsBox-item-right-top">
              <View className="newsBox-item-right-title">项目动态</View>
              <View className="newsBox-item-right-time">
                {type2_latest_info?.send_time || ""}
              </View>
            </View>
            <TextLabel
              content={type2_latest_info?.notice_title || ""}
              className="newsBox-item-right-content"
              num={1}
            />
          </View>
        </View>
      </View>
    );
  }
}
