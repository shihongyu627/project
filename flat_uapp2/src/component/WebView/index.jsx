import React, { Component } from "react";

import { WebView } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  state = {};
  componentDidMount() {}
  componentDidShow() {}

  render() {
    const { url, style } = this.props;
    return <WebView src={url} />;
  }
}
