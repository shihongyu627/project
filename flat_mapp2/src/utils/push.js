import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import _ from "lodash";

let JPush = null;
let AppState = null;
let Image = null;
let Linking = null;
let DeviceEventEmitter = null;
let TouchableOpacity = null;
let Theme = null;
let Overlay = null;
if (process.env.TARO_ENV === "rn") {
  let RN = require("react-native");
  let RNT = require("teaset");
  AppState = RN.AppState;
  Image = RN.Image;
  Linking = RN.Linking;
  DeviceEventEmitter = RN.DeviceEventEmitter;
  TouchableOpacity = RN.TouchableOpacity;
  Theme = RNT.Theme;
  Overlay = RNT.Overlay;
  JPush = require("@kafudev/jpush-react-native").default;
}
// 推送-极光推送
const push = {
  key: null,
  overlayView: null,
  // 初始化推送
  init: function(callback = null) {
    try {
      // 极光推送
      console.log("JPush init");
      JPush.setLoggerEnable(true);
      JPush.init({
        appKey: global.jpush_appkey,
        channel: global.jpush_channel,
        production: 0
      });
      console.log("JPush init end");
      // Crash上报
      JPush.initCrashHandler();
      //连接状态
      JPush.addConnectEventListener(result => {
        console.log("JPush connectListener:", result);
      });
      // 获取RegistrationID
      JPush.getRegistrationID(id => {
        console.log("JPush getRegistrationID: ", id);
        if (callback) {
          callback(id);
        }
      });
      // 设置角标-清除0
      JPush.setBadge({ badge: 0, appBadge: 0 });
      // 通知事件
      JPush.addNotificationListener(message => {
        // msg {"messageID":String,"title":String，"content":String,"badge":String,"ring":String,"extras":{String:String},"notificationEventType":String}
        console.log("JPush addNotificationListener msg: ", message);
        if (message.notificationEventType === "notificationArrived") {
          this.parseMessage("notification", "receive", message);
        } else if (message.notificationEventType === "notificationOpened") {
          this.parseMessage("notification", "open", message);
        }
      });
      // 通知事件-本地
      JPush.addLocalNotificationListener(message => {
        // msg {"messageID":String,"title":String，"content":String,"badge":String,"ring":String,"extras":{String:String},"notificationEventType":String}
        console.log("JPush addLocalNotificationListener msg: ", message);
        if (message.notificationEventType === "notificationArrived") {
          this.parseMessage("notification", "receive", message);
        } else if (message.notificationEventType === "notificationOpened") {
          this.parseMessage("notification", "open", message);
        }
      });
      // 自定义消息监听
      JPush.addCustomMessageListener(message => {
        // msg {"messageID":String，"content":String,"extras":{String:String}}
        console.log("JPush CustomMessage msg: ", message);
        this.parseMessage("message", "receive", message);
      });
    } catch (error) {
      console.log("JPush init error: ", error);
    }
  },
  // 移除监听
  remove: function() {
    // JPush.removeReceiveCustomMsgListener();
    // JPush.removeReceiveNotificationListener();
  },
  // 消息
  parseMessage: function(type, style, message = {}) {
    // 过滤消息
    message = message || {};
    console.log("Push parseMessage: ", message);
    let extras = message.extras || "";
    if (typeof extras === "string") {
      try {
        extras = JSON.parse(extras) || {};
      } catch (error) {
        extras = {};
      }
    }
    message.extras = extras || {};
    message.time = Date.parse(new Date()) / 1000;
    // 分类
    switch (type) {
      case "notification": // 通知
        // 打开
        if (style === "open") {
          console.log("JPush open notification", message);
          if (
            AppState.currentState === "background" ||
            AppState.currentState === "inactive" ||
            AppState.currentState === "active"
          ) {
            // 后台，直接点击打开推送
            this.handleMessage(message);
          }
        }
        // 接收
        if (style === "receive") {
          console.log("JPush receive notification", message);
          if (AppState.currentState === "active") {
            // 前台，自动呈现直接打开推送
            // this.handleMessage(message);
          }
        }
        break;
      case "message": // 自定义消息
        // 接收
        if (style === "receive") {
          console.log("JPush receive message", message);
        }
        break;
      case "tagsWithalias": // 标识 和 别名
        // 设置
        if (style === "set") {
          console.log("JPush set tagsWithalias", message);
        }
        break;
    }
    // 设置角标-清除0
    JPush.setBadge({ badge: 0, appBadge: 0 });
  },
  handleMessage: function(message) {
    message = message || {};
    const extras = message.extras || [];
    console.log("handleMessage extras:", extras);
    // 路由
    if (extras.type === "router") {
      if (extras.scene) {
        Taro.navigateTo({
          url: extras.scene
        });
      } else if (extras.scene_url) {
        Taro.navigateTo({
          url: extras.scene_url
        });
      }
    }
    //  超链接
    // if (extras.type === "link" || extras.type === "linkurl") {
    //   if (extras.url) {
    //     $utils.toast.alert(message.title, extras.content || message.title, {
    //       cancelBtn:
    //         extras.cancel === false || extras.cancel === "false" ? 0 : true,
    //       okBtn: "打开",
    //       okPress: () => {
    //         Linking.openURL(extras.url);
    //       }
    //     });
    //   }
    // }
    // 图片弹窗
    // if (extras.type === "modal") {
    //   if (extras.image) {
    //     this.overlayView = (
    //       <Overlay.View
    //         style={{ alignItems: "center", justifyContent: "center" }}
    //         modal={true}
    //         overlayOpacity={0.5}
    //         ref={v => {
    //           this.overlayView = v;
    //         }}
    //       >
    //         <View
    //           style={{
    //             backgroundColor: "rgba(0,0,0,0)",
    //             height: 420,
    //             width: 289,
    //             borderRadius: 0,
    //             alignItems: "center"
    //           }}
    //         >
    //           <Image
    //             source={$utils.image.load(extras.image)}
    //             resizeMode="contain"
    //             style={{ height: 345, width: 289 }}
    //           />
    //           <TouchableOpacity
    //             activeOpacity={1}
    //             onPress={() => {
    //               console.log("xxxxxxxx");
    //               DeviceEventEmitter.emit("removeAllOverlay", {});
    //               this.overlayView && this.overlayView.close();
    //             }}
    //           >
    //             <Image
    //               source={Theme.iconClose}
    //               resizeMode="contain"
    //               style={{
    //                 marginTop: 30,
    //                 height: 32,
    //                 width: 32,
    //                 borderRadius: 16,
    //                 tintColor: "#fff"
    //               }}
    //             />
    //           </TouchableOpacity>
    //         </View>
    //       </Overlay.View>
    //     );
    //     setTimeout(() => {
    //       this.key = Overlay.show(this.overlayView);
    //     }, 800);
    //   }
    // }
  }
};

export default push;
