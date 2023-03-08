import Taro from "@tarojs/taro";
// 提示
const toast = {
  // 初始化 判断位置
  init: function() {},
  // 文字
  text: function(str, position = "bottom", long = false) {
    Taro.showToast({
      title: str,
      icon: "none",
      position: position,
      duration: long ? 2000 : 1500
    }).then(res => console.log(res));
    return;
  },
  // 成功
  success: function(str = "操作成功", position = "bottom", long = false) {
    Taro.showToast({
      title: str,
      icon: "success",
      position: position,
      duration: long ? 2000 : 1500
    }).then(res => console.log(res));
    return;
  },
  // 警告
  warn: function(str = "操作异常", position = "bottom", long = false) {
    Taro.showToast({
      title: str,
      icon: "none",
      position: position,
      duration: long ? 2000 : 1500
    }).then(res => console.log(res));
    return;
  },
  // 错误
  error: function(str = "操作错误", position = "bottom", long = false) {
    Taro.showToast({
      title: str,
      icon: "none",
      position: position,
      duration: long ? 2000 : 1500
    }).then(res => console.log(res));
    return;
  },
  // 取消
  cancel: function(str = "取消操作", position = "bottom", long = false) {
    Taro.showToast({
      title: str,
      icon: "none",
      position: position,
      duration: long ? 2000 : 1500
    }).then(res => console.log(res));
    return;
  },
  // 隐藏
  hide: function() {},
  // 取消
  modal: function(str = "提示", text = "提示内容") {
    Taro.showModal({
      title: str,
      content: text
    }).then(res => {
      if (res.confirm) {
        return true;
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    });
    return;
  },
  loginModal: function(str = "提示", text = "提示内容") {
    Taro.showModal({
      title: "提示",
      content: "您尚未登录，请去登录",
      confirmText: "登录",
      confirmColor: "#0A74E9"
    }).then(res1 => {
      if (res1.confirm) {
        global.$utils.data.remove("token");
        global.$utils.data.remove("userInfo");
        Taro.hideLoading();
        return Taro.reLaunch({
          url: "/pages/auth/index"
        });
      } else if (res1.cancel) {
        console.log("用户点击取消");
      }
    });
    return;
  },
  textModal: function(text = "提示内容") {
    Taro.showModal({
      title: "提示",
      content: text,
      confirmColor: "#0a74e9",
      showCancel: false
    }).then(res1 => {
      if (res1.confirm) {
      } else if (res1.cancel) {
        console.log("用户点击取消");
      }
    });
    return;
  }
};

export default toast;
