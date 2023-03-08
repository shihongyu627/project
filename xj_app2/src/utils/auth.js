// import * as WechatSdk from 'react-native-wechat'
// import * as QQSdk from 'react-native-qq'
import Taro from "@tarojs/taro";
import { loginSuccess, logoutSuccess } from "../store/actions/user";
import store from "../store";
// import * as userActions from "../store/actions/user";
// import store from "../store";
let WechatSDK = null;
if (process.env.TARO_ENV === "rn") {
  WechatSDK = require("react-native-wechat-lib");
}
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
    let apiset = "authLogin";
    return new Promise((resolve, reject) => {
      global.$utils.api
        .load(apiset, t, "get")
        .then(result => {
          if (result.code == 1) {
            $utils.data.set("token", result.data.token);
            global.isLogin = true;
            $utils.toast.success("登录成功");
            resolve(true);
          } else {
            $utils.toast.text(result.message);
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
        .load("authRegister", t, "post")
        .then(result => {
          if (result.data) {
            global.$utils.toast.success("注册成功");
            $utils.data.set("token", result.data.token);
            global.isLogin = true;
            if (result.data.is_bind_wechat == 0) {
              resolve(result.data && result.data.is_bind_wechat);
              return;
            }
            // 设置登录
            // store.dispatch(userActions.login(user));
            // global.$utils.data.set('auth', 'login', true)
            // global.$utils.data.set('auth', 'userinfo', result.data)
            resolve(true);
          } else {
            $utils.toast.text(result.message);
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
      JPush.deleteAlias({ sequence: 8 });
    }
    console.log("JPush deleteAlias", "uid" + global.uid + "");
    global.token = null;
    global.uid = null;
  },
  // 检测是否登录
  checklogin: function() {
    // 判断登录
    global.$utils.api
      .load("authCheck", {}, "get", {
        toast: false,
        toasterror: false,
        loading: false,
        loadingtext: "Loading"
      })
      .then(result => {
        if (result.code == 1) {
          console.log(result.data);
          let userInfo = result.data || {};
          global.isLogin = true;
          $utils.data.set("userInfo", userInfo);
          $utils.data.set("token", result.data.token);
          global.uid = userInfo.uid;
          global.source_uid = userInfo.uid;
          // 设置极光推送别名
          if (global.uid) {
            if (process.env.TARO_ENV === "rn") {
              if (JPush) {
                JPush.setAlias({
                  sequence: 8,
                  alias: "uid" + global.uid + ""
                });
                console.log("JPush setAlias", "uid" + global.uid + "");
              }
            }
          }
          store.dispatch(loginSuccess(userInfo));
        } else {
          global.isLogin = false;
          $utils.data.set("userInfo", {});
          store.dispatch(logoutSuccess());
          Taro.reLaunch({
            url: "/pages/auth/index"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  //站点配置
  siteInfo: function() {
    $utils.api
      .load("siteInfo", {}, "get", false)
      .then(result => {
        if (result.data) {
          let v = result.data || {};
          global.$utils.data.set("siteInfo", v);
        }
      })
      .catch(err => {
        console.log(err);
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
  }
};

export default auth;
