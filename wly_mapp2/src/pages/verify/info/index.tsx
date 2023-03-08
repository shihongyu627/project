import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image } from "@tarojs/components";

import "./index.scss";
import getCoupon from "@/assets/image/getCoupon.png";
import navBar_back1 from "@/assets/image/goodsInfo_back.png";
export default class Index extends Component {
  state = {
    pageIndex: 1,
    code: "",
    details: {}
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let code = params.code;
    if (!Taro.getStorageSync("verifyToken")) {
      Taro.redirectTo({
        url: `/pages/verify/auth/index`
      });
    }
    this.setState(
      {
        code
      },
      () => {
        if (code) {
          this.loadData();
        }
      }
    );
  }
  componentWillUnmount() {}
  loadData = () => {
    Taro.showLoading({
      title: "loading"
    });
    let that = this;
    let d = {};
    d.code = this.state.code;
    Taro.request({
      url: global.verifyInfo,
      data: d,
      method: "GET",
      success: function(res) {
        let v = res.data || {};
        if (v.data) {
          that.setState({
            details: v.data
          });
          // let token = v.data.token;
          // Taro.redirectTo({
          //   url: `/pages/verify/scan/index`
          // });
        } else {
          Taro.showToast({
            title: v.message || "请求错误",
            icon: "none",
            duration: 1500
          });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        }
      },
      fail: function(res) {
        console.log(res);
      },
      header: {
        "content-type": "application/json",
        Authorization: Taro.getStorageSync("verifyToken")
      }
    });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };
  couponReceive = () => {
    Taro.showLoading({
      title: "loading"
    });
    let that = this;
    let d = {};
    d.record_code = this.state.code;
    Taro.request({
      url: global.verifyCoupon,
      data: d,
      method: "GET",
      success: function(res) {
        let v = res.data || {};
        Taro.showToast({
          title: v.message || "请求错误",
          icon: "none",
          duration: 1500
        });
        if (v.code == 1) {
          setTimeout(() => {
            that.loadData();
          }, 500);
        }
      },
      fail: function(res) {
        console.log(res);
      },
      header: {
        "content-type": "application/json",
        Authorization: Taro.getStorageSync("verifyToken")
      }
    });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };
  //更多
  render() {
    let { details } = this.state;
    return (
      <View className="userCouponInfo">
        <View
          className="userCouponInfo-backImgBox"
          onClick={() => {
            Taro.navigateBack();
          }}
        >
          <Image
            className="userCouponInfo-backImgBox-backImg"
            src={navBar_back1}
          ></Image>
        </View>
        <Image
          src={getCoupon}
          className="userCouponInfo-headerBg"
          mode="widthFix"
        />
        <View className="userCouponInfo-one">{details.name}</View>
        <View className="userCouponInfo-two">￥{details.money}</View>
        <View className="userCouponInfo-three">满{details.at_least}元使用</View>
        {details.store_name ? (
          <View className="userCouponInfo-Four">
            仅限{details.store_name}使用
          </View>
        ) : null}
        {details.status == 1 ? (
          <View
            className="userCouponInfo-btn"
            onClick={() => {
              this.couponReceive();
            }}
          >
            立即核销
          </View>
        ) : (
          <View className="userCouponInfo-btn1">已核销</View>
        )}
      </View>
    );
  }
}
