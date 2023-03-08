import React, { Component } from "react";
import dayjs from "dayjs";
import { Image, View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import ImageMarker from "react-native-image-marker";
import { Platform } from "react-native";
import store from "../../store";
import Geolocation from "@react-native-community/geolocation";
export default class Index extends Component {
  state = {
    address: ""
  };
  uploadImage() {
    return new Promise((resolve, reject) => {
      Taro.chooseImage({
        count: this.props.count,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        compressFocusAlpha: true,
        success: res => {
          Taro.showLoading({ title: "uploading" });
          Promise.all(
            res.tempFilePaths.map((path, index) => this.onlyUpload(path, index))
          ).then(list => {
            resolve(
              list.map(item => {
                return item.includes("http")
                  ? item
                  : `${global.img_host}${item}`;
              })
            );
          });
        },
        fail(e) {
          console.log("error", e);
          Taro.hideLoading();
        }
      });
    });
  }
  getLocation = async () => {
    let xx1 = await $utils.permissionRn.camera();
    let xx2 = await $utils.permissionRn.photo();

    if (!xx1 || !xx2) {
      return false;
    }
    let xx3 = await this.onload();
    this.uploadImage();
  };
  onload = async () => {
    if (Platform.OS == "ios") {
      Geolocation.requestAuthorization();
    }
    Geolocation.getCurrentPosition(
      info => {
        let coords = info.coords;
        let longitude = coords.longitude || "";
        let latitude = coords.latitude || "";
        let a = [longitude, latitude];
        let location = a.join(",");
        if (location) {
          this.loadData(location);
        }
      },
      error => {
        console.log(error, "errorxxxxxx");
        $utils.loading.hide();
      }
    );
    // let xx3 = await $utils.permissionRn.location();
    // if (!xx3) {
    //   return false;
    // }
    // Taro.getLocation({
    //   type: "gcj02",
    //   success: res => {
    //     const { latitude, longitude } = res;
    //     let arr = [longitude, latitude];
    //     let str = arr.join(",");
    //     this.loadData(str);
    //   },
    //   fail: err => {
    //     console.log(err);
    //   },
    //   error: res => {
    //     console.log(res);
    //   }
    // });
  };
  loadData = async str => {
    let d = {};
    let result = {};
    d.lnglat = str;
    try {
      result = await $utils.api.load("mapLocation", d, "get", false);
      if (result.data) {
        this.setState({
          address: result.data.address || ""
        });
      } else {
      }
    } catch (error) {}
  };
  onlyUpload(filePath, index) {
    let that = this;
    let auth = global.$utils.data.get("token") || "";
    let url = `${global.base_host}/api/upload/uploadimage`;
    console.log(url, filePath);
    if (process.env.TARO_ENV === "rn") {
      return this.onlyRnUpload(filePath, index);
    }
    return new Promise((resolve, reject) => {
      Taro.uploadFile({
        url: url,
        filePath: filePath,
        name: "file",
        fileName: "image.png",
        formData: {},
        header: {
          "content-Type": "multipart/form-data",
          "Customer-Authorization": "Bearer " + auth
        },
        success(res1) {
          Taro.hideLoading();
          let data = "";
          if (res1.data) {
            data = JSON.parse(res1.data);
          }
          let filename = (data.data && data.data.pic_path) || "";
          if (filename) {
            that.props.setImg(filename);
          } else {
            Taro.showToast({
              title: "上传失败",
              icon: "none"
            });
          }
        },
        fail(e) {
          console.log("error", e);
          Taro.hideLoading();
          Taro.showToast({
            title: "上传失败",
            icon: "none"
          });
        }
      });
    });
  }
  onlyRnUpload = async (filePath, index) => {
    let that = this;
    let auth = global.$utils.data.get("token") || "";
    let url = `${global.base_host}/api/upload/uploadimage`;
    let date = dayjs(new Date()).format("YYYY-MM-DD");
    let { address } = this.state;
    let userInfo = store.getState().user || {};
    let user_nick = userInfo.user_nick;
    let text = "👤" + user_nick + "\n" + "📆 " + date + "\n" + "🗺 " + address;
    console.log(text, 888888888);
    let res1 = await ImageMarker.markText({
      src: filePath,
      text: text,
      position: "bottomLeft",
      color: "#333333",
      fontName: "Arial-BoldItalicMT",
      fontSize: 20,
      scale: 1,
      quality: 100,
      saveFormat: "png",
      textBackgroundStyle: {
        type: "stretchX",
        paddingX: 10,
        paddingY: 10,
        color: "#C8C6C977" // '#0f0a'
      }
    });
    return new Promise(async (resolve, reject) => {
      let formData = new FormData();
      let file = {
        uri: Platform.OS === "android" ? "file://" + res1 : res1,
        type: "multipart/form-data",
        name: "image.png"
      };
      formData.append("file", file);
      try {
        let axios = require("axios").default;
        let res = await axios({
          url: url,
          method: "post",
          data: formData,
          responseType: "json",
          processData: false, // 告诉axios不要去处理发送的数据(重要参数)
          // contentType: false,   // 告诉axios不要去设置Content-Type请求头
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000
        });
        if (res) {
          Taro.hideLoading();
          let result = res.data;
          console.log(result, 999999);
          if (typeof result === "string") {
            try {
              result = JSON.parse(result) || {};
            } catch (error) {
              result = {};
            }
          }
          let filename = (result.data && result.data.url) || "";
          if (filename) {
            that.props.setImg(filename);
          } else {
            Taro.hideLoading();
            Taro.showToast({
              title: "上传失败",
              icon: "none"
            });
          }
        } else {
          Taro.hideLoading();
        }
      } catch (error) {
        console.log(error);
        Taro.hideLoading();
        $utils.toast.error("上传错误" + error.message);
      }
    });
  };
  render() {
    let { className, style } = this.props;
    return (
      <Image
        onClick={this.getLocation.bind(this)}
        src={this.props.source}
        className={"uploadImage_Items " + className}
        style={style}
      />
    );
  }
}
