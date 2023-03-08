import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image } from "@tarojs/components";

import "./index.scss";
import { SubmitBtn, BoxUpload } from "@component";
import rightPng from "@assets/image/right.png";

export default class Index extends Component {
  state = {
    list: [],
    headImg: "",
    userInfo: {}
  };

  componentDidMount() {}
  componentDidShow() {
    this.loadData();
  }
  loadData = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    global.$utils.api
      .load("getInfo", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let userInfo = res.user || {};
          $utils.data.set("userInfo", userInfo || {});
          $utils.data.set("isLogin", true);
          global.isLogin = true;
          let list = [
            {
              name: "头像",
              image: rightPng,
              headImg: userInfo.avatar
            },
            {
              name: "姓名",
              text: userInfo.isReal == 1 ? userInfo.realName : "未认证",
              url: userInfo.isReal == 1 ? "" : "/pages/user/cardInfo/list/index"
            },
            {
              name: "昵称",
              text: userInfo.nickName,
              url: `/pages/user/nickName/index?nickName=${userInfo.nickName}`
            }
          ];
          this.setState({
            list
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.loadData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };

  //提现
  handleSubmit = () => {
    $utils.toast.islogoutModal("温馨提示", "是否退出登录", 1);
  };
  setAvatar = src => {
    console.log(src, "xxxx");
    this.setState(
      {
        headImg: src
      },
      () => {
        this.modifyheadimg();
      }
    );
  };
  modifyheadimg = () => {
    let { headImg } = this.state;
    console.log(headImg, 9999);
    let d = {};
    d.avatar = headImg;
    $utils.api
      .load("avatarAuth", d, "get", { loading: false, login: true })
      .then(result => {
        $utils.toast.text(result.msg);
        if (result.code == 200) {
          $utils.data.set("CustomerToken", result.data.token);
          setTimeout(() => {
            this.loadData();
          }, 100);
        }
      });
  };

  render() {
    let { list } = this.state;
    return (
      <View className='userInfo'>
        <View className='userInfo-menuBox'>
          {list.map((item, index) => (
            <View
              className={
                index == 0 ? "userInfo-menuBox-items" : "userInfo-menuBox-item"
              }
              key={index}
              onClick={() => {
                if (item.type == "copy") {
                  if (!item.text) {
                    return;
                  }
                  Taro.setClipboardData({
                    data: item.text,
                    success: function(res1) {
                      console.log(res1);
                      Taro.getClipboardData({
                        success: function(res) {
                          console.log(res.data); // data
                        }
                      });
                    }
                  });
                  return;
                }
                if (!item.url) {
                  return;
                }
                Taro.navigateTo({
                  url: item.url
                });
              }}
            >
              <View className='userInfo-menuBox-item-left'>
                <View className='userInfo-menuBox-item-left-titleBox'>
                  <View className='userInfo-menuBox-item-left-titleBox-title'>
                    {item.name}
                  </View>
                </View>
              </View>
              <View className='userInfo-menuBox-item-right'>
                {item.headImg ? (
                  <View className='userInfo-menuBox-item-right-headImg'>
                    <BoxUpload
                      className='userInfo-menuBox-item-right-headImg'
                      title='添加图片'
                      setImage={false}
                      source={global.$utils.loadimg.load(item.headImg)}
                      setImg={this.setAvatar}
                      count={1}
                    />
                  </View>
                ) : index == 0 ? (
                  <View className='userInfo-menuBox-item-right-headImg'>
                    <BoxUpload
                      className='userInfo-menuBox-item-right-headImg'
                      title='添加图片'
                      setImage={false}
                      source={global.$utils.loadimg.load(item.headImg)}
                      setImg={this.setAvatar}
                      count={1}
                    />
                  </View>
                ) : null}
                {item.image ? (
                  <Image
                    className='userInfo-menuBox-item-right-icon'
                    src={item.image}
                    mode='aspectFill'
                  />
                ) : null}
                {item.text ? (
                  <View className='userInfo-menuBox-item-right-text'>
                    {item.text}
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
        <SubmitBtn
          title='安全退出'
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}
