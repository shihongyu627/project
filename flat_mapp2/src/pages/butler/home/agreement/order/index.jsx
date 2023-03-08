import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { AgreementOrder, BoxEmpty, CommonSearch } from "@component";
import ThreePng from "@assets/image/common_bg.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0,
    status: 1,
    searchValue: ""
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let status = params.status;
    let title = params.title;
    Taro.setNavigationBarTitle({
      title: title
    });
    this.setState(
      {
        status
      },
      () => {
        this.load();
      }
    );
    Taro.eventCenter.on("refreshAgreementOrder", val => {
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
    Taro.eventCenter.off("refreshAgreementOrder");
  }
  load = () => {
    console.log(555);
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    d.searchValue = this.state.searchValue;
    d.type = this.state.status;
    let flatId = $utils.data.get("flatId") || "";
    d.flatId = flatId;
    global.$utils.api
      .load("flatcontractList", d, "get", { loading: false, login: true })
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
  //查看合同
  onClickLook = data => {
    Taro.navigateTo({
      url: `/pages/butler/home/agreement/info/index?id=${data.id}`
    });
  };
  //撤回
  getOnClick = data => {
    if (data.state == 2) {
      Taro.navigateTo({
        url: `/pages/butler/home/InitiateSign/index?id=${data.id}`
      });
      return;
    }
    let that = this;
    Taro.showModal({
      title: "温馨提示",
      content: "是否撤回签约？"
    }).then(res => {
      if (res.confirm) {
        that.confirmClick(data);
      } else if (res.cancel) {
        console.log("用户点击取消");
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
    console.log(data, "点击事件类型");
  };
  goInfoClick = data => {
    Taro.navigateTo({
      url: `/pages/butler/home/agreement/info/index?id=${data.id}`
    });
  };
  //搜索
  searchConfirm = data => {
    console.log(data);
    this.setState(
      {
        searchValue: data
      },
      () => {
        this.load();
      }
    );
  };
  render() {
    let { list, dataTotal } = this.state;
    return (
      <View className='AgreementOrderBox'>
        <CommonSearch searchConfirm={this.searchConfirm}></CommonSearch>
        <View className='AgreementOrderBox-list'>
          {list.map((item, index) => (
            <AgreementOrder
              info={item}
              getOnClick={this.getOnClick}
              goInfoClick={this.goInfoClick}
              key={index}
            ></AgreementOrder>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无内容'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
