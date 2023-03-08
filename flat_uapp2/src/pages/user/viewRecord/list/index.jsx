import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import { RepairRecord, BoxEmpty } from "@component";
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
    Taro.eventCenter.on("refreshViewRecord", val => {
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
    Taro.eventCenter.off("refreshViewRecord");
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
    let url = "";
    //保洁预约
    if (type == 1) {
      url = "CleanList";
    }
    //报修预约
    if (type == 2) {
      url = "RepairsList";
    }
    //公共设施预约
    if (type == 3) {
      url = "publicMakeList";
    }
    //拜访预约
    if (type == 4) {
      url = "visitorList";
    }
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
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
  getOnClick = data => {
    console.log(data, "预约记录");
    let content = "";
    if (data.state == 1) {
      content = "是否撤销申请";
      Taro.showModal({
        title: "温馨提示",
        content: content
      }).then(res => {
        if (res.confirm) {
          console.log("999");
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      });
    } else {
      Taro.navigateTo({
        url: `/pages/comment/index?id=${data.id}&type=${this.state.type}`
      });
    }
  };
  goInfo = data => {
    Taro.navigateTo({
      url: `/pages/user/viewRecord/info/index?id=${data.id}&type=${this.state.type}`
    });
  };
  render() {
    let { list, dataTotal, type } = this.state;
    return (
      <View className='RepairRecordBox'>
        <View className='RepairRecordBox-list'>
          {list.map((item, index) => (
            <RepairRecord
              info={item}
              getOnClick={this.getOnClick}
              key={index}
              goInfo={this.goInfo}
              type={type}
            ></RepairRecord>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无记录'></BoxEmpty> : null}
        </View>
      </View>
    );
  }
}
