import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { IndexList, BoxEmpty } from "@component";
import searchPng from "@assets/image/search.png";
import ThreePng from "@assets/image/lifeCost_bg.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0,
    showShare: false,
    content: ""
  };

  componentDidMount() {
    Taro.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#ffffff"
    });
  }

  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let { content } = this.state;
    let d = {};
    let url = "";
    url = `${global.base_host}/customer/flat/room/searchList/${content}`;
    global.$utils.api
      .load(url, d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let v = res.rows || [];
          v.map(item => {
            item.tagArr = [];
            if (item.labelName) {
              item.tagArr = item.labelName.split(",");
            }
            item.content = item.lightspot;
            item.title = item.name;
          });
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
  changeContent = e => {
    this.setState({
      content: e.detail.value
    });
  };
  goInfo = data => {
    console.log(data);
    let infoId = data.id;
    let infoTitle = data.title;
    Taro.navigateTo({
      url: `/pages/homeInfo/index?id=${infoId}&title=${infoTitle}`
    });
  };
  render() {
    let { list, dataTotal, showShare } = this.state;
    let TextInput = null;
    if (process.env.TARO_ENV === "rn") {
      let RN = require("react-native");
      TextInput = RN.TextInput;
    }
    return (
      <View className='searchBox'>
        <View className='searchBox-search'>
          <View className='searchBox-search-left'>
            <Image
              className='searchBox-search-left-icon'
              mode='aspectFill'
              src={searchPng}
            />
            {process.env.TARO_ENV === "rn" ? (
              <TextInput
                className='searchBox-search-left-text'
                clearButtonMode='always'
                keyboardType='default'
                autoCapitalize='none'
                placeholder='搜索房源'
                onChangeText={username => {
                  this.setState({
                    content: username
                  });
                }}
                placeholderTextColor='#888'
              />
            ) : (
              <Input
                className='searchBox-search-left-text'
                type='text'
                placeholder='搜索房源'
                onInput={this.changeContent.bind(this)}
                // focus
              />
            )}
          </View>
          <View
            className='searchBox-search-btn'
            onClick={this.searchList.bind(this)}
          >
            搜索
          </View>
        </View>
        <View className='searchBox-list'>
          {list.map((item, index) => (
            <IndexList goInfo={this.goInfo} info={item} key={index}></IndexList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无内容'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
