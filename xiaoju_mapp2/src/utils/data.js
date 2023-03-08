import Taro from '@tarojs/taro'
// 数据存储
const data = {
  // 获取
  get: (key) => {
    let val = Taro.getStorageSync(key)
    // console.log('data get ', key, val)
    return val
  },
  // 设置
  set: (key, val) => {
    // console.log('data set ', key, val)
    return Taro.setStorageSync(key, val)
  },
  // 移除
  remove: (key) => {
    if (!key) {
      return
    }
    return Taro.removeStorageSync(key)
  },
  // 清除所有
  clearAll: function () {
    return Taro.clearStorageSync()
  }
}

export default data
