import React, { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.scss";
import { Datepicker, BottomModal, Timepicker, Scrollpicker } from "beeshell";
import { Drawer, Button, Label } from "teaset";
import { Text, DeviceEventEmitter } from "react-native";
import dayjs from "dayjs";

export default class Index extends Component {
  state = {
    selectData: null,
    date: "" //显示日期
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
            titleStyle={{ color: "#FFC300" }}
            title="完成"
            type="link"
            onPress={() => {
              let { selectData } = this.state;
              setTimeout(() => {
                if (dayjs().format("YYYY-MM-DD") > selectData) {
                  return global.$utils.toast.text("不能低于当前日期");
                }
                console.log(selectData, "预约日期");
                if (selectData) {
                  this.setState(
                    {
                      date: selectData
                    },
                    () => {
                      this.props.selectData(selectData);
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
          proportion={[1, 1, 1]}
          startYear={dayjs().year()}
          numberOfYears={1}
          date={this.state.selectData}
          onChange={date => this.onChangeDate(date)}
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
    let { title, style } = this.props;
    return (
      <View className="DatepickerRn_list">
        <Text className="DatepickerRn_list_l" style={style}>
          {title}
        </Text>
        <View
          className="DatepickerRn_list_r"
          onClick={() => {
            if (!this.state.date) {
              this.setState({
                selectData: dayjs().format("YYYY-MM-DD")
              });
            }
            this.onShowData();
            // this.bottomModalX.open()
          }}
        >
          {this.state.date ? (
            <Text className="DatepickerRn_list_r_txt">{this.state.date}</Text>
          ) : (
            <Text className="DatepickerRn_list_r_txts">请选择</Text>
          )}
        </View>
      </View>
    );
  }
}
