import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { AdvList, BoxEmpty } from "@component";
import ThreePng from "@assets/image/empty_box1.png";

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
  componentWillUnmount() {}
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 2;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    global.$utils.api
      .load("announcementList", d, "get", false)
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
    }, 1000);
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
  //详情
  goInfo = data => {
    Taro.navigateTo({
      url: `/pages/richText/index?id=${data.id}&title=${data.title}&type=homeNews`
    });
  };
  render() {
    let { list, dataTotal } = this.state;
    return (
      <View className='cleanBox'>
        <View className='cleanBox-list'>
          {list.map((item, index) => (
            <AdvList
              info={item}
              getOnClick={this.getOnClick}
              goInfo={this.goInfo}
              key={index}
            ></AdvList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无公告'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
