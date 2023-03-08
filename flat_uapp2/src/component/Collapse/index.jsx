import React, { Component } from "react";

import "./index.scss";
import { Collapse, CollapseItem } from "@antmjs/vantui";
import askTitle from "@assets/image/askTitle.png";
import { View, Image } from "@tarojs/components";

export default class Index extends Component {
  state = {
    activeNames: []
  };
  componentDidMount() {}
  componentDidShow() {}
  // onChange = event => {
  //   console.log(event.detail);
  //   this.setState(
  //     {
  //       value: event.detail
  //     },
  //     () => {
  //       this.props.onChangeRate(event.detail, this.props.info);
  //     }
  //   );
  // };
  onChange = event => {
    console.log(event);
    this.setState({
      activeNames: event.detail
    });
  };
  onChangeTitle = data => {
    return (
      <View className="title_box">
        <Image className="title_icon" mode="aspectFill" src={askTitle} />
        <View className="title">{data}</View>
      </View>
    );
  };
  render() {
    const { listName } = this.props;
    return (
      <Collapse value={this.state.activeNames} onChange={this.onChange}>
        {listName.map((item, index) => (
          <CollapseItem
            title={this.onChangeTitle(item.title)}
            key={index}
            name={index + 1}
          >
            {item.content}
          </CollapseItem>
        ))}
      </Collapse>
    );
  }
}
