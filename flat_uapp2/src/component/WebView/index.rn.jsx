import React, { Component } from "react";

import { Picker } from "@tarojs/components";
import "./index.scss";
import { Dimensions, View, Platform, Text } from "react-native";
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
    webViewHeight: 0 //显示日期
  };
  componentDidMount() {}

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
    this.setState({
      webViewHeight: Number(event.nativeEvent.data)
    });
  };

  render() {
    let url = this.props.url || "";
    let style = this.props.style;
    return (
      <View
        style={Object.assign(
          {
            height: this.state.webViewHeight,
            width: "100%"
          },
          style
        )}
      >
        <WebView
          source={{ uri: url }}
          scalesPageToFit={true}
          nestedScrollEnabled={false}
          androidLayerType="hardware"
          onMessage={this.onWebViewMessage}
          //  injectedJavaScript={this.injectedJS()}
          originWhitelist={["*"]}
          mixedContentMode={'always'}
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
