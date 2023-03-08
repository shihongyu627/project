import Taro from "@tarojs/taro";
import * as user from "./modules/user";
import * as weapp from "./modules/weapp";
import * as device from "./modules/device";
import * as order from "./modules/order";
import * as devops from "./modules/devops";
import configStore from "../store";

const store = configStore();
// api 集合
const types = {};
Object.assign(types, user, weapp, device, order, devops);

// 请求数据
async function loadData(
  urlOrTypename = "",
  data = {},
  method = "get",
  config = {
    toast: false,
    toasterror: true,
    toastlogin: false,
    login: false,
    loading: false,
    loadingtext: "加载中"
  }
) {
  const baseURL = global.app_host;
  // 匹配api
  let url = "";
  if (urlOrTypename.indexOf("http") >= 0) {
    url = urlOrTypename;
  } else {
    url = baseURL + types[urlOrTypename] + "";
  }
  console.log("api url :", url, " url-typename", urlOrTypename);
  if (url !== "undefined" && url !== null && url !== "") {
    // 附加数据
    let token = global.token || "";
    if (!token) {
      token = (store.user && store.user.token) || "";
    }
    if (!token) {
      token = Taro.getStorageSync('token') || "";
    }
    // console.log(data, token);
    // 附加小程序版本号
    let accountInfo = Taro.getAccountInfoSync();
    data.miniversion =
      (accountInfo &&
        accountInfo.miniProgram &&
        accountInfo.miniProgram.version) ||
      "1.2";
    // request配置
    let con = {
      method: method.toUpperCase(),
      url: url,
      dataType: "json",
      responseType: "text",
      header: {
        AUTHORIZATION: token || ""
      },
      timeout: 10000,
    };
    // 拼装数据
    if (method === "get") {
      con.data = data;
    } else if (method === "post") {
      con.data = data;
    }
    console.log("api data :", data);
    // 异步处理
    // loading
    if (config.loading === true) {
      global.$utils.loading.show(config.loadingtext);
    }
    try {
      let res = await Taro.request(con);
      if (res) {
        // console.log(res)
        if (config.loading === true) {
          global.$utils.loading.hide();
        }
        let result = res.data;
        if (!result) {
          result = {};
        }
        // console.log('api result :', result)
        // 000000 | 1
        if (
          result.code === "000000" ||
          result.code === 1 ||
          result.code >= 1 ||
          result.status === 1
        ) {
          // xx
          result.status = 1;
        } else if (result.code == -2000 || result.code == "-2000") {
          result.status = 0;
          // 登录
          Taro.reLaunch({
            page: "/pages/auth/login"
          });
          return result
        } else {
          result.status = 0;
          // 提示
          if (config.toast === true) {
            global.$utils.toast.error(result.message);
          }
        }
        if (config.loading === true) {
          global.$utils.loading.hide();
        }
        return result;
      }
    } catch (error) {
      if (config.loading === true) {
        global.$utils.loading.hide();
      }
      if (config.toasterror === true) {
        global.$utils.toast.error("请求错误" + (error.message || ""));
      }
      return null;
    }
  } else {
    global.$utils.loading.hide();
    if (config.toasterror === true) {
      global.$utils.toast.warn("Url请求错误");
    }
    return null;
  }
}

const api = {
  load: loadData
};
export default api;
