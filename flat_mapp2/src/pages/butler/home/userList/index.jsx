import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Image, Text } from "@tarojs/components";
import "./index.scss";
import { UserList, BoxEmpty, CommonSearch, SubmitBtn } from "@component";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0,
    flatId: "",
    height: 667,
    name:""
  };

  componentDidMount() {
    const { windowHeight } = Taro.getSystemInfoSync();
    let params = getCurrentInstance().router.params;
    let flatId = params.flatId;
    this.setState(
      {
        height: windowHeight,
        flatId
      },
      () => {
        this.load();
      }
    );
  }
  componentWillUnmount() {}
  //用户列表
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    // let userInfo = $utils.data.get("userInfo");
    // d.butlerId = userInfo.userId;
    d.pageNum = this.state.pageIndex;
    d.pageSize = 15;
    d.orderByColumn = "userId";
    d.isAsc = "descending";
    d.realName=this.state.name
    // let flatId = $utils.data.get("flatId") || "";
    // d.flatId = flatId;
    global.$utils.api
      .load("roomMakeList", d, "get", { loading: false, login: true })
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
  //搜索
  searchConfirm = data => {
    this.setState(
      {
        name: data
      },
      () => {
        this.searchList();
      }
    );
  };
  onClickConfrim = data => {
    Taro.eventCenter.trigger("refreshUserData", data); //合同列表
    setTimeout(() => {
      Taro.navigateBack();
    }, 500);
  };
  handleScroll = () => {
    let { dataTotal, list, pageIndex } = this.state;
    console.log("加载更多");
    this.setState(
      {
        pageIndex: pageIndex + 1
      },
      () => {
        if (dataTotal > list.length) {
          this.load();
        }
      }
    );
  };
  render() {
    let { list, height } = this.state;
    return (
      <View className='houseSelect'>
        <CommonSearch searchConfirm={this.searchConfirm}></CommonSearch>
        <ScrollView
          className='scrollDom'
          scrollY
          lowerThreshold={90}
          style={{
            height: process.env.TARO_ENV === "rn" ? height - 300 : height - 60
          }}
          onScrollToLower={this.handleScroll.bind(this)}
        >
          <View className='houseSelect-list'>
            {list.map((item, index) => (
              <UserList
                info={item}
                key={index}
                onClickConfrim={this.onClickConfrim}
              ></UserList>
            ))}
            {list.length == 0 ? <BoxEmpty title='暂无用户'></BoxEmpty> : null}
            <View className='houseSelect-bottomBr'></View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
