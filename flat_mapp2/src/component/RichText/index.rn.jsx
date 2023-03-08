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
    let html = this.props.html || "";
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
          source={{
            html:
              '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>' +
              html
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
        {/* <WebView
          ref={r => (this.webref = r)}
          source={html ? { html: html } : { uri: this.props.url }}
          style={{
            width: "100%",
            height: this.state.height,
            ...this.props.style
          }}
          injectedJavaScript={this.injectedJS()}
          onMessage={event => {
            let he = parseInt(event.nativeEvent.data);
            if (he == this.state.height) {
              return;
            }
            console.log("onMessage height:", he);
            this.setState({ height: he });
          }}
          allowUniversalAccessFromFileURLs={true}
          automaticallyAdjustContentInsets={false}
          mixedContentMode="always"
          allowFileAccess={true}
          geolocationEnabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          decelerationRate="normal"
          thirdPartyCookiesEnabled={true}
          scalesPageToFit={false}
          useWebKit={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          hideKeyboardAccessoryView={
            Platform.OS === "ios" && DeviceInfo.getSystemVersion() > 12.2
              ? true
              : false
          } // 修复ios11及以下的显示异常
          cacheEnabled={true}
          allowsLinkPreview={false}
          onLoadEnd={({ nativeEvent }) => {
            console.log("onLoadEnd nativeEvent:", nativeEvent);
          }}
          onLoadProgress={({ nativeEvent }) => {
            console.log(
              "onLoadProgress progress:",
              nativeEvent.progress,
              nativeEvent
            );
          }}
          renderError={e => {
            // console.log('renderError')
            // if (e === 'WebKitErrorDomain') {
            //   return
            // }
            return (
              <View
                style={{
                  width: this.props.width,
                  height: this.props.height - Theme.navBarContentHeight,
                  flex: 1,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute"
                }}
              >
                <Text>加载失败，请重试</Text>
              </View>
            );
          }}
          startInLoadingState={true}
          renderLoading={() => {
            console.log("renderLoading");
            return (
              <View
                style={{
                  width: this.props.width || width,
                  height:
                    (this.props.height || height) - Theme.navBarContentHeight,
                  flex: 1,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute"
                }}
              >
                <ActivityIndicator
                  style={{ flex: 1 }}
                  size="large"
                  color="#cbcbcb"
                />
              </View>
            );
            // return <View style={{flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}><Text>加载中···</Text></View>
          }}
        /> */}
      </View>
    );
  }
}
