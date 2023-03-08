import { Component } from "react";

import { Image, View, Input, Text } from "@tarojs/components";
import "./index.scss";
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
      <View className="ItemRecord">
        <View
          className="ItemRecord-top"
          onClick={() => {
            this.props.goInfo(info);
          }}
        >
          <View className="ItemRecord-top-recordNo">{info.batch_no}</View>
          <View
            className={
              "ItemRecord-top-stateName " +
              (info.handle_status == "0"
                ? "ItemRecord-top-stateNameOne"
                : info.handle_status == 5
                ? "ItemRecord-top-stateNameTwo"
                : "")
            }
          >
            {info.handle_status_name}
          </View>
        </View>
        <View
          className="ItemRecord-middle"
          onClick={() => {
            this.props.goInfo(info);
          }}
        >
          <Image
            className="ItemRecord-middle-image"
            src={$utils.loadimg.load(info.project_image)}
            mode="aspectFill"
          />
          <View className="ItemRecord-middle-content">
            <TextLabel
              className="ItemRecord-middle-content-title"
              num={1}
              content={info.project_title}
            />
            <View className="ItemRecord-middle-content-time">
              {info.create_time}
            </View>
            <View className="ItemRecord-middle-content-itemBox">
              <View className="ItemRecord-middle-content-itemText">
                <View className="ItemRecord-middle-content-color">
                  {info.trouble_num}
                </View>
                个隐患
              </View>
              <View className="ItemRecord-middle-content-middleBr"></View>
              <View className="ItemRecord-middle-content-itemText ">
                第
                <View className="ItemRecord-middle-content-color">
                  {info.sort_check_num}
                </View>
                次检查
              </View>
              <View className="ItemRecord-middle-content-middleBr"></View>
              <View className="ItemRecord-middle-content-itemText">
                本月第
                <View className="ItemRecord-middle-content-color">
                  {info.sort_check_month_num}
                </View>
                次检查
              </View>
            </View>
          </View>
        </View>

        <View className="ItemRecord-footer">
          <View className="ItemRecord-footer-now_time">{info.left_time}</View>

          <View className="ItemRecord-footer-right">
            {info.handle_status == "5" || info.handle_status == "10" ? (
              <View
                className="ItemRecord-footer-btn"
                onClick={() => {
                  this.props.downloadFiles(info, 1);
                }}
              >
                整改回复单
              </View>
            ) : null}
            <View
              className="ItemRecord-footer-btn"
              onClick={() => {
                this.props.downloadFiles(info, 2);
              }}
            >
              隐患告知单
            </View>
          </View>
        </View>
      </View>
    );
  }
}
