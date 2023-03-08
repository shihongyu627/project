import React, { Component } from "react";

import "./index.rn.scss";
import { ShareSheet, Cell } from "@antmjs/vantui";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
  Text
} from "react-native";
import { Theme, Label, Button } from "teaset";
import share_wechat from "@assets/share/share_wechat.png";
import share_wxcircle from "@assets/share/share_wxcircle.png";
import share_qq from "@assets/share/share_qq.png";
import share_qzone from "@assets/share/share_qzone.png";
import share_mini from "@assets/share/share_mini.png";
import share_copyurl from "@assets/share/share_copyurl.png";
import share_copy from "@assets/share/share_copy.png";
import download from "@assets/share/download.png";

export default class Index extends Component {
  state = {
    icons: {
      wechat: {
        name: "微信",
        img: share_wechat,
        onPress: () => {
          // 微信好友
          $utils.share.open(this.props.share, "wechat");
        }
      },
      wxcircle: {
        name: "微信朋友圈",
        img: share_wxcircle,
        onPress: () => {
          // 微信朋友圈
          $utils.share.open(this.props.share, "wxcircle");
        }
      },
      qq: { name: "QQ", img: share_qq },
      qzone: {
        name: "QQ空间",
        img: share_qzone
      },
      mini: {
        name: "小程序",
        img: share_mini,
        onPress: () => {
          // 微信小程序
          $utils.share.open(this.props.share, "mini");
        }
      },
      copyurl: {
        name: "复制链接",
        img: share_copyurl
      },
      copy: { name: "复制", img: share_copy },
      download: {
        name: "下载图片",
        img: download,
        onPress: async () => {
          // 微信朋友圈
          // $utils.share.download(this.props.share, 'download')
          let checkVal = await global.$utils.permission.checkUpdate();
          $utils.share.open(this.props.share, "download");
        }
      }
    }
  };
  onClose = () => {
    this.props.onCloseShare(false);
  };

  onSelect = event => {
    this.onClose();
  };
  render() {
    const { info, title, onClick = () => {} } = this.props;
    return (
      <View className="shareSheet">
        <Label className="shareSheet-title" text="选择要分享到的平台"></Label>
        <View className="shareSheet-box">
          {(this.props.platform || []).map((item, index) => (
            <View className="shareSheet-box-item">
              <TouchableOpacity
                className="shareSheet-box-item"
                onPress={
                  this.state.icons[item].onPress &&
                  this.state.icons[item].onPress.bind(this)
                }
              >
                <View className="shareSheet-box-item-iconBox">
                  <Image
                    source={item ? this.state.icons[item].img : null}
                    resizeMode="contain"
                    className="shareSheet-box-item-iconBox-img"
                  ></Image>
                  {/* <Icon name="weixin" style={{...styles.icon, color: item.color || '#f20'}} type="fontawesome5" /> */}
                </View>
                <Label
                  className="shareSheet-box-item-txt"
                  text={this.state.icons[item].name}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  }
}
