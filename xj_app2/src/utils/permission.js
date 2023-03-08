import Taro from "@tarojs/taro";
//检测权限
const permission = {
  // 保存图片
  checkUpdate: function() {
    return new Promise((resolve, reject) => {
      Taro.getSetting({
        complete() {}
      })
        .then(res => {
          if (res.authSetting["scope.writePhotosAlbum"]) {
            resolve(true);
          } else {
            Taro.authorize({
              scope: "scope.writePhotosAlbum",
              complete: function() {},
              fail: function() {
                resolve(false);
              },
              success: function() {
                resolve(true);
              }
            });
          }
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
};
export default permission;
