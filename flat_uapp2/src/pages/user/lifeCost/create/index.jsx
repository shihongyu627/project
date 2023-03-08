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

import { AtNavBar, SelectTypeRn, InputText } from "@component";
import commonBgPng from "@assets/image/common_bg.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeNameOne: [
        {
          name: 50,
          id: 1
        },
        {
          name: 150,
          id: 2
        },
        {
          name: 200,
          id: 3
        }
      ],
      money: "",
      typeOne: "",
      title: "",
      roomData: [],
      roomNameList: [],
      roomInfo: {}
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let type = params.type;
    let title = params.title;
    console.log(type, title, "传过来的值");
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    this.setState({
      type,
      title
    });
  }

  async componentWillUnmount() {}
  componentDidShow() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("light-content");
    }
    this.roomnoPageList();
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
          let roomId = "";
          let roomName = "暂无房间";
          if (roomData && roomData.length > 0) {
            let cc = roomData[0];
            roomName = cc.name || "";
            roomId = cc.id || "";
          }
          this.setState(
            {
              roomData,
              roomNameList,
              roomName,
              roomId
            },
            () => {
              if (roomId) {
                this.load();
              }
            }
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.type = this.state.type;
    d.roomId = this.state.roomId;
    global.$utils.api
      .load("accountInfo", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let roomInfo = res.data || {};
          this.setState({
            roomInfo
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  changeVal = e => {
    let val = e.detail.value || "";
    this.setState({
      money: val
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
    this.setState(
      {
        roomName,
        roomId
      },
      () => {
        this.load();
      }
    );
  };
  handleSubmit = () => {
    let { money, roomId, type, title, roomInfo } = this.state;
    // Taro.eventCenter.trigger("refreshDevice", true);
    if (!roomId) {
      global.$utils.toast.text("请选择房间");
      return;
    }
    if (!money) {
      global.$utils.toast.text("请输入金额");
      return;
    }
    let rechargeType = "";
    if (type == 1) {
      rechargeType = "water";
    }
    if (type == 2) {
      rechargeType = "electric";
    }
    Taro.navigateTo({
      url: `/pages/pay/index?id=${roomInfo.id}&money=${money}&typeName=${title}&rechargeType=${rechargeType}`
    });
  };

  render() {
    let {
      typeNameOne,
      typeOne,
      title,
      roomNameList,
      roomName,
      roomInfo,
      money
    } = this.state;
    let TextInput = null;
    if (process.env.TARO_ENV === "rn") {
      let RN = require("react-native");
      TextInput = RN.TextInput;
    }
    return (
      <View className="lifeCostCreate">
        <View className="lifeCostCreate-header">
          <Image
            className="lifeCostCreate-header-img"
            src={commonBgPng}
            mode="aspectFill"
          />
          <View className="lifeCostCreate-header-content">
            <AtNavBar
              title={title}
              background="rgba(0, 0, 0, 0)"
              color="#fff"
              onClick={() => {
                Taro.navigateBack();
              }}
            ></AtNavBar>
            <View className="lifeCostCreate-box">
              <View className="lifeCostCreate-box-title">账户余额(元)</View>
              <View className="lifeCostCreate-box-price">
                {roomInfo.money || 0}
              </View>
              <InputText
                title="户号信息"
                type="text"
                style={{ border: 0 }}
                value={roomInfo.neea || ""}
                placeholder={roomInfo.neea || ""}
                disabled
              ></InputText>
              {/* <View className="lifeCostCreate-box-item">
                <View className="lifeCostCreate-box-item-title">户号信息</View>
                <View className="lifeCostCreate-box-item-text">5878779989</View>
              </View> */}
              <SelectTypeRn
                title="住址信息"
                listName={roomNameList}
                selectIndex={this.selectRoomIndex}
                typeName={roomName}
              ></SelectTypeRn>
              {/* <View className='lifeCostCreate-box-item'>
                <View className='lifeCostCreate-box-item-title'>住址信息</View>
                <View className='lifeCostCreate-box-item-text'>
                  珠海鸿泰西岸中央9-2-1001
                </View>
              </View> */}
            </View>
            <View className="lifeCostCreate-bottomBox">
              <View className="lifeCostCreate-bottomBox-title">缴费金额</View>
              <View className="lifeCostCreate-bottomBox-price">
                {typeNameOne.map((item, index) => (
                  <View
                    onClick={() => {
                      this.setState({
                        typeOne: item.id,
                        money: Number(item.name)
                      });
                    }}
                    className={
                      "lifeCostCreate-bottomBox-price-item " +
                      (item.id == typeOne
                        ? "lifeCostCreate-bottomBox-price-items"
                        : "")
                    }
                    key={index}
                  >
                    {item.name}
                  </View>
                ))}
              </View>
              <View className="lifeCostCreate-bottomBox-inputBox">
                <View className="lifeCostCreate-bottomBox-inputBox-title">
                  ￥
                </View>
                {process.env.TARO_ENV === "rn" ? (
                  <TextInput
                    className="lifeCostCreate-bottomBox-inputBox-price"
                    clearButtonMode="always"
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                    placeholder="点击输入充值金额"
                    onChangeText={username => {
                      this.setState({
                        money: username
                      });
                    }}
                    value={money + ""}
                    placeholderTextColor="#888"
                  />
                ) : (
                  <Input
                    className="lifeCostCreate-bottomBox-inputBox-price"
                    type="digit"
                    placeholder="点击输入充值金额"
                    onInput={this.changeVal.bind(this)}
                    value={money}
                  />
                )}
              </View>
              <View
                className="lifeCostCreate-bottomBox-btn"
                onClick={() => {
                  this.handleSubmit();
                }}
              >
                立即充值
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
