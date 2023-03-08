import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.less";
import searchPng from "@assets/image/search.png";
import newsPng from "@assets/image/news.png";
import clearPng from "@assets/image/clear.png";

import filterPng from "@assets/image/filter.png";
import { Badge } from "teaset";
import { TextInput,Platform } from "react-native";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  state = {
    value: "",
    clearValue: false
  };
  changeVal = e => {
    let val = e.detail.value || "";
    // this.props.onInput(val);
    this.setState({
      value: e.detail.value
    });
  };
  onConfirm = () => {
    this.props.onConfirm(this.state.value);
  };
  render() {
    let { clearValue, value } = this.state;
    return (
      <View
        className="HomeSearch"
        // style={{
        //   ...Platform.select({
        //     // ios: { paddingTop: 12 },
        //     android: {}
        //   })
        // }}
      >
        <View className="HomeSearch-statusBar"></View>
        <View className="HomeSearch-box">
          <View className="HomeSearch-box-title">首页</View>
          <View className="HomeSearch-box-inputBox">
            <Image
              className="HomeSearch-box-inputBox-search"
              src={searchPng}
              mode="aspectFill"
            />
            <Input
              className="HomeSearch-box-inputBox-text"
              placeholder="搜索项目名称"
              onInput={this.changeVal.bind(this)}
              placeholderStyle={{ color: "#999" }}
              onConfirm={this.onConfirm}
              confirmType="search"
              value={value}
            />
            {value ? (
              <Image
                className="HomeSearch-box-inputBox-clearPng"
                src={clearPng}
                mode="aspectFill"
                onClick={() => {
                  this.setState(
                    {
                      value: ""
                    },
                    () => {
                      this.props.onConfirm("");
                    }
                  );
                }}
              />
            ) : null}
          </View>
          <View className="HomeSearch-box-newsPng">
            <View className="HomeSearch-box-newsPng-num">
              {this.props.no_read_count ? (
                <Badge
                  countStyle={{ fontSize: 10 }}
                  style={{
                    backgroundColor: "#ff3a30",
                    paddingLeft: 0,
                    paddingRight: 0,
                    width: 5,
                    height: 15
                  }}
                  count={this.props.no_read_count}
                  maxCount={99}
                />
              ) : null}
            </View>
            <Image
              className="HomeSearch-box-newsPng"
              onClick={() => {
                this.props.goNews();
              }}
              src={newsPng}
              mode="aspectFill"
            />
          </View>
          <Image
            className="HomeSearch-box-filterPng"
            src={filterPng}
            onClick={() => {
              this.props.setFilter();
            }}
            mode="aspectFill"
          />
        </View>
      </View>
    );
  }
}
