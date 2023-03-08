import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { BillNoticeList, BoxEmpty } from "@component";
import ThreePng from "@assets/share/share_qq.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [
      {
        image: ThreePng,
        title: "水费订单",
        content: "3室1厅 | 88m² 南",
        tagArr: ["近地铁", "独立阳台"],
        price: 1580,
        status:'待缴费',
        time:'2019-02-12 至 2021-09-03'
      },
      {
        image: ThreePng,
        title: "电费订单",
        content: "3室1厅 | 88m² 南",
        tagArr: ["近地铁", "独立阳台", "独立卫浴"],
        price: 1580,
        status:'待缴费'
      },
      {
        image: ThreePng,
        title: "燃气费订单",
        content: "3室1厅 | 88m² 南",
        tagArr: ["近地铁", "独立阳台", "独立卫浴"],
        price: 1580,
        status:'待缴费'
      },
      {
        image: ThreePng,
        title: "水费订单",
        content: "3室1厅 | 88m² 南",
        tagArr: ["近地铁", "独立阳台"],
        price: 1580,
        status:'待缴费'
      },
      {
        image: ThreePng,
        title: "电费订单",
        content: "3室1厅 | 88m² 南",
        tagArr: ["近地铁", "独立阳台", "独立卫浴"],
        price: 1580,
        status:'待缴费'
      },
      {
        image: ThreePng,
        title: "燃气费订单",
        content: "3室1厅 | 88m² 南",
        tagArr: ["近地铁", "独立阳台", "独立卫浴"],
        price: 1580,
        status:'待缴费'
      }
    ],

    dataTotal: 0,
  };

  componentDidMount() {
    // Taro.setNavigationBarColor({
    //   frontColor: "#000000",
    //   backgroundColor: "#ffffff"
    // });
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
      .load("knowledgeList", d, "get", false)
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
  render() {
    let { list, dataTotal } = this.state;
    return (
      <View className='noticeBox'>
        <View className='noticeBox-list'>
          {list.map((item, index) => (
            <BillNoticeList info={item} key={index}></BillNoticeList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无通知'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
