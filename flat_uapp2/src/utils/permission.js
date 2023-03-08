import Taro from "@tarojs/taro";
//检测权限
const permission = {
  // 保存图片
  checkUpdate: function() {
    Taro.getSetting({
      complete() {}
    })
      .then(res => {
        if (res.authSetting["scope.writePhotosAlbum"]) {
          return true;
        } else {
          Taro.authorize({
            scope: "scope.writePhotosAlbum",
            complete: function() {},
            fail: function() {
              return false;
            },
            success: function() {
              return true;
            }
          });
        }
      })
      .catch(() => {
        return false;
      });
  }
};
export default permission;
