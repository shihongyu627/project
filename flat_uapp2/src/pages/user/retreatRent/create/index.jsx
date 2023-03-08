import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Image,
  Textarea,
  ScrollView,
  Input
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import {
  AtNavBar,
  InputText,
  SubmitBtn,
  DatePickerRn,
  TimePickerRn,
  SelectTypeRn
} from "@component";
import { getWindowHeight } from "@utils/style";
import commonBgPng from "@assets/image/common_bg.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomNameList: [],
      roomData: [],
      roomName: "",
      roomId: "",
      name: "",
      aliPay: "",
      account: "",
      date: "", //预约日期
      height: 667,
      bankName: "",
      cardSite: "",
      cusPhone: "",
      content: "",
      submitVal: true
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    const { windowHeight } = Taro.getSystemInfoSync();

    let id = params.id;
    let title = params.title;
    console.log(id, title, "传过来的值");
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    this.setState(
      {
        id,
        title,
        height: windowHeight
      },
      () => {
        this.roomnoPageList();
      }
    );
  }

  async componentWillUnmount() {}
  componentDidShow() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("light-content");
    }
  }
  componentDidHide() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("dark-content");
    }
  }
  //查询房间号
  roomnoPageList = () => {
    let d = {};
    global.$utils.api
      .load("roomnoPageList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let roomData = res.rows || [];
          let roomNameList = [];
          roomData.map(item => {
            item.roomName = item.name;
            roomNameList.push(item.name);
          });
          this.setState({
            roomData,
            roomNameList
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  changeName = data => {
    this.setState({
      name: data
    });
  };
  changeCusPhone = data => {
    this.setState({
      cusPhone: data
    });
  };
  changeAccount = data => {
    this.setState({
      account: data
    });
  };
  changeAliPay = data => {
    this.setState({
      aliPay: data
    });
  };
  changeBankName = data => {
    this.setState({
      bankName: data
    });
  };
  changeCardSite = data => {
    this.setState({
      cardSite: data
    });
  };

  //选择日期
  selectData = data => {
    this.setState({
      date: data
    });
  };
  changeContent = e => {
    this.setState({
      content: e.detail.value
    });
  };
  handleSubmit = () => {
    let {
      name,
      aliPay,
      bankName,
      cardSite,
      account,
      date,
      roomId,
      cusPhone,
      content,
      submitVal
    } = this.state;
    let d = {};
    d.account = account;
    d.aliPay = aliPay;
    d.bankName = bankName;
    d.cardSite = cardSite;
    d.surrenderTime = date;
    d.name = name;
    d.roomId = roomId;
    d.state = "0";
    d.roomId = roomId;
    d.cusPhone = cusPhone;
    d.descr = content;
    if (!roomId) {
      global.$utils.toast.text("请选择房间号");
      return;
    }
    if (!date) {
      global.$utils.toast.text("请选择退租日期");
      return;
    }
    if (!name) {
      global.$utils.toast.text("请输入姓名");
      return;
    }
    if (!cusPhone) {
      global.$utils.toast.text("请输入联系电话");
      return;
    }
    if (!content) {
      global.$utils.toast.text("请输入退租原因");
      return;
    }
    console.log(d, "提交的数据");
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    global.$utils.api
      .load("surrenderAdd", d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          setTimeout(() => {
            Taro.navigateBack();
          }, 500);
        } else {
          this.setState({
            submitVal: true
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          submitVal: true
        });
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  //选择房间
  selectRoomIndex = data => {
    let { roomData } = this.state;
    if (roomData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(roomData[data], "传过来的索引取类型值");
    let obj = roomData[data];
    let roomName = obj.roomName;
    let roomId = obj.id;
    this.setState({
      roomName,
      roomId
    });
  };
  render() {
    let {
      roomNameList,
      roomName,
      date,
      height,
      name,
      aliPay,
      bankName,
      cardSite,
      account,
      cusPhone
    } = this.state;
    return (
      <View className="retreatRentCreate">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: height - 90 }}
        >
          <View className="retreatRentCreate-header">
            <Image
              className="retreatRentCreate-header-img"
              src={commonBgPng}
              mode="aspectFill"
            />
            <View className="retreatRentCreate-header-content">
              <AtNavBar
                title="我要退租"
                background="rgba(0, 0, 0, 0)"
                color="#fff"
                onClick={() => {
                  Taro.navigateBack();
                }}
              ></AtNavBar>
            </View>
          </View>
          <View className="retreatRentCreate-box">
            <SelectTypeRn
              title="房间号"
              listName={roomNameList}
              selectIndex={this.selectRoomIndex}
              typeName={roomName}
            ></SelectTypeRn>
            <DatePickerRn
              title="退租日期"
              // className="retreatRentCreate-box-title"
              selectData={this.selectData}
            ></DatePickerRn>
            <InputText
              title="姓名"
              type="text"
              onInput={this.changeName}
              // className="retreatRentCreate-box-title"
              value={name}
            ></InputText>
            <InputText
              title="联系电话"
              type="text"
              onInput={this.changeCusPhone}
              // className="retreatRentCreate-box-title"
              value={cusPhone}
            ></InputText>

            <InputText
              title="支付宝账号"
              type="text"
              // className="retreatRentCreate-box-title"
              onInput={this.changeAliPay}
              value={aliPay}
            ></InputText>
            <InputText
              title="银行卡卡号"
              type="text"
              // className="retreatRentCreate-box-title"
              onInput={this.changeAccount}
              value={account}
              tag="*"
            ></InputText>
            <InputText
              title="开户行"
              type="text"
              // className="retreatRentCreate-box-title"
              onInput={this.changeBankName}
              value={bankName}
              tag="*"
              placeholder="例：招商银行"
            ></InputText>
            <InputText
              title="开户地"
              type="text"
              // className="retreatRentCreate-box-title"
              onInput={this.changeCardSite}
              value={cardSite}
              tag="*"
              placeholder="例：广东省深圳市"
            ></InputText>
            <View className="retreatRentCreate-box-items">
              <View className="retreatRentCreate-box-items-title">
                退租原因
              </View>
            </View>
            <View className="retreatRentCreate-box-Textarea">
              <Textarea
                className="retreatRentCreate-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="请输入"
                onInput={this.changeContent.bind(this)}
              />
            </View>
          </View>
        </ScrollView>
        <SubmitBtn title="确定" handleSubmit={this.handleSubmit}></SubmitBtn>
      </View>
    );
  }
}

export default Index;
