import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { CleanList, BoxEmpty } from "@component";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0
  };

  componentDidMount() {
    // Taro.setNavigationBarColor({
    //   frontColor: "#000000",
    //   backgroundColor: "#ffffff"
    // });
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
      .load("CleanTypeList", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let v = res.rows || [];
          let dataTotal = res.total || 0;
          let listOld = this.state.list;
          let listNew = [];
          let list = [];
          v.map(item => {
            item.title=item.name
            item.tagArr = [];
            if (item.label) {
              item.tagArr = item.label.split(",");
            }
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
    console.log(data, "预约记录");
    Taro.navigateTo({
      url: `/pages/home/clean/info/index?id=${data.id}`
    });
  };
  render() {
    let { list, dataTotal } = this.state;
    return (
      <View className='cleanBox'>
        <View className='cleanBox-list'>
          {list.map((item, index) => (
            <CleanList
              info={item}
              getOnClick={this.getOnClick}
              key={index}
            ></CleanList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无保洁'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
