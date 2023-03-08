import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.scss";
import LinearGradient from "react-native-linear-gradient";

export default class Index extends Component {
  state = {};
  render() {
    const { title, style } = this.props;
    return (
      <View
        className="SubmitBtn"
        style={style}
        onClick={() => {
          this.props.handleSubmit();
        }}
      >
        <View className="SubmitBtn-titles">{title || "提交"}</View>
      </View>
    );
  }
}
