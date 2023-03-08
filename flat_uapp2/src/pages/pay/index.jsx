import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { SubmitBtn } from "@component";
import checkedPng from "@assets/image/invoice_checked.png";
import noCheckedPng from "@assets/image/invoice_noChecked.png";
import weixin from "@assets/image/weixin.png";
import zhifubao from "@assets/image/zhifubao.png";

export default class Index extends Component {
  state = {
    list: [],
    type: null,
    id: "",
    payData: null,
    money: "",
    typeName: "",
    rechargeType: ""
  };

  componentDidMount() {
    Taro.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#ffffff"
    });
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let money = params.money;
    let typeName = params.typeName;
    let rechargeType = params.rechargeType; //充值

    let list = [
      {
        name: "微信支付",
        type: 2,
        icon: weixin
      }
    ];
    if (process.env.TARO_ENV === "rn") {
      list = [
        {
          name: "支付宝",
          type: 1,
          icon: zhifubao
        },
        {
          name: "微信支付",
          type: 3,
          icon: weixin
        }
      ];
    }
    this.setState({
      id,
      list,
      money,
      typeName,
      rechargeType
    });
  }
  rechargeLoad = () => {
    let { id, type, rechargeType, money } = this.state;
    // Taro.showLoading({
    //   title: "loading"
    // });
    let d = {};
    d.sourceId = id;
    d.payType = type;
    d.money = money;
    d.type = rechargeType;
    global.$utils.api
      .load("accountPay", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          this.setState({
            payData: res.data
          });
        } else {
          $utils.toast.text(res.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
    // setTimeout(() => {
    //   Taro.hideLoading();
    // }, 1200);
  };
  load = () => {
    let { id, type } = this.state;
    // Taro.showLoading({
    //   title: "loading"
    // });
    let d = {};
    d.id = id;
    d.type = type;
    global.$utils.api
      .load("payBill", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          this.setState({
            payData: res.data
          });
        } else {
          $utils.toast.text(res.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
    // setTimeout(() => {
    //   Taro.hideLoading();
    // }, 1200);
  };
  handleSubmit = () => {
    let { payData } = this.state;
    console.log("立即支付");
    if (!payData) {
      return;
    }
    let t = {};
    t.out_trade_no = "";
    if (process.env.TARO_ENV === "rn") {
      t.paytype = "app";
    } else {
      t.paytype = "mapp";
    }
    let style = "";
    if (this.state.type === 2) {
      style = "wechatMapp";
    }
    if (this.state.type === 1) {
      style = "alipay";
    }
    if (this.state.type === 3) {
      style = "wechatApp";
    }
    $utils.pay.pay(style, payData);
  };
  render() {
    let { list, type, money, typeName, rechargeType } = this.state;
    return (
      <View className="payBox">
        <View className="payBox-header">
          {/* <View className='payBox-header-one'>
            <View className='payBox-header-one-left'>支付剩余时间</View>
            <View className='payBox-header-one-right'>09:53</View>
          </View> */}
          <View className="payBox-header-two">
            <View className="payBox-header-two-left">￥</View>
            <View className="payBox-header-two-left payBox-header-two-right">
              {money}
            </View>
          </View>
          <View className="payBox-header-three">{typeName}</View>
        </View>
        <View className="payBox-content">
          {list.map((item, index) => (
            <View className="payBox-content-item" key={index}>
              <View className="payBox-content-item-left">
                <Image
                  className="payBox-content-item-left-img"
                  src={item.icon}
                  mode="aspectFill"
                />
                <View className="payBox-content-item-left-title">
                  {item.name}
                </View>
              </View>
              <View
                className="payBox-content-item-right"
                onClick={() => {
                  if (item.type == type) {
                    return;
                  }
                  this.setState(
                    {
                      type: item.type
                    },
                    () => {
                      if (rechargeType) {
                        this.rechargeLoad();
                        return;
                      }
                      this.load();
                    }
                  );
                }}
              >
                <Image
                  className="payBox-content-item-right-img"
                  src={type == item.type ? checkedPng : noCheckedPng}
                  mode="aspectFill"
                />
              </View>
            </View>
          ))}
        </View>
        <SubmitBtn
          title="立即支付"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}
