import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Picker, Textarea, ScrollView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import {
  InputText,
  SubmitBtn,
  DatePickerRn,
  TimePickerRn,
  SelectTypeRn
} from "@component";
import { getWindowHeight } from "@utils/style";
import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeNameOne: [
        {
          name: "电子发票",
          id: 1
        },
        {
          name: "增值发票",
          id: 2
        }
      ],
      typeNameTwo: [
        {
          name: "单位",
          id: 1
        },
        {
          name: "个人",
          id: 2
        }
      ],
      name: "", //名字
      tel: "", //电话
      date: "", //预约日期
      time: "", //预约时间
      typeName: "",
      typeId: "",
      price: "",
      typeOne: "1",
      typeTwo: "1",
      riseName: "",
      dutyNo: "",
      registerSite: "",
      registerPhone: "",
      bank: "",
      bankAccount: "",
      phone: "",
      email: "",
      id: "",
      submitVal: true
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    console.log(id, "传过来的值");
    this.setState({
      id
    });
  }

  async componentWillUnmount() {}
  changeName = data => {
    this.setState({
      name: data
    });
  };
  changeTel = data => {
    this.setState({
      tel: data
    });
  };
  handleSubmit = () => {
    let {
      riseName,
      dutyNo,
      registerSite,
      registerPhone,
      bank,
      bankAccount,
      phone,
      typeId,
      typeOne,
      typeTwo,
      email,
      id,
      submitVal
    } = this.state;
    let d = {};

    d.riseName = riseName;
    d.dutyNo = dutyNo;
    d.registerSite = registerSite;
    d.registerPhone = registerPhone;
    d.bank = bank;
    d.bankAccount = bankAccount;
    d.phone = phone;
    d.email = email;
    d.flatId = $utils.data.get("flatId");
    console.log(typeOne);
    console.log(typeTwo);
    if (!riseName) {
      global.$utils.toast.text("请输入抬头名称");
      return;
    }
    //发票类型
    if (typeOne == 1) {
      d.invoiceType = 0;
    } else {
      d.invoiceType = 1;
    }

    //抬头类型
    if (typeTwo == 1) {
      d.riseType = 0;
      if (!dutyNo) {
        global.$utils.toast.text("请输入单位税号");
        return;
      }
    } else {
      d.riseType = 1;
    }
    if (!email) {
      global.$utils.toast.text("请输入正确的邮箱");
      return;
    }
    let phoneval = global.$utils.isPhoneNumber.isAvailable(phone);
    if (!phoneval) {
      global.$utils.toast.text("请输入正确的联系电话");
      return;
    }
    let jsonObject = {};
    jsonObject.data = d;
    if (id) {
      jsonObject.ids = id.split(",");
    } else {
      jsonObject.ids = id;
    }
    console.log(jsonObject, "提交的数据");
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    global.$utils.api
      .load("invoiceBatch", jsonObject, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          setTimeout(() => {
            Taro.eventCenter.trigger("refreshInvoiceList", true);
            Taro.redirectTo({
              url: `/pages/user/invoice/success/index?id=${res.data}`
            });
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

  changeRiseName = data => {
    this.setState({
      riseName: data
    });
  };
  changeDutyNo = data => {
    this.setState({
      dutyNo: data
    });
  };
  changeRegisterSite = data => {
    this.setState({
      registerSite: data
    });
  };
  changeRegisterPhone = data => {
    this.setState({
      registerPhone: data
    });
  };
  changeBank = data => {
    this.setState({
      bank: data
    });
  };
  changeBankAccount = data => {
    this.setState({
      bankAccount: data
    });
  };
  changeEmail = data => {
    this.setState({
      email: data
    });
  };
  changePhone = data => {
    this.setState({
      phone: data
    });
  };
  render() {
    let {
      typeNameOne,
      typeNameTwo,
      typeOne,
      typeTwo,
      riseName,
      dutyNo,
      registerSite,
      registerPhone,
      bank,
      bankAccount,
      phone,
      email
    } = this.state;
    return (
      <View className="invoiceDevice">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className="invoiceDevice-br" />
          <View className="invoiceDevice-box">
            <View className="InputText">
              <View className="InputText-title">发票类型</View>
              <View className="InputText-right">
                {typeNameOne.map((item, index) => (
                  <View
                    onClick={() => {
                      this.setState({
                        typeOne: item.id,
                        riseName: "",
                        dutyNo: "",
                        registerSite: "",
                        registerPhone: "",
                        bank: "",
                        bankAccount: "",
                        phone: "",
                        email: ""
                      });
                    }}
                    className={
                      "InputText-right-item " +
                      (item.id == typeOne ? "InputText-right-items" : "")
                    }
                    key={index}
                  >
                    {item.name}
                  </View>
                ))}
              </View>
            </View>
            <View className="InputText">
              <View className="InputText-title">抬头类型</View>
              <View className="InputText-right">
                {typeNameTwo.map((item, index) => (
                  <View
                    onClick={() => {
                      this.setState({
                        typeTwo: item.id,
                        riseName: "",
                        dutyNo: "",
                        registerSite: "",
                        registerPhone: "",
                        bank: "",
                        bankAccount: "",
                        phone: "",
                        email: ""
                      });
                    }}
                    className={
                      "InputText-right-item " +
                      (item.id == typeTwo ? "InputText-right-items" : "")
                    }
                    key={index}
                  >
                    {item.name}
                  </View>
                ))}
              </View>
            </View>
            <InputText
              title="抬头名称"
              type="text"
              placeholder="请输入抬头名称"
              value={riseName}
              onInput={this.changeRiseName}
            ></InputText>
            {typeTwo == 1 ? (
              <View>
                <InputText
                  title="单位税号"
                  type="text"
                  placeholder="请输入单位税号"
                  value={dutyNo}
                  onInput={this.changeDutyNo}
                ></InputText>
                <InputText
                  title="注册地址"
                  type="text"
                  placeholder="选填"
                  value={registerSite}
                  onInput={this.changeRegisterSite}
                ></InputText>
                <InputText
                  title="注册电话"
                  type="text"
                  placeholder="选填"
                  value={registerPhone}
                  onInput={this.changeRegisterPhone}
                ></InputText>
                <InputText
                  title="开户银行"
                  type="text"
                  placeholder="选填"
                  value={bank}
                  onInput={this.changeBank}
                ></InputText>
                <InputText
                  title="银行账号"
                  type="text"
                  placeholder="选填"
                  value={bankAccount}
                  onInput={this.changeBankAccount}
                ></InputText>
              </View>
            ) : null}
          </View>
          <View className="invoiceDevice-br" />
          <View className="invoiceDevice-box">
            <InputText
              title="邮箱"
              type="text"
              placeholder="请输入邮箱"
              value={email}
              onInput={this.changeEmail}
            ></InputText>
            <InputText
              title="手机号码"
              type="text"
              placeholder="请输入手机号码"
              value={phone}
              style={{ border: 0 }}
              onInput={this.changePhone}
            ></InputText>
          </View>
          <View className="bottomBr"></View>
        </ScrollView>
        <SubmitBtn
          title="申请开票"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
