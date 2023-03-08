import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import rightPng from "@assets/image/right.png";
import iconesPng from "@assets/image/invoice_icones.png";
import iconsPng from "@assets/image/invoice_icons.png";
export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className="InvoiceRecord">
        <View
          className="InvoiceRecord-top"
          onClick={() => {
            this.props.goInfo(info);
          }}
        >
          <View className="InvoiceRecord-top-header">
            <View className="InvoiceRecord-top-header-left">
              <Image
                className="InvoiceRecord-top-header-left-img"
                src={iconsPng}
                mode="aspectFill"
              />
              <View className={"InvoiceRecord-top-header-left-title "}>
                {info.title}
              </View>
            </View>
            <View className="InvoiceRecord-top-header-right">
              <View className={"InvoiceRecord-top-header-right-title "}>
                ￥{info.amount}
              </View>
              <Image
                className="InvoiceRecord-top-header-right-icon"
                src={rightPng}
                mode="aspectFill"
              />
            </View>
          </View>
          <View className="InvoiceRecord-bottombox">
            <View>
              <View className={"InvoiceRecord-top-content "}>
                抬&emsp;&emsp;头：{info.riseName}
              </View>
              <View className={"InvoiceRecord-top-content "}>
                手&ensp;机&ensp;号：{info.phone}
              </View>
              <View className={"InvoiceRecord-top-content "}>
                邮&emsp;&emsp;箱：{info.email}
              </View>
              <View className={"InvoiceRecord-top-content "}>
                申请时间：{info.createTime}
              </View>
            </View>
            <View className={"InvoiceRecord-top-statusName"}>
              {info.state == 1 ? "已开票" : "已申请"}
            </View>
            {/* <View
              className={
                "InvoiceList-top-statusName " +
                (info.state == 1
                  ? "InvoiceList-top-statusNamees"
                  : "InvoiceList-top-statusNames")
              }
            >
              {info.state == 1 ? "已开票" : "已申请"}
            </View> */}
          </View>
        </View>
      </View>
    );
  }
}
