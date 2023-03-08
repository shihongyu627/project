import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import {
  View,
  Text,
  Image,
  Swiper,
  SwiperItem,
  Picker
} from "@tarojs/components";

import "./index.scss";
import { BoxEmpty, ItemGradeList, FooterLine } from "@component";
import Accordion from "react-native-collapsible/Accordion";
import downPng from "@assets/image/gradeDown.png";
import topPng from "@assets/image/gradeUp.png";
import gradeOnePng from "@assets/image/gradeOne.png";
import gradeTwoPng from "@assets/image/gradeTwo.png";
import gradeThreePng from "@assets/image/gradeThree.png";
import gradeFourPng from "@assets/image/gradeFour.png";
import dayjs from "dayjs";
class Phonebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
      dataTotal: 0,
      activeSections: [0],
      sectionsList: [],
      batch_id: ""
    };
  }

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let batch_id = params.batch_id;
    this.setState(
      {
        batch_id
      },
      () => {
        this.loadData();
      }
    );
  }
  componentWillUnmount() {}
  loadData = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let result = {};
    let dd = {};
    dd.batch_id = this.state.batch_id;
    try {
      result = await $utils.api.load("batchscoredetail", dd, "get", false);
      if (result.data) {
        let v = result.data;
        let sectionsList = v.score_list || [];
        this.setState({
          sectionsList
        });
      }
    } catch (error) {
      Taro.hideLoading();
    }

    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    Taro.showLoading({
      title: "loading"
    });
    this.loadData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  goInfo = () => {};
  _renderHeader = (section, index) => {
    let { activeSections } = this.state;
    let isActive = activeSections.indexOf(index);
    return (
      <View className="gradeInfo-titleRn_box">
        <View className="gradeInfo-titleRn_box-titleBpx">
          <View className="gradeInfo-titleRn_box-title">检查项目：</View>
          <View className="gradeInfo-titleRn_box-stitle">{section.category_name}</View>
        </View>
        <Image
          className="gradeInfo-titleRn_box-image"
          src={isActive == -1 ? downPng : topPng}
          mode="aspectFill"
        />
      </View>
    );
  };
  _updateSections = activeSections => {
    this.setState({ activeSections });
  };
  _renderContent = section => {
    return (
      <View className="gradeInfo-itembox">
        {(section?.list || []).map((item, index) => {
          return (
            <View
              className={
                "gradeInfo-itemWp " + (index == 0 ? "gradeInfo-itemWps" : "")
              }
              key={index}
            >
              <View className={"gradeInfo-item "} style={{ marginTop: 0 }}>
                <View className="gradeInfo-item-title">检查内容：</View>
                <View className="gradeInfo-item-name">{item.grade_title}</View>
              </View>
              <View className={"gradeInfo-item "}>
                <View className="gradeInfo-item-title">分值：</View>
                <View className="gradeInfo-item-name">{item.grade_score}</View>
              </View>
              <View className={"gradeInfo-item "}>
                <View className="gradeInfo-item-title">扣分：</View>
                <View
                  className="gradeInfo-item-name"
                  style={{ color: "#00CF34" }}
                >
                  {item.score}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  render() {
    let { menuList, bannerList, list, sectionsList } = this.state;
    return (
      <View className="gradeInfo">
        <Accordion
          sections={sectionsList}
          activeSections={this.state.activeSections}
          // renderSectionTitle={this._renderSectionTitle}
          renderHeader={this._renderHeader}
          onChange={this._updateSections}
          renderContent={this._renderContent}
          underlayColor="#f7f7f7"
          sectionContainerStyle={{ marginTop: 10, overflow: "hidden" }}
          containerStyle={{ overflow: "hidden" }}
        />
        {sectionsList && sectionsList.length != 0 ? (
          <FooterLine title="没有更多数据了~"></FooterLine>
        ) : (
          <BoxEmpty title="暂无内容"></BoxEmpty>
        )}
      </View>
    );
  }
}
export default Phonebook;
