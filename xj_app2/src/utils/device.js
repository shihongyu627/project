import Taro from '@tarojs/taro'
// 设备信息
const device = {
  uuid: null,
  info: {},
  // 初始化
  init: function () {
    // 获取设备信息
    this.getInfo()
    console.log('utils device ', this.info)
  },
  getInfo: function () {
    let dev = Taro.getSystemInfoSync()
    let i = {}
    i.uniqueid = ''
    i.manufacturer = ''
    i.brand = dev.brand
    i.model = dev.model
    i.deviceid = ''
    i.systemname = dev.platform
    i.systemversion = dev.system
    i.version = '1.0'
    i.appname = ''
    this.info = i
    this.uuid = i.uniqueid
    return this.info
  }
}

// 获取设备信息
device.init()
export default device
