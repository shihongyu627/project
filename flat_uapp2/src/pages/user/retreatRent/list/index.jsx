import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { RetreatRentList, BoxEmpty } from "@component";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    //动态设置当前页面的标题
    Taro.setNavigationBarTitle({
      title: '退租记录'
    });
    this.load();
  }
  load = () => {
    let { type } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    let url = "surrenderList";
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
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
    }, 1500);
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
  goInfo = data => {
    Taro.navigateTo({
      url: `/pages/user/retreatRent/info/index?id=${data.id}&type=${this.state.type}`
    });
  };
  render() {
    let { list, dataTotal, type } = this.state;
    return (
      <View className='RetreatRentBox'>
        <View className='RetreatRentBox-list'>
          {list.map((item, index) => (
            <RetreatRentList
              info={item}
              getOnClick={this.getOnClick}
              key={index}
              goInfo={this.goInfo}
              type={type}
            ></RetreatRentList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无记录'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
