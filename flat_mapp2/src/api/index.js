import Taro from "@tarojs/taro";
import * as login from "./modules/login";
import * as conSetfig from "./modules/config";
import * as flat from "./modules/flat";

// api 集合
const types = {};
Object.assign(types, login, conSetfig, flat);

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
  if (type == "urlencoded") {
    contentType = "application/x-www-form-urlencoded";
  }
  // console.log("api url :", url, " url-typename", urlOrTypename);
  if (url !== "undefined" && url !== null && url !== "") {
    // 附加数据
    let token = global.$utils.data.get("MaintainerToken") || "";
    if (!token) {
      token = global.token || "";
    }
    if (!isToken) {
      token = "";
    }
    // data.token = token;
    // console.log(data, "5555555");
    // request配置  tokenType  Bearer
    let con = {
      method: method.toUpperCase(),
      url: url,
      // dataType: "json",
      // responseType: "json",
      header: {
        "content-type": contentType,
        "Maintainer-Authorization": "Bearer " + token
      },
      timeout: 8000
    };
    // 拼装数据
    if (method === "get") {
      con.data = data;
    } else if (method === "post") {
      con.data = data;
    } else if (method === "put") {
      con.data = data;
    }
    console.log("api data :", data);
    // 异步处理
    return new Promise((resolve, reject) => {
      // loading
      if (config.loading === true) {
        global.$utils.loading.show(config.loadingtext);
      }
      console.log(con, 333);
      Taro.request(con)
        .then(res => {
          console.log(res);
          let result = res.data;
          if (!result) {
            result = {};
          }
          if (result.code === "200" || result.code === 200) {
            // xx
            result.status = 1;
          } else if (result.code == 401 || result.code == "401") {
            //-10009 token错误
            // -10010 token过期
            // -10011 token不存在
            // result.status = 0;
            $utils.data.remove("MaintainerToken");
            $utils.data.remove("userInfo");
            $utils.data.remove("isLogin");
            $utils.data.remove("userType");
            $utils.data.remove("flatId");
            $utils.data.remove("flatName");
            global.isLogin = false;
            if (config.login) {
              $utils.toast.isLoginModal();
              return;
            }
            // $utils.data.clearAll();
            // global.isLogin = false;
            // return Taro.navigateTo({
            //   url: "/pages/auth/index"
            // });
            // 登录
          } else {
            result.status = 0;
            // 提示
            if (config.toast === true) {
              global.$utils.toast.error(result.msg);
            }
          }
          setTimeout(() => {
            global.$utils.loading.hide();
          }, 200);
          resolve(result);
        })
        .catch(error => {
          console.log(error, "xxxxx  error");
          setTimeout(() => {
            global.$utils.loading.hide();
          }, 1000);
          if (config.loading === true) {
            setTimeout(() => {
              global.$utils.loading.hide();
            }, 1000);
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
