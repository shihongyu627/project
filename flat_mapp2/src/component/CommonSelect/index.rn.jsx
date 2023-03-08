import React, { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.scss";
import { Datepicker, BottomModal, Timepicker, Scrollpicker } from "beeshell";
import { Drawer, Button, Label } from "teaset";
import { Text, DeviceEventEmitter } from "react-native";
import dayjs from "dayjs";

export default class Index extends Component {
  state = {
    name: "",
    index: 0 //显示日期
  };
  componentDidMount() {}
  onShowData = () => {
    console.log(222);
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
          <Label className="DatepickerRn_boxTitle">{this.props.title}</Label>
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
  onChangeDate = e => {
    console.log(e, 333);
    this.setState({
      selectData: e
    });
  };
  render() {
    let { style, title } = this.props;
    return (
      <View
        onClick={() => {
          this.onShowData();
        }}
      >
        <Text style={style}>{title}</Text>
      </View>
    );
  }
}
