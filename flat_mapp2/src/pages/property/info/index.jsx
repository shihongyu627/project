import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { SubmitBtn, IndexList, Rate } from "@component";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/image/repair_icon.png";
import repair_Awaiticon from "@assets/image/repair_Awaiticon.png";
import repair_pressicon from "@assets/image/repair_pressicon.png";
import ceshiPng from "@assets/image/empty_box1.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      stepsList: [],
      height: 667,
      type: "",
      imageArr: [],
      initState: 3,
      maintainUrlArr: []
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let type = params.type;
    console.log(id, type, "传过来的值");
    const { windowHeight } = Taro.getSystemInfoSync();
    Taro.eventCenter.on("refreshPropertyRecord", val => {
      this.load();
    });
    this.setState(
      {
        id,
        type,
        height: windowHeight
      },
      () => {
        this.load();
      }
    );
  }

  componentWillUnmount() {
    Taro.eventCenter.off("refreshPropertyRecord");
  }
  //下拉刷新
  onPullDownRefresh = () => {};
  load = () => {
    let { type, id } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let url = "";
    //保洁预约 1  报修预约 2  公共设施预约 3  拜访预约 4
    if (type == 1) {
      url = `${global.base_host}/maintainer/flat/clean/${id}`;
    }
    //报修预约
    if (type == 2) {
      url = `${global.base_host}/maintainer/flat/repairs/${id}`;
    }
    //公共设施预约
    if (type == 3) {
      url = `${global.base_host}/maintainer/flat/publicMake/${id}`;
    }
    //拜访预约
    if (type == 4) {
      url = `${global.base_host}/maintainer/flat/visitor/${id}`;
    }
    d.id = id;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let detail = res.data || {};
          let imageArr = [];
          let maintainUrlArr = [];
          //报修前的图片
          if (detail.imgUrl) {
            imageArr = detail.imgUrl.split(",");
          }
          //维修后的图片
          if (detail.maintainUrl) {
            maintainUrlArr = detail.maintainUrl.split(",");
          }
          //保洁后的图片
          if (detail.finishUrl) {
            maintainUrlArr = detail.finishUrl.split(",");
          }
          let initState = 3; //其他状态 1待处理  2已完成
          if ((type == 1 || type == 2) && detail.state == 0) {
            initState = 1;
          }
          if ((type == 1 || type == 2) && detail.state == 5) {
            initState = 2;
          }
          if ((type == 3 || type == 4) && detail.state == 0) {
            initState = 1;
          }
          if ((type == 3 || type == 4) && detail.state == 3) {
            initState = 2;
          }
          let stepsList = [];
          let logArr = detail.log || [];
          logArr.map(item => {
            stepsList.unshift(item);
          });
          this.setState({
            detail,
            imageArr,
            maintainUrlArr,
            initState,
            stepsList
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  //拍照上传
  handleSubmit = () => {
    let { detail, type } = this.state;
    Taro.navigateTo({
      url: `/pages/property/create/index?id=${detail.id}&type=${type}`
    });
  };

  render() {
    let {
      detail,
      stepsList,
      height,
      type,
      imageArr,
      initState,
      maintainUrlArr
    } = this.state;
    return (
      <View className="propertyInfo">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{
            height:
              detail.state == 3
                ? height - 90
                : process.env.TARO_ENV === "rn"
                ? height - 90
                : height - 50
          }}
        >
          <View className="propertyInfo-br"></View>
          <View
            className={
              "propertyInfo-header " +
              (initState == 1
                ? "propertyInfo-headers"
                : initState == 3
                ? "propertyInfo-headeres"
                : "propertyInfo-header")
            }
          >
            <Image
              className="propertyInfo-header-img"
              src={
                initState == 1
                  ? repair_Awaiticon
                  : initState == 2
                  ? ThreePng
                  : repair_pressicon
              }
            ></Image>
            <View className="propertyInfo-header-name">{detail.stateName}</View>
          </View>
          {/* //保洁预约 1  报修预约 2  公共设施预约 3  拜访预约 4 */}
          <View className="propertyInfo-lableName">
            {type == 1
              ? "保洁详情"
              : type == 2
              ? "报修详情"
              : type == 3
              ? "公共设施详情"
              : "拜访详情"}
          </View>
          <View className="propertyInfo-content">
            {type == 1 ? (
              <View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    保洁类型
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.cleanName}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    房间号
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.roomName ||
                      (detail.flatRoomResponse && detail.flatRoomResponse.name)}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    预约时间
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.makeTime}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    保洁描述
                  </View>
                </View>
                <View className="propertyInfo-content-txt">{detail.descr}</View>
              </View>
            ) : null}
            {type == 2 ? (
              <View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    报修类型
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.repairsName}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    房间号
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.roomName ||
                      (detail.flatRoomResponse && detail.flatRoomResponse.name)}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    预约时间
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.makeTime}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    报修描述
                  </View>
                </View>
                <View className="propertyInfo-content-txt">{detail.descr}</View>
                {imageArr && imageArr.length > 0 ? (
                  <View>
                    <View className="propertyInfo-content-item">
                      <View className="propertyInfo-content-item-title">
                        报修照片
                      </View>
                    </View>
                    <View className="propertyInfo-content-boximg">
                      {imageArr.map((item, index) => (
                        <Image
                          className="propertyInfo-content-boximg-itemImg"
                          src={global.$utils.loadimg.load(item)}
                          key={index}
                          onClick={() => {
                            Taro.previewImage({
                              current: item, // 当前显示图片的http链接
                              urls: imageArr // 需要预览的图片http链接列表
                            });
                          }}
                        ></Image>
                      ))}
                    </View>
                  </View>
                ) : null}
              </View>
            ) : null}
            {type == 3 ? (
              <View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    预约类型
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.publicName}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">姓名</View>
                  <View className="propertyInfo-content-item-text">
                    {detail.name}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">电话</View>
                  <View className="propertyInfo-content-item-text">
                    {detail.phone}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    房间号
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.roomName ||
                      (detail.flatRoomResponse && detail.flatRoomResponse.name)}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    预约时间
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.makeTime}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    预约描述
                  </View>
                </View>
                <View className="propertyInfo-content-txt">{detail.descr}</View>
              </View>
            ) : null}
            {type == 4 ? (
              <View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    房间号
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.roomName ||
                      (detail.flatRoomResponse && detail.flatRoomResponse.name)}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    代预约人
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.cusName}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    拜访人员
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.visitorName}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    身份证号
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.visitorCard}
                  </View>
                </View>
                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    预约时间
                  </View>
                  <View className="propertyInfo-content-item-text">
                    {detail.visitorTime}
                  </View>
                </View>

                <View className="propertyInfo-content-item">
                  <View className="propertyInfo-content-item-title">
                    预约描述
                  </View>
                </View>
                <View className="propertyInfo-content-txt">{detail.descr}</View>
              </View>
            ) : null}
          </View>
          {(type == 1 || type == 2) && stepsList.length > 0 ? (
            <View>
              <View className="propertyInfo-lableName">
                {type == 1 ? "保洁情况" : "维修情况"}
              </View>
              <View className="propertyInfo-stepsBox">
                {stepsList.map((item, index) => (
                  <View className="propertyInfo-stepsBox-item" key={index}>
                    <View className="propertyInfo-stepsBox-item-top">
                      <View
                        className={
                          index == 0
                            ? "propertyInfo-stepsBox-item-top-raido"
                            : "propertyInfo-stepsBox-item-top-raidos"
                        }
                      ></View>
                      <View
                        className={
                          "propertyInfo-stepsBox-item-top-statusName " +
                          (index == 0
                            ? "propertyInfo-stepsBox-item-top-statusNames"
                            : "")
                        }
                      >
                        {item.refuse}
                      </View>
                    </View>
                    <View className="propertyInfo-stepsBox-item-bottom">
                      <View
                        className={
                          "propertyInfo-stepsBox-item-bottom-contentStart " +
                          (index + 1 == stepsList.length
                            ? "propertyInfo-stepsBox-item-bottom-contents"
                            : index == 0
                            ? "propertyInfo-stepsBox-item-bottom-content"
                            : "propertyInfo-stepsBox-item-bottom-contentes")
                        }
                      >
                        <View className="propertyInfo-stepsBox-item-bottom-contentStart-title">
                          操作人：{item.operateName}
                          {/* ({item.phone}） */}
                        </View>
                        {index + 1 == stepsList.length && detail.staffIdName ? (
                          <View className="propertyInfo-stepsBox-item-bottom-contentStart-title">
                            处理人：{detail.staffIdName}
                            {/* ({item.phone}） */}
                          </View>
                        ) : null}
                        <View className="propertyInfo-stepsBox-item-bottom-contentStart-title">
                          操作时间：{item.createTime}
                        </View>
                        {(stepsList.length == 3 && index == 0) ||
                        (stepsList.length == 4 && index == 1) ? (
                          <View className="propertyInfo-stepsBox-item-bottom-contentStart-imgBox">
                            {maintainUrlArr &&
                              maintainUrlArr.map((menu, indexs) => (
                                <Image
                                  className="propertyInfo-stepsBox-item-bottom-contentStart-imgBox-img"
                                  src={global.$utils.loadimg.load(menu)}
                                  key={indexs}
                                  onClick={() => {
                                    Taro.previewImage({
                                      current: menu, // 当前显示图片的http链接
                                      urls: maintainUrlArr // 需要预览的图片http链接列表
                                    });
                                  }}
                                ></Image>
                              ))}
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          {detail.estimate ? (
            <View>
              <View className="propertyInfo-lableName">客户评价</View>
              <View className="propertyInfo-start">
                {detail.estimate.manner ? (
                  <View className="propertyInfo-start-item">
                    <View className="propertyInfo-start-item-title">
                      服务态度
                    </View>
                    <Rate readValue={detail.estimate.manner} readonly />
                  </View>
                ) : null}
                {detail.estimate.timeliness ? (
                  <View className="propertyInfo-start-item">
                    <View className="propertyInfo-start-item-title">
                      {type == 1 ? "及时性" : "响应速度"}
                    </View>
                    <Rate readValue={detail.estimate.timeliness} readonly />
                  </View>
                ) : null}
                {detail.estimate.tidiness ? (
                  <View className="propertyInfo-start-item">
                    <View className="propertyInfo-start-item-title">
                      {type == 1 ? "整洁度" : "维修质量"}
                    </View>
                    <Rate readValue={detail.estimate.tidiness} readonly />
                  </View>
                ) : null}
                {detail.estimate.descr ? (
                  <View>
                    <View className="propertyInfo-content-item">
                      <View className="propertyInfo-content-item-title">
                        评价内容
                      </View>
                    </View>
                    <View className="propertyInfo-content-txt">
                      {detail.estimate.descr}
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
        </ScrollView>
        {detail.state == 3 && (type == 2 || type == 1) ? (
          <SubmitBtn
            title="拍照上传"
            handleSubmit={this.handleSubmit}
          ></SubmitBtn>
        ) : null}
      </View>
    );
  }
}

export default Index;
