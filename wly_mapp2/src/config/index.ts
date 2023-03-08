global.verifyBaseUrl = '/admin/api'
global.verifyAuth = global.verifyBaseUrl + '/auth/login'//核销登录
global.verifyAuthCheckUsername = global.verifyBaseUrl + '/auth/checkusername'//检测登录账号
global.verifyCheck = global.verifyBaseUrl + '/auth/check'//核销检测登录
global.verifyInfo = global.verifyBaseUrl + '/coupon/recorddetail'//核销详情
global.verifyCoupon = global.verifyBaseUrl + '/coupon/verify'//核销
export default global;
