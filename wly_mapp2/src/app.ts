import { Component } from "react";
import "taro-ui/dist/style/index.scss"; // 全局引入一次即可
import "@/styles/index.scss";
import { getWxConfig, checkLogin } from "@/api/common";
import { Cache, CacheKey } from "@/utils";
import { wxConfig } from "@/utils/wx";
import config from "./config";
global.$config = config;
import "./app.scss";
import VConsole from "vconsole";
class App extends Component {
  async componentDidMount() {
    // const vConsole = new VConsole();
    const getConfig = async () => {
      const resp = await getWxConfig(window.location.href.split("#")[0]);
      resp && Cache.set(CacheKey.JSSDK_CONFIG, resp);
      resp && wxConfig(resp);
    };
    const checkRequest = async () => {
      // 获取url的phone
      let phone = this.getQueryString("phone") || "";
      console.log('phone', phone)
      const resp: any = await checkLogin(phone);
      if (resp && resp.token) {
        Cache.set(CacheKey.TOKEN, resp.token);
        Cache.set(CacheKey.USER_INFO, resp);
      }
    };
    checkRequest();
    getConfig();
  }

  getQueryString(name) {
    const params = decodeURIComponent(window.location.href).split('?')[1];
    let back: any = null;
    params?.split('&')?.forEach(item => {
      const [key, value] = item.split('=');
      key === name && (back = value);
    });
    return back;
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
