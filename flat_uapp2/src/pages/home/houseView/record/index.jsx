import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { HouseViewRecord, BoxEmpty } from "@component";
import ThreePng from "@assets/share/share_qq.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],

    dataTotal: 0
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let title = params.title;
    //动态设置当前页面的标题
    Taro.setNavigationBarTitle({
      title: title
    });
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
      .load("makeList", d, "get", { loading: false, login: true })
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
  onClickConfrim = data => {
    console.log(data, "预约记录");
    let that = this;
    Taro.showModal({
      title: "温馨提示",
      content: "是否取消预约"
    }).then(res => {
      if (res.confirm) {
        console.log("999");
        that.onCancel(data);
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  onCancel = data => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.id = data.id;
    d.state = 1;
    global.$utils.api
      .load("makeAdd", d, "put", { loading: false, login: true })
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
  goInfo = data => {
    Taro.navigateTo({
      url: `/pages/home/houseView/info/index?id=${data.id}`
    });
  };
  render() {
    let { list, dataTotal, type } = this.state;
    return (
      <View className='HouseViewRecordBox'>
        <View className='HouseViewRecordBox-list'>
          {list.map((item, index) => (
            <HouseViewRecord
              info={item}
              onClickConfrim={this.onClickConfrim}
              key={index}
              goInfo={this.goInfo}
              type={type}
            ></HouseViewRecord>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无记录'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
