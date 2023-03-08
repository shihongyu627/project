import React, { Component } from "react";

import "./index.scss";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import map_address from "@assets/image/mapAddress.png";

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
  }

  componentDidMount() {}
  render() {
    let { longitude, latitude } = this.props;
    let html = this.props.html || ``;
    let style = this.props.style;
    return (
      <WebView
        style={Object.assign(
          {
            height: "100%",
            width: "100%"
          },
          style
        )}
        source={{
          uri1: "https://amap.com",
          uri1: "https://a.amap.com/jsapi/static/demo/jsapi2.html",
          html: `<!DOCTYPE html>
              <html lang="en" style="height: 100%;padding:0;margin:0;">
                <head>
                  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                  <meta
                    content="width=device-width,initial-scale=1,user-scalable=yes"
                    name="viewport"
                  />
                  <meta name="apple-mobile-web-app-capable" content="yes" />
                  <meta name="apple-touch-fullscreen" content="yes" />
                  <meta name="format-detection" content="telephone=no,address=no" />
                  <meta name="apple-mobile-web-app-status-bar-style" content="white" />
                  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                  <title>地图</title>
                </head>
                <body style="display: flex;width: 100%;height: 100%;padding:0;margin:0;">
                  <div id="container" style="flex:1;width:100%; height: 100%"></div>
                  <script src="https://webapi.amap.com/maps?v=2.0&key=d5524699de865123669c2e9995106327"></script>
                  <script type="text/javascript">
                    // 地图初始化应该在地图容器div已经添加到DOM树之后
                    // 创建一个 Marker 实例：
                    var map = new AMap.Map('container', {
                      zoom:14,//级别
                      center: [${longitude}, ${latitude}],//中心点坐标
                    });
                    //添加点标记，并使用自己的icon
                    var marker= new AMap.Marker({
                        position:  [${longitude}, ${latitude}],//位置
                        offset: new AMap.Pixel(-15, -35),
                        icon: new AMap.Icon({
                          image:'https://flatoss.oss-cn-shanghai.aliyuncs.com/test/20220226/1645848205223_mapAddress.png',
                          imageSize: new AMap.Size(30, 32)//图标大小
                      })
                    });
                    map.add(marker)
                    map.plugin(["AMap.ToolBar"],function(){
                        //加载工具条
                        var tool = new AMap.ToolBar();
                        map.addControl(tool);
                    });
                  </script>
                </body>
              </html>
              `
        }}
        androidHardwareAccelerationDisabled
        androidLayerType="hardware"
        scalesPageToFit={false}
        // onMessage={this.onWebViewMessage}
        //  injectedJavaScript={this.injectedJS()}
        originWhitelist={["*"]}
        nestedScrollEnabled={true}
        //   injectedJavaScript={`
        //    document.documentElement.style.padding = 0;
        //    document.documentElement.style.margin = 0;
        //    document.body.style.padding = 0;
        //    document.body.style.margin = 0;
        //    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
        //    true;
        //  `}
      />
    );
  }
}
