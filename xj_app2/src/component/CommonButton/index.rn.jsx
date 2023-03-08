import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.scss";
import LinearGradient from "react-native-linear-gradient";

export default class Index extends Component {
  state = {};
  render() {
    const { title, style, border } = this.props;
    return (
      <LinearGradient
        colors={["#d7d52f", "#00dc80"]}
        locations={[0, 1]}
        start={{ x: 0, y: 0.25 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          borderRadius: border ? 0 : 100,
          borderTopRightRadius: border ? 100 : 100,
          borderBottomRightRadius: border ? 100 : 100
        }}
      >
        <View
          style={style}
          onClick={() => {
            this.props.handleSubmit();
          }}
        >
          {title || "提交"}
        </View>
      </LinearGradient>
    );
  }
}
