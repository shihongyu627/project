import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/image/empty_box1.png";
import { CommonSearch, TradeList, BoxEmpty } from "@component";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: "",
      list: [],
      pageIndex: 1,
      searchValue: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let title = params.title;
    console.log(id, title, "传过来的值");
    this.setState({
      id,
      title
    });
    this.load();
    Taro.eventCenter.on("refreshTradeList", val => {
      this.setState(
        {
          list: [],
          pageIndex: 1,
          searchValue: ""
        },
        () => {
          this.load();
        }
      );
    });
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshTradeList");
  }
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    let flatId = $utils.data.get("flatId") || "";
    d.flatId = flatId;
    d.cusName = this.state.searchValue;
    global.$utils.api
      .load("transactionList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let v = res.rows || [];
          console.log(v);
          let dataTotal = res.total || 0;
          let listOld = this.state.list;
          let listNew = [];
          let list = [];
          v.map(item => {
            listNew.push(item);
          });
          list = [...listOld, ...listNew];
          console.log(list);
          this.setState({
            list: list,
            dataTotal
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  //下拉刷新
  onPullDownRefresh = () => {};
  //搜索
  searchConfirm = data => {
    console.log(data);
    this.setState(
      {
        searchValue: data,
        list: [],
        pageIndex: 1
      },
      () => {
        this.load();
      }
    );
  };
  render() {
    let { detail, list } = this.state;
    return (
      <View className='tradeBox'>
        <CommonSearch searchConfirm={this.searchConfirm}></CommonSearch>
        <View className='tradeBox-list'>
          {list.map((item, index) => (
            <TradeList info={item} key={index}></TradeList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无流水'></BoxEmpty> : null}
        </View>
        <View className='tradeBox-bottomBr'></View>
      </View>
    );
  }
}

export default Index;
