import Taro from "@tarojs/taro";

let storage = null;
if (process.env.TARO_ENV === "rn") {
  let MMKV = require("react-native-mmkv").MMKV;
  storage = new MMKV();
}

// 数据存储
const data = {
  // 获取
  get: key => {
    let val = null;
    if (process.env.TARO_ENV === "rn") {
      // 获取数据类型
      let type = storage.getString(key + "_typeof");
      switch (type) {
        case "boolean":
          val = storage.getBoolean(key);
          break;
        case "number":
          val = storage.getNumber(key);
          break;
        case "string":
          val = storage.getString(key);
          break;
        case "object":
          val = storage.getString(key);
          if (val) {
            val = JSON.parse(val);
          }
          break;
        default:
          break;
      }
    } else {
      val = Taro.getStorageSync(key);
    }
    console.log("data get ", typeof val, key, val);
    return val;
  },
  // 设置
  set: (key, val) => {
    console.log("data set ", typeof val, key, val);
    if (process.env.TARO_ENV === "rn") {
      switch (typeof val) {
        case "boolean":
          storage.set(key, val);
          break;
        case "number":
          storage.set(key, val);
          break;
        case "string":
          storage.set(key, val);
          break;
        case "object":
          storage.set(key, JSON.stringify(val));
          break;
        default:
          break;
      }
      // 记录数据类型
      storage.set(key + "_typeof", typeof val);
    } else {
      Taro.setStorageSync(key, val);
    }
  },
  // 移除
  remove: key => {
    if (!key) {
      return;
    }
    if (process.env.TARO_ENV === "rn") {
      // storage.remove(key);
      storage.set(key, "");
    } else {
      Taro.removeStorageSync(key);
    }
    return true;
  },
  // 清除所有
  clearAll: function() {
    if (process.env.TARO_ENV === "rn") {
      storage.clearAll();
    } else {
      Taro.clearStorageSync();
    }
  }
};

export default data;
