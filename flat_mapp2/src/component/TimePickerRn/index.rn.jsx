import React, { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.scss";
import { Datepicker, BottomModal, Timepicker, Scrollpicker } from "beeshell";
import { Drawer, Button, Label } from "teaset";
import { Text, DeviceEventEmitter } from "react-native";
import dayjs from "dayjs";

export default class Index extends Component {
  state = {
    selectTime: dayjs().format("HH:mm") + ":00",
    time: "" //显示日期
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
          <Label className="DatepickerRn_boxTitle">选择时间</Label>
          <Button
            className="DatepickerRn_boxBtn"
            titleStyle={{ color: "#FFC300" }}
            title="完成"
            type="link"
            onPress={() => {
              let { selectTime } = this.state;
              setTimeout(() => {
                console.log(selectTime);
                if (dayjs().format("YYYY-MM-DD") == this.props.date) {
                  if (dayjs().format("HH:mm:ss") > selectTime) {
                    return global.$utils.toast.text("不能低于当前时间");
                  }
                }
                if (selectTime) {
                  this.setState(
                    {
                      time: selectTime
                    },
                    () => {
                      this.props.selectTime(selectTime);
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
        <Timepicker
          style={{ paddingHorizontal: 50 }}
          proportion={[1, 1]}
          hourStep={1}
          // minuteStep={10}
          secondStep={60}
          value={this.state.selectTime}
          onChange={time => this.onChangeTime(time)}
        />
      </View>
    );
    return view;
  };
  onChangeTime = e => {
    console.log(e);
    this.setState({
      selectTime: e
    });
  };
  render() {
    let { title,style } = this.props;
    return (
      <View className="DatepickerRn_list">
        <Text className="DatepickerRn_list_l" style={style}>{title}</Text>
        <View
          className="DatepickerRn_list_r"
          onClick={() => {
            if (!this.props.date) {
              return global.$utils.toast.text("请选择日期");
            }
            this.onShowData();
            // this.bottomModalX.open()
          }}
        >
          {this.state.time ? (
            <Text className="DatepickerRn_list_r_txt">{this.state.time}</Text>
          ) : (
            <Text className="DatepickerRn_list_r_txts">请选择</Text>
          )}
        </View>
      </View>
    );
  }
}
