import Taro from '@tarojs/taro'
import toast from './toast'

// 加载
const loading = {
  isLoading: false,
  // 显示
  show: function (text = '加载中') {
    toast.hide()
    Taro.showLoading({
      title: text,
    }).then(res => console.log(res))
    this.isLoading = true
    return true
  },
  // 隐藏
  hide: function () {
    if(this.isLoading){
      Taro.hideLoading()
    }
    this.isLoading = false
    return false
  }

}

export default loading
