import React, { Component } from "react";

import "./index.scss";
import { Stepper } from "teaset";

export default class Index extends Component {
  state = {
    value: 1
  };
  componentDidMount() {}
  componentDidShow() {}
  render() {
    let { value } = this.state;
    let { maxNum, defaultValue, info } = this.props;
    return (
      <Stepper
        max={info.max_score == 0 ? 100 : info.max_score}
        min={1}
        value={info.score}
        onChange={value => {
          this.props.onChangeStepper(value, info);
        }}
      />
    );
  }
}
