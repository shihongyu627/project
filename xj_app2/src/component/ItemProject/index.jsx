import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.less";
import newPng from "@assets/image/new.png";
import rightPng from "@assets/image/right.png";
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
        className="ItemProject"
        onClick={() => {
          this.props.goInfo(info);
        }}
      >
        <Image
          className="ItemProject-image"
          src={$utils.loadimg.load(info.image)}
          mode="aspectFill"
        />
        <View className="ItemProject-rightBox">
          <TextLabel
            content={info.title}
            className="ItemProject-rightBox-title"
            num={1}
          />
          <View className="ItemProject-rightBox-contentBox">
            <View className="ItemProject-rightBox-contentBox-numText">
              本月已检查次数
              <View className="ItemProject-rightBox-contentBox-num">
                {info.check_month_num}
              </View>
              次
            </View>
            <View className="ItemProject-rightBox-contentBox-goInfo">
              {info.user_is_read != 1 ? (
                <Image
                  className="ItemProject-rightBox-contentBox-newPng"
                  src={newPng}
                  mode="aspectFill"
                />
              ) : null}
              <Image
                className="ItemProject-rightBox-contentBox-rightPng"
                src={rightPng}
                mode="aspectFill"
              />
            </View>
          </View>
          <View className="ItemProject-rightBox-footer">
            <View
              className="ItemProject-rightBox-footer-state_name"
              style={{
                color:
                  info.build_status == 1
                    ? "#0A75E8"
                    : info.build_status == 2
                    ? "#FC5943"
                    : "#666666"
              }}
            >
              {info.build_status_name}
            </View>
            {info.check_recheck_num > 0 ? (
              <View className="ItemProject-rightBox-footer-br">丨</View>
            ) : null}
            {info.check_recheck_num > 0 ? (
              <View className="ItemProject-rightBox-footer-num">
                待复查({info.check_recheck_num})
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}
