import React, { Component } from "react";

import { Image, View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {};
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
  onlyUpload(filePath, index) {
    let that = this;
    let auth = global.$utils.data.get("CustomerToken") || "";
    let url = `${global.base_host}/customer/common/upload`;
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
          console.log(data);
          let filename = (data && data.url) || "";
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
  onlyRnUpload(filePath, index) {
    let that = this;
    let auth = global.$utils.data.get("CustomerToken") || "";
    let url = `${global.base_host}/customer/common/upload`;
    console.log(url, filePath);
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
          processData: false, // 告诉axios不要去处理发送的数据(重要参数)
          // contentType: false,   // 告诉axios不要去设置Content-Type请求头
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res) {
          console.log(res);
          Taro.hideLoading();
          let result = res.data;
          let filename = (result && result.url) || "";
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
  }
  render() {
    let { className } = this.props;
    return (
      <Image
        onClick={this.uploadImage.bind(this)}
        src={this.props.source}
        className={"uploadImage_Items " + className}
        mode='scaleToFill'
      />
    );
  }
}
