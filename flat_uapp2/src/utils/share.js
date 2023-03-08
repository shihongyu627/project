import React, { Component } from "react";
// import ShareUtil from '../lib/ShareUtil'
import Taro from "@tarojs/taro";
import toast from "./toast";
import app from "./app";
import BoxShare from "../component/ShareSheet";

let View = null;
let Dimensions = null;
let DeviceEventEmitter = null;
let Button = null;
let Drawer = null;
let WechatSDK = null;
let width = 750;
if (process.env.TARO_ENV === "rn") {
  let RN = require("react-native");
  let RNT = require("teaset");
  View = RN.View;
  Dimensions = RN.Dimensions;
  DeviceEventEmitter = RN.DeviceEventEmitter;
  Drawer = RNT.Drawer;
  Button = RNT.Button;
  WechatSDK = require("react-native-wechat-lib");
  width = Dimensions.get("window").width;
}

// 分享
const share = {
  drawer: null,
  board(d = {}) {
    // 面板
    let title = "";
    let text = "";
    let image = "";
    let url = "";
    if (d.type === "image") {
      title = d.title || app.name;
      text = d.text || app.name;
      image = d.image || "";
      url = "";
    } else if (d.type === "mini") {
      title = d.title || app.name;
      text = d.text || app.name;
      // image = d.image || ''
      url = d.url;
    } else {
      title = d.title || app.name;
      text = d.text || app.name;
      image = d.image || "";
      url = d.url || "";
    }
    // let list = d.list || [2, 3, 0, 4, 33]
    const list = d.list || [2, 3];
    console.log("share ", d);
    if (d.tool === "umeng") {
      // ShareUtil.shareboard(text, image, url, title, list, (code, message) => {
      //   if (code === 0) {
      //     toast.text('分享成功')
      //   } else {
      //     toast.text(code + ':' + message)
      //   }
      // })
    } else {
      const view = (
        <View
          style={{ backgroundColor: "#fff", height: Taro.pxTransform(520) }}
        >
          <BoxShare platform={d.platform || []} share={d} />
          <Button
            title='取消分享'
            type='default'
            size='md'
            style={{
              width: width,
              height: Taro.pxTransform(90),
              bottom: 0,
              backgroundColor: "#fff",
              borderRadius: 0,
              borderWidth: 0
            }}
            titleStyle={{ color: "#575a5c" }}
            onPress={() => {
              console.log("xxxxxxxx");
              DeviceEventEmitter.emit("removeAllOverlay", {});
            }}
          />
        </View>
      );
      setTimeout(() => {
        this.drawer = Drawer.open(view, "bottom");
      }, 300);
    }
  },
  async open(d = {}, type = "") {
    console.log("share open ", type, d.type, d);
    switch (type) {
      case "wechat": // 分享到微信
        var installed = await WechatSDK.isWXAppInstalled();
        console.log("wechat installed", installed);
        if (!installed) {
          return global.$utils.toast.text("未安装微信");
        }
        if (d.type === "mini") {
          WechatSDK.shareMiniProgram({
            title: d.title || "",
            // thumbImageUrl: d.image || '',
            hdImageUrl: d.image || "",
            description: d.text || "",
            webpageUrl: d.url || "",
            userName: global.wechat_gh, // 小程序原始ID
            path: d.path || "/pages/index/index", // 小程序页面路径
            miniProgramType: 0, // 正式版:0，测试版:1，体验版:2
            withShareTicket: false
            // scene: 3  // 分享到, 0:聊天界面 1:朋友圈 2:收藏 3:指定联系人
          })
            .then(res => {
              console.log(res);
              toast.text("分享成功");
              // DeviceEventEmitter.emit('removeAllOverlay', {})
            })
            .catch(err => {
              console.log(err);
              // toast.error('分享出错')
            });
        } else if (d.type === "url") {
          // 网页
          WechatSDK.shareWebpage({
            title: d.title,
            thumbImageUrl: d.image || "",
            description: d.text || "",
            webpageUrl: d.url || ""
            // scene: 3   // 分享到, 0:聊天界面 1:朋友圈 2:收藏 3:指定联系人
          })
            .then(res => {
              console.log(res);
              toast.text("分享成功");
              DeviceEventEmitter.emit("removeAllOverlay", {});
            })
            .catch(err => {
              console.log(err);
              toast.error("分享出错");
            });
        } else if (d.type === "text") {
          // 文本
          WechatSDK.shareText({
            text: d.text
            // scene: 3   // 分享到, 0:聊天界面 1:朋友圈 2:收藏 3:指定联系人
          })
            .then(res => {
              console.log(res);
              toast.text("分享成功");
              DeviceEventEmitter.emit("removeAllOverlay", {});
            })
            .catch(err => {
              console.log(err);
              toast.error("分享出错");
            });
        } else if (d.type === "image") {
          // 图片
          WechatSDK.shareImage({
            imageUrl: d.image
            // scene: 3   // 分享到, 0:聊天界面 1:朋友圈 2:收藏 3:指定联系人
          })
            .then(res => {
              console.log(res);
              toast.text("分享成功");
              DeviceEventEmitter.emit("removeAllOverlay", {});
            })
            .catch(err => {
              console.log(err);
              toast.error("分享出错");
            });
        } else if (d.type === "video") {
          // 图片
          WechatSDK.shareVideo({
            videoUrl: d.videoUrl,
            title: d.title,
            thumbImageUrl: d.thumbImageUrl
            // scene: 3   // 分享到, 0:聊天界面 1:朋友圈 2:收藏 3:指定联系人
          })
            .then(res => {
              console.log(res);
              toast.text("分享成功");
              DeviceEventEmitter.emit("removeAllOverlay", {});
            })
            .catch(err => {
              console.log(err);
              toast.error("分享出错");
            });
        } else if (d.type === "openmini") {
          WechatSDK.launchMiniProgram({
            userName: global.wechat_gh, // 小程序原始ID
            path: d.path || "/pages/index/index", // 小程序页面路径
            miniProgramType: 0 // 正式版:0，测试版:1，体验版:2
          })
            .then(res => {
              console.log(res);
              // toast.text('分享成功')
              DeviceEventEmitter.emit("removeAllOverlay", {});
            })
            .catch(err => {
              console.log(err);
              toast.error("打开小程序出错");
            });
        } else if (d.type === "open") {
          WechatSDK.openWXApp()
            .then(res => {
              console.log("wechat openwxapp", res);
            })
            .catch(err => {
              console.log(err);
              toast.error("打开微信出错");
            });
        } else {
          // ShareUtil.share(d.text, d.img, d.url, d.title, 2, (code, message) => {
          //   if (code === 0) {
          //     DeviceEventEmitter.emit('removeAllOverlay', {})
          //   } else {
          //     toast.text(code + ':' + message)
          //   }
          // });
        }
        break;
      case "wxcircle": // 分享到微信朋友圈
        if (d.type === "news" || d.type === "url" || d.type === "mini") {
          // 网页
          WechatSDK.shareWebpage({
            title: d.title,
            thumbImageUrl: d.image || "",
            description: d.text || "",
            webpageUrl: d.url || "",
            scene: 1 // 分享到, 0:聊天界面 1:朋友圈 2:收藏 3:指定联系人
          })
            .then(res => {
              console.log(res);
              toast.text("分享成功");
              DeviceEventEmitter.emit("removeAllOverlay", {});
            })
            .catch(err => {
              console.log(err);
              toast.error("分享出错");
            });
        } else if (d.type === "text") {
          // 文本
          WechatSDK.shareText({
            text: d.text,
            scene: 1 // 分享到, 0:聊天界面 1:朋友圈 2:收藏 3:指定联系人
          })
            .then(res => {
              console.log(res);
              toast.text("分享成功");
              DeviceEventEmitter.emit("removeAllOverlay", {});
            })
            .catch(err => {
              console.log(err);
              toast.error("分享出错");
            });
        } else if (d.type === "image") {
          // 图片
          WechatSDK.shareImage({
            imageUrl: d.image,
            scene: 1 // 分享到, 0:聊天界面 1:朋友圈 2:收藏 3:指定联系人
          })
            .then(res => {
              console.log(res);
              toast.text("分享成功");
              DeviceEventEmitter.emit("removeAllOverlay", {});
            })
            .catch(err => {
              console.log(err);
              toast.error("分享出错");
            });
        } else if (d.type === "video") {
          // 图片
          WechatSDK.shareVideo({
            videoUrl: d.videoUrl,
            title: d.title,
            thumbImageUrl: d.thumbImageUrl
            // scene: 3   // 分享到, 0:聊天界面 1:朋友圈 2:收藏 3:指定联系人
          })
            .then(res => {
              console.log(res);
              toast.text("分享成功");
              DeviceEventEmitter.emit("removeAllOverlay", {});
            })
            .catch(err => {
              console.log(err);
              toast.error("分享出错");
            });
        }
        // ShareUtil.share(d.text, d.img, d.url, d.title, 3, (code, message) => {
        //   if (code === 0) {
        //     toast.text('分享成功')
        //     DeviceEventEmitter.emit('removeAllOverlay', {})
        //   } else {
        //     toast.text(code + ':' + message)
        //   }
        // });
        break;
      case "download": // 下载图片
        if (d.type === "text") {
          console.log(d, "xxxx");
          //数组
          let gallery = d.gallery || [];
          gallery.map(item => {
            global.$utils.file.savePhoto(item || "");
          });
          // 网页
        } else if (d.type === "image") {
          // 数组
          let gallery = d.gallery || [];
          gallery.map(item => {
            global.$utils.file.savePhoto(item || "");
          });
        } else if (d.type === "url") {
          //数组
          let gallery = d.gallery || [];
          gallery.map(item => {
            global.$utils.file.savePhoto(item || "");
          });
        } else if (d.type === "mini") {
          //数组
          let gallery = d.gallery || [];
          gallery.map(item => {
            global.$utils.file.savePhoto(item || "");
          });
        }
        break;
      default:
        return;
    }
    DeviceEventEmitter.emit("removeAllOverlay", {});
  },
  async download(d = {}, type = "") {
    console.log("share open ", type, d.type, d);
    switch (type) {
      case "download": // 分享到微信朋友圈
        if (d.type === "image") {
          // console.log(d, 'xxxx')
          // let gallery = d.image || []
          // gallery.map((item) => {
          //   $utils.file.savePhoto(item || '')
          // })
          // 网页
        }
        break;
      default:
        return;
    }
    DeviceEventEmitter.emit("removeAllOverlay", {});
  }
};

export default share;
