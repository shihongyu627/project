import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { getWindowHeight } from "@utils/style";
import { TextLabel, RichText, SubmitBtn } from "@component";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      html: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let title = params.title;
    this.setState(
      {
        id,
        title
      },
      () => {
        this.load();
      }
    );
  }

  async componentWillUnmount() {}
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.id = this.state.id;
    let url = `${global.base_host}/customer/flat/type/${this.state.id}`;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          console.log(res);
          let detail = res.data || {};
          if (detail.label) {
            detail.tagArr = detail.label.split(",");
          }
          this.setState({
            detail,
            html: detail.richText
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
  handleSubmit = () => {
    let { detail } = this.state;
    Taro.redirectTo({
      url: `/pages/home/clean/create/index?title=${detail.name}&id=${detail.id}&price=${detail.price}&payType=${detail.payType}`
    });
  };
  render() {
    let { detail } = this.state;
    return (
      <View className='cleanInfo'>
        <ScrollView
          className='scrollDom'
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className='cleanInfo-header'>
            <View className='cleanInfo-header-top'>
              <Image
                className='cleanInfo-header-top-img'
                src={global.$utils.loadimg.load(detail.themeUrl)}
                mode='aspectFill'
              />
            </View>
            <View className='cleanInfo-header-right'>
              <View className='cleanInfo-header-right-title'>
                <TextLabel
                  className='cleanInfo-header-right-title-text'
                  num={3}
                  content={detail.name}
                ></TextLabel>
              </View>
              <View className='cleanInfo-header-right-tag'>
                {detail.tagArr &&
                  detail.tagArr.map((item, index) => (
                    <View
                      key={index}
                      className={
                        index == 0
                          ? "cleanInfo-header-right-tag-items"
                          : "cleanInfo-header-right-tag-item"
                      }
                    >
                      {item}
                    </View>
                  ))}
              </View>
              <View className='cleanInfo-header-right-bottom'>
                <View className='cleanInfo-header-right-bottom-price'>
                  <Text className='cleanInfo-header-right-bottom-price-size'>
                    ￥
                  </Text>
                  {detail.price}
                </View>
              </View>
            </View>
          </View>
          <View className='cleanInfo-serviceBox'>
            <View className='cleanInfo-serviceBox-title'>服务内容</View>
            <View className='cleanInfo-serviceBox-text'>
              清洗方式：{detail.cleaning}
            </View>
            <View className='cleanInfo-serviceBox-text'>
              服务项目：{detail.services}
            </View>
          </View>
          <View className='cleanInfo-html'>
            <View className='cleanInfo-html-title'>服务项目</View>
            <RichText html={this.state.html}></RichText>
          </View>
          <View className='cleanInfo-bottomBr'></View>
        </ScrollView>
        <SubmitBtn
          title='立即预约'
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
