import Taro from '@tarojs/taro'

// 支付
const pay = {
	// 支付
	pay: (style, t) => {
		var apptype = global.$utils.app.type
		t.paytype = apptype
		switch (style) {
			case 'wechat': // 微信
				this.wechat(t)
				break
			case 'alipay': // 支付宝
				this.alipay(t)
				break
		}
	},
	// 支付完成
	complete: (outTradeNo, t) => {
		// 结果
		global.$utils.url.push({
			path: '/pay/result',
			query: {
				status: 'complete',
				out_trade_no: outTradeNo,
				payment: t.payment
			}
		})
	},
	// 支付宝支付
	alipay: (t) => {
		console.log('alipay data :', t)
		// 请求签名
		let v = {}
		v.payment = 'alipay'
		v.paytype = t.paytype
		v.out_trade_no = t.out_trade_no
		this.getpayinfo('payAlipayPay', v)
			.then((paydata) => {
				console.log('pay paydata', paydata)
				// wap
				if (v.paytype === 'wap') {
					document.write(paydata)
				} else if (v.paytype === 'app') {
					// 服务器端生成支付数据payinfo
					// var payInfo = paydata.payinfo
					// // 支付宝插件
					// cordova.plugins.alipay.payment(payInfo, (e) => {
					// 	console.log('alipay pay ', e)
					// 	// alert("Success")
					// 	this.complete(v.out_trade_no, v)
					// }, (e) => {
					// 	console.log('alipay pay error ', e)
					// 	global.$utils.toast.error(e.result)
					// })
				}
			})

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
	wechat: (t) => {
		console.log('wechat data :', t)
		// 请求签名
		let v = {}
		v.payment = 'wechat'
		v.paytype = t.paytype
		v.out_trade_no = t.out_trade_no
		this.getpayinfo('payWechatPay', v)
			.then((paydata) => {
				console.log('pay paydata', paydata)
				// wap
				if (v.paytype === 'wap') {
					// let payInfo = paydata.jsApiParameters
					// let _this = window.$wechat
					// _this.$wechat.chooseWXPay({
					// 	timestamp: parseInt(paydata.timeStamp + ''), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					// 	nonceStr: payInfo.nonceStr, // 支付签名随机串，不长于 32 位
					// 	package: payInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					// 	signType: payInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					// 	paySign: payInfo.paySign, // 支付签名
					// 	success: function (res) {
					// 		// 支付成功后的回调函数
					// 		console.log(res)
					// 		global.$utils.toast.warn(res)
					// 	},
					// 	error: function (err) {
					// 		console.log(err)
					// 		global.$utils.toast.warn(err)
					// 	}
					// })
				}
				// mapp
				else if (v.paytype === 'mapp') {
					let payInfo = paydata.jsApiParameters
					Taro.requestPayment({
						timeStamp: parseInt(paydata.timeStamp + ''), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						nonceStr: payInfo.nonceStr, // 支付签名随机串，不长于 32 位
						package: payInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
						signType: payInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: payInfo.paySign, // 支付签名
						success: function (res) {
							// 支付成功后的回调函数
							console.log(res)
							global.$utils.toast.warn(res)
						},
						fail: function (err) {
							console.log(err)
							global.$utils.toast.warn(err)
						}
					})
				}  else if (v.paytype === 'app') {
					// 服务器端生成支付数据payinfo
					let payInfo = paydata.payinfo
					let params = {
						mch_id: payInfo.partnerid, // merchant id
						prepay_id: payInfo.prepayid, // prepay id
						nonce: payInfo.noncestr, // nonce
						timestamp: payInfo.timestamp, // timestamp
						sign: payInfo.sign // signed string
					}
					console.log(params)
					// 微信
					// WechatSdk.sendPaymentRequest(params, (res) => {
					// 	console.log('Wechat pay ', res)
					// 	// alert("Success")
					// 	this.complete(v.out_trade_no, v)
					// }, function (e) {
					// 	console.log('Wechat pay error ', e)
					// 	global.$utils.toast.error(e)
					// })
				}
			})
	},
	// 获取支付数据
	getpayinfo: (urltype, t) => {
		let v = {}
		v.payment = t.payment
		v.paytype = t.paytype
		v.out_trade_no = t.out_trade_no
		// 异步处理
		return new Promise((resolve, reject) => {
			global.$utils.api.load(urltype, v, 'post')
				.then((result) => {
					if (result.status) {
						console.log('pay info ', result.data)
						let paydata = result.data
						// 支付宝
						if (v.payment === 'alipay') {
							resolve(paydata)
						}
						// 微信
						if (v.payment === 'wechat' || v.payment === 'weixin') {
							resolve(paydata)
						}
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
	},
	// 创建交易
	createtrade: (t) => {
		// 请求签名
		let v = {}
		v.paymodel = !t.paymodel ? 'pay' : t.paymodel
		v.fee = t.fee
		v.title = t.title
		v.body = t.body
		v.store_id = t.store_id
		v.store_name = t.store_name
		// 异步处理
		return new Promise((resolve, reject) => {
			global.$utils.api.load('payCreateTrade', v, 'post')
				.then((result) => {
					if (result.status) {
						// console.log(result.data)
						let paydata = result.data
						resolve(paydata)
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
	},
	// 获取支付状态
	getpaystatus: (t) => {
		// 请求签名
		let v = {}
		v.out_trade_no = t.out_trade_no
		// 异步处理
		return new Promise((resolve, reject) => {
			global.$utils.api.load('payGetPayStatus', v, 'post', {
					toasterror: false,
					loading: false
				})
				.then((result) => {
					if (result.status) {
						// console.log(result.data)
						let paydata = result.data
						resolve(paydata)
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
	}
}

export default pay
