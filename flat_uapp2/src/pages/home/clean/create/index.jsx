import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Picker,
  Textarea,
  ScrollView,
  Image
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import commonBgPng from "@assets/image/common_bg.png";

import {
  InputText,
  SubmitBtn,
  DatePickerRn,
  TimePickerRn,
  SelectTypeRn,
  AtNavBar
} from "@component";
import { getWindowHeight } from "@utils/style";
import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomNameList: [],
      roomData: [],
      date: "", //预约日期
      time: "", //预约时间
      roomName: "",
      roomId: "",
      price: "",
      typeId: "",
      content: "",
      height: 667,
      payType: "",
      submitVal: true
    };
  }
  componentDidMount() {
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    const { windowHeight } = Taro.getSystemInfoSync();
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let title = params.title;
    let price = params.price;
    let payType = params.payType;

    console.log(id, title, price, payType, "传过来的值");
    this.setState(
      {
        typeId: id,
        title,
        payType,
        price,
        height: windowHeight
      },
      () => {
        this.roomnoPageList();
      }
    );
  }
  async componentWillUnmount() {}
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
  handleSubmit = () => {
    let { date, time, typeId, roomId, content, submitVal } = this.state;
    let d = {};
    let seeTime = date + " " + time;
    d.makeTime = seeTime;
    d.cleanId = typeId;
    d.state = "0";
    d.type = "0";
    d.descr = content;
    d.roomId = roomId;
    if (!roomId) {
      global.$utils.toast.text("请选择房间号");
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
    Taro.showLoading({
      title: "loading"
    });
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    global.$utils.api
      .load("CleanAdd", d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          if (this.state.payType == 0) {
            setTimeout(() => {
              Taro.navigateBack();
            }, 500);
          } else {
            setTimeout(() => {
              Taro.redirectTo({
                url: `/pages/user/bill/history/index`
              });
            }, 500);
            // Taro.redirectTo({
            //   url: `/pages/pay/index`
            // });
          }
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
    }, 1000);
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
    let roomName = obj.name;
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
      price,
      title,
      height,
      payType
    } = this.state;
    return (
      <View className="publicClean">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: height - 90 }}
        >
          <View className="publicClean-header">
            <Image
              className="publicClean-header-img"
              src={commonBgPng}
              mode="aspectFill"
            />
            <View className="publicClean-header-content">
              <AtNavBar
                title="预约保洁"
                background="rgba(0, 0, 0, 0)"
                color="#fff"
                onClick={() => {
                  Taro.navigateBack();
                }}
              ></AtNavBar>
            </View>
          </View>
          <View className="publicClean-box">
            <SelectTypeRn
              title="房间号"
              listName={roomNameList}
              selectIndex={this.selectRoomIndex}
              typeName={roomName}
            ></SelectTypeRn>
            <InputText
              title="保洁项目"
              type="text"
              style={{ border: 0 }}
              value={title}
              disabled
            ></InputText>
            <DatePickerRn
              title="预约日期"
              selectData={this.selectData}
            ></DatePickerRn>
            <TimePickerRn
              title="预约时间"
              selectTime={this.selectTime}
              date={date}
            ></TimePickerRn>
            <View className="publicClean-box-items">
              <View className="publicClean-box-items-title">详细需求</View>
            </View>
            <View className="publicClean-box-Textarea">
              <Textarea
                className="publicClean-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="请输入"
                maxlength={20}
                onInput={this.changeContent.bind(this)}
              />
            </View>
            {/* <View
              className={
                positionVal
                  ? "publicClean-box-Textarea"
                  : "publicClean-box-Textareas"
              }
            >
              <Textarea
                className="publicClean-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="请输入"
                onFocus={this.onFocus.bind(this)}
                onBlur={this.onBlur.bind(this)}
              />
            </View> */}
          </View>
          <View className="publicClean-bottomBr"></View>
        </ScrollView>
        <SubmitBtn
          title={payType == 0 ? "立即预约" : "立即支付￥" + `${price}`}
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
