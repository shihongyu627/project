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
      detail: {},
      stepsList: [],
      height: 667,
      type: "",
      initState: 3
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let type = params.type;
    console.log(id, type, "传过来的值");
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState(
      {
        id,
        type,
        height: windowHeight
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
    url = `${global.base_host}/maintainer/flat/surrender/${id}`;
    d.id = id;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let detail = res.data || {};
          let initState = 3; //其他状态 1待处理  2已完成
          if (detail.state == 0) {
            initState = 1;
          }
          if (detail.state == 5) {
            initState = 2;
          }
          let stepsList = [];
          let logArr = detail.log || [];
          logArr.map(item => {
            stepsList.unshift(item);
          });
          this.setState({
            detail,
            initState,
            stepsList
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
    let { detail, stepsList, height, type, imageArr, initState } = this.state;
    return (
      <View className="rentInfo">
          <View className="rentInfo-br"></View>
          <View className="rentInfo-content">
            <View>
              <View className="rentInfo-content-item">
                <View className="rentInfo-content-item-title">房间号</View>
                <View className="rentInfo-content-item-text">
                  {detail.roomName}
                </View>
              </View>
              <View className="rentInfo-content-item">
                <View className="rentInfo-content-item-title">退租日期</View>
                <View className="rentInfo-content-item-text">
                  {detail.surrenderTime}
                </View>
              </View>
              <View className="rentInfo-content-item">
                <View className="rentInfo-content-item-title">姓名</View>
                <View className="rentInfo-content-item-text">
                  {detail.name}
                </View>
              </View>
              <View className="rentInfo-content-item">
                <View className="rentInfo-content-item-title">联系电话</View>
                <View className="rentInfo-content-item-text">
                  {detail.cusPhone}
                </View>
              </View>
              {detail.aliPay ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">
                    支付宝账号
                  </View>
                  <View className="rentInfo-content-item-text">
                    {detail.aliPay}
                  </View>
                </View>
              ) : null}
              {detail.account ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">
                    银行卡卡号
                  </View>
                  <View className="rentInfo-content-item-text">
                    {detail.account}
                  </View>
                </View>
              ) : null}

              {detail.bankName ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">开户行</View>
                  <View className="rentInfo-content-item-text">
                    {detail.bankName}
                  </View>
                </View>
              ) : null}

              {detail.cardSite ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">开户地</View>
                  <View className="rentInfo-content-item-text">
                    {detail.cardSite}
                  </View>
                </View>
              ) : null}

              {detail.amount ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">总金额</View>
                  <View className="rentInfo-content-item-text">
                    {detail.amount}
                  </View>
                </View>
              ) : null}
              {detail.roomCost ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">房租费</View>
                  <View className="rentInfo-content-item-text">
                    {detail.roomCost}
                  </View>
                </View>
              ) : null}
              {detail.depositCost ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">房租费</View>
                  <View className="rentInfo-content-item-text">
                    {detail.depositCost}
                  </View>
                </View>
              ) : null}
              {detail.electricCost ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">电费</View>
                  <View className="rentInfo-content-item-text">
                    {detail.electricCost}
                  </View>
                </View>
              ) : null}
              {detail.waterCost ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">水费</View>
                  <View className="rentInfo-content-item-text">
                    {detail.waterCost}
                  </View>
                </View>
              ) : null}
              {detail.propertyCost ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">物业费</View>
                  <View className="rentInfo-content-item-text">
                    {detail.propertyCost}
                  </View>
                </View>
              ) : null}
              {detail.otherCost ? (
                <View className="rentInfo-content-item">
                  <View className="rentInfo-content-item-title">
                    其他费用
                  </View>
                  <View className="rentInfo-content-item-text">
                    {detail.otherCost}
                  </View>
                </View>
              ) : null}
              {detail.descr ? (
                <View>
                  <View className="rentInfo-content-item">
                    <View className="rentInfo-content-item-title">
                      退租原因
                    </View>
                  </View>
                  <View className="rentInfo-content-txt">{detail.descr}</View>
                </View>
              ) : null}
              {detail.refuse ? (
                <View>
                  <View className="rentInfo-content-item">
                    <View className="rentInfo-content-item-title">
                      拒绝原因
                    </View>
                  </View>
                  <View className="rentInfo-content-txt">
                    {detail.refuse}
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          <View className="rentInfo-bottomBr"></View>
      </View>
    );
  }
}

export default Index;
