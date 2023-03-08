import React,{ Component } from "react";

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
        compressFocusAlpha:true,
        success: res => {
          console.log(res.tempFilePaths);
          // Taro.showLoading({ title: "uploading" });
          // Promise.all(
          //   res.tempFilePaths.map((path, index) => this.onlyUpload(path, index))
          // ).then(list => {
          //   resolve(
          //     list.map(item => {
          //       return item.includes("http")
          //         ? item
          //         : `${global.img_host}${item}`;
          //     })
          //   );
          // });
        }
      });
    });
  }
  onlyUpload(filePath, index) {
    let that = this;
    let auth = global.$utils.data.get("MaintainerToken") || "";
    let url = `${global.base_host}/customer/common/upload`;
    console.log(url, filePath);
    return new Promise((resolve, reject) => {
      Taro.uploadFile({
        url: url,
        filePath: filePath,
        name: "file",
        formData: {
          // file: filePath
        },
        header: {
          // "content-Type": "multipart/form-data",
          'Customer-Authorization': "Bearer " + auth
        },
        success(res) {
          Taro.hideLoading();
          console.log(res);
          let data = JSON.parse(res.data);
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
  render() {
    return (
      <Image
        onClick={this.uploadImage.bind(this)}
        src={this.props.source}
        className='uploadImage_Item'
      />
    );
  }
}
