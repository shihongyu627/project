import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";
import useravatar from "@assets/image/useravatar.png";
import "./index.scss";
import { SubmitBtn, BoxUpload } from "@component";
import headerBg from "@assets/image/headerBg.png";
import rightPng from "@assets/image/right.png";
import { loginSuccess } from "../../../store/actions/user";
import store from "../../../store";
import { connect } from "react-redux";
class Index extends Component {
  state = {
    list: [],
    headImg: "",
    userInfo: {}
  };

  componentDidMount() {
    this.loadData();
  }
  componentWillUnmount() {}
  componentDidShow() {}
  loadData = () => {
    Taro.showLoading({
      title: "loading"
    });
    let userInfo = this.props.userInfo || {};
    let list = [
      {
        name: "头像",
        headImg: userInfo.user_head ? userInfo.user_head : useravatar
      },
      {
        name: "姓名",
        text: userInfo.user_nick || ""
        // url: `/pages/user/nickName/index?nickName=${userInfo.user_nick}`
      },
      {
        name: "手机号",
        text: userInfo.user_mobile || ""
        // url: `/pages/user/nickName/index?user_mobile=${userInfo.user_mobile}`
      },
      {
        name: "注销账户",
        image: rightPng,
        url: "/pages/user/logout/index"
      }
    ];

    this.setState({
      list,
      userInfo
    });
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
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
    Taro.showModal({
      title: "提示",
      content: "是否退出登录",
      confirmText: "确定",
      confirmColor: "#0A74E9"
    }).then(res1 => {
      if (res1.confirm) {
        $utils.data.remove("token");
        $utils.data.remove("userInfo");
        $utils.auth.logout();
        $utils.auth.checklogin();
      } else if (res1.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  // setAvatar = src => {
  //   this.setState(
  //     {
  //       headImg: src
  //     },
  //     () => {
  //       this.modifyheadimg();
  //     }
  //   );
  // };
  // modifyheadimg = () => {
  //   let { headImg } = this.state;
  //   console.log(headImg, 9999);
  //   let d = {};
  //   d.headimg = headImg;
  //   $utils.api
  //     .load("modifyheadimg", d, "post", { loading: false, login: true })
  //     .then(result => {
  //       $utils.toast.text(result.message);
  //       if (result.code == 0) {
  //         setTimeout(() => {
  //           this.loadData();
  //         }, 500);
  //       }
  //     });
  // };

  render() {
    let { list, userInfo } = this.state;
    return (
      <View className="userInfo">
        <View className="userInfo-menuBox">
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
                Taro.navigateTo({
                  url: item.url
                });
              }}
            >
              <View className="userInfo-menuBox-item-left">
                <View className="userInfo-menuBox-item-left-titleBox">
                  <View className="userInfo-menuBox-item-left-titleBox-title">
                    {item.name}
                  </View>
                </View>
              </View>
              <View className="userInfo-menuBox-item-right">
                {item.headImg ? (
                  <Image
                    className="userInfo-menuBox-item-right-headImg"
                    src={
                      item.headImg
                        ? global.$utils.loadimg.load(item.headImg)
                        : useravatar
                    }
                    mode="aspectFill"
                  />
                ) : // <View className="userInfo-menuBox-item-right-headImg">
                //   <BoxUpload
                //     className="userInfo-menuBox-item-right-headImg"
                //     title="添加图片"
                //     setImage={false}
                //     source={global.$utils.loadimg.load(item.headImg)}
                //     setImg={this.setAvatar}
                //     count={1}
                //   />
                // </View>
                null}
                {item.image ? (
                  <Image
                    className="userInfo-menuBox-item-right-icon"
                    src={item.image}
                    mode="aspectFill"
                  />
                ) : null}
                {item.text ? (
                  <View className="userInfo-menuBox-item-right-text">
                    {item.text}
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
        <SubmitBtn
          title="安全退出"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}
const mapStoreToProps = store => ({
  userInfo: store.user
});
const mapDispatchToProps = dispatch => ({
  // dispatch: dispatch
});
export default connect(mapStoreToProps, mapDispatchToProps)(Index);
