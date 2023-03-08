import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image, ScrollView } from "@tarojs/components";
import "./index.scss";
import { BoxEmpty, ItemNews, FooterLine } from "@component";
export default class News extends Component {
  state = {
    pageIndex: 1,
    list: [],
    height: 667,
    dataTotal: 0,
    type: ""
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let type = params.type;
    this.setState(
      {
        type
      },
      () => {
        this.loadData();
      }
    );
  }
  componentWillUnmount() {}
  componentDidShow() {}
  loadData = async () => {
    let d = {};
    let result = {};
    d.page = this.state.pageIndex;
    d.psize = 10;
    d.type = this.state.type;
    try {
      result = await $utils.api.load("messageLists", d, "get", {
        loading: true,
        login: true
      });
      if (result.data) {
        let v = result.data.list || [];
        v.map(item => {
          if (item.notice_data) {
            item.notice_Obj = JSON.parse(item.notice_data);
            let obj = item.notice_Obj || {};
            let arr = [];
            for (const key in obj) {
              let newObj = {};
              newObj.title = key;
              newObj.stitle = obj[key];
              arr.push(newObj);
            }
            item.contentArr = arr;
          }
        });
        this.setState({
          list: this.state.pageIndex === 1 ? v : this.state.list.concat(v),
          dataTotal: result?.data?.page?.total || 0
        });
      } else {
        Taro.hideLoading();
      }
    } catch (error) {
      Taro.hideLoading();
    }
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.commonSearch();
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
          this.loadData();
        }
      }
    );
  };
  commonSearch = () => {
    this.setState(
      {
        list: [],
        pageIndex: 1
      },
      () => {
        this.loadData();
      }
    );
  };
  goInfo = async data => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let result = {};
    d.message_id = data.message_id;
    try {
      result = await $utils.api.load("messageRead", d, "post", {
        loading: false,
        login: true
      });
      if (result.code == 1) {
        Taro.eventCenter.trigger("refreshMessageBadge", true);
        this.loadData();
      }
    } catch (error) {
      Taro.hideLoading();
    }
    if (!data.url) {
      return;
    }
    Taro.navigateTo({
      url: data.url
    });
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  messageRead = data => {};
  render() {
    let { list } = this.state;
    return (
      <View className="newsBox">
        {list.map((item, index) => {
          return (
            <ItemNews key={index} info={item} goInfo={this.goInfo}></ItemNews>
          );
        })}
        {list && list.length != 0 ? (
          <FooterLine title="没有更多数据了~"></FooterLine>
        ) : (
          <BoxEmpty title="暂无内容"></BoxEmpty>
        )}
      </View>
    );
  }
}
