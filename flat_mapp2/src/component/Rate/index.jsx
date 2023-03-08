import React, { Component } from "react";

import "./index.scss";
import { Rate } from "@antmjs/vantui";
export default class Index extends Component {
  state = {
    value: 1
  };
  componentDidMount() {}
  componentDidShow() {}
  onChange = event => {
    console.log(event.detail);
    this.setState(
      {
        value: event.detail
      },
      () => {
        this.props.onChangeRate(event.detail, this.props.info);
      }
    );
  };
  render() {
    const { value } = this.state;
    const { readonly, readValue } = this.props;
    return (
      <Rate
        value={readValue ? readValue : value}
        readonly={readonly}
        size={50}
        color="#FFBA1A"
        voidIcon="star"
        voidColor="#eee"
        onChange={this.onChange}
      />
    );
  }
}
