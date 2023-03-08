import React, { Component } from "react";

import { Image, View, Text } from "@tarojs/components";
import "./index.scss";
import TextLabel from "../TextLabel";

export default class Index extends Component {
  state = {};

  render() {
    const { info } = this.props;
    return (
      <View className='HouseList'>
        <View
          onClick={() => {
            this.props.onClickConfrim(info);
          }}
        >
          <Text className='HouseList-name'>
            {info.realName || info.nickName}
            {info.phonenumber ? `（${info.phonenumber}）` : ""}
          </Text>
        </View>
      </View>
    );
  }
}
