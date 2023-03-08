import { Component } from "react";

import { Button, View, Input } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  state = {};
  render() {
    const { title, className, style } = this.props;
    return (
      <Button
        className={className}
        style={style}
        onClick={() => {
          this.props.handleSubmit();
        }}
        titleStyle={style}
      >
        {title || "提交"}
      </Button>
    );
  }
}
