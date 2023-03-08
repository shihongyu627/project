import React, { Component } from "react";

import { RichText } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  state = {};
  componentDidMount() {}
  componentDidShow() {}

  render() {
    const { html ,style} = this.props;
    return <RichText nodes={html} style={style}></RichText>;
  }
}
