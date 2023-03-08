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
import {
  BoxEmpty,
  ItemGradeList,
  FooterLine,
  MonthPicker,
  YearPicker
} from "@component";
import Accordion from "react-native-collapsible/Accordion";
import downPng from "@assets/image/gradeDown.png";
import topPng from "@assets/image/gradeUp.png";
import gradeOnePng from "@assets/image/gradeOne.png";
import gradeTwoPng from "@assets/image/gradeTwo.png";
import gradeThreePng from "@assets/image/gradeThree.png";
import gradeFourPng from "@assets/image/gradeFour.png";
import { Clipboard } from "react-native";
import dayjs from "dayjs";
class Phonebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
      list: [],
      bannerList: [],
      menuList: [],
      dataTotal: 0,
      activeSections: [],
      sectionsList: [],
      id: "",
      date: ""
    };
  }

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let date = params.date || "";
    Taro.setNavigationBarTitle({
      title: `${date}评分明细`
    });

    this.setState(
      {
        id,
        date
      },
      () => {
        this.loadData();
      }
    );
    Taro.eventCenter.on("refreshMonthDownloadList", val => {
      // this.troubleScoredown();
      Taro.navigateTo({
        url: `/pages/webView/index?project_id=${this.state.id}&date=${this.state.date}&type=3`
      });
    });
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshMonthDownloadList");
  }
  loadData = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let result = {};
    d.project_id = this.state.id;
    d.date = this.state.date;
    d.page = this.state.pageIndex;
    d.psize = 10;
    try {
      result = await $utils.api.load("batchscorelists", d, "get", {
        loading: false,
        login: true
      });
      if (result.data) {
        let v = result.data.list || [];
        let project_info = result.data.project_info || {};
        let sectionsList = [];
        if (result.data.project_info) {
          sectionsList.push(project_info);
        }
        this.setState({
          list: this.state.pageIndex === 1 ? v : this.state.list.concat(v),
          dataTotal: result?.data?.page?.total || 0,
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
    this.onCommon();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  //滑动加载
  onReachBottom = () => {
    let { dataTotal, list } = this.state;
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1
      },
      () => {
        if (dataTotal > list.length) {
          this.loadData();
        }
      }
    );
  };
  onCommon = () => {
    this.setState(
      {
        list: [],
        pageIndex: 1
      },
      () => {
        this.loadData();
      }
    );
  };
  goInfo = data => {
    Taro.navigateTo({
      url: `/pages/project/grade/info/index?batch_id=${data.batch_id}`
    });
  };
  _renderHeader = (section, index) => {
    let { activeSections } = this.state;
    let isActive = activeSections.indexOf(index);
    return (
      <View className="gradeList-titleRn_box">
        <View className="gradeList-titleRn_box-stitle">{section.title}</View>
        <Image
          className="gradeList-titleRn_box-image"
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
      <View className="gradeList-itembox">
        <View className="gradeList-item">
          <Image
            className="gradeList-item-image"
            src={gradeOnePng}
            mode="aspectFill"
          />
          <View className="gradeList-item-title">建设单位：</View>
          <View className="gradeList-item-name">{section.team4_name}</View>
        </View>
        <View className="gradeList-item">
          <Image
            className="gradeList-item-image"
            src={gradeTwoPng}
            mode="aspectFill"
          />
          <View className="gradeList-item-title">监理单位：</View>
          <View className="gradeList-item-name">{section.team2_name}</View>
        </View>
        <View className="gradeList-item">
          <Image
            className="gradeList-item-image"
            src={gradeThreePng}
            mode="aspectFill"
          />
          <View className="gradeList-item-title">施工单位：</View>
          <View className="gradeList-item-name">{section.team1_name}</View>
        </View>
        <View className="gradeList-item">
          <Image
            className="gradeList-item-image"
            src={gradeFourPng}
            mode="aspectFill"
          />
          <View className="gradeList-item-title">工程地址：</View>
          <View className="gradeList-item-name">{section.full_address}</View>
        </View>
      </View>
    );
  };

  render() {
    let { menuList, bannerList, list, sectionsList } = this.state;
    return (
      <View className="gradeList">
        {list.map((item,index) => {
          return (
            <ItemGradeList key={index} goInfo={this.goInfo} info={item}></ItemGradeList>
          );
        })}
        {list && list.length != 0 ? (
          <FooterLine title="没有更多数据了~"></FooterLine>
        ) : (
          <BoxEmpty title="暂无内容"></BoxEmpty>
        )}
      </View>
    );
  }
}
export default Phonebook;
