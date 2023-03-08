import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Image,
  Textarea,
  ScrollView,
  Input
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import {
  AtNavBar,
  InputText,
  SubmitBtn,
  DatePickerRn,
  TimePickerRn,
  SelectTypeRn
} from "@component";
import { getWindowHeight } from "@utils/style";
import commonBgPng from "@assets/image/common_bg.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomNameList: [],
      roomData: [],
      roomName: "",
      roomId: "",
      visitorName: "",
      visitorCard: "",
      title: "",
      date: "", //预约日期
      height: 667,
      content: "",
      time: "", //预约时间
      submitVal: true
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    const { windowHeight } = Taro.getSystemInfoSync();

    let id = params.id;
    let title = params.title;
    console.log(id, title, "传过来的值");
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    this.setState(
      {
        id,
        title,
        height: windowHeight
      },
      () => {
        this.roomnoPageList();
      }
    );
  }

  componentDidShow() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("light-content");
    }
  }
  componentDidHide() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("dark-content");
    }
  }
  //查询房间号
  roomnoPageList = () => {
    let d = {};
    global.$utils.api
      .load("roomnoPageList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let roomData = res.rows || [];
          let roomNameList = [];
          roomData.map(item => {
            item.roomName = item.name;
            roomNameList.push(item.name);
          });
          this.setState({
            roomData,
            roomNameList
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  changeVisitorName = data => {
    this.setState({
      visitorName: data
    });
  };
  changeVisitorCard = data => {
    this.setState({
      visitorCard: data
    });
  };
  //选择日期
  selectData = data => {
    this.setState({
      date: data
    });
  };
  //选择时间
  selectTime = data => {
    console.log("预约时间", data);
    this.setState({
      time: data
    });
  };

  handleSubmit = () => {
    let {
      visitorName,
      visitorCard,
      date,
      time,
      roomId,
      content,
      submitVal
    } = this.state;
    let d = {};
    d.visitorName = visitorName;
    d.visitorCard = visitorCard;
    let seeTime = date + " " + time;
    d.visitorTime = seeTime;
    d.descr = content;
    d.state = "0";
    d.type = "0";
    d.roomId = roomId;
    if (!roomId) {
      global.$utils.toast.text("请选择房间号");
      return;
    }
    if (!visitorName) {
      global.$utils.toast.text("请输入拜访人员");
      return;
    }
    if (!visitorCard) {
      global.$utils.toast.text("请输入身份证号码");
      return;
    }
    if (!date) {
      global.$utils.toast.text("请选择预约日期");
      return;
    }
    if (!time) {
      global.$utils.toast.text("请选择预约时间");
      return;
    }
    console.log(d, "提交的数据");
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    global.$utils.api
      .load("visitorAdd", d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          setTimeout(() => {
            Taro.navigateBack();
          }, 500);
        } else {
          this.setState({
            submitVal: true
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          submitVal: true
        });
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  changeContent = e => {
    this.setState({
      content: e.detail.value
    });
  };
  //选择房间
  selectRoomIndex = data => {
    let { roomData } = this.state;
    if (roomData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(roomData[data], "传过来的索引取类型值");
    let obj = roomData[data];
    let roomName = obj.roomName;
    let roomId = obj.id;
    this.setState({
      roomName,
      roomId
    });
  };
  render() {
    let {
      roomNameList,
      roomName,
      date,
      height,
      visitorName,
      visitorCard
    } = this.state;
    return (
      <View className="visitorCreate">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: height - 90, position: "relative" }}
        >
          <View className="visitorCreate-header">
            <Image
              className="visitorCreate-header-img"
              src={commonBgPng}
              mode="aspectFill"
            />
            <View className="visitorCreate-header-content">
              <AtNavBar
                title="拜访预约"
                background="rgba(0, 0, 0, 0)"
                color="#fff"
                onClick={() => {
                  Taro.navigateBack();
                }}
              ></AtNavBar>
            </View>
          </View>
          <View className="visitorCreate-box">
            <SelectTypeRn
              title="房间号"
              listName={roomNameList}
              selectIndex={this.selectRoomIndex}
              typeName={roomName}
            ></SelectTypeRn>
            <InputText
              title="拜访人员"
              type="text"
              onInput={this.changeVisitorName}
              // className="visitorCreate-box-title"
              value={visitorName}
            ></InputText>
            <InputText
              title="身份证号码"
              type="idcard"
              // className="visitorCreate-box-title"
              onInput={this.changeVisitorCard}
              value={visitorCard}
            ></InputText>
            <DatePickerRn
              title="预约日期"
              // className="visitorCreate-box-title"
              selectData={this.selectData}
            ></DatePickerRn>
            <TimePickerRn
              title="预约时间"
              // className="visitorCreate-box-title"
              selectTime={this.selectTime}
              date={date}
            ></TimePickerRn>
            <View className="visitorCreate-box-items">
              <View className="visitorCreate-box-items-title">详细需求</View>
            </View>
            <View className="visitorCreate-box-Textarea">
              <Textarea
                className="visitorCreate-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="请输入您的要求，为更好得服务您"
                maxlength={20}
                onInput={this.changeContent.bind(this)}
              />
            </View>
          </View>
          <View className="visitorCreate-bottomBr"></View>
        </ScrollView>
        <SubmitBtn
          title="发送申请"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
