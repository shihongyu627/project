import React, { Component } from "react";

import { Image, View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
export default class Index extends Component {
  state = {};
  async uploadImage() {
    let xx1 = await $utils.permissionRn.camera();
    let xx2 = await $utils.permissionRn.photo();

    if (!xx1 || !xx2) {
      return false;
    }
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
              title: "????????????",
              icon: "none"
            });
          }
        },
        fail(e) {
          console.log("error", e);
          Taro.hideLoading();
          Taro.showToast({
            title: "????????????",
            icon: "none"
          });
        }
      });
    });
  }
  onlyRnUpload(filePath, index) {
    let that = this;
    let auth = global.$utils.data.get("token") || "";
    let url = `${global.base_host}/api/upload/uploadimage`;
    return new Promise(async (resolve, reject) => {
      let formData = new FormData();
      let file = {
        uri: filePath,
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
          processData: false, // ??????axios??????????????????????????????(????????????)
          // contentType: false,   // ??????axios???????????????Content-Type?????????
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
              title: "????????????",
              icon: "none"
            });
          }
        } else {
          Taro.hideLoading();
        }
      } catch (error) {
        console.log(error);
        Taro.hideLoading();
        $utils.toast.error("????????????" + error.message);
      }
    });
  }
  render() {
    let { className, style } = this.props;
    return (
      <Image
        onClick={this.uploadImage.bind(this)}
        src={this.props.source}
        className={"uploadImage_Items " + className}
        style={style}
      />
    );
  }
}
