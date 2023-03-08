import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.scss";
import searchPng from "@assets/image/search.png";
import { TextInput } from "react-native";

export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入关键字进行搜索"
  };
  state = {
    value: ""
  };
  changeVal = e => {
    let val = e.detail.value || "";
    // this.props.onInput(val);
    this.setState({
      value: val
    });
  };
  render() {
    const {
      title,
      placeholder,
      style,
      type,
      maxlength,
      value,
      disabled,
      className
    } = this.props;
    return (
      <View className='CommonSearch' style={style}>
        <View className='CommonSearch-search'>
          <View className='CommonSearch-search-left'>
            <Image
              className='CommonSearch-search-left-icon'
              mode='aspectFill'
              src={searchPng}
            />
            <TextInput
              className='CommonSearch-search-left-text'
              clearButtonMode='always'
              keyboardType='default'
              autoCapitalize='none'
              placeholder={placeholder}
              value={value}
              onChangeText={username => {
                this.setState({
                  value: username
                });
              }}
              returnKeyType='search'
              placeholderTextColor='#888'
              onSubmitEditing={() => {
                this.props.searchConfirm(this.state.value);
              }}
            />
            {/* <Input
              className="CommonSearch-search-left-text"
              type="text"
              placeholder={placeholder}
              onInput={this.changeVal.bind(this)}
              // value={value}
              confirmType="search"
              onConfirm={() => {
                this.props.searchConfirm(this.state.value);
              }}
              // focus
            /> */}
          </View>
          <View
            className='CommonSearch-search-btn'
            onClick={() => {
              this.props.searchConfirm(this.state.value);
            }}
          >
            搜索
          </View>
        </View>
      </View>
    );
  }
}
