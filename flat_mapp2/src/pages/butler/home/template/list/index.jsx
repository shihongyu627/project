import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { TemplateList, BoxEmpty, SubmitBtn } from "@component";
import ThreePng from "@assets/image/common_bg.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    dataTotal: 0,
    platform: "",
    height: 667
  };

  componentDidMount() {
    const { platform, windowHeight } = Taro.getSystemInfoSync();
    this.setState({ platform, height: windowHeight }, () => {
      this.load();
    });
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
    global.$utils.api
      .load("signTemplateList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let v = res.rows || [];
          v.map(item => {
            item.checked = false;
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
    let { list } = this.state;
    list.map(item => {
      if (data.id == item.id) {
        item.checked = !data.checked;
      } else {
        item.checked = false;
      }
    });
    this.setState({
      list
    });
  };
  //确认
  handleSubmit = () => {
    let { list } = this.state;
    list.map(item => {
      if (item.checked) {
        console.log(item, "点击事件类型");
        Taro.eventCenter.trigger("refreshTemplateId", item); //合同列表
        Taro.navigateBack();
      }
    });
  };
  goInfo = data => {
    let { platform } = this.state;
    if (process.env.TARO_ENV === "rn") {
      Taro.navigateTo({
        url: `/pages/butler/home/template/info/index?id=${data.docTemplateId}`
      });
      return;
    }
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.docTemplateId = data.docTemplateId;
    let url = `${global.base_host}/maintainer/flat/sign/${data.docTemplateId}`;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.data) {
          Taro.hideLoading();
          let dd = res.data || {};
          //查看合同详情处理
          Taro.downloadFile({
            url: dd,
            success: function(res1) {
              var filePath = res1.tempFilePath;
              console.log(filePath, 888);
              Taro.openDocument({
                filePath: filePath,
                success: function(res) {
                  console.log("打开文档成功");
                }
              });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };
  render() {
    let { list, height } = this.state;
    return (
      <View className="templateBox">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={110}
          style={{
            height: process.env.TARO_ENV === "rn" ? height - 300 : height - 60
          }}
          onScrollToLower={this.handleScroll.bind(this)}
        >
          <View className="templateBox-list">
            {list.map((item, index) => (
              <TemplateList
                info={item}
                getOnClick={this.getOnClick}
                goInfo={this.goInfo}
                key={index}
              ></TemplateList>
            ))}
            {list.length == 0 ? <BoxEmpty title="暂无模板"></BoxEmpty> : null}
          </View>
          <View className="templateBox-bottomBr"></View>
        </ScrollView>
        <SubmitBtn title="确认" handleSubmit={this.handleSubmit}></SubmitBtn>
      </View>
    );
  }
}
