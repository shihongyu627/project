import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import { Clipboard } from "react-native";
// file  文件处理
const file = {
  savePhoto: async function(url, name = "") {
    if (url && url.indexOf("http") < 0) {
      url = global.img_host + "/" + url;
    }
    if (process.env.TARO_ENV === "rn") {
      Taro.showLoading({
        title: "保存中..."
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
                  $utils.toast.success("图片已保存至相册");
                }, 500);
              })
              .catch(error => {
                console.log("保存失败", error);
                Taro.hideLoading();
                $utils.toast.error("保存失败");
              });
          } else {
            Taro.hideLoading();
            $utils.toast.error("保存失败");
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
                      global.$utils.toast.error("保存失败");
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
                        global.$utils.toast.error("保存失败");
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
  },
  saveBase64Photo: async function(base64Img, name = "", copyText, index) {
    Taro.showLoading({
      title: "下载中..."
    });
    let RNFS = require("react-native-fs");
    const dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; // 外部文件，共享目录的绝对路径（仅限android）
    const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.png`;
    const imageDatas = base64Img.split('data:image/png;base64,');
    const imageData = imageDatas[1];
    let CameraRoll = require("@react-native-community/cameraroll");
    RNFetchBlob.fs.writeFile(downloadDest, imageData, 'base64').then((rst) => {
      try {
        CameraRoll.saveToCameraRoll(downloadDest).then((e1) => {
          console.log('suc',e1)
          setTimeout(() => {
            Taro.hideLoading();
            $utils.toast.success("已保存至相册");
          }, 500);
        }).catch((e2) => {
          console.log('fai',e2)
          Taro.hideLoading();
          $utils.toast.error("保存失败");
        })
      } catch (e3) {
        console.log('catch',e3)
        Taro.hideLoading();
        $utils.toast.error("保存失败");
        // fail && fail()
      }
    });
    // RNFetchBlob.config({
    //   // response data will be saved to this path if it has access right.
    //   path: dirs.DownloadDir + "/" + name
    // })
    //   .fetch("GET", url, {
    //     //some headers ..
    //   })
    //   .then(res => {
    //     // the path should be dirs.DocumentDir + 'path-to-file.anything'
    //     console.log("The file saved to ", res.path());
    //     console.log("下载成功");
    //     setTimeout(() => {
    //       Taro.hideLoading();
    //       $utils.toast.success("下载成功");
    //       setTimeout(() => {
    //         Clipboard.setString(copyText || "");
    //         if (index == 0) {
    //           $utils.toast.textModal("文件地址已复制，请粘贴内容进行下载查看");
    //         }
    //       }, 1000);
    //     }, 500);
    //   })
    //   .catch(error => {
    //     console.log("下载失败", error);
    //     Taro.hideLoading();
    //     $utils.toast.error("下载失败");
    //   });
  }
};

export default file;
