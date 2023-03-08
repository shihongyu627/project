// import * as WechatSDK from 'react-native-wechat'
// import * as QQSdk from 'react-native-qq'
import Taro from "@tarojs/taro";
// import * as userActions from "../store/actions/user";
// import store from "../store";
// 认证
let WechatSDK = null;
let JPush = null;
if (process.env.TARO_ENV === "rn") {
  WechatSDK = require("react-native-wechat-lib");
}
if (process.env.TARO_ENV === "rn") {
  JPush = require("@kafudev/jpush-react-native").default;
}
const auth = {
  style: {},
  back: function() {},
  // 登录
  login(t) {
    return new Promise((resolve, reject) => {
      $utils.api
        .load("loginCommonAuth", t, "post")
        .then(async result => {
          if (result.code == 200) {
            global.$utils.toast.success("登录成功");
            $utils.data.set("CustomerToken", result.data.token);
            global.isLogin = true;
            await $utils.auth.getInfo();
            setTimeout(() => {
              Taro.navigateBack();
            }, 500);
            // 设置登录
            // store.dispatch(userActions.login(user));
            // global.$utils.data.set('auth', 'login', true)
            // global.$utils.data.set('auth', 'userinfo', result.data)
            resolve(true);
          } else {
            $utils.toast.success(result.msg);
          }
          resolve(null);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // 注册
  register(t) {
    return new Promise((resolve, reject) => {
      global.$utils.api
        .load("authRegister", t, "get")
        .then(result => {
          if (result.status) {
            global.$utils.toast.success("注册成功");
            let user = {
              uid: result.data.uid,
              uname: result.data.username,
              avatar: result.data.useravatar,
              point: result.data.userpoint,
              level: result.data.userlevel,
              levelname: result.data.level_name
            };
            // 设置登录
            // store.dispatch(userActions.login(user));
            // global.$utils.data.set('auth', 'login', true)
            // global.$utils.data.set('auth', 'userinfo', result.data)
            resolve(user);
          }
          resolve(null);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // 注销
  logout: function() {
    if (JPush) {
      JPush.deleteAlias({ sequence: 6 });
    }
    console.log("JPush deleteAlias", "uid" + global.uid + "");
    global.token = null;
    global.uid = null;
  },
  // 检测是否登录
  getInfo: async function() {
    Taro.showLoading({
      title: "loading"
    });
    try {
      let d = {};
      let res = await global.$utils.api.load("getInfo", d, "get", false);
      if (res) {
        if (res.code == 200) {
          let userInfo = res.user || {};
          $utils.data.set("userInfo", userInfo || {});
          $utils.data.set("isLogin", true);
          global.isLogin = true;
          global.uid = userInfo.userId;
          global.source_uid = userInfo.userId;
          // 设置极光推送别名
          if (userInfo.userId) {
            if (process.env.TARO_ENV === "rn") {
              JPush.setAlias({
                sequence: 6,
                alias: "uid" + userInfo.userId + ""
              });
              console.log("JPush setAlias", "uid" + userInfo.userId + "");
            }
          }
          setTimeout(function() {
            Taro.hideLoading();
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  },
  // 认证
  oauth: function(style) {
    this.wechat(style);
  },
  // 微信
  wechat: async function(style) {
    if (process.env.TARO_ENV === "weapp") {
      let that = this;
      Taro.getUserProfile({
        desc: "用于完善个人资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: res => {
          console.log(res, 55555);
          Taro.login({
            success(res1) {
              console.log("---login success---", res1);
              let loginData = {
                encryptedData: res.encryptedData,
                iv: res.iv,
                unionId: res.cloudID
              };
              let userInfo = res.userInfo || {};
              let code = res1.code || "";
              console.log(userInfo, code);
              that.callback(style, res1, loginData, userInfo);
            },
            fail(err) {
              console.log("---login fail---", err);
            }
          });
        }
      });
    }
    if (process.env.TARO_ENV === "rn") {
      const installed = await WechatSDK.isWXAppInstalled();
      if (!installed) {
        $utils.toast.text("未安装微信");
        return null;
      }
      const scope = "snsapi_userinfo";
      const state = "_" + +new Date();
      console.log("wechat oauth start");
      try {
        const res = await WechatSDK.sendAuthRequest(scope, state);
        console.log("wechat oauth ", res);
        // you may use res.code to get the access token.
        // alert('code', res.code);
        this.callback(style, res);
      } catch (error) {
        console.log("wechat oauth error ", error);
        $utils.toast.text("授权失败");
        return null;
      }
    }
  },
  // 微信
  wechatRn: async function() {},
  callback(style, dd, loginData = {}, userInfo = {}) {
    // 登录回调
    let data = {};
    data.code = dd.code;
    if (style == "wxmapp") {
      data.encryptedData = loginData.encryptedData || "";
      data.iv = loginData.iv || "";
      data.avatar = userInfo.avatarUrl || "";
      data.gender = userInfo.gender || "";
      data.nickname = userInfo.nickName || "";
    }
    data.type = style;
    global.$utils.api.load("loauthAuth", data, "post").then(async result => {
      if (result.code === 200) {
        $utils.toast.success("登录成功");
        // 设置登录
        $utils.data.set("CustomerToken", result.data.token);
        // global.$utils.data.set("login", true);
        global.isLogin = true;
        await $utils.auth.getInfo();
        // global.$utils.data.set("userInfo", result.data);
        setTimeout(() => {
          Taro.navigateBack();
        }, 500);
      } else {
        global.$utils.toast.error(result.msg);
      }
      // this.back(result)
    });
  },
  // 发送短信
  sendsms(mobile) {
    return new Promise((resolve, reject) => {
      global.$utils.api
        .load(
          "authSendsms",
          {
            mobile: mobile
          },
          "get"
        )
        .then(result => {
          if (result.status) {
            global.$utils.toast.success("发送成功");
            resolve(true);
          }
          resolve(null);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  messageAll(type) {
    return new Promise((resolve, reject) => {
      let dd = {};
      dd.type = type;
      $utils.api
        .load("messageAll", dd, "get", false)
        .then(result => {
          console.log(result);
          if (result.code == 200) {
            let num = result.data;
            if (num == 0) {
              Taro.removeTabBarBadge({
                index: 1
              });
              return;
            }
            Taro.setTabBarBadge({
              index: 1,
              text: `${num}`
            });
            resolve(true);
          }
          resolve(null);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

export default auth;
