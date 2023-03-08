import React, { Component } from "react";
import Taro from "@tarojs/taro";

import {
  View,
  Text,
  Image,
  Swiper,
  SwiperItem,
  Picker,
  ScrollView
} from "@tarojs/components";

import "./index.scss";
import {
  BoxEmpty,
  ItemRecord,
  FooterLine,
  DatePicker,
  ProjectPicker
} from "@component";
import Accordion from "react-native-collapsible/Accordion";
import currencyPng from "@assets/image/currency.png";
import { getWindowHeight } from "@utils/style";
import dayjs from "dayjs";
import Recordnochecked from "@assets/image/Recordnochecked.png";
import Recordchecked from "@assets/image/Recordchecked.png";
import { Clipboard } from "react-native";
class Phonebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
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
      list: [],
      dataTotal: 0,
      activeSections: [],
      idArr: [],
      isAll: false,
      listName: [],
      listData: [],
      projectName: "",
      projectId: "",
      pageIndex: 1,
      dataTotal: 0,
      search: "",
      date: "",
      actions: ["整改回复单", "隐患告知单"],
      height: 667,
      strId: ""
    };
  }

  componentDidMount() {
    this.loadData();
    this.projectDroplist();
    Taro.eventCenter.on("refreshRecordList", val => {
      this.loadData();
    });
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState({
      height: windowHeight
    });
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshRecordList");
  }
  projectDroplist = async () => {
    let d = {};
    let result = {};
    try {
      result = await $utils.api.load("projectDroplist", d, "get", false);
      if (result.data) {
        let v = result.data || [];
        let listName = [];
        let dd = {
          name: "全部",
          id: ""
        };
        let allName = "全部";
        v.map(item => {
          listName.push(item.title);
          item.name = item.title;
          item.id = item.project_id;
        });
        listName.unshift(allName);
        v.unshift(dd);
        this.setState({
          listData: v,
          listName
        });
      }
    } catch (error) {
      console.log(error, "异常");
    }
  };
  loadData = async () => {
    if (!global.isLogin) {
      return;
    }
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let result = {};
    d.search = this.state.search;
    d.handle_status = this.state.state;
    d.page = this.state.pageIndex;
    d.project_id = this.state.projectId;
    d.date = this.state.date;
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
    this.setState(
      {
        projectName: "",
        date: "",
        projectId: ""
      },
      () => {
        this.onCommon();
      }
    );
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  //滑动加载
  handleScroll = () => {
    let { dataTotal, list } = this.state;
    console.log("加载");
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
        pageIndex: 1,
        date: ""
      },
      () => {
        this.loadData();
      }
    );
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
  //选择
  selectRecord = data => {
    console.log(data);
    let { idArr, list, isAll } = this.state;
    let index = idArr.indexOf(data?.batch_id);
    console.log(index);
    if (index == -1) {
      idArr.push(data?.batch_id);
    } else {
      idArr.splice(index, 1);
    }
    isAll = false;
    if (idArr.length == list.length) {
      isAll = true;
    }
    this.setState({
      idArr,
      isAll
    });
  };
  //全选
  selectAllRecord = data => {
    let { idArr, list, isAll } = this.state;
    let newArr = [];
    if (!isAll) {
      list.map(item => {
        newArr.push(item.batch_id);
      });
    }
    this.setState({
      idArr: newArr,
      isAll: !isAll
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
  //多个下载
  downloadConfirmFiles = () => {
    let { idArr } = this.state;
    console.log(idArr);
    let strId = idArr.join(",");
    if (!strId) {
      $utils.toast.text("请选择下载的文件");
      return;
    }
    this._actionsheet.open();
    this.setState({
      strId
    });
  };

  //告知单下载
  onClickDownload = async (batch_id, type) => {
    // Taro.showLoading({
    //   title: "loading..."
    // });
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
        let gallery = result.data || [];
        console.log(gallery);
        let obj = gallery[0];
        let url = obj.preview_url;
        Taro.navigateTo({
          url: `/pages/webView/index?url=${url}`
        });
        // let checkVal = await $utils.permission.checkUpdate();
        // if (checkVal) {
        //   gallery.map(item => {
        //     $utils.file.savePhoto(item.img_url || "");
        //   });
        // }
      } else {
        $utils.toast.text(result.message);
        Taro.hideLoading();
      }
    } catch (error) {
      Taro.hideLoading();
    }
  };
  //日期
  selectMonthData = date => {
    console.log(date);
    this.setState(
      {
        date
      },
      () => {
        this.commonSearch();
      }
    );
  };
  commonSearch = () => {
    this.setState(
      {
        pageIndex: 1,
        list: []
      },
      () => {
        this.loadData();
      }
    );
  };
  selectlevelIndex = data => {
    let { listData } = this.state;
    let obj = listData[data];
    let projectName = obj.name;
    let projectId = obj.id;
    this.setState(
      {
        projectName,
        projectId
      },
      () => {
        this.commonSearch();
      }
    );
  };
  render() {
    let {
      menuList,
      bannerList,
      list,
      state,
      idArr,
      isAll,
      actions,
      height,
      strId,
      date
    } = this.state;
    let RnActionsheet = null;
    if (process.env.TARO_ENV === "rn") {
      let { Actionsheet } = require("beeshell");
      RnActionsheet = Actionsheet;
    }
    return (
      <View className="recordList">
        {/* <ScrollView
          className="recordList"
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
          onScrollToLower={this.handleScroll.bind(this)}
        > */}
        <View className="recordList-header">
          <ProjectPicker
            title="选择项目"
            className="recordList-header-left"
            listName={this.state.listName}
            selectIndex={this.selectlevelIndex}
            typeName={this.state.projectName}
          />
          <DatePicker
            selectData={this.selectMonthData}
            className="recordList-header-right"
            date={date}
          ></DatePicker>
        </View>
        <View className="recordList-headers">
          {menuList.map((item, index) => {
            return (
              <View
                className={
                  "recordList-headers-item " +
                  (item.state == state ? "recordList-headers-active" : "")
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
              selectRecord={this.selectRecord}
              goInfo={this.goInfo}
              downloadFiles={this.downloadFiles}
              info={item}
              idArr={idArr}
              key={index}
            ></ItemRecord>
          );
        })}
        {list && list.length != 0 ? (
          <FooterLine title="没有更多数据了~"></FooterLine>
        ) : (
          <BoxEmpty title="暂无内容"></BoxEmpty>
        )}
        {/* <View className="recordList-bottomBr"></View> */}
        {/* </ScrollView> */}
        {/* <View className="recordList-footer">
          <View
            className="recordList-footer-left"
            onClick={() => {
              this.selectAllRecord();
            }}
          >
            <Image
              className="recordList-footer-image"
              src={!isAll ? Recordnochecked : Recordchecked}
              mode="aspectFill"
            />
            <View className="recordList-footer-title">全选</View>
          </View>
          <View
            className="recordList-footer-btn"
            onClick={() => {
              this.downloadConfirmFiles();
            }}
          >
            下载
          </View>
        </View> */}
        <RnActionsheet
          ref={c => {
            this._actionsheet = c;
          }}
          data={actions}
          cancelable
          header="请选择"
          offsetY={height + 20}
          useSafeAreaView
          onPressConfirm={item => {
            console.log("confirm", item);
            if (!item) {
              return;
            }
            if (item == "整改回复单") {
              this.onClickDownload(strId, 1);
            } else {
              this.onClickDownload(strId, 2);
            }
            // Taro.makePhoneCall({
            //   phoneNumber: item //仅为示例，并非真实的电话号码
            // });
          }}
          onPressCancel={() => {
            console.log("cancel");
          }}
        ></RnActionsheet>
      </View>
    );
  }
}
export default Phonebook;
