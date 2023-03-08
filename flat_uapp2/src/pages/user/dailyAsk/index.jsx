import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Picker,
  Textarea,
  ScrollView,
  Image
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import askTitle from "@assets/image/askTitle.png";
import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listName: []
    };
  }
  componentDidMount() {
    this.load();
  }

  async componentWillUnmount() {}
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    global.$utils.api
      .load("issueList", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let v = res.rows || [];
          this.setState({
            listName: v
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  render() {
    let { listName } = this.state;

    return (
      <View className='dailyAsk'>
        <ScrollView className='scrollDom' scrollY lowerThreshold={90}>
          <View className='dailyAsk-br' />
          {listName.map((item, index) => (
            <View
              className='dailyAsk-title_box'
              key={index}
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/richText/index?id=${item.id}&title=${item.issue}&type=dailyAsk`
                });
              }}
            >
              <Image
                className='dailyAsk-title_icon'
                mode='aspectFill'
                src={askTitle}
              />
              <View className='dailyAsk-title'>{item.issue}</View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default Index;
