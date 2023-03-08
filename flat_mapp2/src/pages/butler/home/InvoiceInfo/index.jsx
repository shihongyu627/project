import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { getWindowHeight } from "@utils/style";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {}
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    this.setState(
      {
        id
      },
      () => {
        this.load();
      }
    );
  }

  async componentWillUnmount() {}
  load = () => {
    let { type, id } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let url = "";
    url = `${global.base_host}/maintainer/flat/invoice/${id}`;
    d.id = id;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let detail = res.data || {};
          this.setState({
            detail
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  render() {
    let { detail } = this.state;
    return (
      <View className="invoiceInfo">
        <View className="invoiceInfo-br"></View>
        <View className="invoiceInfo-content">
          {detail.createBy ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">姓名</View>
              <View className="invoiceInfo-content-item-text">
                {detail.createBy}
              </View>
            </View>
          ) : null}
          {detail.invoiceTypeName ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">发票类型</View>
              <View className="invoiceInfo-content-item-text">
                {detail.invoiceTypeName}
              </View>
            </View>
          ) : null}
          {detail.riseTypeName ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">抬头类型</View>
              <View className="invoiceInfo-content-item-text">
                {detail.riseTypeName}
              </View>
            </View>
          ) : null}
          {detail.riseName ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">发票抬头</View>
              <View className="invoiceInfo-content-item-text">
                {detail.riseName}
              </View>
            </View>
          ) : null}
          {detail.dutyNo ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">单位税号</View>
              <View className="invoiceInfo-content-item-text">
                {detail.dutyNo}
              </View>
            </View>
          ) : null}
          {detail.registerSite ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">注册地址</View>
              <View className="invoiceInfo-content-item-text">
                {detail.registerSite}
              </View>
            </View>
          ) : null}
          {detail.registerPhone ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">注册电话</View>
              <View className="invoiceInfo-content-item-text">
                {detail.registerPhone}
              </View>
            </View>
          ) : null}
          {detail.bank ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">开户银行</View>
              <View className="invoiceInfo-content-item-text">
                {detail.bank}
              </View>
            </View>
          ) : null}
          {detail.bankAccount ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">银行账号</View>
              <View className="invoiceInfo-content-item-text">
                {detail.bankAccount}
              </View>
            </View>
          ) : null}
          {detail.email ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">邮箱</View>
              <View className="invoiceInfo-content-item-text">
                {detail.email}
              </View>
            </View>
          ) : null}
          {detail.phone ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">手机号码</View>
              <View className="invoiceInfo-content-item-text">
                {detail.phone}
              </View>
            </View>
          ) : null}
          {detail.amount ? (
            <View className="invoiceInfo-content-item">
              <View className="invoiceInfo-content-item-title">发票金额</View>
              <View className="invoiceInfo-content-item-text">
                {detail.amount}
              </View>
            </View>
          ) : null}
        </View>
        <View className="bottomBr"></View>
      </View>
    );
  }
}

export default Index;
