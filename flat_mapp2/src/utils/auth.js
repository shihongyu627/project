// import * as WechatSdk from 'react-native-wechat'
// import * as QQSdk from 'react-native-qq'
import Taro from "@tarojs/taro";
let JPush = null;
if (process.env.TARO_ENV === "rn") {
  JPush = require("@kafudev/jpush-react-native").default;
}

// 认证
const auth = {
  style: {},
  back: function() {},
  // 登录
  login(t) {
    return new Promise((resolve, reject) => {
      global.global.$utilss.api
        .load("authLogin", t, "get")
        .then(result => {
          if (result.status) {
            global.global.$utilss.toast.success("登录成功");
            let user = {
              uid: result.data.uid,
              uname: result.data.username,
              avatar: result.data.useravatar,
              point: result.data.userpoint,
              level: result.data.userlevel,
              levelname: result.data.level_name
            };
            // 设置登录
            store.dispatch(userActions.login(user));
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
          $utils.data.set("userType", userInfo.userType || "");
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
        } else {
          $utils.data.set("userInfo", {});
          $utils.data.set("isLogin", false);
          global.isLogin = false;
          $utils.data.set("userType", "");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
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
