import Taro, {} from '@tarojs/taro'
// 扫码
const qrcode = {
  // 扫二维码-设备编号
  scan: async (scanType = 'device_no') => {
    try {
      let res = await Taro.scanCode()
      if (res) {
        let result = res.result
        console.log(res,result, '二维码扫描result');
        let uuid = ''
        switch (res.scanType) {
          case 'CODE_128':
            uuid = result
            break;
          case 'QR_CODE':
            uuid = global.$utils.url.getUrlKey(result, 'm')
            console.log(uuid, '设备二维码编号')
            break;
          default:
            global.$utils.toast.error('无效二维码')
            break
        }
        // 获取m车辆编号
        if (scanType == 'device_no') {
          if (uuid) {
            return uuid;
          } else {
            return '';
          }
        } else {
          return result;
        }
      }
    } catch (error) {
      console.log('scan error', error)
      // global.$utils.toast.error('扫码错误')
      return null
    }
  },
  // 扫码中控二维码
  imei: async (scanType) => {
    try {
      let res = await Taro.scanCode()
      if (res) {
        let result = res.result
        console.log(res,result, '二维码扫描result');
        let uuid = ''
        switch (res.scanType) {
          case 'CODE_128':
            uuid = result
            break;
          case 'QR_CODE':
            uuid = global.$utils.url.getUrlKey(result, 'm')
            console.log(uuid, '设备二维码编号')
            break;
          default:
            global.$utils.toast.error('无效二维码')
            break
        }
        // 获取m车辆编号
        if (scanType) {
          if (uuid) {
            return uuid;
          } else {
            return '';
          }
        } else {
          return result;
        }
      }
    } catch (error) {
      console.log('scan error', error)
      // global.$utils.toast.error('扫码错误')
      return null
    }
  }
}
export default qrcode
