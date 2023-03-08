import { Cache, CacheKey } from "@/utils/cache";

interface OpenMapParams {
  latitude: number;
  longitude: number;
  name?: string; // 位置名
  address?: string; // 地址详情说明
  scale?: number; // 地图缩放级别,整型值,范围从1~28。默认为最大
}
interface ShareParams {
  title: string; // 分享标题
  desc: string; // 分享描述
  link: string; // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  imgUrl: string; // 分享图标
}

export const wxConfig = (config) => {
  // @ts-ignore
  wx.config({
    debug: config.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
    appId: config.appId, // 必填，公众号的唯一标识
    timestamp: config.timestamp, // 必填，生成签名的时间戳
    nonceStr: config.nonceStr, // 必填，生成签名的随机串
    signature: config.signature,// 必填，签名，见附录1
    jsApiList: config.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });
}

export const openMap = (params: OpenMapParams) => {
  // @ts-ignore
  wx.ready((e) => {
    console.log('readyreadyreadyreadyreadyready', e)
    // @ts-ignore
    wx.openLocation(params);
  })
}

export const getPosition = () => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    wx.ready((e) => {
      console.log('readyreadyreadyreadyreadyready', e)
      // @ts-ignore
      wx.getLocation({
        type: 'gcj02',
        success: (resp) => {
          console.log('1234')

          resolve(resp)
        },
        fail: (resp) => {
          reject(resp);
        }
      })
    })
  })
}

export const shareToPerson = (params: ShareParams) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    wx.ready((e) => {
      console.log('readyreadyreadyreadyreadyready', e)
      // @ts-ignore
      wx.updateAppMessageShareData({
        ...params,
        success: () => {
          // 设置成功
          resolve(true)
        },
        fail: () => {
          reject(false)
        }
      })
    })
  })
}
export const scanQRCode = (params: ShareParams) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    wx.scanQRCode({
      needResult: 1,
      scanType: ["qrCode", "barCode"],
      success: (res) => {
        let code = res.resultStr || '';
        resolve(code)
      },
      fail: () => {
        reject(false)
      }
    });
  })
}
export const getUserInfo = (appid, redirect_uri) => {
  // @ts-ignore
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=snsapi_base&state=back#wechat_redirect`
}

export const getMyPosition = async (isRefresh?: boolean, callback?: (l: string) => void) => {
  const value = Cache.get(CacheKey.LNG_LAT);
  if (value && !isRefresh && callback) {
    callback(value);
    return;
  }
  if (!value || isRefresh) {
    const resp: any = await getPosition();
    if (resp) {
      const { longitude, latitude } = resp;
      Cache.set(CacheKey.LNG_LAT, `${longitude},${latitude}`)
      callback && callback(`${longitude},${latitude}`)
    }
  }
}
