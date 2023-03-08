import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.scss";
import Recordnochecked from "@assets/image/Recordnochecked.png";
import Recordchecked from "@assets/image/Recordchecked.png";
import TextLabel from "../TextLabel";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  state = {};
  render() {
    let { info, idArr } = this.props;
    return (
      <View className="ItemUserRecord">
        <View className="ItemUserRecord-left">
          <Image
            className="ItemUserRecord-left-image"
            src={
              idArr.indexOf(info.batch_id) == -1
                ? Recordnochecked
                : Recordchecked
            }
            onClick={() => {
              this.props.selectRecord(info);
            }}
            mode="aspectFill"
          />
        </View>
        <View>
          <View
            className="ItemUserRecord-top"
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <View className="ItemUserRecord-top-recordNo">{info.batch_no}</View>
            <View
              className={
                "ItemUserRecord-top-stateName " +
                (info.handle_status == "0"
                  ? "ItemUserRecord-top-stateNameOne"
                  : info.handle_status == 5
                  ? "ItemUserRecord-top-stateNameTwo"
                  : "")
              }
            >
              {info.handle_status_name}
            </View>
          </View>
          <View
            className="ItemUserRecord-middle"
            onClick={() => {
              this.props.goInfo(info);
            }}
          >
            <Image
              className="ItemUserRecord-middle-image"
              src={$utils.loadimg.load(info.project_image)}
              mode="aspectFill"
            />
            <View className="ItemUserRecord-middle-content">
              <TextLabel
                className="ItemUserRecord-middle-content-title"
                num={1}
                content={info.project_title}
              />
              <View className="ItemUserRecord-middle-content-time">
                {info.creat_time}
              </View>
              <View className="ItemUserRecord-middle-content-itemBox">
                <View className="ItemUserRecord-middle-content-itemText">
                  <View className="ItemUserRecord-middle-content-color">
                    {info.trouble_num || 0}
                  </View>
                  个隐患
                </View>
                <View className="ItemUserRecord-middle-content-middleBr"></View>
                <View className="ItemUserRecord-middle-content-itemText ">
                  第
                  <View className="ItemUserRecord-middle-content-color">
                    {info.sort_check_num || 0}
                  </View>
                  次检查
                </View>
              </View>
            </View>
          </View>
          <View className="ItemUserRecord-footer">
            <View className="ItemUserRecord-footer-now_time">
              {info.left_time}
            </View>
            <View className="ItemUserRecord-footer-right">
              {info.handle_status == "5" || info.handle_status == "10" ? (
                <View
                  className="ItemUserRecord-footer-btn"
                  onClick={() => {
                    this.props.downloadFiles(info, 1);
                  }}
                >
                  整改回复单
                </View>
              ) : null}
              <View
                className="ItemUserRecord-footer-btn"
                onClick={() => {
                  this.props.downloadFiles(info, 2);
                }}
              >
                隐患告知单
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
