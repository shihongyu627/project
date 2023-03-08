import React, { Component } from "react";

import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { ShareSheet, Cell } from "@antmjs/vantui";
export default class Index extends Component {
  state = {
    options: [
      {
        name: "微信",
        icon: "wechat",
        openType: "share",
        type: "wechat"
      },
      {
        name: "复制链接",
        icon: "link",
        type: "link"
      },
      {
        name: "分享海报",
        icon: "poster",
        type: "poster"
      }
    ]
  };
  onClose = () => {
    this.props.onCloseShare(false);
  };

  onSelect = async event => {
    console.log(event.detail);
    let dd = event.detail || {};
    if (dd.type == "poster") {
      console.log(this.props.filePath);
      Taro.getImageInfo({
        src: this.props.filePath,
        success(result) {
          if (result.path) {
            Taro.saveImageToPhotosAlbum({
              filePath: result.path
            }).then(getImageInfoResult => {
              if (
                getImageInfoResult.errMsg === "saveImageToPhotosAlbum:ok"
              ) {
                global.$utils.toast.success("图片已保存至相册");
              } else {
                global.$utils.toast.fail("保存失败");
              }
            });
          }
        }
      });
    }
    this.onClose();
  };
  render() {
    const { info, title, onClick = () => {} } = this.props;
    return (
      <ShareSheet
        show={this.props.showShare}
        title="立即分享给好友"
        options={this.state.options}
        onSelect={this.onSelect}
        onClose={this.onClose}
      />
    );
  }
}
