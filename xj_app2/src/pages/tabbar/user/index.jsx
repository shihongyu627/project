import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Text } from "@tarojs/components";
import "./index.scss";
import rightPng from "@assets/image/user_right.png";
import addressPng from "@assets/image/address.png";
import recordPng from "@assets/image/record.png";
import useraboutPng from "@assets/image/userabout.png";
import usertelPng from "@assets/image/usertel.png";
import userRecordPng from "@assets/image/userRecord.png";
import userProjectPng from "@assets/image/userProject.png";
import { loginSuccess } from "../../../store/actions/user";
import useravatar from "@assets/image/useravatar.png";
import store from "../../../store";
import { ItemUserList } from "@component";
import { connect } from "react-redux";
export default class Index extends Component {
  state = {
    menuTwo: [
      {
        title: "管辖项目",
        url: "/pages/user/project/index?title=管辖项目",
        image: userProjectPng,
        is_login: true
      },
      {
        title: "隐患记录",
        url: "/pages/record/list/index",
        image: recordPng,
        is_login: true
      },
      {
        title: "关于我们",
        url: "/pages/user/about/index",
        image: useraboutPng
      },
      {
        title: "客服电话",
        url: "",
        image: usertelPng,
        phone: false
      }
    ],
    userInfo: {}
  };

  componentDidMount() {
    this.loadData();
  }
  componentWillUnmount() {}
  componentDidShow() {
    this.commonConfig();
  }
  //下拉刷新
  onPullDownRefresh = () => {
    this.loadData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  loadData = async () => {
    await $utils.auth.checklogin();
    this.commonConfig();
    if (!global.isLogin) {
      $utils.toast.loginModal();
      return;
    }
  };
  commonConfig = () => {
    let userInfo = store.getState().user || {};
    let siteInfo = $utils.data.get("siteInfo") || {};
    let menuTwo = [
      {
        title: "管辖项目",
        url: "/pages/user/project/index?title=管辖项目",
        image: userProjectPng,
        is_login: true
      },
      {
        title: "隐患记录",
        url: "/pages/record/list/index",
        image: recordPng,
        is_login: true
      },
      {
        title: "关于我们",
        url: "/pages/user/about/index",
        image: useraboutPng
      },
      {
        title: "客服电话",
        url: "",
        image: usertelPng,
        phone: siteInfo.kefu_mobile?.value || false
      }
    ];
    //针对工地端以及巡检段，user_type为2是巡检 1是工地
    this.setState({
      userInfo,
      menuTwo
    });
  };
  render() {
    let { menuOne, menuTwo, userInfo } = this.state;
    console.log(userInfo);
    return (
      <View className="userBox">
        <View className="userBox-header">
          {global.isLogin ? (
            <View className="userBox-header-top">
              <Image
                src={
                  userInfo.user_head
                    ? global.$utils.loadimg.load(userInfo && userInfo.user_head)
                    : useravatar
                }
                className="userBox-header-top-img"
                mode="aspectFill"
                onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/user/info/index"
                  });
                }}
              />
              <View
                className="userBox-header-top-right"
                onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/user/info/index"
                  });
                }}
              >
                <View className="userBox-header-top-right-name">
                  {(userInfo && userInfo.user_nick) || ""}
                </View>
                <View className="userBox-header-top-right-bottom">
                  <View className="userBox-header-top-right-text">
                    {(userInfo && userInfo.user_type_name) || ""}
                  </View>
                  <View className="userBox-header-top-right-br"></View>
                  <View className="userBox-header-top-right-text">
                    {(userInfo && userInfo.team_name) || ""}
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="userBox-header-top">
              <View
                className="userBox-header-top-loginName"
                onClick={() => {
                  Taro.reLaunch({
                    url: "/pages/auth/index"
                  });
                }}
              >
                登录/注册
              </View>
            </View>
          )}
        </View>
        <View className="userBox-menuBox">
          {menuTwo.map((item, index) => (
            <ItemUserList info={item} index={index}></ItemUserList>
          ))}
        </View>
      </View>
    );
  }
}
