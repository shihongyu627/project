import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/image/empty_box1.png";
import telPng from "@assets/image/tel.png";
import rightPng from "@assets/image/right.png";
import { TextLabel, SubmitBtn } from "@component";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      html: "",
      list: [
        // {
        //   title: "第3期",
        //   statusName: "待缴纳",
        //   price: "1600.00",
        //   time: "2021-02-07 至 2022-02-30",
        //   date: "2021-02-07",
        //   status: 1
        // },
        // {
        //   title: "第2期",
        //   statusName: "已缴纳",
        //   price: "1600.00",
        //   time: "2021-02-07 至 2022-02-30",
        //   date: "2021-02-07",
        //   status: 2
        // },
        // {
        //   title: "第1期",
        //   statusName: "已缴纳",
        //   price: "1600.00",
        //   time: "2021-02-07 至 2022-02-30",
        //   date: "2021-02-07",
        //   status: 2
        // }
      ],
      height: 667,
      platform: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let title = params.title;
    console.log(id, title, "传过来的值");
    const { windowHeight, platform } = Taro.getSystemInfoSync();
    this.setState(
      {
        id,
        title,
        height: windowHeight,
        platform
      },
      () => {
        this.load();
      }
    );
  }

  async componentWillUnmount() {}
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.id = this.state.id;
    let url = `${global.base_host}/customer/flat/contract/${this.state.id}`;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          console.log(res);
          let detail = res.data || {};
          this.setState({
            detail
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
  handleSubmit = () => {
    let { detail } = this.state;
    let that = this;
    let content = "";
    if (detail.state == 3) {
      content = "是否立即签约？";
    }
    if (detail.relet == 1) {
      content = "是否续租？";
    }
    Taro.showModal({
      title: "温馨提示",
      content: content
    }).then(res => {
      if (res.confirm) {
        console.log("999");
        that.confirmClick();
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  //确认
  confirmClick = () => {
    let { detail } = this.state;
    // Taro.showLoading({
    //   title: "loading"
    // });
    let url = "";
    let d = {};
    if (detail.state == 3) {
      // url = "contractAdd";
      // d.state = "4";
      Taro.navigateTo({
        url: `/pages/user/agreement/signAgreement/index?url=${detail.contractUrl}`
      });
      return;
    }
    if (detail.relet == 1) {
      url = `${global.base_host}/customer/flat/contract/relet/${detail.id}`;
    }
    d.id = detail.id;
    global.$utils.api
      .load(url, d, "put", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          Taro.eventCenter.trigger("refreshAgreementList", true);
          this.load();
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  render() {
    let { detail, list, height, platform } = this.state;
    return (
      <View className="agreement">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{
            height:
              detail.state == 3 || detail.relet == 1
                ? height - 100
                : process.env.TARO_ENV === "rn"
                ? height - 90
                : height - 10
          }}
        >
          <View className="agreement-headerBox">
            <View className="agreement-headerBox-top">
              <View className="agreement-headerBox-top-left">
                {detail.contractNo}
              </View>
              <View className="agreement-headerBox-top-right">
                <View
                  className={
                    "agreement-headerBox-top-right-radio " +
                    (detail.state == 1
                      ? "agreement-headerBox-top-right-radioOne"
                      : detail.state == 2
                      ? "agreement-headerBox-top-right-radioTwo"
                      : detail.state == 3
                      ? "agreement-headerBox-top-right-radioThree"
                      : detail.state == 4
                      ? "agreement-headerBox-top-right-radioFour"
                      : "")
                  }
                ></View>
                <View
                  className={
                    "agreement-headerBox-top-right-txt " +
                    (detail.state == 1
                      ? "agreement-headerBox-top-right-txtOne"
                      : detail.state == 2
                      ? "agreement-headerBox-top-right-txtTwo"
                      : detail.state == 3
                      ? "agreement-headerBox-top-right-txtThree"
                      : detail.state == 4
                      ? "agreement-headerBox-top-right-txtFour"
                      : "")
                  }
                >
                  {detail.stateName}
                </View>
              </View>
            </View>
            <View className="agreement-header">
              <Image
                className="agreement-header-img"
                src={global.$utils.loadimg.load(
                  detail.flatRoomResponse && detail.flatRoomResponse.themeUrl
                )}
                mode="aspectFill"
              />
              <View className="agreement-header-right">
                <View className="agreement-header-right-title">
                  <TextLabel
                    className="agreement-header-right-title-text"
                    num={2}
                    content={
                      detail.flatRoomResponse && detail.flatRoomResponse.name
                    }
                  ></TextLabel>
                </View>
                <View className="agreement-header-right-content">
                  {detail.beginTime} 至 {detail.endTime}
                </View>
                <View
                  className="agreement-header-right-telBox"
                  onClick={() => {
                    if (
                      !detail.flatRoomResponse &&
                      detail.flatRoomResponse.flatPhone
                    ) {
                      return;
                    }
                    Taro.makePhoneCall({
                      phoneNumber:
                        detail.flatRoomResponse &&
                        detail.flatRoomResponse.flatPhone //仅为示例，并非真实的电话号码
                    });
                  }}
                >
                  <Image
                    className="agreement-header-right-telBox-img"
                    src={telPng}
                    mode="aspectFill"
                  />
                  <View className="agreement-header-right-telBox-text">
                    联系ta
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="agreement-textBox">
            <View className="agreement-textBox-title">合同文本</View>
            <View
              className="agreement-textBox-right"
              onClick={() => {
                //查看合同详情处理
                if (detail.state == 3) {
                  // url = "contractAdd";
                  // d.state = "4";
                  Taro.navigateTo({
                    url: `/pages/user/agreement/signAgreement/index?url=${detail.contractUrl}`
                  });
                  return;
                }
                if (process.env.TARO_ENV === "rn" || platform == "ios") {
                  Taro.navigateTo({
                    url: `/pages/user/agreement/testPdf/index?url=${detail.contractUrl}`
                  });
                  return;
                }
                Taro.downloadFile({
                  url: detail.contractUrl,
                  success: function(res) {
                    var filePath = res.tempFilePath;
                    Taro.openDocument({
                      filePath: filePath,
                      success: function(res) {
                        console.log("打开文档成功");
                      }
                    });
                  }
                });
              }}
            >
              <View className="agreement-textBox-right-text">查看</View>
              <Image
                className="agreement-textBox-right-rightPng"
                src={rightPng}
                mode="aspectFill"
              />
            </View>
          </View>
          <View className="agreement-ContentBox">
            <View className="agreement-textBox agreement-textBoxs">
              <View className="agreement-textBox-titles">客户信息</View>
            </View>
            <View className="agreement-ContentBox-item">
              <View className="agreement-ContentBox-item-title">客户姓名</View>
              <View className="agreement-ContentBox-item-text">
                {detail.cusName}
              </View>
            </View>
            {/* <View className="agreement-ContentBox-item">
              <View className="agreement-ContentBox-item-title">
                共同居住人
              </View>
              <View className="agreement-ContentBox-item-text">
                {detail.commonName}
              </View>
            </View> */}
          </View>
          <View className="agreement-ContentBox">
            <View className="agreement-textBox agreement-textBoxs">
              <View className="agreement-textBox-titles">付款信息</View>
              {/* <View
                className='agreement-textBox-right'
                onClick={() => {
                  console.log("我的账单");
                  Taro.navigateTo({
                    url: `/pages/user/bill/history/index?id=${detail.id}`
                  });
                }}
              >
                <View className='agreement-textBox-right-text'>我的账单</View>
                <Image
                  className='agreement-textBox-right-rightPng'
                  src={rightPng}
                  mode='aspectFill'
                />
              </View> */}
            </View>
            <View className="agreement-ContentBox-item">
              <View className="agreement-ContentBox-item-title">月租金</View>
              <View className="agreement-ContentBox-item-text">
                {detail.price}
              </View>
            </View>
            <View className="agreement-ContentBox-item">
              <View className="agreement-ContentBox-item-title">付款方式</View>
              <View className="agreement-ContentBox-item-text">
                {detail.termsPaymentTypeName}
              </View>
            </View>
            <View className="agreement-ContentBox-item">
              <View className="agreement-ContentBox-item-title">押金</View>
              <View className="agreement-ContentBox-item-text">
                {detail.deposit}
              </View>
            </View>
          </View>

          {/* <View className='agreement-ContentBox agreement-ContentBoxEnd'>
            <View className='agreement-textBox agreement-textBoxs'>
              <View className='agreement-textBox-titles'>付款计划</View>
            </View>
            {list.map((item, index) => (
              <View className='agreement-ContentBox-itembox' key={index}>
                <View className='agreement-ContentBox-itembox-top'>
                  <View className='agreement-ContentBox-itembox-top-title'>
                    {item.title}
                  </View>
                  <View
                    className={
                      "agreement-ContentBox-itembox-top-typeNames " +
                      (item.status == 1
                        ? "agreement-ContentBox-itembox-top-typeName"
                        : "")
                    }
                  >
                    {item.statusName}
                  </View>
                </View>
                <View className='agreement-ContentBox-itembox-text'>
                  {item.time}
                </View>
                <View className='agreement-ContentBox-itembox-text'>
                  缴费日期 {item.date}
                </View>
                <View className='agreement-ContentBox-itembox-textBox'>
                  <View className='agreement-ContentBox-itembox-textBox-title'>
                    缴费金额
                  </View>
                  <View className='agreement-ContentBox-itembox-textBox-text'>
                    {item.price}
                  </View>
                </View>
                <View className='agreement-ContentBox-itembox-bottom'>
                  <Text className='agreement-ContentBox-itembox-bottom-btn'>
                    立即缴纳
                  </Text>
                </View>
              </View>
            ))}
          </View> */}
        </ScrollView>
        {detail.state == 3 || detail.relet == 1 ? (
          <SubmitBtn
            title={detail.state == 3 ? "立即签约" : "续租"}
            handleSubmit={this.handleSubmit}
          ></SubmitBtn>
        ) : null}
      </View>
    );
  }
}

export default Index;
