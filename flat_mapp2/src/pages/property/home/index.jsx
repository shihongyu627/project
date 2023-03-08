import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { IndexHeader, AgreementModal, TextLabel } from "@component";
import menuNine from "@assets/image/menuNine.png";
import menuTen from "@assets/image/menuTen.png";
import menuEle from "@assets/image/menuEle.png";
import menuTw from "@assets/image/menuTw.png";
import common_bg from "@assets/image/common_bg.png";
import loginIcon from "@assets/image/auth_icon.png";
import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabbarList: [
        {
          name: "保洁预约",
          icon: menuNine,
          url: "/pages/property/list/index?type=1&title=保洁预约记录"
        },
        {
          name: "报修预约",
          icon: menuTen,
          url: "/pages/property/list/index?type=2&title=报修预约记录"
        },
        {
          name: "公共设施预约",
          icon: menuEle,
          url: "/pages/property/list/index?type=3&title=公共设施预约记录"
        },
        {
          name: "拜访预约",
          icon: menuTw,
          url: "/pages/property/list/index?type=4&title=拜访预约记录"
        }
      ],
      listName: [],
      listData: [],
      name: "",
      userInfo: {},
      flatId: "",
      showModal: false
    };
  }
  componentDidMount() {
    // Taro.hideTabBar()//隐藏tabbar
    // 小程序设置状态栏字体颜色
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    if (process.env.TARO_ENV === "rn") {
      let { NativeModules } = require("react-native");
      setTimeout(
        () => {
          NativeModules.RNBootSplash.hide(true); // 隐藏启动屏
        },
        process.env.NODE_ENV === "development" ? 200 : 1500
      );
    }
    Taro.eventCenter.on("refreshDevice", val => {
      // this.setState({
      //   list: []
      // });
    });
    this.load();
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshDevice");
  }
  componentDidShow() {
    let userInfo = $utils.data.get("userInfo");
    global.firstModal = 1;
    this.setState({
      userInfo,
      showModal: true,
      name: $utils.data.get("flatName") || "请选择公寓",
      flatId: $utils.data.get("flatId") || ""
    });
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

  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    $utils.api
      .load("flatnoPageList", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let v = res.rows || [];
          console.log(v);
          let listName = [];
          v.map(item => {
            listName.push(item.name);
          });
          // let flatId = "";
          // let name = "请选择公寓";
          // if (v && v.length > 0) {
          //   let cc = v[0];
          //   name = cc.name || "";
          //   flatId = cc.id || "";
          // }
          // $utils.data.set("flatId", flatId);
          this.setState({
            listName,
            listData: v
            // name,
            // flatId
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.load();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  //选择公寓
  selectIndex = data => {
    let { listData } = this.state;
    if (listData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(listData[data], "传过来的索引取类型值");
    let obj = listData[data];
    let name = obj.name;
    let flatId = obj.id;
    $utils.data.set("flatId", flatId);
    $utils.data.set("flatName", name);
    this.setState({
      name,
      flatId
    });
  };
  //弹窗协议
  onLeftBtn = () => {
    this.setState({
      showModal: false
    });
  };
  onRightBtn = () => {
    this.setState(
      {
        showModal: false
      },
      () => {
        $utils.data.set("showPropertyModal", true);
      }
    );
  };
  //分享好友
  onShareAppMessage(e) {
    let path = `pages/index/index`;
    return {
      title: `公寓`,
      path: path,
      imageUrl: "",
      success: function(res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  }
  //分享朋友圈
  onShareTimeline(e) {
    let path = `pages/index/index`;
    return {
      title: `公寓`,
      path: path,
      imageUrl: "",
      success: function(res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  }
  loginOutClick = () => {
    $utils.toast.islogoutModal();
  };
  render() {
    let { tabbarList, name, showModal, userInfo, flatId } = this.state;
    return (
      <View className='index'>
        <View className='index-topbg'>
          <View className='index-topbg-bg'>
            <Image
              className='index-topbg-bg-img'
              src={common_bg}
              mode='aspectFill'
            />

            <View className='index-topbg-bg-Box'>
              {/* 头部 */}
              {global.isLogin ? (
                <IndexHeader
                  title={name}
                  listName={this.state.listName}
                  selectIndex={this.selectIndex}
                />
              ) : (
                <View className='index-topbg-bg-Box-loginBr'></View>
              )}
              <View
                className='index-topbg-bg-Box-content'
                onClick={() => {
                  if (global.isLogin) {
                    return;
                  }
                  Taro.navigateTo({
                    url: "/pages/auth/index"
                  });
                }}
              >
                <Image
                  className='index-topbg-bg-Box-content-img'
                  src={global.$utils.loadimg.load(
                    global.isLogin ? userInfo.avatar : loginIcon
                  )}
                  mode='aspectFill'
                />
                <View className='index-topbg-bg-Box-content-info'>
                  <View className='index-topbg-bg-Box-content-info-name'>
                    {global.isLogin ? userInfo.nickName : "登录/注册"}
                  </View>
                  {global.isLogin ? (
                    <View className='index-topbg-bg-Box-content-info-text'>
                      {userInfo.phonenumber}
                    </View>
                  ) : null}
                </View>
              </View>
              {global.isLogin ? (
                <View className='index-changeBox'>
                  <View
                    className='index-changeBox-title'
                    onClick={() => {
                      this.loginOutClick();
                    }}
                  >
                    切换账号
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          {/* 菜单栏 */}
          <View className='index-tabbar'>
            {tabbarList.map((item, index) => (
              <View
                key={index}
                className='index-tabbar-item'
                onClick={() => {
                  if (!global.isLogin) {
                    $utils.toast.isLoginModal();
                    return;
                  }
                  if (!item.url) {
                    global.$utils.toast.text("暂未开放");
                    return;
                  }
                  if (!flatId) {
                    global.$utils.toast.text("请选择公寓");
                    return;
                  }
                  Taro.navigateTo({
                    url: item.url
                  });
                }}
              >
                <Image
                  // src={global.$utils.loadimg.load(item)}
                  className='index-tabbar-item-img'
                  src={item.icon}
                  mode='aspectFill'
                />
                <View className='index-tabbar-item-name'>{item.name}</View>
              </View>
            ))}
          </View>
        </View>
        {!$utils.data.get("showPropertyModal") ? (
          <AgreementModal
            title='用户协议和隐私政策'
            leftBtnTxt='不同意并退出'
            rightBtnTxt='同意'
            type='input'
            onRightBtn={this.onRightBtn}
            onLeftBtn={this.onLeftBtn}
            show={showModal}
          ></AgreementModal>
        ) : null}
      </View>
    );
  }
}

export default Index;
