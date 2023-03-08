import React, { Component } from "react";

import "./index.scss";
import { Stepper } from "@antmjs/vantui";
export default class Index extends Component {
  state = {
    value: 1
  };
  componentDidMount() {}
  componentDidShow() {}
  onChange = event => {
    console.log(event);
    this.setState(
      {
        value: event.detail
      },
      () => {
        this.props.onChangeStepper(event.detail);
      }
    );
  };
  render() {
    const { value } = this.state;
    let { maxNum, disabled, defaultValue } = this.props;
    return (
      <Stepper
        value={defaultValue}
        longPress={false}
        onChange={this.onChange}
        max={maxNum}
        min={defaultValue == 0 ? 0 : 1}
      />
    );
  }
}
