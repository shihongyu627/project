import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.scss";
import { Button } from "teaset";

export default class Index extends Component {
  state = {};
  render() {
    const { title, style, border, titleStyle } = this.props;
    return (
      <View
        style={style}
        className='buttomTitle'
        onClick={() => {
          this.props.handleSubmit();
        }}
      >
        {title}
      </View>
    );
  }
}
