import React, { Component } from "react";

import { Picker, View, Image } from "@tarojs/components";
import "./index.scss";
import { Datepicker, BottomModal, Timepicker, Scrollpicker } from "beeshell";
import { Drawer, Button, Label } from "teaset";
import { Text, DeviceEventEmitter } from "react-native";
import dayjs from "dayjs";
import categorydownPng from "@assets/image/categorydown.png";
import categorytopPng from "@assets/image/categorytop.png";
export default class Index extends Component {
  state = {
    selectData: dayjs().format("YYYY-MM"),
    selectMonth: dayjs().format("YYYY-MM"),
    date: null //dayjs().format("YYYY-MM") //显示日期
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
            titleStyle={{ color: "#555" }}
            title="取消"
            type="link"
            onPress={() => {
              setTimeout(() => {
                DeviceEventEmitter.emit("removeAllOverlay", {});
              }, 50);
            }}
          />
          <Label className="DatepickerRn_boxTitle">选择日期</Label>
          <Button
            className="DatepickerRn_boxBtn"
            titleStyle={{ color: "#0A75E8" }}
            title="完成"
            type="link"
            onPress={() => {
              let { selectData, selectMonth } = this.state;
              setTimeout(() => {
                console.log(selectData, "预约日期");
                if (selectData) {
                  this.setState(
                    {
                      date: selectMonth
                    },
                    () => {
                      this.props.selectData(selectMonth);
                    }
                  );
                }
                setTimeout(() => {
                  DeviceEventEmitter.emit("removeAllOverlay", {});
                }, 100);
              }, 100);
            }}
          />
        </View>
        <Datepicker
          proportion={[1, 1, 0]}
          startYear={2022}
          date={this.state.selectData}
          onChange={date => this.onChangeDate(date)}
          format="YYYY-MM"
        />
      </View>
    );
    return view;
  };
  onChangeDate = e => {
    // this.setState({
    //   selectData: e
    // });
    let date = e.split("-");
    let month = date[1];
    let year = date[0];
    let selectMonth = year + "-" + month;
    this.setState({
      selectData: e,
      selectMonth: selectMonth
    });
  };
  render() {
    let { title, style } = this.props;
    return (
      <View
        style={style}
        className="DatePicker"
        onClick={() => {
          this.onShowData();
        }}
      >
        <View className="DatePicker-title">
          {this.props.date ? `${this.props.date}` : "选择日期"}
        </View>
        <Image
          className="DatePicker-image"
          src={categorydownPng}
          // src={imageVal ? categorytopPng : categorydownPng}
          mode="aspectFill"
        />
      </View>
    );
  }
}
