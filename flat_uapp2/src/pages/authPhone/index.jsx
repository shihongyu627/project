import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import { Checkbox } from "@component";
import weapp_icon from "@assets/image/tel.png";
import auth_phone from "@assets/image/auth_phone.png";

let Platform = null;
let JVerification = null;

if (process.env.TARO_ENV === "rn") {
  let RN = require("react-native");
  Platform = RN.Platform;
  JVerification = require("jverification-react-native").default;
  // 注册一键手机号登录页面
  // let authView = require("./authView").default;
  // RN.AppRegistry.registerComponent('authView', () => authView);
}
//安卓授权页弹窗模式
const androidDialogConfig = {
  privacyNeedClose: true, //弹窗是否需要关闭按钮
  privacyCloseTheme: [10, 60, 2, 2], //弹窗关闭按钮偏移量 privacyNeedClose为true时，必须设置它的偏移量
  privacyDialogTheme: [300, 340, 0, 0, false], //授权页弹窗模式
  privacyNeedStartAnim: true, //设置拉起授权页时是否需要显示默认动画 默认展示
  privacyNeedCloseAnim: true, //设置关闭授权页时是否需要显示默认动画 默认展示
  logoHidden: false,
  numberY: 50,
  sloganY: 62,
  navColor: 0xff000000,
  loginBtnText: " 当前手机号一键登录 ",
  loginBtnOffsetY: 75,
  privacyOffsetY: 10,
  privacyCheckboxHidden: true,
  privacyCheckEnable: true,
  privacyColor: [0xff00f000, 0xff000000],
  loginBtnWidth: 60,
  privacyOne: ["隐私条款一", "https://www.jiguang.cn/about"], //隐私条款一（显示名称和url，请严格按照格式）
  privacyColor: [-16777216, -65536], //隐私条款颜色 （显示名称和url的颜色，请严格按照格式）
  privacyText: ["登录即同意", "并用本机号码登录", "、", "并使用本机号码登录"], //隐私条款名称外的文字
  privacyTextSize: 11,
  privacyTextGravityMode: "center"
};
//ios授权页弹窗模式
const iosDialogConfig = {
  navHidden: true, //导航栏是否隐藏
  logoImage: "umcsdk_mobile_logo", //logo(android默认为应用图标;ios默认无)
  logoConstraints: [0, -100, 60, 60], //LOGO图片布局对象
  logoHidden: false, //logo是否隐藏
  numberConstraints: [0, -42, 200, 14], //号码栏布局对象
  sloganConstraints: [0, -20, 200, 14], //slogan布局对象
  logBtnConstraints: [0, 20, 220, 40],
  loginBtnText: " 一键登录 ", //登录按钮文字
  loginBtnTextSize: 16, //登录按钮字体大小
  loginBtnTextColor: -16777216, //登录按钮文字颜色
  privacyConstraints: [0, 100, 200, 60], //隐私条款布局对象
  checkViewConstraints: [-108, 100, 10, 10], //checkBox布局对象

  loadingConstraints: [0, 0, 20, 20],
  showWindow: true, // 是否弹窗，默认no
  //windowBackgroundImage:"bg", // 弹框内部背景图片
  windowBackgroundAlpha: 0.3, //弹窗外侧 透明度 0~1.0
  windowCornerRadius: 10, //弹窗圆角数值
  windowConstraints: [0, 0, 300, 300], //弹窗布局对象
  windowCloseBtnImgs: ["windowClose", "windowClose"], //弹窗close按钮图片 @[普通状态图片，高亮状态图片]
  windowCloseBtnConstraints: [-135, -135, 20, 20] //弹窗close按钮布局,
};

const customViewParams = [
  { customViewName: "", customViewPoint: [20, 200, 150, 30] }
];

export default class Index extends Component {
  state = {
    phone: "",
    logining: false,
    checked: false,
    loginEnable: false
  };

  componentDidMount() {
    // 极光认证加载
    this.initJAuth();
    // this.getIspPhone();
  }

  // 极光认证加载
  initJAuth() {
    if (process.env.TARO_ENV === "rn") {
      // 极光认证配置
      const initParams = {
        time: 5000,
        appKey: global.jpush_appkey, //仅iOS
        channel: global.jpush_channel, //仅iOS
        advertisingId: "advertisingId", //仅iOS
        isProduction: false //仅iOS
      };
      // 极光认证监听
      JVerification.setLoggerEnable(true);
      this.LoginListener = result => {
        console.log("LoginListener:" + JSON.stringify(result));
        Taro.hideLoading();
        this.setState({
          logining: false
        });
        console.log(result.content, 9999998888);
        // 授权成功 operator以前是CU result.operator == "CM" &&
        if (result.code == 6000) {
          if (result.content) {
            this.ispLogin(result.content);
            return;
          }
        } else {
          // 提示
          switch (result.code) {
            case 4031:
            case 4032:
            case 4033:
              $utils.toast.error("获取不到配置" + result.code);
              break;
            case 5000:
              $utils.toast.error("服务器未知错误");
              break;
            case 6001:
              $utils.toast.error("获取LoginToken失败");
              break;
            case 6002:
              $utils.toast.error("用户取消认证");
              break;
            case 6004:
              $utils.toast.error("正在登录中，稍后再试");
              break;
            case 7002:
              $utils.toast.error("正在预取号中，稍后再试");
              break;
            default:
              // $utils.toast.error("服务器未知错误" + result.code);
              break;
          }
          return;
        }
      };
      // 初始化
      JVerification.init(initParams, result => {
        console.log("init:" + JSON.stringify(result));

        // 检测是否可以认证
        JVerification.checkLoginEnable(result1 => {
          console.log("checkLoginEnable:" + JSON.stringify(result1));
          if (result1.enable) {
            this.setState({
              loginEnable: result1.enable
            });
            // 认证弹窗配置
            if (Platform.OS == "android") {
              JVerification.addLoginCustomConfig(
                androidDialogConfig,
                customViewParams
              );
            } else {
              JVerification.addLoginCustomConfig(
                iosDialogConfig,
                customViewParams
              );
            }
          }

          JVerification.preLogin(10000, result2 => {
            console.log("preLogin:" + JSON.stringify(result2));
          });
        });
      });
      JVerification.removeListener(this.LoginListener);
      JVerification.addLoginEventListener(this.LoginListener);
    }
  }
  // 移除暂不需要
  // getIspPhone = () => {
  //   Taro.showLoading({
  //     title: "loading"
  //   });
  //   let d = {};
  //   d.ispToken = "1";
  //   global.$utils.api
  //     .load("getIspPhone", d, "get", false)
  //     .then(res => {
  //       if (res.code == 200) {
  //         this.setState({
  //           phone: res.data.phone
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  //   setTimeout(() => {
  //     Taro.hideLoading();
  //   }, 1500);
  // };

  // 授权弹窗
  authLogin = async () => {
    if (!this.state.checked) {
      return $utils.toast.text("请先阅读并同意用户服务协议");
    }
    if (this.state.logining) {
      return;
    }
    this.setState({
      logining: true
    });
    console.log("loginEnable ", this.state.loginEnable);
    // 调起极光认证
    if (process.env.TARO_ENV === "rn") {
      Taro.hideLoading();
      Taro.showLoading({
        title: "手机号识别中"
      });
      // 检测是否可以认证
      if (this.state.loginEnable) {
        try {
          // 认证弹窗配置
          if (Platform.OS == "android") {
            JVerification.addLoginCustomConfig(
              androidDialogConfig,
              customViewParams
            );
          } else {
            JVerification.addLoginCustomConfig(
              iosDialogConfig,
              customViewParams
            );
          }
          JVerification.login(true);
        } catch (error) {
          $utils.toast.text("登录失败" + error.message);
        }
        setTimeout(() => {
          this.setState({
            logining: false
          });
          Taro.hideLoading();
        }, 10000);
      } else {
        Taro.hideLoading();
        $utils.toast.text("当前设备不支持一键登录");
        return;
      }
    }

    // // global.$utils.auth.wechat();
    // let { phone } = this.state;
    // let d = {};
    // d.phone = phone;
    // d.isptoken = "123";
    // //登录方式[pwd=密码登录，sms=短信登录，isp=运营商登录]
    // d.style = "isp";
    // let res = await $utils.auth.login(d);
  };

  ispLogin = async isptoken => {
    console.log(isptoken, 99998888);
    let d = {};
    d.phone = "wait"; //默认传一个值，否则后台会报错
    d.isptoken = isptoken; // 后台通过ispToken获取手机号
    //登录方式[pwd=密码登录，sms=短信登录，isp=运营商登录]
    d.style = "isp";
    await $utils.auth.login(d);
  };

  onChangeChecked = data => {
    console.log(data, "是否同意协议");
    this.setState({
      checked: data
    });
  };
  render() {
    let { phone } = this.state;
    return (
      <View className='authPhone'>
        <Image className='authPhone-icon' src={auth_phone} mode='aspectFill' />
        {/* <View className='authPhone-text'>中国联通认证</View> */}
        <View className='authPhone-title'>{phone}</View>
        <View
          className='authPhone-login_btn'
          onClick={this.authLogin.bind(this)}
        >
          <Image
            className='authPhone-login_btn-icon'
            src={weapp_icon}
            mode='aspectFill'
          />
          <View className='authPhone-login_btn-text'>手机号一键登录</View>
        </View>
        <View
          className='authPhone-phonetext'
          onClick={() => {
            Taro.redirectTo({
              url: "/pages/authSendCode/index"
            });
          }}
        >
          其他账号登录
        </View>
        <View className='authPhone-contentBox'>
          <Checkbox onChangeChecked={this.onChangeChecked}></Checkbox>
        </View>
      </View>
    );
  }
}
