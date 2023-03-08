import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { AgreementList, BoxEmpty } from "@component";
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
    Taro.eventCenter.on("refreshAgreementList", val => {
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
    Taro.eventCenter.off("refreshAgreementList");
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
      .load("contractList", d, "get", { loading: false, login: true })
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
  //详情
  goInfo = data => {
    Taro.navigateTo({
      url: `/pages/user/agreement/info/index?id=${data.id}`
    });
  };
  //点击事件类型
  getOnClick = (data, type) => {
    let that = this;
    //1 立即预约  2  续租  3 取消
    let content = "";
    if (type == 1) {
      content = "是否立即签约？";
    }
    if (type == 2) {
      content = "是否续租？";
    }
    if (type == 3) {
      content = "是否取消？";
    }
    Taro.showModal({
      title: "温馨提示",
      content: content
    }).then(res => {
      if (res.confirm) {
        console.log("999");
        that.confirmClick(data, type);
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  //确认
  confirmClick = (data, type) => {
    //1 立即预约  2  续租  3 取消
    // Taro.showLoading({
    //   title: "loading"
    // });
    let url = "";
    let d = {};
    if (type == 1) {
      Taro.navigateTo({
        url: `/pages/user/agreement/signAgreement/index?url=${data.contractUrl}`
      });
      return;
    }
    if (type == 2) {
      url = `${global.base_host}/customer/flat/contract/relet/${data.id}`;
    }
    d.id = data.id;
    global.$utils.api
      .load(url, d, "put", { loading: false, login: true })
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
  render() {
    let { list, dataTotal } = this.state;
    return (
      <View className='cleanBox'>
        <View className='cleanBox-list'>
          {list.map((item, index) => (
            <AgreementList
              info={item}
              getOnClick={this.getOnClick}
              goInfo={this.goInfo}
              key={index}
            ></AgreementList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无合同'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
