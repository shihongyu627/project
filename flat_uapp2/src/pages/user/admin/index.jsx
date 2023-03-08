import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { AdminList, BoxEmpty } from "@component";
import ThreePng from "@assets/image/empty_box1.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0
  };

  componentDidMount() {
    this.load();
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
    global.$utils.api
      .load("roomRelation", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let v = res.data || [];
          // let dataTotal = res.total || 0;
          // let listOld = this.state.list;
          // let listNew = [];
          // let list = [];
          v.map(item => {
            item.content='生活琐事我帮您，我是管家'
          });
          // list = [...listOld, ...listNew];
          // console.log(list);
          this.setState({
            list: v,
            // dataTotal
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
  onPullDownRefresh = () => {
    this.searchList();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  //滑动加载
  onReachBottom = () => {
    let { dataTotal, list } = this.state;
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1
      },
      () => {
        if (dataTotal > list.length) {
          this.load();
        }
      }
    );
  };
  searchList = () => {
    this.setState(
      {
        pageIndex: 1,
        list: []
      },
      () => {
        this.load();
      }
    );
  };
  render() {
    let { list, dataTotal } = this.state;
    return (
      <View className='noticeBox'>
        <View className='noticeBox-list'>
          {list.map((item, index) => (
            <AdminList info={item} key={index}></AdminList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无管家'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
