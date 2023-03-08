// 配置
const appconfig = {
  // 配置初始化
  init: function () {
  },
  // 清空
  clear: function () {
    // global.$utils.data.clear('appconfig')
  },
  // 获取
  get: function (key) {
    return global.$utils.data.get(key)
  },
  // 设置
  set: function (key, val) {
    return global.$utils.data.set(key, val)
  }
}

export default appconfig
