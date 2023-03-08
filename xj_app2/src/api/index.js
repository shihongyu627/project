import Taro from "@tarojs/taro";
import * as conf from "./modules/config";
import * as home from "./modules/home";
import * as auth from "./modules/auth";
import * as base from "./modules/base";
import * as user from "./modules/user";
import * as push from "./modules/push";
import * as dict from "./modules/dict";
import * as project from "./modules/project";
import * as trouble from "./modules/trouble";
import * as about from "./modules/about";
import * as feedback from "./modules/feedback";
import * as message from "./modules/message";
import * as map from "./modules/map";

// api 集合
const types = {};
Object.assign(
  types,
  conf,
  home,
  base,
  auth,
  user,
  push,
  dict,
  project,
  trouble,
  about,
  feedback,
  message,
  map
);

// 请求数据
function loadData(
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
  },
  type = "json",
  isToken = true
) {
  // 配置
  const baseURL = global.api_host;
  // 匹配api
  let url = "";
  if (urlOrTypename.indexOf("http") >= 0) {
    url = urlOrTypename;
  } else {
    url = baseURL + types[urlOrTypename] + "";
  }
  let contentType = "application/json";
  // console.log("api url :", url, " url-typename", urlOrTypename);
  if (url !== "undefined" && url !== null && url !== "") {
    // data.token = $utils.data.get("token") || "";
    // if (!data.token) {
    //   delete data.token;
    // }
    if (!isToken) {
      token = "";
    }
    let con = {
      method: method.toUpperCase(),
      url: url,
      dataType: "json",
      responseType: "text",
      header: {
        "content-type": "application/json",
        Authorization: $utils.data.get("token") || ""
      },
      timeout: 60000
    };
    // 拼装数据
    if (method === "get") {
      con.data = data;
    } else if (method === "post") {
      con.data = data;
    }
    console.log("api data :", data);
    // 异步处理
    return new Promise((resolve, reject) => {
      // loading
      if (config.loading === true) {
        $utils.loading.show(config.loadingtext);
      }
      console.log(con);
      Taro.request(con)
        .then(res => {
          let result = res.data;
          console.log(result, "请求结果");
          if (!result) {
            result = {};
          }
          if (
            result.code === "000000" ||
            result.code > 0 ||
            result.code === 1 ||
            result.code >= 1 ||
            result.status === 1
          ) {
            // xx
            result.status = 1;
          } else if (result.code == -2000 || result.code == "-2000") {
            // -10010 token过期
            // -10011 token不存在
            // result.status = 0;
            // global.$utils.data.clearAll();
            $utils.data.remove("token");
            global.isLogin = false;
            $utils.loading.hide();
            if (config.login) {
              Taro.reLaunch({
                url: "/pages/auth/index"
              });
              return;
            }
            // global.$utils.data.remove("code");
            // Taro.showModal({
            //   title: "提示",
            //   content: "您尚未登录，请点击确认，去登录",
            //   confirmText: "确认"
            // }).then(res1 => {
            //   if (res1.confirm) {
            //     return Taro.navigateTo({
            //       url: "/pages/auth/index"
            //     });
            //   } else if (res1.cancel) {
            //     console.log("用户点击取消");
            //   }
            // });
            // 登录
          } else {
            result.status = 0;
            // 提示
            if (config.toast === true) {
              global.$utils.toast.error(result.msg);
            }
          }
          if (config.loading === true) {
            $utils.loading.hide();
          }
          resolve(result);
        })
        .catch(error => {
          console.log(error, "xxxxx  error");
          global.$utils.loading.hide();
          global.$utils.toast.error("请求失败" + (error.errMsg || ""));
          if (config.loading === true) {
            global.$utils.loading.hide();
          }
          if (config.toasterror === true) {
            console.log(error, "xxxxxxxx");
            global.$utils.toast.error("请求错误" + ("" || ""));
          }
          // reject(new Error(null))
          reject(null);
        });
    });
  } else {
    global.$utils.loading.hide();
    return new Promise((resolve, reject) => {
      if (config.toasterror === true) {
        global.$utils.toast.warn("Url请求错误");
      }
      // resolve(null)
      reject(null);
    });
  }
}

// taro request请求数据
function requestData(url, data = {}, method = "get") {
  // console.log("taro request url :", url);
  // console.log('api data :', data)
  if (url !== "undefined" && url !== null && url !== "") {
    // request配置
    let con = {
      method: method,
      url: url,
      dataType: "json",
      responseType: "text",
      data: data
    };
    // console.log("taro request data :", data);
    // 异步处理
    return new Promise(function(resolve, reject) {
      Taro.request(con)
        .then(res => {
          global.$utils.loading.hide();
          // console.log('taro request response :', res)
          let result = res.data;
          // console.log('taro request result :', result)
          resolve(result);
        })
        .catch(function(error) {
          console.log("taro request error", error);
          global.$utils.toast.error("请求错误" + (error.msg || ""));
          // reject(new Error(null))
          reject(null);
        });
    });
  } else {
    global.$utils.loading.hide();
    return new Promise(function(resolve, reject) {
      global.$utils.toast.warn("Url请求错误");
      // resolve(null)
      reject(null);
    });
  }
}

const api = {
  load: loadData,
  request: requestData
};
export default api;
