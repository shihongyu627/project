import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Picker,
  Textarea,
  ScrollView,
  Image
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import {
  InputText,
  SubmitBtn,
  DatePickerRn,
  TimePickerRn,
  SelectTypeRn,
  AtNavBar
} from "@component";
import { getWindowHeight } from "@utils/style";
import commonBgPng from "@assets/image/common_bg.png";
import rightPng from "@assets/image/right.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listName: [],
      listData: [],
      payMoisNameList: ["月付", "季度付", "半年付", "年付"],
      payMoisData: ["0", "1", "2", "3"],
      roomNameList: [],
      roomData: [],
      userNameList: [],
      userData: [],
      cusName: "",
      cusId: "",
      positionVal: true,
      positionVals: true,
      flatId: "",
      flatName: "",
      roomId: "",
      roomName: "",
      payMoisId: "",
      payMoisName: "",
      isSelect: true, //是否选择
      name: "", //姓名
      price: "", //价格
      deposit: "", //押金
      discounts: "", //优惠
      endTime: "", //结束日期
      beginTime: "", //开始日期
      docTemplateId: "", //模板id
      contractUrl: "", //模板地址
      docTemplateName: "", //模板名称
      makeId: "",
      submitVal: true
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let makeId = params.makeId;
    this.setState(
      {
        id,
        makeId
      },
      () => {
        if (id) {
          this.agreementInfo();
        }
        if (makeId) {
          this.flatMake();
        }
      }
    );

    //选择合同
    Taro.eventCenter.on("refreshTemplateId", val => {
      if (val) {
        this.setState(
          {
            docTemplateId: val.docTemplateId,
            docTemplateName: val.docTemplateName
          },
          () => {
            this.load();
          }
        );
      }
    });
    //选择房源
    Taro.eventCenter.on("refreshHouseData", val => {
      if (val) {
        this.setState({
          roomId: val.roomId,
          roomName: val.name
        });
      }
    });
    //选择用户
    Taro.eventCenter.on("refreshUserData", val => {
      if (val) {
        this.setState({
          cusId: val.userId || "",
          cusName: val.realName || val.nickName || ""
        });
      }
    });

    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    this.flatnoPageList(); //公寓列表
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshTemplateId");
  }
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
  //预约详情
  flatMake = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.id = this.state.makeId;
    let url = `${global.base_host}/maintainer/flat/make/${this.state.makeId}`;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let detail = res.data || {};
          let dd = detail.flatRoomResponse && detail.flatRoomResponse.price;
          let price = Number(dd);
          let flatId = detail.flatId;
          let flatName = detail.flatName;
          let roomName =
            detail.flatRoomResponse && detail.flatRoomResponse.name;
          let roomId = detail.roomId;
          let cusId = detail.cusId;
          let cusName = detail.cusName;
          this.setState({
            price,
            flatId,
            flatName,
            roomName,
            roomId,
            cusId,
            cusName,
            isSelect: false
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
  //模板详情
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let { docTemplateId } = this.state;
    let d = {};
    d.docTemplateId = docTemplateId;
    let url = `${global.base_host}/maintainer/flat/sign/${docTemplateId}`;
    global.$utils.api
      .load(url, d, "get", false)
      .then(res => {
        if (res.data) {
          Taro.hideLoading();
          let contractUrl = res.data || {};
          console.log(contractUrl);
          this.setState({
            contractUrl
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };
  //合同详情
  agreementInfo = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.id = this.state.id;
    let url = `${global.base_host}/maintainer/flat/contract/${this.state.id}`;
    global.$utils.api
      .load(url, d, "get", false)
      .then(res => {
        if (res.code == 200) {
          console.log(res);
          let detail = res.data || {};
          let price = Number(detail.price);
          let deposit = Number(detail.deposit);
          let discounts = Number(detail.discounts);
          let endTime = detail.endTime;
          let beginTime = detail.beginTime;
          let flatId = detail.flatId;
          let flatName =
            detail.flatRoomResponse && detail.flatRoomResponse.flatName;
          let roomName =
            detail.flatRoomResponse && detail.flatRoomResponse.name;
          let roomId = detail.roomId;
          let cusId = detail.cusId;
          let cusName = detail.cusName;
          let contractWay = detail.contractWay;
          let termsPaymentType = detail.termsPaymentType;
          let payMoisId = detail.payMois + "";
          let payMoisName = detail.payMoisName;
          let contractUrl = detail.contractUrl;
          let docTemplateId = detail.flowId;
          let docTemplateName = detail.contractTemplate;
          let state = "0";
          this.setState({
            detail,
            price,
            deposit,
            discounts,
            endTime,
            beginTime,
            flatId,
            flatName,
            roomName,
            roomId,
            cusId,
            cusName,
            contractWay,
            termsPaymentType,
            payMoisId,
            payMoisName,
            state,
            isSelect: false,
            contractUrl,
            docTemplateId,
            docTemplateName
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };

  //公寓
  flatnoPageList = () => {
    let d = {};
    global.$utils.api
      .load("flatnoPageList", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let listData = res.rows || [];
          let listName = [];
          listData.map(item => {
            listName.push(item.name);
          });
          this.setState({
            listData,
            listName
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  //下拉刷新
  onPullDownRefresh = () => {};
  //姓名
  changeName = data => {
    this.setState({
      name: data
    });
  };
  //价格
  changePrice = data => {
    this.setState({
      price: data
    });
  };
  //押金
  changeDeposit = data => {
    this.setState({
      deposit: data
    });
  };
  //优惠金额
  changeDiscounts = data => {
    this.setState({
      discounts: data
    });
  };
  handleSubmit = () => {
    let {
      price,
      deposit,
      discounts,
      endTime,
      beginTime,
      flatId,
      roomId,
      cusId,
      payMoisId,
      contractUrl,
      docTemplateId,
      docTemplateName,
      submitVal
    } = this.state;
    let d = {};
    d.price = price;
    d.deposit = deposit;
    d.discounts = 0;
    d.endTime = endTime;
    d.beginTime = beginTime;
    d.flatId = flatId;
    d.roomId = roomId;
    d.cusId = cusId;
    d.contractWay = 1;
    d.state = "0";
    d.termsPaymentType = 1;
    d.payMois = payMoisId;
    d.contractUrl = contractUrl;
    d.flowId = docTemplateId;
    d.contractTemplate = docTemplateName;
    if (!flatId) {
      $utils.toast.text("请选择公寓");
      return;
    }
    if (!roomId) {
      $utils.toast.text("请选择房屋");
      return;
    }
    if (!cusId) {
      $utils.toast.text("请选择用户");
      return;
    }
    if (!price) {
      $utils.toast.text("请输入月租金");
      return;
    }
    if (!beginTime) {
      $utils.toast.text("请选择起租日期");
      return;
    }
    if (!endTime) {
      $utils.toast.text("请选择到租日期");
      return;
    }
    if (!payMoisId) {
      $utils.toast.text("请选择付租周期");
      return;
    }
    Taro.showLoading({
      title: "loading"
    });
    let url = "contractAdd";
    let method = "post";
    if (this.state.id) {
      url = "contractEdit";
      method = "put";
      d.id = this.state.id;
    }
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    $utils.api
      .load(url, d, method, false)
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          setTimeout(() => {
            Taro.eventCenter.trigger("refreshAgreementList", true); //合同列表
            Taro.navigateBack();
          }, 1000);
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
    console.log(d, "提交的数据");
  };
  //选择日期
  selectStartData = data => {
    this.setState({
      beginTime: data
    });
  };
  //选择日期
  selectEndData = data => {
    this.setState({
      endTime: data
    });
  };
  //选择公寓类型
  selectIndex = data => {
    let { listData, flatId } = this.state;
    if (listData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(listData[data], "传过来的索引取类型值");
    let obj = listData[data];
    let flatName = obj.name;
    let id = obj.id;
    if (flatId == obj.id) {
      return;
    }
    this.setState({
      flatName,
      flatId: id,
      isSelect: false,
      roomName: "",
      roomId: ""
    });
  };
  //选择房屋类型
  selectRoomIndex = data => {
    let { roomData } = this.state;
    console.log(data, "传过来的索引");
    console.log(roomData[data], "传过来的索引取类型值");
    let obj = roomData[data];
    let roomName = obj.name;
    let roomId = obj.id;
    this.setState({
      roomName,
      roomId
    });
  };
  //选择用户
  selectuserIndex = data => {
    let { userData } = this.state;
    if (userData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(userData[data], "传过来的索引取类型值");
    let obj = userData[data];
    let cusName = obj.nickName;
    let cusId = obj.userId;
    this.setState({
      cusName,
      cusId
    });
  };
  //付租周期
  selectpayMoisIndex = data => {
    let { payMoisData, payMoisNameList } = this.state;
    console.log(data, "传过来的索引");
    // console.log(userData[data], "传过来的索引取类型值");
    // let obj = userData[data];
    let payMoisName = payMoisNameList[data];
    let payMoisId = payMoisData[data];
    this.setState({
      payMoisName,
      payMoisId
    });
  };
  //选择模板
  selectTemplate = () => {
    Taro.navigateTo({
      url: "/pages/butler/home/template/list/index"
    });
  };
  render() {
    let {
      date,
      positionVal,
      positionVals,
      flatId,
      isSelect,
      name,
      price,
      deposit,
      discounts,
      userNameList,
      payMoisNameList,
      payMoisName,
      docTemplateName,
      roomName,
      cusName
    } = this.state;
    return (
      <View className="InitiateSign">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className="InitiateSign-header">
            <Image
              className="InitiateSign-header-img"
              src={commonBgPng}
              mode="aspectFill"
            />
            <View className="InitiateSign-header-content">
              <AtNavBar
                title="发起签约"
                background="rgba(0, 0, 0, 0)"
                color="#fff"
                onClick={() => {
                  Taro.navigateBack();
                }}
              ></AtNavBar>
            </View>
          </View>
          <View className="InitiateSign-box">
            <SelectTypeRn
              title="选择公寓"
              listName={this.state.listName}
              selectIndex={this.selectIndex}
              typeName={this.state.flatName}
            ></SelectTypeRn>
            <View
              className="InitiateSign-box-item"
              onClick={() => {
                if (!flatId) {
                  $utils.toast.text("请选择公寓");
                  return;
                }
                Taro.navigateTo({
                  url: `/pages/butler/home/house/index?flatId=${flatId}`
                });
              }}
            >
              <View className="InitiateSign-box-item-title">选择房屋</View>
              <View className="InitiateSign-box-item-texts">
                {roomName || "请选择"}
              </View>
            </View>
            <View
              className="InitiateSign-box-item"
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/butler/home/userList/index?flatId=${flatId}`
                });
              }}
            >
              <View className="InitiateSign-box-item-title">选择用户</View>
              <View className="InitiateSign-box-item-texts">
                {cusName || "请选择"}
              </View>
            </View>
            {/* <SelectTypeRn
              title='选择房屋'
              listName={this.state.roomNameList}
              selectIndex={this.selectRoomIndex}
              typeName={this.state.roomName}
              isSelect={isSelect}
              value='请选择公寓'
            ></SelectTypeRn> */}
            {/* <SelectTypeRn
              title='选择用户'
              listName={userNameList}
              selectIndex={this.selectuserIndex}
              typeName={this.state.cusName}
            ></SelectTypeRn> */}
            <InputText
              title="月租金"
              type="digit"
              onInput={this.changePrice}
              value={price + ""}
            ></InputText>
            <InputText
              title="押金"
              type="digit"
              onInput={this.changeDeposit}
              maxlength={11}
              value={deposit + ""}
            ></InputText>
            <DatePickerRn
              title="起租日期"
              selectData={this.selectStartData}
              date={this.state.beginTime}
            ></DatePickerRn>
            <DatePickerRn
              title="到租日期"
              selectData={this.selectEndData}
              date={this.state.endTime}
            ></DatePickerRn>
            <SelectTypeRn
              title="付租周期"
              listName={payMoisNameList}
              selectIndex={this.selectpayMoisIndex}
              typeName={payMoisName}
            ></SelectTypeRn>
          </View>
          <View className="InitiateSign-box">
            {/* <SelectTypeRn
              title={"付款方式"}
              listName={this.state.listName}
              selectIndex={this.selectIndex}
              typeName={this.state.typeName}
            ></SelectTypeRn> */}
            <View className="InitiateSign-box-item">
              <View className="InitiateSign-box-item-title">付款方式</View>
              <View className="InitiateSign-box-item-textBox">
                <View className="InitiateSign-box-item-texts">线下付款</View>
              </View>
            </View>
            {/* <InputText
              title='优惠金额'
              type='digit'
              onInput={this.changeDiscounts}
              value={discounts}
            ></InputText> */}
            <View
              className="InitiateSign-box-item"
              onClick={() => {
                this.selectTemplate();
              }}
            >
              <View className="InitiateSign-box-item-title">合同模板</View>
              <View className="InitiateSign-box-item-texts">
                {docTemplateName || "请选择"}
              </View>
            </View>
            <View className="InitiateSign-box-item">
              <View className="InitiateSign-box-item-title">签约模式</View>
              <View className="InitiateSign-box-item-textBox">
                <View className="InitiateSign-box-item-texts">线下签约</View>
              </View>
            </View>
          </View>
          <View className={positionVals ? "bottomBr" : "bottomBrs"}></View>
        </ScrollView>
        <SubmitBtn
          title="发起签约"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
