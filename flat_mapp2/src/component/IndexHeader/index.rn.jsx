import React, { Component } from "react";

import { Image, View, Picker } from "@tarojs/components";
import "./index.scss";
import searchPng from "@assets/image/search.png";
import weissPng from "@assets/image/address_icon.png";
import bottomPng from "@assets/image/bottom.png";
import { Datepicker, BottomModal, Timepicker, Scrollpicker } from "beeshell";
import { Drawer, Button, Label } from "teaset";
import { Text, DeviceEventEmitter } from "react-native";
import TextLabel from "../TextLabel";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {
    name: "",
    index: 0 //显示日期
  };
  onShowData = () => {
    setTimeout(() => {
      let showDrawer = Drawer.open(this.renderData(), "bottom");
    }, 5);
  };
  renderData = () => {
    let view = (
      <View
        style={{
          // ...styles.container,
          backgroundColor: "#f6f6f6",
          minHheight: 380
        }}
      >
        <View className="DatepickerRn_boxHeader">
          <Button
            className="DatepickerRn_boxBtn"
            titleStyle={{ color: "#555" }}
            title="取消"
            type="link"
            onPress={() => {
              setTimeout(() => {
                DeviceEventEmitter.emit("removeAllOverlay", {});
              }, 50);
            }}
          />
          <Label className="DatepickerRn_boxTitle">选择公寓</Label>
          <Button
            className="DatepickerRn_boxBtn"
            titleStyle={{ color: "#FFC300" }}
            title="完成"
            type="link"
            onPress={() => {
              let { index } = this.state;
              setTimeout(() => {
                this.props.selectIndex(index);
              }, 100);
              DeviceEventEmitter.emit("removeAllOverlay", {});
            }}
          />
        </View>
        <Scrollpicker
          list={[this.props.listName]}
          value={[this.state.index]}
          proportion={[1]}
          onChange={(columnIndex, index) => {
            console.log(this.props.listName[index], "xxx");
            this.setState({
              name: this.props.listName[index],
              index: index
            });
          }}
        />
      </View>
    );
    return view;
  };
  render() {
    const { title } = this.props;
    return (
      <View className="header">
        <View className="header-address" onClick={this.onShowData.bind(this)}>
          <Image
            className="header-address-icon"
            mode="aspectFill"
            src={weissPng}
          />
          <View className="header-address-title">
            <TextLabel
              className="header-address-title-text"
              content={title}
              num={1}
            ></TextLabel>
          </View>
          <Image
            className="header-address-bottomPng"
            mode="aspectFill"
            src={bottomPng}
          />
        </View>
      </View>
    );
  }
}
