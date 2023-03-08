import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { AgreementList, BoxEmpty } from "@component";
import ThreePng from "@assets/image/common_bg.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0
  };

  componentDidMount() {
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
    let flatId = $utils.data.get("flatId") || "";
    d.flatId = flatId;
    global.$utils.api
      .load("flatcontractList", d, "get", { loading: false, login: true })
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
  //点击事件类型
  getOnClick = data => {
    if (data.state == 2) {
      Taro.navigateTo({
        url: `/pages/butler/home/InitiateSign/index?id=${data.id}`
      });
      return;
    }
    let that = this;
    //1 立即预约  2  发送催缴  3 撤回
    let content = "";
    // if (type == 1) {
    //   content = "是否立即预约？";
    // }
    // if (data.state == 4) {
    //   content = "是否发送催缴？";
    // }
    if (data.state == 0) {
      content = "是否撤回？";
    }
    Taro.showModal({
      title: "温馨提示",
      content: content
    }).then(res => {
      if (res.confirm) {
        console.log("999");
        that.confirmClick(data);
      } else if (res.cancel) {
        console.log("用户点击撤回");
      }
    });
  };
  //确认
  confirmClick = data => {
    Taro.showLoading({
      title: "loading"
    });
    //1 立即预约  2  发送催缴  3 撤回
    let url = "";
    let d = {};
    if (data.state == 0) {
      url = "contractRevocation";
      d.state = "0";
    }
    d.id = data.id;
    global.$utils.api
      .load(url, d, "put", { loading: false, login: true })
      .then(res => {
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

  goInfo = data => {
    Taro.navigateTo({
      url: `/pages/butler/home/agreement/info/index?id=${data.id}`
    });
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
