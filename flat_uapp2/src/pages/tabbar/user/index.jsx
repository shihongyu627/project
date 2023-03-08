import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image } from "@tarojs/components";
import "./index.scss";
import { BoxEmpty, CommonSelect } from "@component";
import commonBgPng from "@assets/image/common_bg.png";
import user_bgPng from "@assets/image/user_bg.png";
import agreementPng from "@assets/image/agreement_icon.png";
import billPng from "@assets/image/bill_icon.png";
import adminPng from "@assets/image/admin_icon.png";
import cardPng from "@assets/image/card_icon.png";
import wifiPng from "@assets/image/wifi_icon.png";
import doorPng from "@assets/image/door_icon.png";
import invoicePng from "@assets/image/invoice_icon.png";
import costPng from "@assets/image/cost_icon.png";
import viewPng from "@assets/image/view_icon.png";
import feekPng from "@assets/image/feek_icon.png";
import askPng from "@assets/image/ask_icon.png";
import kefuPng from "@assets/image/kefu_icon.png";
import loginIcon from "@assets/image/auth_phone.png";
import cleanIcon from "@assets/image/cleanIcon.png";
import repairIcon from "@assets/image/repairIcon.png";
import deviceIcon from "@assets/image/deviceIcon.png";
import visitorIcon from "@assets/image/visitorIcon.png";
import retreatRentIcon from "@assets/image/retreatRentIcon.png";
import retreatIcon from "@assets/image/retreatIcon.png";
import userAbout from "@assets/image/userAbout.png";

export default class Index extends Component {
  state = {
    menuOne: [
      {
        title: "合同管理",
        image: agreementPng,
        url: "/pages/user/agreement/list/index"
      },
      {
        title: "账单管理",
        image: billPng,
        url: "/pages/user/bill/history/index"
      },
      {
        title: "联系管家",
        image: adminPng,
        url: "/pages/user/admin/index"
      }
    ],
    menuTwo: [
      {
        title: "我的服务",
        list: [
          {
            title: "身份信息",
            image: cardPng,
            url: "/pages/user/cardInfo/list/index"
          },
          {
            title: "WiFi信息",
            image: wifiPng,
            url: "/pages/user/wifi/index"
          },
          {
            title: "门锁信息",
            image: doorPng,
            url: "/pages/user/doorLock/list/index"
          },
          {
            title: "发票管理",
            image: invoicePng,
            url: "/pages/user/invoice/list/index"
          },
          {
            title: "生活缴费",
            image: costPng,
            url: "/pages/user/lifeCost/list/index"
          },
          {
            title: "我要退租",
            image: retreatIcon,
            url: "/pages/user/retreatRent/create/index"
          },
          {
            title: "退租记录",
            image: retreatRentIcon,
            url: "/pages/user/retreatRent/list/index"
          },
          {
            title: "预约看房",
            image: viewPng,
            url: "/pages/home/houseView/record/index?title=预约看房"
          },
          {
            title: "保洁预约",
            image: cleanIcon,
            url: "/pages/user/viewRecord/list/index?type=1&title=保洁预约"
          },
          {
            title: "报修预约",
            image: repairIcon,
            url: "/pages/user/viewRecord/list/index?type=2&title=报修预约"
          },
          {
            title: "公共设施预约",
            image: deviceIcon,
            url: "/pages/user/viewRecord/list/index?type=3&title=公共设施预约"
          },
          {
            title: "拜访预约",
            image: visitorIcon,
            url: "/pages/user/viewRecord/list/index?type=4&title=拜访预约"
          }
        ]
      },
      {
        title: "其他服务",
        list: [
          {
            title: "意见反馈",
            image: feekPng,
            url: "/pages/user/feedBack/index",
            isOpen: true
          },
          {
            title: "常见问题",
            image: askPng,
            url: "/pages/user/dailyAsk/index",
            isOpen: true
          },
          {
            title: "服务电话",
            image: kefuPng,
            url: "kefu",
            isOpen: true
          },
          {
            title: "关于我们",
            image: userAbout,
            url: "/pages/user/about/index",
            isOpen: true
          }
        ]
      }
    ],
    actions: [],
    show: false,
    userInfo: {},
    height: 667,
  };

  componentDidMount() {
    if (process.env.TARO_ENV !== "rn") {
      // 小程序设置状态栏字体颜色
      Taro.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#ffffff"
      });
    }
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState(
      {
        height: windowHeight
      },
      () => {
        this.load();
      }
    );
  }
  componentDidShow() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("light-content");
    }
    let userInfo = $utils.data.get("userInfo") || {};
    this.setState({
      userInfo
    });
  }
  componentDidHide() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("dark-content");
    }
  }
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let url = `${global.base_host}/customer/customer/config/configKey/SERVICE`;
    global.$utils.api
      .load(url, d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let data = res.msg || "";
          if (!data) {
            return;
          }
          let actions = data.split(",");
          if (process.env.TARO_ENV === "rn") {
            actions.map((item, index) => {
              item.label = item;
              item.value = index + 1;
            });
          }
          this.setState({
            actions
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1000);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.load();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  render() {
    let { menuOne, menuTwo, actions, userInfo, height } = this.state;
    let RnActionsheet = null;
    if (process.env.TARO_ENV === "rn") {
      let { Actionsheet } = require("beeshell");
      RnActionsheet = Actionsheet;
    }
    return (
      <View className="userBox">
        <ScrollView className="scrollDom" scrollY lowerThreshold={90}>
          <View className="userBox-header">
            <Image
              className="userBox-header-img"
              src={commonBgPng}
              mode="aspectFill"
            />
            <View className="userBox-header-content">
              <View
                className="userBox-header-content-userInfo"
                onClick={() => {
                  if (userInfo.userId) {
                    Taro.navigateTo({
                      url: "/pages/user/info/index"
                    });
                    return;
                  }
                  Taro.navigateTo({
                    url: "/pages/auth/index"
                  });
                }}
              >
                <Image
                  className="userBox-header-content-userInfo-img"
                  src={global.$utils.loadimg.load(
                    userInfo.avatar ? userInfo.avatar : loginIcon
                  )}
                  mode="aspectFill"
                />
                <View className="userBox-header-content-userInfo-right">
                  {userInfo.nickName ? (
                    <View className="userBox-header-content-userInfo-right-name">
                      {userInfo.nickName}
                    </View>
                  ) : (
                    <View className="userBox-header-content-userInfo-right-name">
                      登录/注册
                    </View>
                  )}
                  <View className="userBox-header-content-userInfo-right-address">
                    {userInfo.isReal == 1 ? "已认证" : "未认证"}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="userBox-menuBox">
            <Image
              className="userBox-menuBox-bg"
              src={user_bgPng}
              mode="aspectFill"
            />
            <View className="userBox-menuBox-content">
              {menuOne.map((item, index) => (
                <View
                  className="userBox-menuBox-content-item"
                  key={index}
                  onClick={() => {
                    if (!userInfo.userId) {
                      $utils.toast.isLoginModal();
                      return;
                    }
                    Taro.navigateTo({
                      url: item.url
                    });
                  }}
                >
                  <Image
                    className="userBox-menuBox-content-item-icon"
                    src={item.image}
                    mode="aspectFill"
                  />
                  <View className="userBox-menuBox-content-item-title">
                    {item.title}
                  </View>
                </View>
              ))}
            </View>
          </View>
          {menuTwo.map((item, index) => (
            <View className="userBox-menuBoxTwo" key={index}>
              <View className="userBox-menuBoxTwo-title">{item.title}</View>
              <View className="userBox-menuBoxTwo-content">
                {item.list &&
                  item.list.map((menu, mindex) => (
                    <View
                      className="userBox-menuBoxTwo-content-item"
                      key={mindex}
                      onClick={() => {
                        if (menu.url == "kefu") {
                          if (process.env.TARO_ENV === "rn") {
                            this._actionsheet.open();
                          } else {
                            Taro.showActionSheet({
                              itemList: actions,
                              success: function(res) {
                                console.log(res.tapIndex);
                                let tel = actions[res.tapIndex] || "";
                                if (!tel) {
                                  return;
                                }
                                Taro.makePhoneCall({
                                  phoneNumber: tel //仅为示例，并非真实的电话号码
                                });
                              },
                              fail: function(res) {
                                console.log(res.errMsg);
                              }
                            });
                          }
                          return;
                        }
                        if (!userInfo.userId && !menu.isOpen) {
                          $utils.toast.isLoginModal();
                          return;
                        }
                        Taro.navigateTo({
                          url: menu.url
                        });
                      }}
                    >
                      <Image
                        className="userBox-menuBoxTwo-content-item-icon"
                        src={menu.image}
                        mode="aspectFill"
                      />
                      <View className="userBox-menuBoxTwo-content-item-title">
                        {menu.title}
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          ))}
          {process.env.TARO_ENV === "rn" ? (
            <RnActionsheet
              ref={c => {
                this._actionsheet = c;
              }}
              data={actions}
              cancelable
              header="服务电话"
              offsetY={height + 20}
              useSafeAreaView
              onPressConfirm={item => {
                console.log("confirm", item);
                if (!item) {
                  return;
                }
                Taro.makePhoneCall({
                  phoneNumber: item //仅为示例，并非真实的电话号码
                });
              }}
              onPressCancel={() => {
                console.log("cancel");
              }}
            ></RnActionsheet>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}
