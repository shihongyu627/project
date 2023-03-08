import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { PropertyView, BoxEmpty } from "@component";
import ThreePng from "@assets/share/share_qq.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],

    dataTotal: 0
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let type = params.type;
    let title = params.title;
    //动态设置当前页面的标题
    Taro.setNavigationBarTitle({
      title: title
    });
    this.setState(
      {
        type
      },
      () => {
        this.load();
      }
    );
    Taro.eventCenter.on("refreshPropertyRecord", val => {
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
    Taro.eventCenter.off("refreshPropertyRecord");
  }
  load = () => {
    let { type } = this.state;
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
    let url = "";
    //保洁预约
    if (type == 1) {
      url = "propertyCleanList";
    }
    //报修预约
    if (type == 2) {
      url = "propertyRepairsList";
    }
    //公共设施预约
    if (type == 3) {
      url = "propertyPublicList";
    }
    //拜访预约
    if (type == 4) {
      url = "propertyVisitorList";
    }
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
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
  submitPost = id => {
    let { type } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.state = 3;
    d.id = id;
    let url = "";

    //保洁预约
    if (type == 1) {
      url = "propertyCleanEdit";
    }
    //报修预约
    if (type == 2) {
      url = "propertyRepairsEdit";
    }
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
    let { type } = this.state;
    Taro.navigateTo({
      url: `/pages/property/create/index?id=${data.id}&type=${type}`
    });
  };
  goInfo = data => {
    let { type } = this.state;
    Taro.navigateTo({
      url: `/pages/property/info/index?id=${data.id}&type=${type}`
    });
  };
  render() {
    let { list, dataTotal, type } = this.state;
    return (
      <View className='RepairRecordBox'>
        <View className='RepairRecordBox-list'>
          {list.map((item, index) => (
            <PropertyView
              info={item}
              goInfo={this.goInfo}
              type={type}
              onClickConfrim={this.onClickConfrim}
              key={index}
            ></PropertyView>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无记录'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
