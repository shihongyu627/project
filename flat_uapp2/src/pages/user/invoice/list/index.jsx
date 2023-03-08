import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input, Text } from "@tarojs/components";
import "./index.scss";
import {
  CommonSelect,
  BoxEmpty,
  MonthPicker,
  InvoiceList,
  InvoiceRecord
} from "@component";
import invoiceTopPng from "@assets/image/invoice-top.png";
import header_selectPng from "@assets/image/header_select.png";
import month_icon from "@assets/image/month_icon.png";
import noCheckedPng from "@assets/image/invoice_noChecked.png";
import checkedPng from "@assets/image/invoice_checked.png";
import { getWindowHeight } from "@utils/style";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    listName: [],
    listData: [],
    roomName: "",
    roomId: "",
    list: [],
    listRecord: [],
    headerList: [
      {
        title: "发票管理",
        type: 1
      },
      {
        title: "开票记录",
        type: 2
      }
    ],
    transactionTotal: 0,
    headerType: 1,
    checked: false,
    height: 677,
    ym: "",
    total: 0 //可开发票总数
  };

  componentDidMount() {
    let timestamp = Date.parse(new Date());
    let ym = $utils.datetime.format(Number(timestamp) / 1000, "YYYY-MM");
    // Taro.setNavigationBarColor({
    //   frontColor: "#000000",
    //   backgroundColor: "#ffffff"
    // });
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState(
      {
        height: windowHeight,
        ym
      },
      () => {
        this.load();
      }
    );
    // this.roomnoPageList();
    Taro.eventCenter.on("refreshInvoiceList", val => {
      this.setState(
        {
          list: [],
          listRecord: [],
          pageIndex: 1,
          checked:false
        },
        () => {
          this.load();
          this.invoiceList();
        }
      );
    });
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshInvoiceList");
  }
  //查询房间号
  roomnoPageList = () => {
    let d = {};
    global.$utils.api
      .load("roomnoPageList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let listData = res.rows || [];
          let listName = [];
          listData.map(item => {
            listName.push(item.name);
          });
          let roomId = "";
          let roomName = "请切换房间";
          if (listData && listData.length > 0) {
            let cc = listData[0];
            roomName = cc.name || "";
            roomId = cc.id || "";
          }
          this.setState(
            {
              listData,
              listName,
              roomName,
              roomId
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
  };
  invoiceList = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    global.$utils.api
      .load("invoiceList", d, "get", false)
      .then(res => {
        let { list } = this.state;
        let total = 0;
        if (res.code == 200) {
          let v = res.rows || [];
          let dataTotal = res.total || 0;
          let listOld = this.state.listRecord;
          let listNew = [];
          let list = [];
          v.map(item => {
            item.checked = false;
            listNew.push(item);
          });
          list = [...listOld, ...listNew];
          console.log(list);
          this.setState({
            listRecord: list,
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
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    d.ym = this.state.ym;
    // d.roomId = this.state.roomId;
    global.$utils.api
      .load("transactionInvoice", d, "get", { loading: false, login: true })
      .then(res => {
        let { list } = this.state;
        let total = 0;
        if (res.code == 200) {
          let v = res.rows || [];
          let transactionTotal = res.total || 0;
          let listOld = this.state.list;
          let listNew = [];
          let list = [];
          v.map(item => {
            item.checked = false;
            listNew.push(item);
          });
          list = [...listOld, ...listNew];
          console.log(list);
          this.setState({
            list: list,
            transactionTotal
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
  // //下拉刷新
  // onPullDownRefresh = () => {
  //   this.load();
  // };
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

  //选择类型
  selectIndex = data => {
    let { listData } = this.state;
    if (listData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(listData[data], "传过来的索引取类型值");
    let obj = listData[data];
    let roomName = obj.name;
    let roomId = obj.id;
    this.setState(
      {
        roomName,
        roomId
      },
      () => {
        this.load();
      }
    );
  };
  selectData = data => {
    console.log(data, "选择日期");
    this.setState(
      {
        ym: data,
        list: [],
        pageIndex: 1
      },
      () => {
        this.load();
      }
    );
  };
  //选择发票
  getOnClick = data => {
    let { list, transactionTotal } = this.state;
    list.map(item => {
      if (data.id == item.id) {
        item.checked = !data.checked;
      }
    });
    let num = 0;
    list.map(item => {
      if (item.checked) {
        num += 1;
      }
    });
    if (num == transactionTotal) {
      this.setState({
        checked: true
      });
    } else {
      this.setState({
        checked: false
      });
    }
    console.log(transactionTotal, "选中总数");
    this.setState({
      list
    });
  };
  //全选
  selectAll = () => {
    let { list, checked } = this.state;
    console.log(list);
    list.map(item => {
      item.checked = !checked;
    });
    this.setState({
      list,
      checked: !checked
    });
  };
  //提交申请
  submitBtn = () => {
    let { list } = this.state;
    let idArr = [];
    list.map(item => {
      if (item.checked) {
        idArr.push(item.id);
      }
    });
    let strId = idArr.join(",");
    if (!strId) {
      return global.$utils.toast.text("请选择需要开的发票");
    }
    Taro.navigateTo({
      url: `/pages/user/invoice/create/index?id=${strId}`
    });
  };
  goInfo = data => {
    Taro.navigateTo({
      url: `/pages/user/invoice/info/index?id=${data.id}`
    });
  };
  selectHeaderType = data => {
    this.setState(
      {
        headerType: data,
        pageIndex: 1,
        list: [],
        listRecord: [],
      },
      () => {
        if (data == "1") {
          this.load();
        } else {
          this.invoiceList();
        }
      }
    );
  };
  handleScroll = () => {
    let {
      dataTotal,
      list,
      transactionTotal,
      pageIndex,
      headerType,
      listRecord
    } = this.state;
    console.log("加载更多");
    this.setState(
      {
        pageIndex: pageIndex + 1
      },
      () => {
        if (headerType == "1") {
          if (transactionTotal > list.length) {
            this.load();
          }
        } else {
          if (dataTotal > listRecord.length) {
            this.invoiceList();
          }
        }
      }
    );
  };
  render() {
    let {
      list,
      dataTotal,
      listName,
      roomName,
      headerType,
      headerList,
      checked,
      listRecord,
      height
    } = this.state;
    return (
      <View className='invoiceBox'>
        <View className='invoiceBox-headerTitle'>
          {headerList.map((item, index) => (
            <View
              className={
                "invoiceBox-headerTitle-item " +
                (item.type == headerType ? "invoiceBox-headerTitle-items" : "")
              }
              key={index}
              onClick={() => {
                this.selectHeaderType(item.type);
              }}
            >
              {item.title}
              {item.type == headerType ? (
                <Image
                  // src={global.$utils.loadimg.load(item)}
                  className='invoiceBox-headerTitle-item-img'
                  src={header_selectPng}
                  mode='aspectFill'
                />
              ) : null}
            </View>
          ))}
        </View>
        <ScrollView
          className='scrollDom'
          scrollY
          lowerThreshold={90}
          style={{
            height:
              headerType == 1
                ? height - 140
                : process.env.TARO_ENV === "rn"
                ? height - 200
                : height - 110,
          }}
          onScrollToLower={this.handleScroll.bind(this)}
        >
          {headerType == 1 ? (
            <View>
              {/* <View className="invoiceBox-header">
                <View className="invoiceBox-header-top">
                  <Image
                    // src={global.$utils.loadimg.load(item)}
                    className="invoiceBox-header-top-img"
                    src={invoiceTopPng}
                    mode="aspectFill"
                  />
                  <View className="invoiceBox-header-top-address">
                    {roomName}
                  </View>
                </View>
                <CommonSelect
                  listName={listName}
                  selectIndex={this.selectIndex}
                  className="invoiceBox-header-changeHome"
                  title="切换房间"
                ></CommonSelect>
              </View> */}
              <View className='invoiceBox-monthBox'>
                <MonthPicker
                  className='invoiceBox-monthBox-title'
                  selectData={this.selectData}
                ></MonthPicker>
                <Image
                  // src={global.$utils.loadimg.load(item)}
                  className='invoiceBox-monthBox-img'
                  src={month_icon}
                  mode='aspectFill'
                />
              </View>
              <View className='invoiceBox-list'>
                {list.map((item, index) => (
                  <InvoiceList
                    info={item}
                    getOnClick={this.getOnClick}
                    key={index}
                  ></InvoiceList>
                ))}
                {list.length == 0 ? (
                  <BoxEmpty title='暂无发票'></BoxEmpty>
                ) : null}
              </View>
              <View className='invoiceBox-bottomBr'></View>
            </View>
          ) : (
            <View className='invoiceBox-list'>
              <View className='invoiceBox-topBr'></View>
              {listRecord.map((item, index) => (
                <InvoiceRecord
                  info={item}
                  key={index}
                  goInfo={this.goInfo}
                ></InvoiceRecord>
              ))}
              {listRecord.length == 0 ? (
                <BoxEmpty title='暂无记录'></BoxEmpty>
              ) : null}
            </View>
          )}
        </ScrollView>
        {headerType == 1 ? (
          <View className='invoiceBox-footer'>
            <View
              className='invoiceBox-footer-left'
              onClick={this.selectAll.bind(this)}
            >
              <Image
                className='invoiceBox-footer-left-img'
                src={checked ? checkedPng : noCheckedPng}
                mode='aspectFill'
              />
              <View className='invoiceBox-footer-left-text'>全选</View>
            </View>
            <View
              className='invoiceBox-footer-btn'
              onClick={this.submitBtn.bind(this)}
            >
              申请发票
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
