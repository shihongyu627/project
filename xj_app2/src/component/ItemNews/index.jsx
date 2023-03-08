import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.scss";
import replywaitPng from "@assets/image/replywait.png";
import replytimeoutPng from "@assets/image/replytimeout.png";
import replypassPng from "@assets/image/replypass.png";
import passsuccessPng from "@assets/image/passsuccess.png";
import replyrejectPng from "@assets/image/replyreject.png";
import newsTwoPng from "@assets/image/newsTwo.png";
import TextLabel from "../TextLabel";
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
      <View
        className="ItemNews"
        onClick={() => {
          this.props.goInfo(info);
        }}
      >
        <View className="ItemNews-top">
          <View className="ItemNews-imageBox">
            <Image
              className="ItemNews-image"
              src={
                info.scene == "reply_wait_timeout"
                  ? replytimeoutPng
                  : info.scene == "'reply_wait_pass"
                  ? replypassPng
                  : info.scene == "'reply_pass_reject"
                  ? replyrejectPng
                  : info.scene == "reply_pass_success"
                  ? passsuccessPng
                  : info.type == 2
                  ? newsTwoPng
                  : replywaitPng
              }
              mode="aspectFill"
            />
            {info.user_is_read == 0 ? (
              <View className="ItemNews-imageBox-tip"></View>
            ) : null}
          </View>
          <View className="ItemNews-right">
            <View className="ItemNews-right-title">{info.notice_title}</View>
            <View className="ItemNews-right-creat_time">
              {info.create_time}
            </View>
          </View>
        </View>
        <View className="ItemNews-bottom">
          <View className="ItemNews-bottom-box">
            {info.timeout_day ? (
              <View className="ItemNews-bottom-title">
                已延期{" "}
                <Text style={{ color: "#FC5943" }}>{info.timeout_day}</Text>{" "}
                天未整改
              </View>
            ) : info.notice_content ? (
              <View className="ItemNews-bottom-title">
                {info.notice_content}
              </View>
            ) : null}
            <View className="ItemNews-bottom-content">
              {(info.contentArr || []).map((item, index) => {
                return (
                  <View className="ItemNews-bottom-content-box" key={index}>
                    <View className="ItemNews-bottom-content-title">
                      {item.title}：
                    </View>
                    <View className="ItemNews-bottom-content-text">
                      {item.stitle}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
