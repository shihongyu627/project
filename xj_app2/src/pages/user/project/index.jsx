import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, Text, Image } from "@tarojs/components";

import "./index.scss";
import { BoxEmpty, FooterLine } from "@component";
import MapLinking from "react-native-map-linking";
class UserProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
      list: [],
      dataTotal: 0,
      type: ""
    };
  }

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let title = params.title;
    let type = params.type;
    Taro.setNavigationBarTitle({
      title: title
    });
    this.setState(
      {
        type
      },
      () => {
        this.loadData();
      }
    );
  }
  componentWillUnmount() {}
  loadData = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let result = {};
    let url = "userTeamlist"; //所属街道
    if (this.state.type == 2) {
      d.type = "3";
    } else {
      url = "userProjectlist"; //管辖项目
    }
    d.page = this.state.pageIndex;
    d.psize = 10;
    try {
      result = await $utils.api.load(url, d, "get", {
        loading: false,
        login: true
      });
      if (result.data) {
        let v = result.data.list || [];
        this.setState({
          list: this.state.pageIndex === 1 ? v : this.state.list.concat(v),
          dataTotal: result?.data?.page?.total || 0
        });
      }
    } catch (error) {
      Taro.hideLoading();
    }
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    Taro.showLoading({
      title: "loading"
    });
    this.onCommon();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  onCommon = () => {
    this.setState(
      {
        list: [],
        pageIndex: 1
      },
      () => {
        this.loadData();
      }
    );
  };
  render() {
    let { list } = this.state;
    console.log(list);
    return (
      <View className="userProject">
        {list.map((item, index) => {
          return (
            <View
              className="userProject-item"
              key={index}
              onClick={() => {
                let lnglat = [];
                if (item.lnglat) {
                  lnglat = item.lnglat.split(",");
                  MapLinking.markLocation(
                    { lat: lnglat[1], lng: lnglat[0], type: "gcj02" },
                    item.title,
                    item.address
                  );
                }
              }}
            >
              <View className="userProject-title">
                {item.title || item.name}
              </View>
            </View>
          );
        })}
        {list && list.length != 0 ? (
          <FooterLine title="没有更多数据了~"></FooterLine>
        ) : (
          <BoxEmpty title="暂无内容"></BoxEmpty>
        )}
      </View>
    );
  }
}
export default UserProject;
