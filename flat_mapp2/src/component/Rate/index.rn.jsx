import React, { Component } from "react";

import "./index.scss";
import { Rate } from "beeshell";

export default class Index extends Component {
  state = {
    value: 1
  };
  componentDidMount() {}
  componentDidShow() {}
  render() {
    let { value } = this.state;
    let { readValue } = this.props;
    return (
      <Rate
        total={5}
        value={readValue ? readValue : value}
        iconSize={30}
        enableHalf={false}
        onChange={value => {
          if (this.props.readonly) {
            return;
          }
          this.setState(
            {
              value
            },
            () => {
              this.props.onChangeRate(value, this.props.info);
            }
          );
        }}
      />
    );
  }
}
