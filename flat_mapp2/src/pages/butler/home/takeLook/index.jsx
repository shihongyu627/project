import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { TakeLookList, BoxEmpty, CommonSearch } from "@component";
import ThreePng from "@assets/share/share_qq.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0,
    searchValue: ""
  };

  componentDidMount() {
    // Taro.setNavigationBarColor({
    //   frontColor: "#000000",
    //   backgroundColor: "#ffffff"
    // });
    this.load();
    Taro.eventCenter.on("refreshTakeLookList", val => {
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
    Taro.eventCenter.off("refreshTakeLookList");
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
    d.name = this.state.searchValue;
    let flatId = $utils.data.get("flatId") || "";
    d.flatId = flatId;
    global.$utils.api
      .load("flatmakeList", d, "get", { loading: false, login: true })
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
  //拨打电话
  telPhoneOnClick = data => {
    let phone = data.phone || "";
    if (!phone) {
      return;
    }
    Taro.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    });
  };
  //确认带看
  onClickConfrim = data => {
    if (data.state == 4) {
      Taro.navigateTo({
        url: `/pages/butler/home/InitiateSign/index?makeId=${data.id}`
      });
      return;
    }
    let that = this;
    Taro.showModal({
      title: "温馨提示",
      content: "是否确认带看？"
    }).then(res => {
      if (res.confirm) {
        console.log("999");
        that.flatMake(data);
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  flatMake = data => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.id = data.id;
    d.state = 4;
    global.$utils.api
      .load("flatMake", d, "put", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          this.setState(
            {
              pageIndex: 1,
              list: []
            },
            () => {
              this.load();
            }
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  //搜索
  searchConfirm = data => {
    this.setState(
      {
        searchValue: data,
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
      url: `/pages/butler/home/takeLook/info/index?id=${data.id}`
    });
  };
  render() {
    let { list, dataTotal } = this.state;
    return (
      <View className='TakeLookBox'>
        <CommonSearch searchConfirm={this.searchConfirm}></CommonSearch>
        <View className='TakeLookBox-list'>
          {list.map((item, index) => (
            <TakeLookList
              info={item}
              telPhoneOnClick={this.telPhoneOnClick}
              key={index}
              onClickConfrim={this.onClickConfrim}
              goInfo={this.goInfo}
            ></TakeLookList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无记录'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
