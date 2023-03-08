import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { NewsList, BoxEmpty, NewsNavBar } from "@component";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],

    dataTotal: 0,
    showShare: false,
    height: 667
  };

  componentDidMount() {
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState({
      height: windowHeight
    });
  }
  componentDidShow() {
    $utils.auth.messageAll("customer");
    this.searchList();
  }
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.receiveType = "customer";
    d.orderByColumn = "id";
    d.isAsc = "descending";
    global.$utils.api
      .load("messageList", d, "get", { loading: false, login: true })
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
    }, 1200);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.searchList();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  // //滑动加载
  // onReachBottom = () => {
  //   console.log("滑动");
  //   let { dataTotal, list } = this.state;
  //   this.setState(
  //     {
  //       pageIndex: this.state.pageIndex + 1
  //     },
  //     () => {
  //       if (dataTotal > list.length) {
  //         this.load();
  //       }
  //     }
  //   );
  // };
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
  handleScroll = () => {
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
  goInfo = data => {
    if (!data.skipUrl) {
      return;
    }
    let d = {};
    d.id = data.id;
    global.$utils.api
      .load("messageRead", d, "get", { loading: false, login: true })
      .then(res => {
        Taro.navigateTo({
          url: data.skipUrl
        });
      })
      .catch(err => {
        console.log(err);
        Taro.navigateTo({
          url: data.skipUrl
        });
      });
  };
  messageReadAll = () => {
    let that = this;
    Taro.showModal({
      title: "提示",
      content: "是否清空未读消息？",
      success: function(res) {
        if (res.confirm) {
          setTimeout(() => {
            that.getReadAll();
          }, 300);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  };
  getReadAll = () => {
    let d = {};
    d.type = "customer";
    global.$utils.api
      .load("messageReadAll", d, "get", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        setTimeout(() => {
          $utils.auth.messageAll("customer");
          this.searchList();
        }, 500);
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    let { list, dataTotal, height } = this.state;
    return (
      <View className="news">
        <NewsNavBar
          title="消息中心"
          background="#fff"
          color="#333"
          className="news-headers"
          onClick={() => {
            this.messageReadAll();
          }}
        ></NewsNavBar>
        <ScrollView
          className="news-scrollDom"
          scrollY
          lowerThreshold={100}
          style={{
            height: height,
            position: "absolute",
            paddingTop: Taro.pxTransform(155),
            left: 0,
            right: 0
          }}
          onScrollToLower={this.handleScroll.bind(this)}
        >
          <View
            className="news-list"
          >
            {list.map((item, index) => (
              <NewsList info={item} goInfo={this.goInfo} key={index}></NewsList>
            ))}
            {list.length == 0 ? <BoxEmpty title="暂无消息"></BoxEmpty> : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}
