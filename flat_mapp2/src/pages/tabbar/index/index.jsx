import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { IndexHeader, BoxEmpty, AgreementModal } from "@component";
import menuOne from "@assets/image/menuOne.png";
import menuTwo from "@assets/image/menuTwo.png";
import menuThree from "@assets/image/menuThree.png";
import menuFour from "@assets/image/menuFour.png";
import menuFive from "@assets/image/menuFive.png";
import menuSix from "@assets/image/menuSix.png";
import menuSeven from "@assets/image/menuSeven.png";
import menuEight from "@assets/image/menuEight.png";
import menuNine from "@assets/image/menuNine.png";
import menuTen from "@assets/image/menuTen.png";
import menuEle from "@assets/image/menuEle.png";
import menuTw from "@assets/image/menuTw.png";
import common_bg from "@assets/image/common_bg.png";
import loginIcon from "@assets/image/icon_app.png";
import setPng from "@assets/image/setPng.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabbarList: [
        {
          name: "我的客户",
          icon: menuOne,
          url: "/pages/butler/home/customer/index"
        },
        {
          name: "合同管理",
          icon: menuTwo,
          url: "/pages/butler/home/agreement/list/index"
        },
        {
          name: "预约带看",
          icon: menuThree,
          url: "/pages/butler/home/takeLook/index"
        },
        {
          name: "发起签约",
          icon: menuFour,
          url: "/pages/butler/home/InitiateSign/index"
        },
        {
          name: "待签约",
          icon: menuFive,
          url: "/pages/butler/home/agreement/order/index?status=0&title=待签约"
        },
        {
          name: "履行中",
          icon: menuSix,
          url: "/pages/butler/home/agreement/order/index?status=1&title=履行中"
        },
        {
          name: "已完成",
          icon: menuSeven,
          url: "/pages/butler/home/agreement/order/index?status=2&title=已完成"
        },
        {
          name: "交易流水",
          icon: menuEight,
          url: "/pages/butler/home/trade/index"
        },
        {
          name: "保洁预约",
          icon: menuNine,
          url: "/pages/butler/home/view/record/index?type=1&title=保洁预约记录"
        },
        {
          name: "报修预约",
          icon: menuTen,
          url: "/pages/butler/home/view/record/index?type=2&title=报修预约记录"
        },
        {
          name: "公共设施预约",
          icon: menuEle,
          url:
            "/pages/butler/home/view/record/index?type=3&title=公共设施预约记录"
        },
        {
          name: "拜访预约",
          icon: menuTw,
          url: "/pages/butler/home/view/record/index?type=4&title=拜访预约记录"
        }
      ],
      listName: [],
      listData: [],
      name: "",
      userInfo: {},
      flatId: "",
      showModal: false,
      agreeModal: false //协议弹窗控制
    };
  }
  componentDidMount() {
    // Taro.hideTabBar()//隐藏tabbar
    // 小程序设置状态栏字体颜色
    global.firstModal = 1;
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
      let NetInfo = require("@react-native-community/netinfo").default;
      this.tt = setInterval(() => {
        NetInfo.fetch()
          .then(state => {
            console.log({ "网络状态1+++++++++++++++++++": state.isConnected });
            if (state.isConnected) {
              clearInterval(this.tt);
              this.load();
              this.setMenu();
            }
            // console.log('Is connected?', state.isConnected) //如果存在活动的网络连接。请注意，这并不意味着可以访问互联网
          })
          .catch(err => {
            console.log(err, "xxxxx");
          });
      }, 500);
    }
    this.setMenu();
    Taro.eventCenter.on("refreshMenuList", val => {
      if (val) {
        this.setMenu();
      }
    });
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshMenuList");
  }
  componentDidHide() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("dark-content");
    }
  }
  componentDidShow() {
    this.setState({
      showModal: true,
      name: $utils.data.get("flatName") || "请选择公寓",
      flatId: $utils.data.get("flatId") || "",
      agreeModal: $utils.data.get("showAdminModal")
    });
    this.load();
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("light-content");
    }
  }
  setMenu = () => {
    let userType = $utils.data.get("userType");
    let { tabbarList } = this.state;
    if (userType == "PROPERTY") {
      tabbarList = [
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
      ];
    } else {
      tabbarList = [
        {
          name: "我的客户",
          icon: menuOne,
          url: "/pages/butler/home/customer/index"
        },
        {
          name: "合同管理",
          icon: menuTwo,
          url: "/pages/butler/home/agreement/list/index"
        },
        {
          name: "预约带看",
          icon: menuThree,
          url: "/pages/butler/home/takeLook/index"
        },
        {
          name: "发起签约",
          icon: menuFour,
          url: "/pages/butler/home/InitiateSign/index"
        },
        {
          name: "待签约",
          icon: menuFive,
          url: "/pages/butler/home/agreement/order/index?status=0&title=待签约"
        },
        {
          name: "履行中",
          icon: menuSix,
          url: "/pages/butler/home/agreement/order/index?status=1&title=履行中"
        },
        {
          name: "已完成",
          icon: menuSeven,
          url: "/pages/butler/home/agreement/order/index?status=2&title=已完成"
        },
        {
          name: "交易流水",
          icon: menuEight,
          url: "/pages/butler/home/trade/index"
        },
        {
          name: "保洁预约",
          icon: menuNine,
          url: "/pages/butler/home/view/record/index?type=1&title=保洁预约记录"
        },
        {
          name: "报修预约",
          icon: menuTen,
          url: "/pages/butler/home/view/record/index?type=2&title=报修预约记录"
        },
        {
          name: "公共设施预约",
          icon: menuEle,
          url:
            "/pages/butler/home/view/record/index?type=3&title=公共设施预约记录"
        },
        {
          name: "拜访预约",
          icon: menuTw,
          url: "/pages/butler/home/view/record/index?type=4&title=拜访预约记录"
        }
      ];
    }
    this.setState({
      tabbarList
    });
  };
  load = () => {
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
          // if (v && v.length > 0) {
          //   let cc = v[0];
          //   name = cc.name || "";
          //   flatId = cc.id || "";
          // }
          // $utils.data.set("flatId", flatId);
          this.setState({
            listName,
            listData: v
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    let userInfo = $utils.data.get("userInfo");
    this.setState({
      userInfo
    });
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.load();
    global.$utils.auth.getInfo();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
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
        $utils.data.set("showAdminModal", true);
      }
    );
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
    this.setState(
      {
        name,
        flatId
      },
      () => {
        // Taro.eventCenter.trigger("refreshCustomerList", true); //我的用户
        // Taro.eventCenter.trigger("refreshTakeLookList", true); //预约带看
        // Taro.eventCenter.trigger("refreshViewRecord", true); //预约记录
        // Taro.eventCenter.trigger("refreshAgreementList", true); //合同列表
        // Taro.eventCenter.trigger("refreshAgreementOrder", true); //合同状态列表
        // Taro.eventCenter.trigger("refreshTradeList", true); //合同状态交易流水列表
        Taro.eventCenter.trigger("refreshNewsList", true); //合同状态交易流水列表
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
    let {
      tabbarList,
      name,
      showModal,
      userInfo,
      flatId,
      agreeModal
    } = this.state;
    return (
      <View className="index">
        <View className="index-topbg">
          <View className="index-topbg-bg">
            <Image
              className="index-topbg-bg-img"
              src={common_bg}
              mode="aspectFill"
            />
            <Image
              className="index-topbg-bg-setPng"
              src={setPng}
              mode="aspectFill"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/about/index"
                });
              }}
            />
            <View className="index-topbg-bg-Box">
              {/* 头部 */}
              {global.isLogin ? (
                <IndexHeader
                  title={name}
                  listName={this.state.listName}
                  selectIndex={this.selectIndex}
                />
              ) : (
                <View className="index-topbg-bg-Box-loginBr"></View>
              )}
              <View
                className="index-topbg-bg-Box-content"
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
                  className="index-topbg-bg-Box-content-img"
                  src={
                    global.isLogin
                      ? global.$utils.loadimg.load(userInfo.avatar)
                      : loginIcon
                  }
                  mode="aspectFill"
                />
                <View className="index-topbg-bg-Box-content-info">
                  <View className="index-topbg-bg-Box-content-info-name">
                    {global.isLogin ? userInfo.nickName : "登录/注册"}
                  </View>
                  {global.isLogin ? (
                    <View className="index-topbg-bg-Box-content-info-text">
                      {userInfo.phonenumber}
                    </View>
                  ) : null}
                </View>
              </View>
              {global.isLogin ? (
                <View className="index-changeBox">
                  <View
                    className="index-changeBox-title"
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
          <View className="index-tabbar">
            {tabbarList.map((item, index) => (
              <View
                key={index}
                className="index-tabbar-item"
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
                  className="index-tabbar-item-img"
                  src={item.icon}
                  mode="aspectFill"
                />
                <View className="index-tabbar-item-name">{item.name}</View>
              </View>
            ))}
          </View>
        </View>
        {!agreeModal && global.firstModal == 1 ? (
          <AgreementModal
            title="用户协议和隐私政策"
            leftBtnTxt="不同意并退出"
            rightBtnTxt="同意"
            type="input"
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
