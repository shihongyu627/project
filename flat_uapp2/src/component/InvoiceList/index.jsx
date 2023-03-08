import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";
import rightPng from "@assets/image/right.png";
import iconesPng from "@assets/image/invoice_icones.png";
import iconsPng from "@assets/image/invoice_icons.png";
import noCheckedPng from "@assets/image/invoice_noChecked.png";
import checkedPng from "@assets/image/invoice_checked.png";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className="InvoiceList">
        <View
          className="InvoiceList-left"
          onClick={() => {
            this.props.getOnClick(info);
          }}
        >
          <Image
            className="InvoiceList-left-img"
            src={info.checked ? checkedPng : noCheckedPng}
            mode="aspectFill"
          />
        </View>
        <View className="InvoiceList-top">
          <View className="InvoiceList-top-header">
            <View className="InvoiceList-top-header-left">
              <Image
                className="InvoiceList-top-header-left-img"
                src={global.$utils.loadimg.load(info.icon)}
                mode="aspectFill"
              />
              <View
                className={
                  "InvoiceList-top-header-left-title " +
                  (info.state == 3 ? "InvoiceList-top-header-left-titles" : "")
                }
              >
                {info.typeName}
              </View>
            </View>
            <View className="InvoiceList-top-header-right">
              <View
                className={
                  "InvoiceList-top-header-right-title " +
                  (info.state == 3 ? "InvoiceList-top-header-right-titles" : "")
                }
              >
                ￥{info.money}
              </View>
              <Image
                className="InvoiceList-top-header-right-icon"
                src={rightPng}
                mode="aspectFill"
              />
            </View>
          </View>
          <View className="InvoiceList-bottombox">
            <View>
              <View
                className={
                  "InvoiceList-top-content " +
                  (info.state == 3 ? "InvoiceList-top-contents" : "")
                }
              >
                房&nbsp;&nbsp;间&nbsp;号：{info.roomName}
              </View>
              <View
                className={
                  "InvoiceList-top-content " +
                  (info.state == 3 ? "InvoiceList-top-contents" : "")
                }
              >
                流水单号：{info.orderNo}
              </View>
              <View
                className={
                  "InvoiceList-top-content " +
                  (info.status == 3 ? "InvoiceList-top-contents" : "")
                }
              >
                交易时间：{info.payTime}
              </View>
            </View>
            {/* <View
              className={
                "InvoiceList-top-statusName " +
                (info.state == 1
                  ? "InvoiceList-top-statusNamees"
                  : info.state == 3
                  ? "InvoiceList-top-statusNames"
                  : "")
              }
            >
              {info.stateName}
            </View> */}
          </View>
        </View>
      </View>
    );
  }
}
