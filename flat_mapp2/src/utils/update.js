let Platform = null;
let codePush = null;
if (process.env.TARO_ENV === "rn") {
  let RN = require("react-native");
  Platform = RN.Platform;
  codePush = require("react-native-code-push");
}
const update = {
  updateInfo: '正在检测更新',
  showLog: true,
  // 检查更新
  check: function (showLog = true) {
    // 忽略开发模式
    if (global.__DEV__) {
      return true
    }
    this.showLog = showLog
    console.log('codePush check', this.updateInfo)
    // this.showLog && $utils.toast.text(this.updateInfo)
    const codepushKey =
      Platform.OS === 'ios'
        ? global.codepush_key_ios
        : global.codepush_key_android
    codePush
      .checkForUpdate(codepushKey)
      .then((updateInfo) => {
        console.log('codePush check', updateInfo)
        if (!updateInfo) {
          this.updateInfo = '当前是最新配置'
          // this.showLog && $utils.toast.text(this.updateInfo)
        } else {
          codePush
            .sync(
              {
                deploymentKey: codepushKey,
                installMode: codePush.InstallMode.IMMEDIATE,
              },
              this.codePushStatusDidChange.bind(this),
              this.codePushDownloadDidProgress.bind(this),
            )
            .catch((e) => {
              console.log('codePush check e', e)
            })
        }
      })
      .catch((err) => {
        console.log('codePush check error', err)
      })
    codePush.notifyAppReady()
  },

  // 处理状态
  codePushStatusDidChange: function (status) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.updateInfo = '正在检查新配置'
        break
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        break
      case codePush.SyncStatus.INSTALLING_UPDATE:
        break
      case codePush.SyncStatus.UP_TO_DATE:
        this.updateInfo = '正在安装新配置'
        break
      case codePush.SyncStatus.UPDATE_INSTALLED:
        this.updateInfo = '将重新打开应用'
        break
    }
    console.log('codePush codePushStatusDidChange', status, this.updateInfo)
    // this.showLog && $utils.toast.text(this.updateInfo)
  },

  // 下载进度
  codePushDownloadDidProgress: function (progress) {
    this.updateInfo = `正在更新配置${(
      (progress.receivedBytes / progress.totalBytes) *
      100
    ).toFixed(2)}%`
    this.showLog && $utils.toast.text(this.updateInfo)
  },
}

export default update
