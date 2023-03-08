import Taro from '@tarojs/taro'

// 网络环境
const network = {
  networkType: {},
  init: function () {
    Taro.getNetworkType().then((res) => {
      this.networkType = res.networkType
    })
  },
  // 类型
  type: function () {
    let networkState = this.networkType
    let state = 'unknown'
    switch (networkState) {
      case 'unknown':
        state = 'UNKNOWN'
        break
      case 'wifi':
        state = 'WIFI'
        break
      case '2g':
        state = '2G'
        break
      case '3g':
        state = '3G'
        break
      case '4g':
        state = '4G'
        break
      case 'none':
        state = 'NONE'
        break
    }
    state = state.toLocaleLowerCase()
    console.log('network type: ', state)
    return state
  },
  // 状态
  state: function () {
    let networkState = this.networkType
    let states = {}
    states['unknown'] = 'Unknown connection'
    states['wifi'] = 'WiFi connection'
    states['2g'] = 'Cell 2G connection'
    states['3g'] = 'Cell 3G connection'
    states['4g'] = 'Cell 4G connection'
    states['none'] = 'No network connection'
    return states[networkState]
  }
}
network.init()
export default network
