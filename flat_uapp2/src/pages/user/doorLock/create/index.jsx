import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Picker, Textarea, ScrollView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { InputText, SubmitBtn } from "@component";
import { getWindowHeight } from "@utils/style";
import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsPassWord: "", //新密码
      oldPassWord: "", //旧密码
      confirmPassWord: "", //确认密码
      passwork: "",
      roomId: "",
      roomName: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let roomId = params.roomId;
    let passwork = params.passwork;
    let roomName = params.roomName;
    console.log(roomId, passwork,roomName, "传过来的值");
    this.setState({
      roomId,
      passwork,
      roomName
    });
  }

  async componentWillUnmount() {}
  changeNewsPassWord = data => {
    this.setState({
      newsPassWord: data
    });
  };
  changeOldPassWord = data => {
    this.setState({
      oldPassWord: data
    });
  };
  changeConfirmPassWord = data => {
    this.setState({
      confirmPassWord: data
    });
  };
  handleSubmit = () => {
    let {
      newsPassWord,
      oldPassWord,
      confirmPassWord,
      roomName,
      roomId
    } = this.state;
    let d = {};
    d.passwork = newsPassWord;
    d.roomId = roomId;
    d.roomName = roomName;
    // if (!oldPassWord) {
    //   global.$utils.toast.text("请输入原密码");
    //   return;
    // }
    if (!newsPassWord) {
      global.$utils.toast.text("请输入新密码");
      return;
    }
    if (newsPassWord != confirmPassWord) {
      global.$utils.toast.text("密码不一致,请重新确认");
      return;
    }
    Taro.showLoading({
      title: "loading"
    });
    global.$utils.api
      .load("doorAdd", d, "post", { loading: false, login: true })
      .then(res => {
        Taro.hideLoading();
        Taro.showModal({
          title: "提示",
          content: res.msg,
          showCancel: res.code == 200 ? false : true,
          success: function(res) {
            if (res.confirm) {
              Taro.eventCenter.trigger("refreshDoor", true);
              Taro.navigateBack();
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
    console.log(d, "提交的数据");
  };
  oldPassWord = data => {
    this.setState({
      oldPassWord: data
    });
  };
  confirmPassWord = data => {
    this.setState({
      confirmPassWord: data
    });
  };
  newsPassWord = data => {
    this.setState({
      newsPassWord: data
    });
  };
  render() {
    let { oldPassWord, newsPassWord, confirmPassWord, passwork,roomName } = this.state;
    return (
      <View className="doorLockCreate">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className="doorLockCreate-br" />
          <View className="doorLockCreate-box">
            <InputText
              title="房间名称"
              type="text"
              style={{ border: 0 }}
              // onInput={this.oldPassWord}
              value={roomName}
              disabled
            ></InputText>
            <InputText
              title="新密码"
              type="number"
              style={{ border: 0 }}
              onInput={this.newsPassWord}
              value={newsPassWord}
            ></InputText>
            <InputText
              title="确认新密码"
              type="number"
              style={{ border: 0 }}
              onInput={this.confirmPassWord}
              value={confirmPassWord}
            ></InputText>
          </View>
        </ScrollView>
        <SubmitBtn title="提交" handleSubmit={this.handleSubmit}></SubmitBtn>
      </View>
    );
  }
}

export default Index;
