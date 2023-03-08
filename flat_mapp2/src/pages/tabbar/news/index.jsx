import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { NewsList, BoxEmpty, NewsNavBar } from "@component";
import ThreePng from "@assets/share/share_qq.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0,
    height: 667
  };

  componentDidMount() {
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState({
      height: windowHeight
    });
    Taro.eventCenter.on("refreshNewsList", val => {
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
    Taro.eventCenter.off("refreshNewsList");
  }
  componentDidShow() {
    $utils.auth.messageAll("butler");
    this.searchList();
  }
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let userType = $utils.data.get("userType");

    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    let flatId = $utils.data.get("flatId") || "";
    d.flatId = flatId;
    d.receiveType = "butler";
    if (userType == "PROPERTY") {
      d.receiveType = "property";
    }
    global.$utils.api
      .load("messageList", d, "get", { loading: false, login: true })
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
  onPullDownRefresh = () => {
    this.searchList();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  //滑动加载
  onReachBottom = () => {
    console.log("滑动");
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
  searchList = () => {
    this.setState(
      {
        pageIndex: 1,
        list: []
      },
      () => {
        let flatId = $utils.data.get("flatId") || "";
        if (!flatId) {
          return;
        }
        this.load();
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
    d.type = "butler";
    global.$utils.api
      .load("messageReadAll", d, "get", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        setTimeout(() => {
          $utils.auth.messageAll("butler");
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
