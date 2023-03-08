import React, { Component } from "react";

import "./index.scss";
import Accordion from "react-native-collapsible/Accordion";
import { View, Text, Image } from "@tarojs/components";
import askTitle from "@assets/image/askTitle.png";
export default class Index extends Component {
  state = {
    activeSections: []
  };
  componentDidMount() {}
  componentDidShow() {}
  _renderSectionTitle = section => {
    return (
      <View className="Collapse_contentBox">
        <Text className="Collapse_content">{section.content}</Text>
      </View>
    );
  };

  _renderHeader = section => {
    return (
      <View className="titleRn_box">
        <Image className="titleRn_icon" mode="aspectFill" src={askTitle} />
        <View className="titleRn">{section.title}</View>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    // let { value } = this.state;
    const { listName } = this.props;
    console.log(listName);
    return (
      <Accordion
        sections={listName}
        activeSections={this.state.activeSections}
        // renderSectionTitle={this._renderSectionTitle}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
    );
  }
}
