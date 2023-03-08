// initial state
const baseName = "/maintainer";
const loginAuth = baseName + "/login"; //登录接口,只需用户名和密码
const logoutAuth = baseName + "/logout"; //退出登录
const getInfo = baseName + "/getInfo"; //获取用户信息
const getWxConfigInfo = baseName + "/getWxConfigInfo"; //获取微信配置
const getWxAuthInfo = baseName + "/getWxAuthInfo"; //获取微信api请求权限配置
const userGetPhone = baseName + "/maintainer/user/getPhone"; //获取管理员、客服电话

export { getInfo, loginAuth,logoutAuth, userGetPhone,getWxConfigInfo,getWxAuthInfo };
