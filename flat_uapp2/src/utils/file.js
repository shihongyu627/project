import Taro from "@tarojs/taro";
// file  文件处理
const file = {
  savePhoto: async function(url, name = "") {
    if (url && url.indexOf("http") < 0) {
      url = global.img_host + "/" + url;
    }
    if (process.env.TARO_ENV === "rn") {
      Taro.showLoading({
        title: "loading"
      });
      let RNFS = require("react-native-fs");
      let CameraRoll = require("@react-native-community/cameraroll");
      const storeLocation = `${RNFS.DocumentDirectoryPath}`;
      const pathName = new Date().getTime() + ".png";
      const downloadDest = `${storeLocation}/${pathName}`;
      RNFS.downloadFile({ fromUrl: url, toFile: downloadDest }).promise.then(
        res => {
          if (res && res.statusCode === 200) {
            const promise = CameraRoll.saveToCameraRoll(
              "file://" + downloadDest
            );
            promise
              .then(result => {
                console.log("图片已保存至相册");
                setTimeout(() => {
                  Taro.hideLoading();
                  global.$utils.toast.success("图片已保存至相册");
                }, 500);
              })
              .catch(error => {
                console.log("保存失败", error);
                Taro.hideLoading();
                global.$utils.toast.fail("保存失败");
              });
          }
        }
      );
      // setTimeout(() => {
      //   Taro.hideLoading();
      // }, 500);
    } else {
      Taro.getSetting({
        complete() {}
      })
        .then(res => {
          if (res.authSetting["scope.writePhotosAlbum"]) {
            Taro.getImageInfo({
              src: url,
              success(result) {
                if (result.path) {
                  Taro.saveImageToPhotosAlbum({
                    filePath: result.path
                  }).then(getImageInfoResult => {
                    if (
                      getImageInfoResult.errMsg === "saveImageToPhotosAlbum:ok"
                    ) {
                      global.$utils.toast.success("图片已保存至相册");
                    } else {
                      global.$utils.toast.fail("保存失败");
                    }
                  });
                }
              }
            });
          } else {
            Taro.authorize({
              scope: "scope.writePhotosAlbum"
            }).then(() => {
              Taro.getImageInfo({
                src: url,
                success(result) {
                  if (result.path) {
                    Taro.saveImageToPhotosAlbum({
                      filePath: result.path
                    }).then(getImageInfoResult => {
                      if (
                        getImageInfoResult.errMsg ===
                        "saveImageToPhotosAlbum:ok"
                      ) {
                        global.$utils.toast.success("图片已保存至相册");
                      } else {
                        global.$utils.toast.fail("保存失败");
                      }
                    });
                  }
                }
              });
            });
          }
        })
        .catch(() => {});
    }
  }
};

export default file;
