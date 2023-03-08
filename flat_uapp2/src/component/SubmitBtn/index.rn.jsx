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
        className='SubmitBtn'
        style={style}
        onClick={() => {
          this.props.handleSubmit();
        }}
      >
        <LinearGradient
          colors={["#ffe9be", "#efce98"]}
          locations={[0, 1]}
          start={{ x: 0, y: 0.25 }}
          end={{ x: 0.5, y: 1 }}
          className='SubmitBtn-titles'
        >
          <View className='SubmitBtn-titles'>{title || "提交"}</View>
        </LinearGradient>
      </View>
    );
  }
}
