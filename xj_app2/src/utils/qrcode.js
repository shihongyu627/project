import Taro from "@tarojs/taro";

// 扫码
const qrcode = {
  scan: async () => {
    try {
      let res = await Taro.scanCode();
      if (res) {
        let result = res.result;
        console.log(res, result, "二维码扫描result");
        return result
      }
    } catch (error) {
      console.log("scan error", error);
      // global.$utils.toast.error('扫码错误')
      return null;
    }
  },
  config: async (appId, signature, nonceStr, timestamp) => {
    try {
      let res = await Taro.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名
        jsApiList: ["checkJsApi", "scanQRCode", "chooseImage"] // 必填，需要使用的JS接口列表
      });
      if (res) {
        console.log(res, "初始化微信sdk");
      }
    } catch (error) {
      console.log("scan error", error);
      return null;
    }
  }
};
export default qrcode;
