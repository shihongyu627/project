import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Button, Image } from "@tarojs/components";
import "./index.scss";
import { BoxEmpty, ItemRecord, FooterLine } from "@component";
import store from "../../../store";
import { connect } from "react-redux";
import { Clipboard } from "react-native";
export default class Index extends Component {
  state = {
    height: 667,
    menuList: [
      {
        title: "全部",
        state: ""
      },
      {
        title: "待整改",
        state: "0"
      },
      {
        title: "待复核",
        state: 5
      },
      {
        title: "已整改",
        state: 10
      }
    ],
    state: "",
    pageIndex: 1,
    dataTotal: 0,
    list: [],
    search: ""
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let userInfo = store.getState().user || {};
    //针对工地端以及巡检段，user_type为2是巡检 1是工地
    let menuList = [
      {
        title: "全部",
        state: ""
      },
      {
        title: "待整改",
        state: "0"
      },
      {
        title: "待复核",
        state: 5
      },
      {
        title: "已整改",
        state: 10
      }
    ];
    if (userInfo.user_type == 1) {
      menuList = [
        {
          title: "全部",
          state: ""
        },
        {
          title: "待整改",
          state: "0"
        },
        {
          title: "已通过",
          state: 10
        }
      ];
    }
    this.setState(
      {
        id,
        menuList
      },
      () => {
        this.loadData();
      }
    );
  }
  loadData = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let result = {};
    d.search = this.state.search;
    d.project_id = this.state.id;
    d.handle_status = this.state.state;
    d.page = this.state.pageIndex;
    d.psize = 10;
    try {
      result = await $utils.api.load("batchlists", d, "get", {
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
  //滑动加载
  onReachBottom = () => {
    let { dataTotal, list } = this.state;
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1
      },
      () => {
        if (dataTotal > list.length) {
          this.loadData();
        }
      }
    );
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
  setMenu = state => {
    this.setState(
      {
        state
      },
      () => {
        this.onCommon();
      }
    );
  };
  goInfo = data => {
    Taro.navigateTo({
      url: `/pages/record/info/index?batch_id=${data.batch_id}`
    });
  };
  //下载
  downloadFiles = (data, type) => {
    console.log(data);
    // this.onClickDownload(data.batch_id, type);
    Taro.navigateTo({
      url: `/pages/webView/index?batch_id=${data.batch_id}&type=${type}`
    });
  };
  //告知单下载
  onClickDownload = async (batch_id, type) => {
    console.log(batch_id);
    Taro.showLoading({
      title: "loading..."
    });
    let d = {};
    let result = {};
    d.batch_id = batch_id;
    let url = "troubleBatchdown";
    if (type == "1") {
      url = "batchreplydown";
    }
    try {
      result = await $utils.api.load(url, d, "get", {
        loading: false,
        login: true
      });
      if (result.code == 1) {
        // Taro.hideLoading();
        console.log(result);
        let gallery = result.data || [];
        // let copyTextArr = [];
        // let urlArr = [];
        // gallery.map(item => {
        //   copyTextArr.push(item.copytext);
        //   urlArr.push(item.report_url);
        // });
        // if (copyTextArr.length == 0) {
        //   $utils.toast.text("暂无文件地址");
        //   return;
        // }
        // let copyText = copyTextArr.join("\n\n");
        // const info = Taro.getSystemInfoSync();
        // if (info.platform == "android") {
        //   let dd = await $utils.permissionRn.androidStorage();
        //   if (dd) {
        //     urlArr.map((item, index) => {
        //       let indexs = item.lastIndexOf("/");
        //       let name = item.substring(indexs + 1, item.length);
        //       $utils.file.downloadFile(item || "", name, copyText, index);
        //     });
        //   }
        // } else {
        //   Taro.hideLoading();
        //   Clipboard.setString(copyText || "");
        //   $utils.toast.textModal("文件地址已复制，请粘贴内容进行下载查看");
        // }
        let checkVal = await $utils.permission.checkUpdate();
        if (checkVal) {
          gallery.map(item => {
            $utils.file.savePhoto(item.img_url || "");
          });
        }
      } else {
        $utils.toast.text(result.message);
        Taro.hideLoading();
      }
    } catch (error) {
      Taro.hideLoading();
    }
  };
  render() {
    let { menuList, state, list } = this.state;
    return (
      <View className="projectRecord">
        <View className="projectRecord-header">
          {menuList.map((item, index) => {
            return (
              <View
                className={
                  "projectRecord-header-item " +
                  (item.state == state ? "projectRecord-header-active" : "")
                }
                key={index}
                onClick={() => {
                  this.setMenu(item.state);
                }}
              >
                {item.title}
              </View>
            );
          })}
        </View>
        {list.map((item, index) => {
          return (
            <ItemRecord
              key={index}
              goInfo={this.goInfo}
              downloadFiles={this.downloadFiles}
              info={item}
            ></ItemRecord>
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
// const mapStoreToProps = store => ({
//   userInfo: store.user
// });
// const mapDispatchToProps = dispatch => ({
//   // dispatch: dispatch
// });
// export default connect(mapStoreToProps, mapDispatchToProps)(Index);
