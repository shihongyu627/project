import Taro from "@tarojs/taro";

let Linking = null;
let WechatSDK = null;
let AlipaySdk = null;
if (process.env.TARO_ENV === "rn") {
  let RN = require("react-native");
  Linking = RN.Linking;
  WechatSDK = require("react-native-wechat-lib");
  AlipaySdk = require("@kafudev/react-native-alipay").default;
}
// 支付
const pay = {
  // 支付
  pay: function(style, payData) {
    switch (style) {
      case "wechatMapp": // 微信
        return this.wechatMapp(payData);
      case "wechatApp": // 微信app
        return this.wechatApp(payData);
      case "alipay": // 支付宝
        return this.alipay(payData);
    }
  },
  // 支付完成
  complete: function(outTradeNo, t) {
    // 结果
    $utils.url.push("paySuccess", {
      status: "complete",
      out_trade_no: outTradeNo,
      payment: t.payment,
      ...t
    });
    $utils.auth.sync();
    // $utils.toast.text('支付完成')
  },
  // 支付宝支付
  alipay: function(t) {
    AlipaySdk.pay(t)
      .then(e => {
        console.log("alipay pay ", e);
        if (
          e.resultStatus === "9000" ||
          e.resultStatus === "8000" ||
          e.resultStatus === 9000 ||
          e.resultStatus === 8000
        ) {
          // this.complete(v.out_trade_no, v);
          $utils.toast.text("支付完成");
          setTimeout(() => {
            Taro.navigateBack();
          }, 500);
        } else {
          let xx = e.memo || "支付参数错误";
          $utils.toast.error(xx);
        }
      })
      .catch(e => {
        console.log("alipay pay error ", e);
        $utils.toast.error(e.result);
      });
    // e.resultStatus  状态代码  e.result  本次操作返回的结果数据 e.memo 提示信息
    // e.resultStatus  9000  订单支付成功 ;8000 正在处理中  调用function success
    // e.resultStatus  4000  订单支付失败 ;6001  用户中途取消 ;6002 网络连接出错  调用function error
    // 当e.resultStatus为9000时，请去服务端验证支付结果
    /**
     * 同步返回的结果必须放置到服务端进行验证（验证的规则请看https://doc.open.alipay.com/doc2/
     * detail.htm?spm=0.0.0.0.xdvAU6&treeId=59&articleId=103665&
     * docType=1) 建议商户依赖异步通知
     */
  },
  // 微信支付
  wechatMapp: function(payInfo) {
    console.log("wechat data :", payInfo);
    Taro.requestPayment({
      timeStamp: payInfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: payInfo.nonceStr, // 支付签名随机串，不长于 32 位
      package: payInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: payInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: payInfo.paySign, // 支付签名
      success: function(res) {
        // 支付成功后的回调函数
        $utils.toast.text("支付完成");
        setTimeout(() => {
          Taro.navigateBack();
        }, 500);
      },
      fail: function(err) {
        console.log(err);
        $utils.toast.text("支付失败");
      }
    });
  },
  // 微信app支付
  wechatApp: function(payInfo) {
    console.log("wechat data :", payInfo);
    const params = {
      partnerId: payInfo.partnerid, // merchant id
      prepayId: payInfo.prepayid, // prepay id
      nonceStr: payInfo.noncestr, // nonce
      package: payInfo.package, // package
      timeStamp: payInfo.timestamp, // timestamp
      sign: payInfo.sign // signed string
    };
    console.log("params", params);
    // 微信
    WechatSDK.pay(params)
      .then(res => {
        console.log("Wechat pay ", res);
        // 支付成功回调
        if (res.errCode === "0" || res.errCode === 0) {
          // 回调成功处理
          // alert("Success")
          $utils.toast.text("支付完成");
          setTimeout(() => {
            Taro.navigateBack();
          }, 500);
        } else {
          $utils.toast.error(res.errStr);
        }
      })
      .catch(e => {
        console.log("Wechat pay error ", e);
        if (e.message === -2 || e.message === "-2") {
          $utils.toast.error("取消支付");
        } else {
          $utils.toast.error(e.message);
        }
      });
    // 请求签名
    // const v = {};
    // v.payment = "wechat";
    // v.paytype = t.paytype;
    // v.out_trade_no = t.out_trade_no;
    // this.getPayinfo("payWechatPay", v).then(paydata => {
    //   console.log("pay paydata", paydata);
    //   // wap
    //   if (v.paytype === "wap") {
    //     const payInfo = paydata.jsApiParameters;
    //     const _this = window.$wechat;
    //     _this.$wechat.chooseWXPay({
    //       timestamp: parseInt(payInfo.timeStamp + ""), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    //       nonceStr: payInfo.nonceStr, // 支付签名随机串，不长于 32 位
    //       package: payInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
    //       signType: payInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    //       paySign: payInfo.paySign, // 支付签名
    //       success: function(res) {
    //         // 支付成功后的回调函数
    //         console.log(res);
    //         $utils.toast.warn(res);
    //       },
    //       error: function(err) {
    //         console.log(err);
    //         $utils.toast.warn(err);
    //       }
    //     });
    //   } else if (v.paytype === "app") {
    //     // 服务器端生成支付数据payinfo
    //     const payInfo = (paydata && paydata.paydata) || "";
    //     const params = {
    //       partnerId: payInfo.partnerid, // merchant id
    //       prepayId: payInfo.prepayid, // prepay id
    //       nonceStr: payInfo.noncestr, // nonce
    //       package: payInfo.package, // package
    //       timeStamp: parseInt(payInfo.timestamp + ""), // timestamp
    //       sign: payInfo.sign // signed string
    //     };
    //     console.log("params", params);
    //     // 微信
    //     WechatSdk.pay(params)
    //       .then(res => {
    //         console.log("Wechat pay ", res);
    //         // 支付成功回调
    //         if (res.errCode === "0" || res.errCode === 0) {
    //           // 回调成功处理
    //           // alert("Success")
    //           this.complete(v.out_trade_no, v);
    //         } else {
    //           $utils.toast.error(res.errStr);
    //         }
    //       })
    //       .catch(e => {
    //         console.log("Wechat pay error ", e);
    //         if (e.message === -2 || e.message === "-2") {
    //           $utils.toast.error("取消支付");
    //         } else {
    //           $utils.toast.error(e.message);
    //         }
    //       });
    //   } else if (v.paytype === "mapp") {
    //     let payInfo = paydata.jsApiParameters;
    //     Taro.requestPayment({
    //       timeStamp: parseInt(paydata.timeStamp + ""), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    //       nonceStr: payInfo.nonceStr, // 支付签名随机串，不长于 32 位
    //       package: payInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
    //       signType: payInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    //       paySign: payInfo.paySign, // 支付签名
    //       success: function(res) {
    //         // 支付成功后的回调函数
    //         console.log(res);
    //         global.$utils.toast.warn(res);
    //       },
    //       fail: function(err) {
    //         console.log(err);
    //         global.$utils.toast.warn(err);
    //       }
    //     });
    //   }
    // });
  },
  // 获取支付数据
  getPayinfo: (urltype, t) => {
    const v = {};
    v.payment = t.payment;
    v.paytype = t.paytype;
    v.out_trade_no = t.out_trade_no;
    // 异步处理
    return new Promise((resolve, reject) => {
      $utils.api.load(urltype, v, "post", { loading: true }).then(result => {
        if (result.data) {
          console.log("pay info ", result.data);
          const paydata = result.data;
          // 支付宝
          if (v.payment === "alipay") {
            resolve(paydata);
          }
          // 微信
          if (v.payment === "wechat" || v.payment === "weixin") {
            resolve(paydata);
          }
          // 易宝
          if (v.payment === "yeepay") {
            resolve(paydata);
          }
        }
      });
    });
  },
  // 创建交易
  createTrade: t => {
    // 请求签名
    // let v = {}
    // v.paymodel = !t.paymodel ? 'pay' : t.paymodel
    // 异步处理
    return new Promise((resolve, reject) => {
      $utils.api
        .load("payCreateTrade", t, "post", { loading: false })
        .then(result => {
          if (result.status) {
            // console.log(result.data)
            const paydata = result.data;
            resolve(paydata);
          }
          resolve(null);
        });
    });
  },
  // 获取支付状态
  getPayStatus: t => {
    // 请求签名
    const v = {};
    v.out_trade_no = t.out_trade_no;
    // 异步处理
    return new Promise((resolve, reject) => {
      $utils.api
        .load("Payinfo", v, "post", {
          loading: false,
          toasterror: false,
          toast: false
        })
        .then(result => {
          if (result.status) {
            // console.log(result.data)
            const paydata = result.data;
            resolve(paydata);
          }
        });
    });
  }
};

export default pay;
