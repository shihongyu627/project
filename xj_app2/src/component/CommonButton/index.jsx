import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  state = {};
  render() {
    const { title, className, style } = this.props;
    return (
      <View
        className={className}
        style={style}
        onClick={() => {
          this.props.handleSubmit();
        }}
      >
        {title || "提交"}
      </View>
    );
  }
}
