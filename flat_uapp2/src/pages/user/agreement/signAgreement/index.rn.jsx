import React, { Component } from "react";

import { Picker } from "@tarojs/components";
import "./index.scss";
import { Dimensions, View, Platform, Text,Linking } from "react-native";
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
    webViewHeight: 0 //显示日期
  };
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let url = params.url;
    const { windowHeight } = Taro.getSystemInfoSync();
    this.setState({
      url
    });
  }

  async componentWillUnmount() {}
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
    console.log(event,98888);
    this.setState({
      webViewHeight: Number(event.nativeEvent.data)
    });
  };
  onShouldStartLoadWithRequest=(request)=>{
    // short circuit these
    if (!request.url ||
      request.url.startsWith('http') ||
      request.url.startsWith("/") ||
      request.url.startsWith("#") ||
      request.url.startsWith("javascript") ||
      request.url.startsWith("about:blank")
    ) {
      return true;
    }

    // blocked blobs
    if(request.url.startsWith("blob")){
      Alert.alert("Link cannot be opened.");
      return false;
    }

    // list of schemas we will allow the webview
    // to open natively
    if(request.url.startsWith("tel:") ||
      request.url.startsWith("mailto:") ||
      request.url.startsWith("maps:") ||
      request.url.startsWith("geo:") ||
      request.url.startsWith("alipays:") ||
      request.url.startsWith("alipayhk:") ||
      request.url.startsWith("uppaywallet:") ||
      request.url.startsWith("sms:")
      ){

      Linking.openURL(request.url).catch(er => {
        Alert.alert("Failed to open Link: " + er.message);
      });
      return false;
    }

    // let everything else to the webview
    return true;
  }
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
            uri: url
          }}
          originWhitelist={['http://*', 'https://*', 'intent://*', 'alipays://*', 'alipayhk://*', 'uppaywallet://']}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
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
