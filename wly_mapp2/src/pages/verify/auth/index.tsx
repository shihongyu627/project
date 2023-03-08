import { Component } from "react";
import { View, Text, Input } from "@tarojs/components";
import Md5 from "crypto-js/md5";
import "./index.scss";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {
    width: 750,
    height: 667,
    username: "",
    password: "",
    isOpened: false,
    adminPhone: ""
  };
  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {}
  //忘记密码
  onForgetClick = () => {
    this.setState({
      isOpened: true
    });
  };
  //登录
  onClickLogin = async () => {
    let { username, password } = this.state;
    if (!username) {
      Taro.showToast({
        title: "请输入账号",
        icon: "none",
        duration: 1500
      });
      return;
    }
    if (!password) {
      Taro.showToast({
        title: "请输入密码",
        icon: "none",
        duration: 1500
      });
      return;
    }

    // 检测账号
    try {
      //检测账号
      let cres = await Taro.request({
        url: global.verifyAuthCheckUsername,
        data: { username },
        method: "POST",
        header: {
          "content-type": "application/json"
        }
      });
      let ss = "";
      if (cres?.data?.data) {
        ss = cres.data.data;
      }
      // 请求参数
      let q = {};
      q.username = username;
      // 加密请求参数
      q.password = Md5(Md5(password + ss).toString()).toString();
      q.scene = "login";
      // 加密请求参数base64加密
      let data = window.btoa(JSON.stringify(q));
      Taro.request({
        url: global.verifyAuth,
        data: { data },
        method: "POST",
        success: function(res) {
          let v = res.data || {};
          Taro.showToast({
            title: v.message || "请求错误",
            icon: "none",
            duration: 1500
          });
          if (v.data) {
            let token = v.data.token;
            Taro.setStorageSync("verifyToken", token);
            Taro.setStorageSync("verifyInfo", v.data);
            Taro.redirectTo({
              url: `/pages/verify/scan/index`
            });
          }
        },
        fail: function(res) {
          console.log(res);
        },
        header: {
          "content-type": "application/json"
        }
      });
    } catch (error) {
      console.log("login", error);
    }
  };
  //我的账号
  changeValNum = e => {
    this.setState({
      username: e.detail.value
    });
  };
  //我的密码
  changeValPassWord = e => {
    this.setState({
      password: e.detail.value
    });
  };
  render() {
    return (
      <View className='login_box'>
        <View className='title'>欢迎来到濮院物流</View>
        <View className='input_box'>
          <Input
            className='input_wp'
            onInput={this.changeValNum.bind(this)}
            type='text'
            placeholder='请输入账号'
          />
        </View>
        <View className='input_box'>
          <Input
            className='input_wp'
            onInput={this.changeValPassWord.bind(this)}
            type='text'
            placeholder='请输入密码'
            password
          />
        </View>
        <View className='login_btn' onClick={this.onClickLogin.bind(this)}>
          登录
        </View>
        <View className='login_br'></View>
      </View>
    );
  }
}
