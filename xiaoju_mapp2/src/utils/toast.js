import Taro from '@tarojs/taro'
import loading from './loading'
// 提示
const toast = {
  isToast: false,
  // 初始化 判断位置
  init: function () {
  },
  // 文字
  text: function (str, position = 'bottom', long = false) {
    loading.hide()
    Taro.showToast({
      title: str,
      icon: 'none',
      position: position,
      duration: long?2000:1500
    }).then(res => console.log(res))
    this.isToast = true
    return
  },
  // 成功
  success: function (str = '操作成功', position = 'bottom', long = false) {
    loading.hide()
    Taro.showToast({
      title: str,
      icon: 'success',
      position: position,
      duration: long?2000:1500
    }).then(res => console.log(res))
    this.isToast = true
    return
  },
  // 警告
  warn: function (str = '操作异常', position = 'bottom', long = false) {
    loading.hide()
    Taro.showToast({
      title: str,
      icon: 'none',
      position: position,
      image:  require('../assets/img/warn.png'),
      duration: long?2000:1500
    }).then(res => console.log(res))
    this.isToast = true
    return
  },
  // 错误
  error: function (str = '操作错误', position = 'bottom', long = false) {
    loading.hide()
    Taro.showToast({
      title: str,
      icon: 'none',
      position: position,
      image:  require('../assets/img/fail.png'),
      duration: long?2000:1500
    }).then(res => console.log(res))
    this.isToast = true
    return
  },
  // 取消
  cancel: function (str = '取消操作', position = 'bottom', long = false) {
    loading.hide()
    Taro.showToast({
      title: str,
      icon: 'none',
      position: position,
      duration: long?2000:1500
    }).then(res => console.log(res))
    this.isToast = true
    return
  },
  // 隐藏
  hide: function () {
    if(this.isToast){
      Taro.hideToast()
    }
    this.isToast = false
  }
}

export default toast
