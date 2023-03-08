import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image, WebView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/image/empty_box1.png";
import telPng from "@assets/image/tel.png";
import rightPng from "@assets/image/right.png";
import { TextLabel, SubmitBtn } from "@component";
import { Platform } from "react-native";
import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      height: 667,
      url: "",
      type: "",
      batch_id: "",
      project_id: "",
      date: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let batch_id = params.batch_id || "";
    let project_id = params.project_id || "";
    let date = params.date || "";
    let type = params.type || "";
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState(
      {
        batch_id,
        height: windowHeight,
        type,
        project_id,
        date
      },
      () => {
        this.onClickDownload(batch_id, type);
      }
    );
  }

  async componentWillUnmount() {}
  //告知单下载
  onClickDownload = async (batch_id, type) => {
    Taro.showLoading({
      title: "loading..."
    });
    let d = {};
    let result = {};
    let url = "";
    if (type == "1") {
      url = "batchreplydown";
      d.batch_id = batch_id;
    } else if (type == 3) {
      url = "troubleScoredown";
      d.project_id = this.state.project_id;
      d.date = this.state.date;
    } else {
      url = "troubleBatchdown";
      d.batch_id = batch_id;
    }

    try {
      result = await $utils.api.load(url, d, "get", {
        loading: false,
        login: true
      });
      if (result.code == 1) {
        Taro.hideLoading();
        let gallery = result.data || [];
        let obj = {};
        let url = "";
        if (gallery.length > 0) {
          obj = gallery[0];
          url = obj.preview_url;
        } else {
          $utils.toast.text("暂无预览文件");
        }
        this.setState({
          url
        });
      } else {
        $utils.toast.text(result.message);
        Taro.hideLoading();
      }
    } catch (error) {
      Taro.hideLoading();
    }
  };
  onMessage = async sttr => {
    if (sttr.type == "showLoading") {
      Taro.showLoading({
        title: sttr?.title || "加载中..."
      });
    }
    if (sttr.type == "hideLoading") {
      Taro.hideLoading();
    }
    if (sttr.type == "showToast") {
      if (!sttr.title) {
        return;
      }
      Taro.showToast({
        title: sttr?.title,
        icon: sttr?.icon,
        duration: sttr?.duration,
        position: sttr?.position
      });
    }
    if (sttr.type == "saveImage") {
      let xx2 = await $utils.permissionRn.photo();
      if (!xx2) {
        return false;
      }
      $utils.file.saveBase64Photo(sttr.data || "");
    }
  };
  //下拉刷新
  render() {
    let { url, height } = this.state;
    return (
      <WebView
        style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}
        src={url}
        onMessage={e => {
          let sttr = JSON.parse(e.detail.data) || {};
          this.onMessage(sttr);
        }}
      />
    );
  }
}

export default Index;
