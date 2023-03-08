// 存储
const storage = {
  // 存储初始化
  init: function () {
    this.clear()
  },
  // 清空
  clear: function () {
    // global.$utils.data.clear('storage')
  },
  // 获取
  get: function (key) {
    return global.$utils.data.get(key)
  },
  // 设置
  set: function (key, val) {
    return global.$utils.data.set(key, val)
  },
  // 获取/设置
  getset: function (key, val) {
    if (!val) {
      val = global.$utils.data.get(key)
      // 不缓存
      // val = ''
      if (!val) {
        return false
      }
    } else {
      global.$utils.data.set(key, val)
    }
    return val
  }
}
export default storage
