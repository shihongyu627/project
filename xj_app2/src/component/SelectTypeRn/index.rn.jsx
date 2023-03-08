import React, { Component } from "react";

import { Picker, View, Image } from "@tarojs/components";
import "./index.scss";
import { Datepicker, BottomModal, Timepicker, Scrollpicker } from "beeshell";
import { Drawer, Button, Label } from "teaset";
import { Text, DeviceEventEmitter } from "react-native";
import dayjs from "dayjs";
import downPng from "@assets/image/projectBottom.png";
export default class Index extends Component {
  state = {
    selectName: "",
    index: 0 //显示日期
  };
  componentDidMount() {}
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
            titleStyle={{ color: "#0A74E9" }}
            title="取消"
            type="link"
            onPress={() => {
              setTimeout(() => {
                DeviceEventEmitter.emit("removeAllOverlay", {});
              }, 50);
            }}
          />
          <Label className="DatepickerRn_boxTitle">{this.props.title}</Label>
          <Button
            className="DatepickerRn_boxBtn"
            titleStyle={{ color: "#0A74E9" }}
            title="完成"
            type="link"
            onPress={() => {
              let { index } = this.state;
              let selectName = this.props.listName[index];
              this.setState({
                selectName
              });
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
              index: index
            });
          }}
        />
      </View>
    );
    return view;
  };
  onChangeDate = e => {
    this.setState({
      selectData: e
    });
  };
  render() {
    let { title, typeName, listName, style,placeholder } = this.props;
    let { selectName } = this.state;
    return (
      <View
        className="SelectType"
        onClick={() => {
          this.onShowData();
        }}
      >
        <View className="SelectType-title">{typeName}</View>
        <View className="SelectType-right">
          <View className="SelectType-right-title">{placeholder}</View>
          <Image
            className="SelectType-right-image"
            src={downPng}
            mode="aspectFill"
          />
        </View>
      </View>
    );
  }
}
