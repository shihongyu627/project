import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { DoorLockList, BoxEmpty } from "@component";
import ThreePng from "@assets/image/empty_box1.png";
// lock
export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],

    dataTotal: 0
  };

  componentDidMount() {
    this.load();
    Taro.eventCenter.on("refreshDoor", val => {
      this.setState(
        {
          list: [],
          pageIndex: 1
        },
        () => {
          this.load();
        }
      );
    });
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshDoor");
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
      .load("doorList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let v = res.rows || [];
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
  getOnClick = data => {
    console.log(data, "更改密码");
    let name = data?.room?.name || "";
    Taro.navigateTo({
      url: `/pages/user/doorLock/create/index?roomId=${data.roomId}&roomName=${name}`
    });
  };
  render() {
    let { list, dataTotal } = this.state;
    return (
      <View className="cleanBox">
        <View className="cleanBox-list">
          {list.map((item, index) => (
            <DoorLockList
              info={item}
              getOnClick={this.getOnClick}
              key={index}
            ></DoorLockList>
          ))}
          {list.length == 0 ? <BoxEmpty title="暂无门锁"></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
