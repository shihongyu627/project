import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/image/empty_box1.png";
import telPng from "@assets/image/tel.png";
import rightPng from "@assets/image/right.png";
import { TextLabel, BillNoticeList, BoxEmpty, CommonSelect } from "@component";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {
        image: ThreePng,
        title: "上城区 中开化府 9号楼 1单元804室",
        content: "3室1厅 | 88m² 南",
        tagArr: ["近地铁", "独立阳台"],
        price: 0,
        typeName: "非拆机",
        severStr: "单门冰箱、双门冰箱、三门冰箱",
        time: "2021-02-07 至 2022-02-30",
        statusName: "履行中",
        noOrder: "YG000225587",
        tel: "171",
        name: "张三",
        commonName: "无",
        price: "1600.00",
        cost: "1600.00",
        payway: "季付",
        status: 2
      },
      html: "",
      list: [],
      roomId: "",
      roomName: "",
      pageIndex: 1
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let title = params.title;
    console.log(id, title, "传过来的值");
    this.setState({
      id,
      title
    });
  }

  async componentWillUnmount() {}
  componentDidShow() {
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
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    // d.roomId = this.state.roomId;
    global.$utils.api
      .load("billList", d, "get", { loading: false, login: true })
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
    }, 500);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.setState(
      {
        pageIndex: 1,
        list: []
      },
      () => {
        this.load();
      }
    );
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
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
        roomId,
        detail: {}
      },
      () => {
        this.load();
      }
    );
  };
  onClickPay = data => {
    console.log(data);
    let name = data.typeName + "账单";
    Taro.navigateTo({
      url: `/pages/pay/index?id=${data.id}&money=${data.money}&typeName=${name}`
    });
  };
  render() {
    let { detail, list, listName } = this.state;
    return (
      <View className='agreement'>
        {/* <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        > */}
        {/* <View className="agreement-headerBox">
            <View className="agreement-header">
              <Image
                className="agreement-header-img"
                src={detail.image}
                mode="aspectFill"
              />
              <View className="agreement-header-right">
                <View className="agreement-headerBox-top">
                  <View className="agreement-headerBox-top-left">
                    {detail.noOrder}
                  </View>
                  <View className="agreement-headerBox-top-right">
                    <View
                      className={
                        "agreement-headerBox-top-right-radio " +
                        (detail.status == 1
                          ? "agreement-headerBox-top-right-radioOne"
                          : detail.status == 2
                          ? "agreement-headerBox-top-right-radioTwo"
                          : detail.status == 3
                          ? "agreement-headerBox-top-right-radioThree"
                          : detail.status == 4
                          ? "agreement-headerBox-top-right-radioFour"
                          : "")
                      }
                    ></View>
                    <View
                      className={
                        "agreement-headerBox-top-right-txt " +
                        (detail.status == 1
                          ? "agreement-headerBox-top-right-txtOne"
                          : detail.status == 2
                          ? "agreement-headerBox-top-right-txtTwo"
                          : detail.status == 3
                          ? "agreement-headerBox-top-right-txtThree"
                          : detail.status == 4
                          ? "agreement-headerBox-top-right-txtFour"
                          : "")
                      }
                    >
                      {detail.statusName}
                    </View>
                  </View>
                </View>
                <View className="agreement-header-right-title">
                  <TextLabel
                    className="agreement-header-right-title-text"
                    num={2}
                    content={detail.title}
                  ></TextLabel>
                </View>
                <CommonSelect
                  listName={listName}
                  selectIndex={this.selectIndex}
                  className="agreement-header-right-telBox"
                  title="切换房间"
                ></CommonSelect>
              </View>
            </View>
          </View> */}
        <View className='agreement-list'>
          {list.map((item, index) => (
            <BillNoticeList
              info={item}
              key={index}
              onClickPay={this.onClickPay}
            ></BillNoticeList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无账单'></BoxEmpty> : null}
        </View>
        <View className='agreement-bottomBr'></View>
        {/* </ScrollView> */}
      </View>
    );
  }
}

export default Index;
