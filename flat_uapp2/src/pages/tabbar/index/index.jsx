import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Image, Swiper, SwiperItem } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  IndexList,
  IndexHeader,
  BoxEmpty,
  TextLabel,
  AgreementModal
} from "@component";
import newsPng from "@assets/image/news.png";
import home_one from "@assets/image/home_one.png";
import home_two from "@assets/image/home_two.png";
import home_three from "@assets/image/home_three.png";
import home_four from "@assets/image/home_four.png";
import home_five from "@assets/image/home_five.png";
import common_bg from "@assets/image/common_bg.png";
import header_select from "@assets/image/header_select.png";
import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banner_list: [],
      tabbarList: [
        {
          name: "品牌公寓",
          icon: home_one,
          url: "/pages/richText/index",
          isOpen: false,
          type: "flatInfo"
        },
        {
          name: "公用设施",
          icon: home_two,
          url: "/pages/home/device/create/index"
        },
        {
          name: "保洁预约",
          icon: home_three,
          url: "/pages/home/clean/list/index"
        },
        {
          name: "报修预约",
          icon: home_four,
          url: "/pages/home/repair/create/index"
        },
        {
          name: "拜访预约",
          icon: home_five,
          url: "/pages/home/visitor/create/index"
        }
      ],
      newsList: [],
      list: [],
      listName: [],
      listData: [],
      name: "请选择公寓",
      titleList: [
        {
          title: "猜你喜欢",
          id: "1"
        },
        {
          title: "新上房源",
          id: "0"
        },
        {
          title: "全部房源",
          id: "3"
        }
      ],
      roomType: "1",
      flatId: "",
      showModal: true,
      pageIndex: 1,
      pagesTotal: 1,
      agreeModal: false //协议弹窗控制
    };
  }
  async componentDidMount() {
    // Taro.hideTabBar()//隐藏tabbar
    // 小程序设置状态栏字体颜色
    global.firstModal = 1;
    global.modalNum = global.modalNum + 1; //协议弹窗控制
    if (process.env.TARO_ENV === "rn") {
      let { NativeModules } = require("react-native");
      setTimeout(
        () => {
          NativeModules.RNBootSplash.hide(true); // 隐藏启动屏
        },
        process.env.NODE_ENV === "development" ? 200 : 1500
      );
      let NetInfo = require("@react-native-community/netinfo").default;
      this.tt = setInterval(() => {
        NetInfo.fetch()
          .then(state => {
            console.log({ "网络状态1+++++++++++++++++++": state.isConnected });
            if (state.isConnected) {
              clearInterval(this.tt);
              this.advertiseType(); //广告轮播
              this.announcementList(); //公告消息轮播
              this.searchLoad(); //公寓列表
            }
            // console.log('Is connected?', state.isConnected) //如果存在活动的网络连接。请注意，这并不意味着可以访问互联网
          })
          .catch(err => {
            console.log(err, "xxxxx");
          });
      }, 500);
    }
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    await this.advertiseType(); //广告轮播
    await this.announcementList(); //公告消息轮播
    await this.searchLoad(); //公寓列表
  }
  componentDidShow() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("light-content");
    }
    this.setState({
      showModal: true,
      agreeModal: $utils.data.get("showModal")
    });
  }
  componentDidHide() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("dark-content");
    }
  }
  loadList = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    if (this.state.roomType == "3") {
      //全部房源
      d.roomType = "";
    } else {
      d.roomType = this.state.roomType;
    }
    d.flatId = this.state.flatId;
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    console.log(22222222222222222,this.state.pageIndex);
    let res = {};
    try {
      res = await $utils.api.load("homeList", d, "get", false);
      if (res.code == 200) {
        let v = res.rows || [];
        let pagesTotal = res.pages || 1;
        v.map(item => {
          item.tagArr = [];
          if (item.labelName) {
            item.tagArr = item.labelName.split(",");
          }
          item.content = item.lightspot;
          item.title = item.name;
        });
        let listOld = this.state.pageIndex == 1 ? [] : this.state.list;
        let listNew = [];
        let list = [];
        v.map(item => {
          listNew.push(item);
        });
        list = [...listOld, ...listNew];
        this.setState({
          list,
          pagesTotal
        });
      }
    } catch (error) {
      Taro.hideLoading();
      $utils.toast.text(error.msg || "请求异常");
    }
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };

  //消息公告轮播
  announcementList = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let res = {};
    try {
      res = await $utils.api.load("announcementList", d, "get", false);
      if (res.code == 200) {
        let newsList = res.rows || [];
        this.setState({
          newsList
        });
      }
    } catch (error) {
      $utils.toast.text(error.msg || "请求异常");
      Taro.hideLoading();
    }
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  //广告轮播
  advertiseType = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let res = {};
    let url = `${global.base_host}/customer/flat/advertiseType/HOME`;
    try {
      res = await $utils.api.load(url, d, "get", false);
      if (res.code == 200) {
        let banner_list = res.rows || [];
        this.setState({
          banner_list
        });
      }
    } catch (error) {
      $utils.toast.text(error.msg || "请求异常");
      Taro.hideLoading();
    }
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  //房源
  flatnoPageList = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let res = {};
    try {
      res = await $utils.api.load("flatnoPageList", d, "get", false);
      if (res.code == 200) {
        let listData = res.rows || [];
        let listName = [];
        listData.map(item => {
          listName.push(item.name);
        });
        let flatId = "";
        let name = "请选择公寓";
        let flatName = "";
        if (listData && listData.length > 0) {
          let cc = listData[0];
          name = cc.name || "";
          flatName = cc.name || "";
          flatId = cc.id || "";
          $utils.data.set("flatId", flatId);
          $utils.data.set("flatName", flatName);
          this.setState(
            {
              flatId,
              name,
              listData,
              listName,
              list: []
            },
            () => {
              this.loadList();
            }
          );
        }
      }
    } catch (error) {
      $utils.toast.text(error.msg || "请求异常");
      Taro.hideLoading();
    }

    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.announcementList(); //公告消息轮播
    this.advertiseType(); //广告轮播
    this.searchLoad(); //公寓列表
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  searchLoad = () => {
    this.setState(
      {
        pageIndex: 1,
        list: []
      },
      () => {
        this.flatnoPageList();
      }
    );
  };
  //选择公寓
  selectIndex = data => {
    let { listData } = this.state;
    if (listData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(listData[data], "传过来的索引取类型值");
    let obj = listData[data];
    let name = obj.name;
    let flatId = obj.id;
    $utils.data.set("flatId", flatId);
    $utils.data.set("flatName", name);
    this.setState(
      {
        name,
        flatId,
        pageIndex: 1,
        list: []
      },
      () => {
        this.loadList();
      }
    );
  };
  //弹窗协议
  onLeftBtn = () => {
    this.setState({
      showModal: false
    });
  };
  onRightBtn = () => {
    this.setState(
      {
        showModal: false
      },
      () => {
        $utils.data.set("showModal", true);
      }
    );
  };
  //滑动加载
  onReachBottom = () => {
    let { pagesTotal, list, pageIndex } = this.state;
    this.setState(
      {
        pageIndex: pageIndex + 1
      },
      () => {
        if (pagesTotal > pageIndex) {
          this.loadList();
        }
      }
    );
  };
  //分享好友
  onShareAppMessage(e) {
    let path = `pages/index/index`;
    return {
      title: `象寓`,
      path: path,
      imageUrl: "",
      success: function(res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  }
  //分享朋友圈
  onShareTimeline(e) {
    let path = `pages/index/index`;
    return {
      title: `象寓`,
      path: path,
      imageUrl: "",
      success: function(res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  }
  render() {
    let {
      banner_list,
      tabbarList,
      newsList,
      list,
      name,
      titleList,
      roomType,
      showModal,
      agreeModal
    } = this.state;
    return (
      <View className="index">
        <View className="index-topbg">
          <View className="index-topbg-bg">
            <Image
              className="index-topbg-bg-img"
              src={common_bg}
              mode="aspectFill"
            />

            <View className="index-topbg-bg-Box">
              {/* 头部 */}
              <IndexHeader
                title={name}
                listName={this.state.listName}
                selectIndex={this.selectIndex}
              />
              {/* 轮播 */}
              <Swiper
                className="index-swiper"
                indicatorColor="rgba(0, 0, 0, .3)"
                indicatorActiveColor="#fff"
                circular
                indicatorDots
                autoplay
                interval={2000}
              >
                {banner_list.map((item, index) => (
                  <SwiperItem key={index} className="index-swiper-item">
                    {item.imgUrl ? (
                      <Image
                        // src={global.$utils.loadimg.load(item)}
                        className="index-swiper-img"
                        src={global.$utils.loadimg.load(item.imgUrl)}
                        mode="aspectFill"
                        onClick={() => {
                          console.log(item);
                          if (!item.skipUrl) {
                            return;
                          }
                          if (item.skipUrl.indexOf("http") >= 0) {
                            Taro.navigateTo({
                              url: `/pages/webView/index?url=${item.skipUrl}`
                            });
                            return;
                          }
                          Taro.navigateTo({
                            url: item.skipUrl
                          });
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </SwiperItem>
                ))}
              </Swiper>
            </View>
          </View>
          {/* 消息轮播 */}
          <View className="index-news">
            <Image className="index-news-img" src={newsPng} mode="aspectFill" />
            <Swiper
              className="index-news-swiper"
              autoplay
              interval={3000}
              vertical
              circular
            >
              {newsList.map((item, index) => (
                <SwiperItem
                  key={index}
                  className="index-news-swiper-item"
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/home/advList/index`
                    });
                  }}
                >
                  <TextLabel
                    className="index-news-swiper-item-content"
                    num={1}
                    content={item.content}
                  ></TextLabel>
                </SwiperItem>
              ))}
            </Swiper>
          </View>
          {/* 菜单栏 */}
          <View className="index-tabbar">
            {tabbarList.map((item, index) => (
              <View
                key={index}
                className="index-tabbar-item"
                onClick={() => {
                  if (!global.isLogin && item.isOpen) {
                    $utils.toast.isLoginModal();
                    return;
                  }
                  // 测试同步存储
                  if (!item.url) {
                    global.$utils.toast.text("暂未开放");
                    return;
                  }
                  if (item.type == "flatInfo") {
                    let id = $utils.data.get("flatId");
                    let url =
                      item.url +
                      `?type=${item.type}&id=${id}&title=${$utils.data.get(
                        "flatName"
                      )}`;
                    Taro.navigateTo({
                      url: url
                    });
                    return;
                  }
                  Taro.navigateTo({
                    url: item.url
                  });
                }}
              >
                <Image
                  // src={global.$utils.loadimg.load(item)}
                  className="index-tabbar-item-img"
                  src={item.icon}
                  mode="aspectFill"
                />
                <View className="index-tabbar-item-name">{item.name}</View>
              </View>
            ))}
          </View>

          {/* 列表头部 */}
          <View className="index-titleMen">
            {titleList.map((item, index) => (
              <View
                className="index-titleMen-itembox"
                key={index}
                onClick={() => {
                  this.setState(
                    {
                      roomType: item.id,
                      pageIndex: 1,
                      list: []
                    },
                    () => {
                      this.loadList();
                    }
                  );
                }}
              >
                <View
                  className={
                    "index-titleMen-itembox-item" +
                    " " +
                    (roomType == item.id ? "index-titleMen-itembox-active" : "")
                  }
                >
                  {item.title}
                  {roomType == item.id ? (
                    <Image
                      // src={global.$utils.loadimg.load(item)}
                      className="index-titleMen-itembox-item-img"
                      src={header_select}
                      mode="aspectFill"
                    />
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* 列表 */}
        <View className="index-list">
          {list.map((item, index) => (
            <IndexList
              info={item}
              key={index}
              goInfo={data => {
                console.log(data);
                let infoId = data.id;
                let infoTitle = data.title;
                Taro.navigateTo({
                  url: `/pages/homeInfo/index?id=${infoId}&title=${infoTitle}`
                });
              }}
            ></IndexList>
          ))}
          {list.length == 0 ? <BoxEmpty title="暂无内容"></BoxEmpty> : null}
        </View>
        {!agreeModal && global.firstModal == 1 ? (
          <AgreementModal
            title="用户协议和隐私政策"
            leftBtnTxt="不同意并退出"
            rightBtnTxt="同意"
            type="input"
            onRightBtn={this.onRightBtn}
            onLeftBtn={this.onLeftBtn}
            show={showModal}
          ></AgreementModal>
        ) : null}
      </View>
    );
  }
}

export default Index;
