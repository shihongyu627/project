import React, { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.scss";
import { Datepicker, BottomModal, Timepicker, Scrollpicker } from "beeshell";
import { Drawer, Button, Label } from "teaset";
import { Text, DeviceEventEmitter } from "react-native";
import dayjs from "dayjs";
import MultiSelector from "../MultiSelector";
export default class Index extends Component {
  state = {
    name: ""
  };

  onShowData = () => {
    setTimeout(() => {
      let showDrawer = Drawer.open(this.renderData(), "bottom");
    }, 5);
  };
  renderData = () => {
    return <MultiSelector selectData={this.selectData}></MultiSelector>;
  };
  selectData=(s1,s2,s3)=>{
     this.props.selectEndData(s1,s2,s3)
  }
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
