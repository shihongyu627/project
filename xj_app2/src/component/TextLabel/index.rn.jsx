import React, { Component } from "react";

import { Text } from "react-native";

export default class Index extends Component {
  state = {};
  render() {
    const { content, num, className, style } = this.props;
    return (
      <Text numberOfLines={num} style={style}>
        {content}
      </Text>
    );
  }
}
