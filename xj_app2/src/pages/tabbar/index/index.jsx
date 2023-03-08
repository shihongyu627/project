import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Swiper,
  SwiperItem,
  ScrollView
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  BoxEmpty,
  FooterLine,
  AgreementModal,
  HomeSearch,
  ItemProject,
  FilterDrawer
} from "@component";
import dayjs from "dayjs";
import currencyPng from "@assets/image/currency.png";
import closePng from "@assets/image/close.png";
import "./index.scss";
import { Drawer } from "teaset";
import store from "../../../store";
import Geolocation from "@react-native-community/geolocation";
import { connect } from "react-redux";
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      header_image: require("@assets/image/headerBg.png"),
      filterList: [],
      drawer: null,
      selectTagArr: [],
      selectTagData: [],
      pageIndex: 1,
      dataTotal: 0,
      search: "",
      invest_type: "",
      project_type: "",
      build_status: "",
      check_month_num: "",
      check_status: "",
      no_read_count: 0
    };
  }
  async componentDidMount() {
    // Taro.hideTabBar()//隐藏tabbar
    // 小程序设置状态栏字体颜色
    global.firstModal = 1;
    Taro.eventCenter.on("refreshMessageBadge", val => {
      this.messageBadge();
      this.loadData();
    });
    if (process.env.TARO_ENV === "rn") {
      let { NativeModules } = require("react-native");
      setTimeout(
        () => {
          NativeModules.RNBootSplash.hide(true); // 隐藏启动屏
        },
        process.env.NODE_ENV === "development" ? 200 : 1000
      );
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("dark-content");
      //查看网络状态,连接时，请求数据
      let NetInfo = require("@react-native-community/netinfo").default;
      this.tt = setInterval(() => {
        NetInfo.fetch()
          .then(state => {
            console.log({ "网络状态1+++++++++++++++++++": state.isConnected });
            if (state.isConnected) {
              clearInterval(this.tt);
              $utils.auth.checklogin();
              $utils.auth.siteInfo();
              this.groupkv();
              this.messageBadge();
              this.loadData();
            }
            // console.log('Is connected?', state.isConnected) //如果存在活动的网络连接。请注意，这并不意味着可以访问互联网
          })
          .catch(err => {
            console.log(err, "xxxxx");
          });
      }, 500);
    }
    await this.groupkv();
    await this.messageBadge();
    await this.loadData();


  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshMessageBadge");
  }
  componentDidShow() {}
  async componentDidHide() {}

  groupkv = async () => {
    let d = {};
    let result = {};
    try {
      result = await $utils.api.load("groupkv", d, "get", false);
      if (result.data) {
        console.log(result.data);
        let v = result.data;
        let filterList = [
          {
            title: "检查次数",
            type: "check_month_num",
            children: [
              {
                title: "本月检查0次",
                params: 0,
                value: 0,
                type: "check_month_num"
              },
              {
                title: "本月检查1次",
                params: 1,
                value: 1,
                type: "check_month_num"
              },
              {
                title: "本月检查2次",
                params: 2,
                value: 2,
                type: "check_month_num"
              },
              {
                title: "本月检查3次",
                params: 3,
                value: 3,
                type: "check_month_num"
              }
            ]
          },
          {
            title: "检查状态",
            type: "check_status",
            children: [
              {
                title: "待复查",
                params: 2,
                value: 2,
                type: "check_status"
              }
            ]
          }
        ];
        let newsArr = [];
        for (const key in v) {
          let obj = {};
          obj.type = key;
          if (key == "invest_type") {
            obj.title = "投资类型";
          }
          if (key == "project_type") {
            obj.title = "项目类型";
          }
          if (key == "build_status") {
            obj.title = "项目进度";
          }
          obj.children = v[key];
          obj.children.map(item => {
            item.title = item.name;
            item.params = item.value;
            item.type = key;
          });
          newsArr.push(obj);
        }
        filterList.unshift(...newsArr);
        this.setState({
          filterList
        });
      }
    } catch (error) {
      // Taro.hideLoading();
    }
  };
  messageBadge = async () => {
    let d = {};
    let result = {};
    try {
      result = await $utils.api.load("messageBadge", d, "get", {
        loading: true,
        login: false
      });
      if (result.data) {
        console.log(result.data);
        let v = result.data;
        this.setState({
          no_read_count: v.no_read_count
        });
      }
    } catch (error) {
      // Taro.hideLoading();
    }
  };
  loadData = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let result = {};
    d.search = this.state.search;
    d.invest_type = this.state.invest_type;
    d.project_type = this.state.project_type;
    d.build_status = this.state.build_status;
    d.check_month_num = this.state.check_month_num;
    d.check_status = this.state.check_status;
    d.page = this.state.pageIndex;
    d.psize = 10;
    try {
      result = await $utils.api.load("projectLists", d, "get", false);
      if (result.data) {
        let v = result.data.list || [];
        this.setState({
          list: this.state.pageIndex === 1 ? v : this.state.list.concat(v),
          dataTotal: result?.data?.page?.total || 0
        });
      } else {
        this.setState({
          list: []
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
    this.resetHandleClick();
    this.messageBadge();
    Taro.getSystemInfo().then(res => {
      console.log(res, "xxxxxxxxx");
    });
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
  //搜索
  onSearch = data => {
    console.log(data);
    this.setState(
      {
        search: data
      },
      () => {
        this.onCommon();
      }
    );
  };
  //过滤筛选
  setFilter = () => {
    let { filterList } = this.state;
    setTimeout(() => {
      let showDrawer = Drawer.open(this.renderFilterDrawer(), "right");
    }, 5);
  };
  renderFilterDrawer = () => {
    let { filterList } = this.state;
    return (
      <FilterDrawer
        resetHandleClick={this.resetHandleClick}
        onSubmitClick={this.onSubmitClick}
        filterList={filterList}
      />
    );
  };
  resetHandleClick = () => {
    this.setState(
      {
        selectTagArr: [],
        selectTagData: [],
        invest_type: "",
        project_type: "",
        build_status: "",
        check_month_num: "",
        check_status: ""
      },
      () => {
        this.onCommon();
      }
    );
  };
  onSubmitClick = data => {
    let { filterList } = this.state;

    let arr = [];
    let selectTagData = [];
    data.map(item => {
      item.children.map(subItem => {
        if (subItem.active) {
          arr.push(subItem);
          selectTagData.push(item);
        }
      });
    });
    let invest_type = "";
    let project_type = "";
    let build_status = "";
    let check_month_num = "";
    let check_status = "";
    arr.map(key => {
      if (key.type == "invest_type") {
        invest_type = key.value;
      }
      if (key.type == "project_type") {
        project_type = key.value;
      }
      if (key.type == "build_status") {
        build_status = key.value;
      }
      if (key.type == "check_month_num") {
        check_month_num = key.value;
      }
      if (key.type == "check_status") {
        check_status = key.value;
      }
    });
    this.setState(
      {
        selectTagArr: arr,
        selectTagData,
        invest_type,
        project_type,
        build_status,
        check_month_num,
        check_status
      },
      () => {
        this.onSearch(this.state.search);
      }
    );
  };
  //关闭标签
  closeTag = (dataItem, dataSubItem) => {
    let { selectTagArr, selectTagData, filterList } = this.state;
    let invest_type = "";
    let project_type = "";
    let build_status = "";
    let check_month_num = "";
    let check_status = "";
    selectTagArr.map((item, index) => {
      if (item.type == dataSubItem.type) {
        selectTagArr.splice(index, 1);
        selectTagData.splice(index, 1);
      }
    });
    const _filterList = filterList.map(menu => {
      if (menu.type === dataItem.type) {
        menu.children.forEach(menuItem => {
          menuItem.active = false;
        });
      }
      return menu;
    });
    const target = _filterList.find(v => v.type == dataItem.type);
    const child = target.children.find(v => v.params == dataSubItem.params);
    selectTagArr.map(key => {
      if (key.type == "invest_type") {
        invest_type = key.value;
      }
      if (key.type == "project_type") {
        project_type = key.value;
      }
      if (key.type == "build_status") {
        build_status = key.value;
      }
      if (key.type == "check_month_num") {
        check_month_num = key.value;
      }
      if (key.type == "check_status") {
        check_status = key.value;
      }
    });
    this.setState(
      {
        selectTagArr,
        selectTagData,
        filterList: _filterList,
        invest_type,
        project_type,
        build_status,
        check_month_num,
        check_status
      },
      () => {
        this.onSearch(this.state.search);
      }
    );
  };
  //跳转消息列表
  goNews = () => {
    Taro.switchTab({
      url: "/pages/tabbar/news/index"
    });
  };
  //跳转项目详情
  goInfo = data => {
    let userInfo = store.getState().user || {};
    //针对工地端以及巡检段，user_type为2是巡检 1是施工人员  3街道人员，
    if (userInfo.user_type == 2) {
      Taro.navigateTo({
        url: `/pages/project/info/index?title=${data.title}&id=${data.project_id}`
      });
    } else {
      Taro.navigateTo({
        url: `/pages/project/record/index?id=${data.project_id}`
      });
    }
  };
  render() {
    let { list, selectTagArr, filterList, no_read_count } = this.state;
    let SafeAreaView = null;
    if (process.env.TARO_ENV === "rn") {
      let Rn = require("react-native-safe-area-context");
      SafeAreaView = Rn.SafeAreaView;
    }
    return (
      <SafeAreaView style={{ backgroundColor: "#fff" }}>
        <View className="index">
          <HomeSearch
            onConfirm={this.onSearch}
            goNews={this.goNews}
            setFilter={this.setFilter}
            no_read_count={no_read_count}
          ></HomeSearch>
          {selectTagArr.length > 0 ? (
            <View className="index-wrapp">
              <ScrollView scrollX scrollWithAnimation>
                <View className="index-tagBox">
                  {filterList.map((item, index) => {
                    return (
                      <View className="index-tagBoxss" key={index}>
                        {item.children.map((subItem, sindex) => {
                          return subItem.active ? (
                            <View
                              key={sindex}
                              className="index-tagBox-item"
                              onClick={() => {
                                this.closeTag(item, subItem);
                              }}
                            >
                              <View className="index-tagBox-title">
                                {subItem.title}
                              </View>
                              <Image
                                className="index-tagBox-closePng"
                                src={closePng}
                                mode="aspectFill"
                              />
                            </View>
                          ) : null;
                        })}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ) : null}
          {list.map((item, index) => {
            return (
              <ItemProject
                goInfo={this.goInfo}
                index={index}
                info={item}
              ></ItemProject>
            );
          })}
          {list.length == 0 ? (
            <BoxEmpty title="暂无内容"></BoxEmpty>
          ) : (
            <FooterLine title="没有更多数据了~"></FooterLine>
          )}
        </View>
      </SafeAreaView>
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
