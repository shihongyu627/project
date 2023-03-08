import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Button, Image } from "@tarojs/components";
import "./index.scss";
import currencyPng from "@assets/image/currency.png";
import projectEditPng from "@assets/image/projectEdit.png";
import projectRatePng from "@assets/image/projectRate.png";
import projectRecordPng from "@assets/image/projectRecord.png";
import projectRightPng from "@assets/image/projectRight.png";
import Accordion from "react-native-collapsible/Accordion";
import {
  BoxEmpty,
  ItemRecordInfo,
  FooterLine,
  TextLabel,
  ItemBatchInfo,
  ItemLogList
} from "@component";
import downPng from "@assets/image/down.png";
import topPng from "@assets/image/top.png";
import store from "../../../store";
import { connect } from "react-redux";
export default class Index extends Component {
  state = {
    height: 667,
    list: [],
    activeSections: [0],
    batchSections: [0],
    batch_id: "",
    submitVal: true,
    userInfo: {},
    user_type: "",
    detail: {},
    logList: [],
    batch_reply_list: []
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let batch_id = params.batch_id;
    let userInfo = store.getState().user || {};
    this.setState(
      {
        batch_id,
        user_type: userInfo.user_type || ""
      },
      () => {
        this.load();
        this.troubleBatchlog();
      }
    );
    Taro.eventCenter.on("refreshRecordInfo", val => {
      if (val) {
        this.setState(
          {
            pageIndex: 1,
            logList: []
          },
          () => {
            this.load();
            this.troubleBatchlog();
          }
        );
      }
    });
  }

  componentWillUnmount() {
    Taro.eventCenter.off("refreshRecordInfo");
  }
  troubleBatchlog = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let result = {};
    d.batch_id = this.state.batch_id;
    d.page = this.state.pageIndex;
    d.psize = 100;
    try {
      result = await $utils.api.load("troubleBatchlog", d, "get", {
        loading: false,
        login: true
      });
      if (result.data) {
        let v = result.data.list || [];
        console.log(v);
        this.setState({
          logList:
            this.state.pageIndex === 1 ? v : this.state.logList.concat(v),
          dataTotal: result?.data?.page?.total || 0
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
    this.load();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  load = () => {
    let { batch_id } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.batch_id = batch_id;
    global.$utils.api
      .load("batchdetail", d, "get", false)
      .then(res => {
        if (res.data) {
          let data = res.data;
          let list = data.trouble_list || [];
          let batch_reply_list = data.batch_reply_list || [];
          console.log(list, 999);
          this.setState({
            list,
            detail: data,
            batch_reply_list
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
  setMenu = state => {
    this.setState({
      state
    });
  };
  //审核通过
  troubleReplypass = data => {
    let { submitVal } = this.state;
    let d = {};
    let url = "troubleReplypass";
    d.pass_status = 1;
    d.reply_id = data;
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    $utils.api
      .load(url, d, "post", { loading: false, login: true })
      .then(result => {
        $utils.toast.text(result.message);
        if (result.code == 1) {
          setTimeout(() => {
            Taro.eventCenter.trigger("refreshRecordList", true);
            this.load();
          }, 500);
        } else {
          this.setState({
            submitVal: true
          });
        }
      })
      .catch(err => {
        $utils.toast.text("操作异常");
        console.log(err);
        this.setState({
          submitVal: true
        });
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  //隐患
  _renderHeader = (section, index) => {
    let { activeSections } = this.state;
    let isActive = activeSections.indexOf(index);
    return (
      <View className="recordInfo-titleRn_box">
        <View className="recordInfo-titleRn_box-left">
          <View className="recordInfo-titleRn-stitle">隐患{index + 1}</View>
          <TextLabel
            content={section.title}
            className="recordInfo-titleRn"
            num={1}
          />
        </View>
        <View className="recordInfo-right">
          <Image
            className="recordInfo-right-image"
            src={isActive == -1 ? downPng : topPng}
            mode="aspectFill"
          />
        </View>
      </View>
    );
  };
  _updateSections = activeSections => {
    this.setState({ activeSections });
  };
  _renderContent = section => {
    let { detail } = this.state;
    //针对工地端以及巡检段，user_type为2是巡检 1是工地
    return (
      <ItemRecordInfo
        info={section}
        user_type={this.state.user_type}
        troubleReplypass={this.troubleReplypass}
        detail={detail}
      />
    );
  };

  //整改
  _batchrenderHeader = (section, index) => {
    let { batchSections } = this.state;
    let isActive = batchSections.indexOf(index);
    return (
      <View
        className="recordInfo-titleRn_box"
        style={{ backgroundColor: "#fff" }}
      >
        <View
          className="recordInfo-titleRn-stitle"
          style={{ color: isActive == -1 ? "#333" : "#0a75e8" }}
        >
          第{index + 1}次整改
        </View>
        <View className="recordInfo-right">
          <View
            className="recordInfo-stitleRn"
            style={{
              color:
                section.pass_status == 2
                  ? "#FC5943"
                  : section.pass_status == 1
                  ? "#0A75E8"
                  : "#F2902B"
            }}
          >
            {section.pass_status_name}
          </View>
          <Image
            className="recordInfo-right-image"
            src={isActive == -1 ? downPng : topPng}
            mode="aspectFill"
          />
        </View>
      </View>
    );
  };
  _batchupdateSections = batchSections => {
    this.setState({ batchSections });
  };
  _batchrenderContent = section => {
    let { detail } = this.state;
    //针对工地端以及巡检段，user_type为2是巡检 1是工地
    return (
      <ItemBatchInfo
        info={section}
        user_type={this.state.user_type}
        detail={detail}
      />
    );
  };
  render() {
    let {
      menuList,
      state,
      list,
      detail,
      user_type,
      batch_reply_list,
      logList
    } = this.state;
    return (
      <View className="recordInfo">
        <Accordion
          sections={list}
          activeSections={this.state.activeSections}
          // renderSectionTitle={this._renderSectionTitle}
          renderHeader={this._renderHeader}
          onChange={this._updateSections}
          renderContent={this._renderContent}
          underlayColor="#dcebfb"
          sectionContainerStyle={{ marginTop: 10, overflow: "hidden" }}
          containerStyle={{ overflow: "hidden" }}
        />
        <Accordion
          sections={batch_reply_list}
          activeSections={this.state.batchSections}
          // renderSectionTitle={this._renderSectionTitle}
          renderHeader={this._batchrenderHeader}
          onChange={this._batchupdateSections}
          renderContent={this._batchrenderContent}
          underlayColor="#dcebfb"
          sectionContainerStyle={{ marginTop: 10, overflow: "hidden" }}
          containerStyle={{ overflow: "hidden" }}
        />
        {/* <View className="recordInfo-itemBox">
          <View className="recordInfo-item">
            <View className="recordInfo-item-title">是否停工：</View>
            <View className="recordInfo-item-content">
              {detail.is_stop_work == 1 ? "是" : "否"}
            </View>
          </View>
          <View className="recordInfo-item">
            <View className="recordInfo-item-title">整改天数：</View>
            <View className="recordInfo-item-content">
              {detail.handle_day}天
            </View>
          </View>
          <View className="recordInfo-title">签名1</View>
          <View className="recordInfo-signBox">
            <Image
              className="recordInfo-signBox-signNamePng"
              src={detail.sign_img}
              mode="aspectFill"
            />
          </View>
          <View className="recordInfo-title">签名2</View>
          <View className="recordInfo-signBox">
            <Image
              className="recordInfo-signBox-signNamePng"
              src={detail.sign_img2}
              mode="aspectFill"
            />
          </View>
        </View> */}
        <View
          className="recordInfo-titleRn_box"
          style={{ backgroundColor: "#fff", marginBottom: 1, marginTop: 10 }}
        >
          <View
            className="recordInfo-titleRn-stitle"
            style={{ color: "#0a75e8" }}
          >
            项目流程
          </View>
          <View className="recordInfo-right">
            <Image
              className="recordInfo-right-image"
              src={downPng}
              mode="aspectFill"
            />
          </View>
        </View>
        <View className="recordInfo-logBox">
          {logList.map((item, index) => {
            return (
              <ItemLogList
                info={item}
                list={logList}
                index={index}
                key={index}
              />
            );
          })}
        </View>

        {/* 施工单位签字-1已签字，0未签字  team1_sign_status
            建设单位签字-1已签字，0未签字  team4_sign_status
            监理单位签字-1已签字，0未签字  team5_sign_status */}

        {(user_type == 4 && detail.team4_sign_status == "0") ||
        (user_type == 5 && detail.team5_sign_status == "0") ||
        (user_type == 1 && detail.team1_sign_status == "0") ? (
          <View
            className="recordInfo-btn"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/sign/index?batch_id=${detail.batch_id}`
              });
            }}
          >
            签字
          </View>
        ) : null}
        {/* 街道签字整改完成后，整个流程走完 街道单位签字-1已签字，0未签字  team3_sign_status */}
        {user_type == 3 &&
        detail.handle_status == 10 &&
        detail.team3_sign_status == "0" ? (
          <View
            className="recordInfo-btn"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/sign/index?batch_id=${detail.batch_id}`
              });
            }}
          >
            签字
          </View>
        ) : null}

        {/* 施工整改，并签字 */}
        {user_type == 1 &&
        detail.handle_status == 0 &&
        detail.sign_status == 1 ? (
          <View
            className="recordInfo-btn"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/sign/index?batch_id=${detail.batch_id}&sign_status=${detail.team1_sign_status}`
              });
            }}
          >
            整改签名
          </View>
        ) : null}
        {/* 监理查看并签字审核 */}
        {(user_type == 5 &&
          detail.handle_status == 5 &&
          detail.team5_reply_pass_status != 1) ||
        (user_type == 4 &&
          detail.handle_status == 5 &&
          detail.team5_reply_pass_status == "1" &&
          detail.team4_reply_pass_status != 1) ||
        (user_type == 2 &&
          detail.handle_status == 5 &&
          detail.team5_reply_pass_status == "1" &&
          detail.team4_reply_pass_status == "1") ? (
          <View>
            <View
              className="recordInfo-btnOne"
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/record/create/index?type=replypass&batch_id=${detail.batch_id}&title=整改未通过&user_type=${user_type}`
                });
              }}
            >
              审核未通过
            </View>
            <View
              className="recordInfo-btnTwo"
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/sign/index?batch_id=${detail.batch_id}&type=check&user_type=${user_type}`
                });
              }}
            >
              审核通过
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
// const mapStoreToProps = store => ({
//   userInfo: store.user
// });
// const mapDispatchToProps = dispatch => ({
//   // dispatch: dispatch
// });
// export default connect(mapStoreToProps, mapDispatchToProps)(Index);
