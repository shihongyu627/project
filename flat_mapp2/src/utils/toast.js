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
  isLoginModal: function(
    str = "温馨提示",
    text = "您尚未登录，请点击确认，去登录"
  ) {
    // $utils.data.clearAll();
    global.isLogin = false;
    Taro.showModal({
      title: str,
      content: text
    }).then(res => {
      if (res.confirm) {
        if (process.env.TARO_ENV === "rn") {
          $utils.auth.logout();
        }
        return Taro.navigateTo({
          url: "/pages/auth/index"
        });
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    });
    return;
  },
  islogoutModal: function(str = "温馨提示", text = "是否退出登录") {
    Taro.showModal({
      title: str,
      content: text
    }).then(res => {
      if (res.confirm) {
        let d = {};
        global.$utils.api
          .load("logoutAuth", d, "get", false)
          .then(res => {
            $utils.toast.text(res.msg);
            if (res.code == 200) {
              // $utils.data.clearAll();
              $utils.data.remove("MaintainerToken");
              $utils.data.remove("userInfo");
              $utils.data.remove("isLogin");
              $utils.data.remove("userType");
              $utils.data.remove("flatId");
              $utils.data.remove("flatName");
              global.isLogin = false;
              if (process.env.TARO_ENV === "rn") {
                $utils.auth.logout();
              }
              setTimeout(() => {
                return Taro.navigateTo({
                  url: "/pages/auth/index"
                });
              }, 500);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    });
    return;
  }
};

export default toast;
