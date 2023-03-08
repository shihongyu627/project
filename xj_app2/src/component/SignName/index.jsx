import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { BottomModal } from "beeshell";
import { Platform } from "react-native";
import { Button } from "teaset";
import signNamePng from "@assets/image/signName.png";
import SignatureCapture from "react-native-signature-capture";
export default class Index extends Component {
  state = {
    value: 1
  };
  componentDidMount() {}
  componentDidShow() {}
  //签名
  saveSign = () => {
    this.signRef.saveImage();
  };

  resetSign = () => {
    this.signRef.resetImage();
  };
  _onSaveEvent = result => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    let signPathName = result.encoded || "";
    this.onlyRnUpload(`data:image/png;base64,${signPathName}`);
  };
  _onDragEvent() {
    // This callback will be called when the user enters signature
    console.log("dragged");
  }
  onlyRnUpload(filePath) {
    let that = this;
    let auth = global.$utils.data.get("token") || "";
    let url = `${global.base_host}/api/upload/uploadbase64`;
    return new Promise(async (resolve, reject) => {
      let formData = new FormData();
      let file = {
        base64: filePath,
        type: "multipart/form-data",
        name: "image.png"
      };
      formData.append("img", file);
      try {
        let axios = require("axios").default;
        let res = await axios({
          url: url,
          method: "post",
          data: {
            // is_iso: 1,
            base64: filePath
            // type: 1
          },
          responseType: "json",
          processData: false, // 告诉axios不要去处理发送的数据(重要参数)
          // contentType: false,   // 告诉axios不要去设置Content-Type请求头
          headers: { "Content-Type": "application/json" }
        });
        if (res) {
          Taro.hideLoading();
          let result = res.data;
          if (typeof result === "string") {
            try {
              result = JSON.parse(result) || {};
            } catch (error) {
              result = {};
            }
          }
          let filename = (result.data && result.data.url) || "";
          if (filename) {
            this.props.setImg(filename);
          } else {
            Taro.hideLoading();
            Taro.showToast({
              title: result.message || "上传失败",
              icon: "none"
            });
          }
        } else {
          Taro.hideLoading();
        }
      } catch (error) {
        console.log(error, 777);
        Taro.hideLoading();
        $utils.toast.error("上传错误" + error.message);
      }
    });
  }
  render() {
    const { value } = this.state;
    let { maxNum, disabled, signShow } = this.props;
    return (
      <View className="signName-signBox-modal">
        <View className="signName-signBox-modal-header">
          <Button
            className="signName-signBox-modal-header-reset"
            type="danger"
            onPress={() => {
              this.resetSign();
            }}
            title="重置"
          />

          <Button
            className="signName-signBox-modal-header-save"
            type="primary"
            onPress={() => {
              this.saveSign();
            }}
            title="完成"
          />
        </View>
        <SignatureCapture
          ref={sign => {
            if (sign) {
              this.signRef = sign;
            }
          }}
          onSaveEvent={this._onSaveEvent}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          showBorder={false}
          backgroundColor={Platform.OS == "ios" ? "#ffffff00" : "#00ffffff"}
          strokeColor="#333333"
          minStrokeWidth={4}
          maxStrokeWidth={4}
          viewMode={"portrait"}
          style={{ flex: 1, width: "100%" }}
        />
      </View>
    );
  }
}
