import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";

import "./index.scss";
import { AtNavBar, SubmitBtn } from "@component";
import headerBg from "@assets/image/headerBg.png";

export default class Index extends Component {
  state = {
    siteInfo: {}
  };

  componentDidMount() {
    let siteInfo = $utils.data.get("siteInfo") || {};
    this.setState({
      siteInfo
    });
  }
  //提现
  handleSubmit = () => {
    Taro.showModal({
      title: "温馨提示",
      content: "账户注销后，将无法恢复",
      confirmText: "注销",
      confirmColor:'#0A74E9'
    }).then(res1 => {
      if (res1.confirm) {
        let d = {};
        $utils.api
          .load("userLogout", d, "post", { loading: false, login: true })
          .then(result => {
            $utils.toast.text(result.message);
            if (result.code == 1) {
              setTimeout(() => {
                Taro.navigateBack();
              }, 500);
            }
          });
        setTimeout(() => {
          Taro.hideLoading();
        }, 500);
      } else if (res1.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  render() {
    let { siteInfo } = this.state;
    return (
      <View className="userAboutApp">
        <View className="userAboutApp-br"></View>
        <View className="userAboutApp-iconBox">
          <Image
            className="userAboutApp-iconBox-icon"
            src={$utils.loadimg.load(siteInfo.app_logo?.value)}
            mode="aspectFill"
          />
        </View>
        <View className="userAboutApp-title">
          账户注销后，将放弃以下权益
        </View>
        <View className="userAboutApp-titleTwo">
          1.你的身份、账户信息将清空
        </View>
        <View className="userAboutApp-titleTwo">
          2.隐患记录以及整改记录将清空且无法恢复
        </View>
        <View className="userAboutApp-titleThree">
          账户删除后历史记录可能产生的整改以及审核将视作自动放弃
        </View>
        <View className="userAboutApp-titleTwo">
          3.在您申请注销账户后，我们将在7个工作日内完成账号核查和注销处理
        </View>

        <SubmitBtn
          title="申请注销"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}
