import React, { Component } from "react";

import { Picker } from "@tarojs/components";
import "./index.scss";
import { Dimensions, View, Platform, Text } from "react-native";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { WebView } from "react-native-webview";
// import DeviceInfo from "react-native-device-info";
// import { Theme } from "teaset";
import dayjs from "dayjs";

let { height, width } = Dimensions.get("window");

export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    html: "",
    nodes: "",
    url: "",
    minHeight: 0,
    style: {},
    injectedJS: ""
  };
  constructor(props) {
    super(props);
    let hh = props.minHeight ? props.minHeight : height;
    this.state = {
      height: hh
    };
  }

  state = {
    name: "",
    url: "",
    webViewHeight: 0, //显示日期
    id: ""
  };
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let url = params.url;
    url=encodeURIComponent(url)
    console.log(url);
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState(
      {
        id,
        url
      },
      () => {
        if (id) {
          this.onLoad();
        }
      }
    );
  }

  async componentWillUnmount() {}
  onLoad = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.docTemplateId = this.state.id;
    let url = `${global.base_host}/maintainer/flat/sign/${this.state.id}`;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.data) {
          Taro.hideLoading();
          let dd = res.data || {};
          dd = encodeURIComponent(dd);
          this.setState({
            url: dd
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };
  injectedJS = () => {
    // ！！！结尾不能缺少true;
    let script = `
      const meta = document.createElement('meta');
      meta.setAttribute('content', 'initial-scale=1, maximum-scale=1, user-scalable=0');
      meta.setAttribute('name', 'viewport');
      document.getElementsByTagName('head')[0].appendChild(meta);
      console.log('html injectJS scrollHeight:',document.body.scrollHeight);
      setInterval(() => {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(document.body.scrollHeight)
      }, 100);
      true;
    `;
    if (this.props.injectedJS) {
      script = script + this.props.injectedJS;
      console.log("load injectJs.");
    }
    script = script + "true;";
    return script;
  };
  onWebViewMessage = event => {
    console.log(event);
    this.setState({
      webViewHeight: Number(event.nativeEvent.data)
    });
  };

  render() {
    let html = this.props.html || "";
    let style = this.props.style;
    let { url } = this.state;
    return (
      <View
        style={Object.assign(
          {
            height: "100%",
            width: "100%"
          },
          style
        )}
      >
        <WebView
          source={{
            uri: `https://app.hnxiangyu.net/work/viewpdf.html?file=${url}`
          }}
          scalesPageToFit={false}
          onMessage={this.onWebViewMessage}
          //  injectedJavaScript={this.injectedJS()}
          originWhitelist={["*"]}
          injectedJavaScript={`
           document.documentElement.style.padding = 0;
           document.documentElement.style.margin = 0;
           document.body.style.padding = 0;
           document.body.style.margin = 0;
           window.ReactNativeWebView.postMessage(document.body.scrollHeight);
           true;
         `}
        />
      </View>
    );
  }
}
