import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { SubmitBtn, IndexList, Rate } from "@component";
import ThreePng from "@assets/image/repair_icon.png";
import repair_Awaiticon from "@assets/image/repair_Awaiticon.png";
import repair_pressicon from "@assets/image/repair_pressicon.png";
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
    //监听评价后刷新
    Taro.eventCenter.on("refreshViewRecord", val => {
      this.load();
    });
  }

  componentWillUnmount() {
    Taro.eventCenter.off("refreshViewRecord");
  }
  load = () => {
    let { type, id } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let url = "";
    //保洁预约 1  报修预约 2  公共设施预约 3  拜访预约 4
    if (type == 1) {
      url = `${global.base_host}/customer/flat/clean/${id}`;
    }
    //报修预约
    if (type == 2) {
      url = `${global.base_host}/customer/flat/repairs/${id}`;
    }
    //公共设施预约
    if (type == 3) {
      url = `${global.base_host}/customer/flat/publicMake/${id}`;
    }
    //拜访预约
    if (type == 4) {
      url = `${global.base_host}/customer/flat/visitor/${id}`;
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
            initState,
            stepsList,
            maintainUrlArr
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
  //去评价
  handleSubmit = () => {
    let { detail, id, type } = this.state;
    let that = this;
    if (detail.state == 5 && detail.evaluate != 1) {
      Taro.navigateTo({
        url: `/pages/comment/index?id=${id}&type=${type}`
      });
      return;
    }
    Taro.showModal({
      title: "温馨提示",
      content: "是否撤销申请？"
    }).then(res => {
      if (res.confirm) {
        console.log("999");
        that.onConfirm();
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  onConfirm = () => {
    let { type, id } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let url = "";
    //保洁预约
    if (type == 1) {
      url = `CleanAdd`;
    }
    //报修预约
    if (type == 2) {
      url = `RepairsAdd`;
    }
    //公共设施预约
    if (type == 3) {
      url = `publicMakeAdd`;
    }
    //拜访预约
    if (type == 4) {
      url = `visitorAdd`;
    }
    d.id = id;
    d.state = 1;
    d.type = 0;
    global.$utils.api
      .load(url, d, "put", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          Taro.eventCenter.trigger("refreshViewRecord", true);
          this.load();
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
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
      <View className="repairInfo">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{
            height:
              detail.state == 0 || (detail.state == 5 && detail.evaluate != 1)
                ? height - 90
                : process.env.TARO_ENV === "rn"
                ? height - 90
                : height - 10
          }}
        >
          <View className="repairInfo-br"></View>
          <View
            className={
              "repairInfo-header " +
              (initState == 1
                ? "repairInfo-headers"
                : initState == 3
                ? "repairInfo-headeres"
                : "repairInfo-header")
            }
          >
            <Image
              className="repairInfo-header-img"
              src={
                initState == 1
                  ? repair_Awaiticon
                  : initState == 2
                  ? ThreePng
                  : repair_pressicon
              }
            ></Image>
            <View className="repairInfo-header-name">{detail.stateName}</View>
          </View>
          {/* //保洁预约 1  报修预约 2  公共设施预约 3  拜访预约 4 */}
          <View className="repairInfo-lableName">
            {type == 1
              ? "保洁详情"
              : type == 2
              ? "报修详情"
              : type == 3
              ? "公共设施详情"
              : "拜访详情"}
          </View>
          <View className="repairInfo-content">
            {type == 1 ? (
              <View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    保洁类型
                  </View>
                  <View className="repairInfo-content-item-text">
                    {detail.cleanName}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">房间号</View>
                  <View className="repairInfo-content-item-text">
                    {detail.roomName ||
                      (detail.flatRoomResponse && detail.flatRoomResponse.name)}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    预约时间
                  </View>
                  <View className="repairInfo-content-item-text">
                    {detail.makeTime}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    保洁描述
                  </View>
                </View>
                <View className="repairInfo-content-txt">{detail.descr}</View>
              </View>
            ) : null}
            {type == 2 ? (
              <View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    报修类型
                  </View>
                  <View className="repairInfo-content-item-text">
                    {detail.repairsName}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">房间号</View>
                  <View className="repairInfo-content-item-text">
                    {detail.roomName ||
                      (detail.flatRoomResponse && detail.flatRoomResponse.name)}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    预约时间
                  </View>
                  <View className="repairInfo-content-item-text">
                    {detail.makeTime}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    报修描述
                  </View>
                </View>
                <View className="repairInfo-content-txt">{detail.descr}</View>
                {imageArr && imageArr.length > 0 ? (
                  <View>
                    <View className="repairInfo-content-item">
                      <View className="repairInfo-content-item-title">
                        报修照片
                      </View>
                    </View>
                    <View className="repairInfo-content-boximg">
                      {imageArr.map((item, index) => (
                        <Image
                          className="repairInfo-content-boximg-itemImg"
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
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    预约类型
                  </View>
                  <View className="repairInfo-content-item-text">
                    {detail.publicName}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">姓名</View>
                  <View className="repairInfo-content-item-text">
                    {detail.name}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">电话</View>
                  <View className="repairInfo-content-item-text">
                    {detail.phone}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">房间号</View>
                  <View className="repairInfo-content-item-text">
                    {detail.roomName ||
                      (detail.flatRoomResponse && detail.flatRoomResponse.name)}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    预约时间
                  </View>
                  <View className="repairInfo-content-item-text">
                    {detail.makeTime}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    预约描述
                  </View>
                </View>
                <View className="repairInfo-content-txt">{detail.descr}</View>
              </View>
            ) : null}
            {type == 4 ? (
              <View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">房间号</View>
                  <View className="repairInfo-content-item-text">
                    {detail.roomName ||
                      (detail.flatRoomResponse && detail.flatRoomResponse.name)}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    拜访人员
                  </View>
                  <View className="repairInfo-content-item-text">
                    {detail.visitorName}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    身份证号
                  </View>
                  <View className="repairInfo-content-item-text">
                    {detail.visitorCard}
                  </View>
                </View>
                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    预约时间
                  </View>
                  <View className="repairInfo-content-item-text">
                    {detail.visitorTime}
                  </View>
                </View>

                <View className="repairInfo-content-item">
                  <View className="repairInfo-content-item-title">
                    预约描述
                  </View>
                </View>
                <View className="repairInfo-content-txt">{detail.descr}</View>
              </View>
            ) : null}
          </View>
          {(type == 1 || type == 2) && stepsList.length > 0 ? (
            <View>
              <View className="repairInfo-lableName">
                {type == 1 ? "保洁情况" : "维修情况"}
              </View>
              <View className="repairInfo-stepsBox">
                {stepsList.map((item, index) => (
                  <View className="repairInfo-stepsBox-item" key={index}>
                    <View className="repairInfo-stepsBox-item-top">
                      <View
                        className={
                          index == 0
                            ? "repairInfo-stepsBox-item-top-raido"
                            : "repairInfo-stepsBox-item-top-raidos"
                        }
                      ></View>
                      <View
                        className={
                          "repairInfo-stepsBox-item-top-statusName " +
                          (index == 0
                            ? "repairInfo-stepsBox-item-top-statusNames"
                            : "")
                        }
                      >
                        {item.refuse}
                      </View>
                    </View>
                    <View className="repairInfo-stepsBox-item-bottom">
                      <View
                        className={
                          "repairInfo-stepsBox-item-bottom-contentStart " +
                          (index + 1 == stepsList.length
                            ? "repairInfo-stepsBox-item-bottom-contents"
                            : index == 0
                            ? "repairInfo-stepsBox-item-bottom-content"
                            : "repairInfo-stepsBox-item-bottom-contentes")
                        }
                      >
                        <View className="repairInfo-stepsBox-item-bottom-contentStart-title">
                          操作人：{item.operateName}
                          {/* ({item.phone}） */}
                        </View>
                        {index + 1 == stepsList.length && detail.staffIdName ? (
                          <View className="repairInfo-stepsBox-item-bottom-contentStart-title">
                            处理人：{detail.staffIdName}
                            {/* ({item.phone}） */}
                          </View>
                        ) : null}
                        <View className="repairInfo-stepsBox-item-bottom-contentStart-title">
                          操作时间：{item.createTime}
                        </View>
                        {(stepsList.length == 3 && index == 0) ||
                        (stepsList.length == 4 && index == 1) ? (
                          <View className="repairInfo-stepsBox-item-bottom-contentStart-imgBox">
                            {maintainUrlArr &&
                              maintainUrlArr.map((menu, indexs) => (
                                <Image
                                  className="repairInfo-stepsBox-item-bottom-contentStart-imgBox-img"
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
              <View className="repairInfo-lableName">我的评价</View>
              <View className="repairInfo-start">
                {detail.estimate.manner ? (
                  <View className="repairInfo-start-item">
                    <View className="repairInfo-start-item-title">
                      服务态度
                    </View>
                    <Rate readValue={detail.estimate.manner} readonly />
                  </View>
                ) : null}
                {detail.estimate.timeliness ? (
                  <View className="repairInfo-start-item">
                    <View className="repairInfo-start-item-title">
                      {type == 1 ? "及时性" : "响应速度"}
                    </View>
                    <Rate readValue={detail.estimate.timeliness} readonly />
                  </View>
                ) : null}
                {detail.estimate.tidiness ? (
                  <View className="repairInfo-start-item">
                    <View className="repairInfo-start-item-title">
                      {type == 1 ? "整洁度" : "维修质量"}
                    </View>
                    <Rate readValue={detail.estimate.tidiness} readonly />
                  </View>
                ) : null}
                {detail.estimate.descr ? (
                  <View>
                    <View className="repairInfo-content-item">
                      <View className="repairInfo-content-item-title">
                        评价内容
                      </View>
                    </View>
                    <View className="repairInfo-content-txt">
                      {detail.estimate.descr}
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
        </ScrollView>
        {detail.state == 0 || (detail.state == 5 && detail.evaluate != 1) ? (
          <SubmitBtn
            title={detail.state == 0 ? "取消预约" : "去评价"}
            handleSubmit={this.handleSubmit}
          ></SubmitBtn>
        ) : null}
      </View>
    );
  }
}

export default Index;
