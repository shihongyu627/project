import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { CustomerList, BoxEmpty, CommonSearch } from "@component";
import ThreePng from "@assets/share/share_qq.png";
import header_selectPng from "@assets/image/header_select.png";
export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0,
    searchValue: "",
    headerList: [
      {
        title: "签约客户",
        type: 1
      },
      {
        title: "管理客户",
        type: 2
      }
    ],
    headerType: 1,
    height: 677
  };

  componentDidMount() {
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState(
      {
        height: windowHeight
      },
      () => {
        this.load();
      }
    );
  }
  componentWillUnmount() {}
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
    d.cusName = this.state.searchValue;
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
  flatcontractNolist = () => {
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
    d.cusName = this.state.searchValue;
    global.$utils.api
      .load("flatcontractNolist", d, "get", { loading: false, login: true })
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
  //拨打电话
  telPhoneOnClick = data => {
    if (!data.phone) {
      return;
    }
    Taro.makePhoneCall({
      phoneNumber: data.phone //仅为示例，并非真实的电话号码
    });
  };

  selectHeaderType = data => {
    this.setState(
      {
        headerType: data,
        pageIndex: 1,
        list: []
      },
      () => {
        if (data == "1") {
          this.load();
        } else {
          this.flatcontractNolist();
        }
      }
    );
  };
  handleScroll = () => {
    let {
      dataTotal,
      list,
      transactionTotal,
      pageIndex,
      headerType,
      listRecord
    } = this.state;
    console.log("加载更多");
    this.setState(
      {
        pageIndex: pageIndex + 1
      },
      () => {
        if (dataTotal > list.length) {
          if (headerType == "1") {
            this.load();
          } else {
            this.flatcontractNolist();
          }
        }
      }
    );
  };
  goInfo = data => {
    // Taro.navigateTo({
    //   url: `/pages/butler/home/agreement/info/index?id=${data.id}`
    // });
  };
  render() {
    let { list, dataTotal, headerType, headerList, height } = this.state;
    return (
      <View className="TakeLookBox">
        <View className="TakeLookBox-headerTitle">
          {headerList.map((item, index) => (
            <View
              className={
                "TakeLookBox-headerTitle-item " +
                (item.type == headerType ? "TakeLookBox-headerTitle-items" : "")
              }
              key={index}
              onClick={() => {
                this.selectHeaderType(item.type);
              }}
            >
              {item.title}
              {item.type == headerType ? (
                <Image
                  // src={global.$utils.loadimg.load(item)}
                  className="TakeLookBox-headerTitle-item-img"
                  src={header_selectPng}
                  mode="aspectFill"
                />
              ) : null}
            </View>
          ))}
        </View>
        <CommonSearch searchConfirm={this.searchConfirm}></CommonSearch>
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{
            height: process.env.TARO_ENV === "rn" ? height - 160 : height - 110
          }}
          onScrollToLower={this.handleScroll.bind(this)}
        >
          <View className="TakeLookBox-list">
            {list.map((item, index) => (
              <CustomerList
                info={item}
                telPhoneOnClick={this.telPhoneOnClick}
                key={index}
                goInfo={this.goInfo}
              ></CustomerList>
            ))}
            {list.length == 0 ? <BoxEmpty title="暂无记录"></BoxEmpty> : null}
            <View className="TakeLookBox-bottomBr"></View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
