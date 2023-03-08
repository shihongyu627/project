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
import Taro from "@tarojs/taro";
import {
  InputText,
  SubmitBtn,
  DatePickerRn,
  TimePickerRn,
  SelectTypeRn,
  AtNavBar
} from "@component";
import { getWindowHeight } from "@utils/style";
import commonBgPng from "@assets/image/common_bg.png";
import telPng from "@assets/image/tel.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listName: [],
      listData: [],
      name: "", //名字
      tel: "", //电话
      date: "", //预约日期
      time: "", //预约时间
      typeName: "",
      typeId: "",
      positionVal: true,
      positionVals: true,
      roomNameList: [],
      roomData: [],
      roomName: "",
      roomId: "",
      content: "",
      height: 667,
      flatId: "",
      submitVal: true
    };
  }
  componentDidMount() {
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState({
      height: windowHeight
    });
    this.roomnoPageList();
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
  //查询预约类型（设备类型）
  publicList = () => {
    let d = {};
    d.flatId = this.state.flatId;
    global.$utils.api
      .load("publicList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let listData = res.rows || [];
          let listName = [];
          listData.map(item => {
            listName.push(item.name);
          });
          this.setState({
            listData,
            listName
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  changeName = data => {
    this.setState({
      name: data
    });
  };
  changeTel = data => {
    this.setState({
      tel: data
    });
  };
  changeContent = e => {
    this.setState({
      content: e.detail.value
    });
  };
  handleSubmit = () => {
    let {
      name,
      tel,
      date,
      time,
      typeId,
      roomId,
      content,
      submitVal
    } = this.state;
    let d = {};
    d.name = name;
    d.phone = tel;
    let seeTime = date + " " + time;
    d.makeTime = seeTime;
    d.publicId = typeId;
    d.descr = content;
    d.roomId = roomId;
    d.state = "0";
    d.type = "0";
    let val = global.$utils.isPhoneNumber.isAvailable(tel);
    if (!roomId) {
      global.$utils.toast.text("请选择房间号");
      return;
    }
    if (!name) {
      global.$utils.toast.text("请输入姓名");
      return;
    }
    if (!val) {
      global.$utils.toast.text("请输入正确的联系电话");
      return;
    }
    if (!typeId) {
      global.$utils.toast.text("请选择预约类型");
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
      .load("publicMakeAdd", d, "post", { loading: false, login: true })
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
    }, 1000);
    console.log(d, "提交的数据");
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
  //选择类型
  selectIndex = data => {
    let { listData, flatId } = this.state;
    if (!flatId) {
      global.$utils.toast.text("请选择房间号");
      return;
    }
    if (listData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(listData[data], "传过来的索引取类型值");
    let obj = listData[data];
    let typeName = obj.name;
    let typeId = obj.id;
    this.setState({
      typeName,
      typeId
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
    let flatId = obj.flatId;

    this.setState(
      {
        roomName,
        roomId,
        flatId,
        typeName: "",
        typeId: ""
      },
      () => {
        this.publicList();
      }
    );
  };
  onFocus = () => {
    this.setState({ scrollTop: 100 });
    // this.setState({
    //   positionVal: false
    // });
  };
  onBlur = () => {
    console.log("6666");
    this.setState({
      positionVal: true
    });
  };
  onFocusTwo = () => {
    this.setState({
      positionVals: false
    });
  };
  onBlurTwo = () => {
    console.log("6666");
    this.setState({
      positionVals: true
    });
  };
  render() {
    let {
      listName,
      listData,
      date,
      positionVal,
      positionVals,
      roomNameList,
      roomName,
      name,
      tel,
      time,
      height
    } = this.state;
    return (
      <View className="publicDevice">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: height - 90 }}
        >
          <View className="publicDevice-header">
            <Image
              className="publicDevice-header-img"
              src={commonBgPng}
              mode="aspectFill"
            />
            <View className="publicDevice-header-content">
              <AtNavBar
                title="预约公用设施"
                background="rgba(0, 0, 0, 0)"
                color="#fff"
                onClick={() => {
                  Taro.navigateBack();
                }}
              ></AtNavBar>
            </View>
          </View>
          <View className="publicDevice-box">
            <SelectTypeRn
              title="房间号"
              listName={roomNameList}
              selectIndex={this.selectRoomIndex}
              typeName={roomName}
            ></SelectTypeRn>
            <InputText
              title="姓名"
              type="text"
              onInput={this.changeName}
              value={name}
            ></InputText>
            <InputText
              title="联系电话"
              type="number"
              onInput={this.changeTel}
              maxlength={11}
              value={tel}
            ></InputText>
            <SelectTypeRn
              title="预约类型"
              listName={this.state.listName}
              selectIndex={this.selectIndex}
              typeName={this.state.typeName}
            ></SelectTypeRn>
            <DatePickerRn
              title="预约日期"
              selectData={this.selectData}
            ></DatePickerRn>
            <TimePickerRn
              title="预约时间"
              selectTime={this.selectTime}
              date={date}
            ></TimePickerRn>
            <View className="publicDevice-box-items">
              <View className="publicDevice-box-items-title">详细需求</View>
            </View>
            <View className="publicDevice-box-Textarea">
              <Textarea
                className="publicDevice-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="请输入您的要求，为更好得服务您"
                maxlength={20}
                onInput={this.changeContent.bind(this)}
              />
            </View>
            {/* <View
              className={
                positionVal
                  ? "publicDevice-box-Textarea"
                  : "publicDevice-box-Textareas"
              }
            >
              <Textarea
                className="publicDevice-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="请输入"
                onFocus={this.onFocus.bind(this)}
                onBlur={this.onBlur.bind(this)}
              />
            </View> */}
          </View>
          {/* <View className='publicDevice-bottom'>
            <Image
              className='publicDevice-bottom-img'
              src={telPng}
              mode='aspectFill'
            />
            <View className='publicDevice-bottom-text'>
              客服热线：400-0000-0002
            </View>
          </View> */}
          <View className="publicDevice-bottomBr"></View>
          {/* <View className={positionVals ? "bottomBr" : "bottomBrs"}></View> */}
        </ScrollView>
        <SubmitBtn
          title="提交申请"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
