import React, { Component } from "react";

import { Text, View } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  state = {};

  render() {
    const { content, num, className, style } = this.props;
    return (
      <View
        className={className + " " + (num == 1 ? " onActive1" : "onActive2")}
        style={{ ...style, "-webkit-line-clamp": num > 2 ? num : 2 }}
      >
        {content}
      </View>
    );
  }
}
