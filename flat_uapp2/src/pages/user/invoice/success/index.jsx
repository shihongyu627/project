import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Picker, Textarea, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import invoice_success from "@assets/image/invoice_success.png";

import dayjs from "dayjs";
import "./index.scss";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ""
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

  render() {
    return (
      <View className="invoiceSuccess">
        <Image
          className="invoiceSuccess-img"
          src={invoice_success}
          mode="aspectFill"
        />
        <View className="invoiceSuccess-title">提交成功!</View>
        <View
          className="invoiceSuccess-one"
          onClick={() => {
            Taro.redirectTo({
              url: `/pages/user/invoice/info/index?id=${this.state.id}`
            });
          }}
        >
          查看开票详情
        </View>
        <View
          className="invoiceSuccess-two"
          onClick={() => {
            Taro.navigateBack();
          }}
        >
          继续开票
        </View>
      </View>
    );
  }
}

export default Index;
