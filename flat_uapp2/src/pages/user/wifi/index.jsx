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

import { AtNavBar, CommonSelect } from "@component";
import { getWindowHeight } from "@utils/style";
import commonBgPng from "@assets/image/common_bg.png";
import wifiInfo_icon from "@assets/image/wifiInfo_icon.png";
import wifi_change from "@assets/image/wifi_change.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      listName: [],
      listData: [],
      roomName: "",
      roomId: ""
    };
  }
  componentDidMount() {
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    this.roomnoPageList();
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
          let listData = res.rows || [];
          let listName = [];
          listData.map(item => {
            listName.push(item.name);
          });
          let roomId = "";
          let roomName = "请切换房间";
          if (listData && listData.length > 0) {
            let cc = listData[0];
            roomName = cc.name || "";
            roomId = cc.id || "";
          }
          this.setState(
            {
              listData,
              listName,
              roomName,
              roomId
            },
            () => {
              this.load();
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
    d.id = this.state.roomId;
    let url = `${global.base_host}/customer/flat/wifi/${this.state.roomId}`;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let detail = res.data || {};
          console.log(res);
          this.setState({
            detail
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
  //选择类型
  selectIndex = data => {
    let { listData } = this.state;
    if (listData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(listData[data], "传过来的索引取类型值");
    let obj = listData[data];
    let roomName = obj.name;
    let roomId = obj.id;
    this.setState(
      {
        roomName,
        roomId,
        detail: {}
      },
      () => {
        this.load();
      }
    );
  };
  render() {
    let { detail, roomName, listName } = this.state;
    return (
      <View className='WIFIBox'>
        <View className='WIFIBox-header'>
          <Image
            className='WIFIBox-header-img'
            src={commonBgPng}
            mode='aspectFill'
          />
          <View className='WIFIBox-header-content'>
            <AtNavBar
              title='WIFI信息'
              background='rgba(0, 0, 0, 0)'
              color='#fff'
              onClick={() => {
                Taro.navigateBack();
              }}
            ></AtNavBar>
            <View className='WIFIBox-contentbox'>
              <Image
                className='WIFIBox-contentbox-img'
                src={wifiInfo_icon}
                mode='aspectFill'
              />
              <View className='WIFIBox-contentbox-address'>{roomName}</View>
              <View className='WIFIBox-contentbox-changeBox'>
                <Image
                  className='WIFIBox-contentbox-changeBox-img'
                  src={wifi_change}
                  mode='aspectFill'
                />
                {/* <View className="WIFIBox-contentbox-changeBox-text">切换</View> */}
                <CommonSelect
                  listName={listName}
                  selectIndex={this.selectIndex}
                  className='WIFIBox-contentbox-changeBox-text'
                  title='切换'
                ></CommonSelect>
              </View>
              <View className='WIFIBox-contentbox-wrapper'>
                <View className='WIFIBox-contentbox-wrapper-title'>账号</View>
                <View className='WIFIBox-contentbox-wrapper-text'>
                  {detail.account}
                </View>
                <View className='WIFIBox-contentbox-wrapper-title WIFIBox-contentbox-wrapper-titles'>
                  密码
                </View>
                <View className='WIFIBox-contentbox-wrapper-text'>
                  {detail.passwork}
                  {detail.passwork ? (
                    <View
                      className='WIFIBox-contentbox-wrapper-btn'
                      onClick={() => {
                        if (!detail.passwork) {
                          return;
                        }
                        Taro.setClipboardData({
                          data: detail.passwork,
                          success: function(res) {
                            Taro.getClipboardData({
                              success: function(res) {
                                console.log(res.data); // data
                              }
                            });
                          }
                        });
                      }}
                    >
                      点击复制
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
