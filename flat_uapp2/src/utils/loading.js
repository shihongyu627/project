import Taro from '@tarojs/taro'

// 加载
const loading = {
  // 显示
  show: function (text = '加载中') {
    Taro.showLoading({
      title: text
    }).then(res => console.log(res))
    return true
  },
  // 隐藏
  hide: function () {
    Taro.hideLoading()
    return false
  }

}

export default loading
