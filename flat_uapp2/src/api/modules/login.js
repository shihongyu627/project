// initial state
const baseName = "/customer";
const loginAuth = baseName + "/login"; //登录接口,只需用户名和密码
const avatarAuth = baseName + "/auth/avatar"; //修改头像
const nickAuth = baseName + "/auth/nick"; //修改昵称

const logoutAuth = baseName + "/logout"; //登录接口,只需用户名和密码
const loauthAuth = baseName + "/auth/oauth"; //登录接口,三方授权
const loginCommonAuth = baseName + "/auth/login"; //登录授权,登录方式[pwd=密码登录，sms=短信登录，isp=运营商登录]
const getInfo = baseName + "/getInfo"; //获取用户信息
const getIspPhone = baseName + "/auth/getIspPhone"; //识别运营商手机号
const authSendSms = baseName + "/auth/sendSms"; //发送验证码
const getWxConfigInfo = baseName + "/getWxConfigInfo"; //获取微信配置
const getWxAuthInfo = baseName + "/getWxAuthInfo"; //获取微信api请求权限配置
const userGetPhone = baseName + "/customer/user/getPhone"; //获取管理员、客服电话


export {
  getInfo,
  avatarAuth,
  nickAuth,
  loginAuth,
  logoutAuth,
  loauthAuth,
  loginCommonAuth,
  getIspPhone,
  authSendSms,
  userGetPhone,
  getWxConfigInfo,
  getWxAuthInfo
};
