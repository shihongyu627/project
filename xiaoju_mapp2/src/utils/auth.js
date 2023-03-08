// import * as WechatSdk from 'react-native-wechat'
// import * as QQSdk from 'react-native-qq'
import Taro from '@tarojs/taro'
import * as userActions from '../store/actions/user'
import store from '../store'
// 认证
const auth = {
  style: {},
  back: function () {},
  // 登录
  login(t) {
    return new Promise((resolve, reject) => {
      global.global.$utilss.api.load('authLogin', t, 'get')
        .then((result) => {
          if (result.status) {
            global.global.$utilss.toast.success('登录成功')
            let user = {
              uid: result.data.uid,
              uname: result.data.username,
              avatar: result.data.useravatar,
              point: result.data.userpoint,
              level: result.data.userlevel,
              levelname: result.data.level_name
            }
            // 设置登录
            store.dispatch(userActions.login(user))
            // global.$utils.data.set('auth', 'login', true)
            // global.$utils.data.set('auth', 'userinfo', result.data)
            resolve(user)
          }
          resolve(null)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // 注册
  register(t) {
    return new Promise((resolve, reject) => {
      global.$utils.api.load('authRegister', t, 'get')
        .then((result) => {
          if (result.status) {
            global.$utils.toast.success('注册成功')
            let user = {
              uid: result.data.uid,
              uname: result.data.username,
              avatar: result.data.useravatar,
              point: result.data.userpoint,
              level: result.data.userlevel,
              levelname: result.data.level_name
            }
            // 设置登录
            store.dispatch(userActions.login(user))
            // global.$utils.data.set('auth', 'login', true)
            // global.$utils.data.set('auth', 'userinfo', result.data)
            resolve(user)
          }
          resolve(null)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // 注销
  logout: function () {
    console.log('auth logout')
    return new Promise((resolve, reject) => {
      global.$utils.api.load('authLogout')
        .then((result) => {
          if (result.status) {
            // 设置注销
            store.dispatch(userActions.logout())
            // global.$utils.data.set('auth', 'login', false)
            // global.$utils.data.set('auth', 'userinfo', null)
            resolve(true)
          } else {
            resolve(null)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // 检测是否登录
  checklogin: function (toLogin = false, online = false) {
    // 判断登录
    let isLogin = false
    let is1 = global.$utils.data.get('auth', 'login')
    let is2 = global.$utils.data.get('auth', 'userinfo')
    if (is1 === true && is2) {
      isLogin = true
    } else {
      isLogin = false
    }
    return new Promise((resolve, reject) => {
      if (!online || !isLogin) {
        if (!isLogin && toLogin) {
          // 去登录
          global.$utils.url.push({
            path: '/auth/login'
          })
        }
        console.log('checklogin ', isLogin)
        resolve(isLogin)
      } else {
        global.$utils.api.load('authCheck', {}, 'get', {
            toast: false,
            toasterror: false,
            loading: false,
            loadingtext: 'Loading'
          })
          .then((result) => {
            if (result.status) {
              isLogin = true
            } else {
              global.$utils.data.set('auth', 'login', false)
              isLogin = false
            }
            if (!isLogin && toLogin) {
              // 去登录
              global.$utils.url.push({
                path: '/auth/login'
              })
            }
            console.log('checklogin online ', isLogin)
            resolve(isLogin)
          })
          .catch((err) => {
            reject(err)
          })
      }
    })
  },
  // 用户信息
  userinfo: function (toLogin = false) {
    let userinfo = null
    return new Promise((resolve, reject) => {
      this.checklogin(toLogin).then((result) => {
          if (result) {
            userinfo = global.$utils.data.get('auth', 'userinfo') || null
            if (userinfo != null) {
              userinfo.useravatar = userinfo.useravatar || global.$utils.app.getIcon()
              userinfo.useravatar = global.$utils.image.load(userinfo.useravatar)
            }
          } else {
            userinfo = null
          }
          console.log('userinfo ', userinfo)
          resolve(userinfo)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getLevelIcon: function (level) {
    let icon = 'level_0.svg'
    switch (level) {
      case 1:
        icon = 'level_1.svg'
        break
      case 2:
        icon = 'level_2.svg'
        break
      case 3:
        icon = 'level_3.svg'
        break
      case 4:
        icon = 'level_4.svg'
        break
      default:
        icon = 'level_0.svg'
    }
    console.log(icon)
    // return require('../assets/icon/' + icon)
  },
  // 认证
  oauth: function (style, data, callback) {
    this.style = style
    this.back = callback
    console.log('auth oauth ' + style)
    switch (style) {
      case 'wechat': // 微信
        this.wechat(data)
        break
      case 'weibo': // 微博
        this.weibo(data)
        break
      case 'qq': // qq
        this.qq(data)
        break
    }
  },
  // 微信
  wechat: function () {
    if (global.$utils.app.type === 'mapp') {
      Taro.authorize({scope: 'scope.userInfo'}).then((res) => {
        console.log('wechat scope ', res)
        Taro.getUserInfo({
          success: info => {
            console.log('wechat oauth ', info)
            // to-do 需要处理回调
            // this.callback(this.style, res)
          }
        })
      })
      .catch((e) => {
        console.log('wechat oauth error ', e)
        global.$utils.toast.error(e.message);
      })
    }
    if (global.$utils.app.type === 'app') {
      // WechatSdk.isWXAppInstalled().then((installed) => {
      //   if (!installed) {
      //     return global.$utils.toast.error('未安装微信')
      //   } else {
      //     let scope = 'snsapi_userinfo'
      //     let state = '_' + (+new Date())
      //     WechatSdk.sendAuthRequest(scope, state).then((res) => {
      //       console.log('wechat oauth ', res)
      //       // you may use res.code to get the access token.
      //       // alert('code', res.code);
      //       this.callback(this.style, res)
      //     }, function (e) {
      //       console.log('wechat oauth error ', e)
      //       global.$utils.toast.error(e.message);
      //     })
      //   }
      // })
    }
  },
  // 微博登录
  weibo: function () {
    /*
    var INSTALLED = false
    WeiboSDK.checkClientInstalled(function () {
        INSTALLED = true
    }, function () {
        INSTALLED = false
    })
    if (!INSTALLED) {
      alert('未安装微博')
      return
    }
    */
    // WeiboSdk.ssoLogin((args) => {
    //    console.log('weibo oauth ', args)
    //   //  alert('access token is ' + args.access_token)
    //   //  alert('userId is ' + args.userId)
    //   //  alert('expires_time is ' + new Date(parseInt(args.expires_time)) + ' TimeStamp is ' + args.expires_time)
    //   this.callback(this.style, args)
    // }, function (failReason) {
    //    global.$utils.toast.error(failReason);
    // })
  },
  // QQ登录
  qq: function () {
    // wap登录
    if (global.$utils.app.type === 'wap') {
      // 请求登录
      var v = {}
      v.type = 'qq'
      v.url = encodeURIComponent(global.app_base + '?calloauth=qq')
      global.$utils.api.load('authApiOauth', v, 'get')
        .then((result) => {
          if (result.status) {
            // url = result.data.tourl
          }
        })
      return true
    }

    // if (!QQSdk.isQQInstalled) {
    //   return global.$utils.toast.error('未安装QQ')
    // } else {
    //   let scope = 'snsapi_userinfo'
    //   QQSdk.login(scope).then((res) => {
    //     console.log('qq oauth ', res)
    //     // {
    //     // 	"access_token": "CAF0085A2AB8FDE7903C97F4792ECBC3",
    //     // 	"openid": "0E00BA738F6BB55731A5BBC59746E88D"
    //     // 	"expires_in": "1458208143094.6"
    //     // 	"oauth_consumer_key": "12345"
    //     // }
    //     // you may use res.code to get the access token.
    //     // alert('code', response.code);
    //     this.callback(this.style, res)
    //   }, function (e) {
    //     console.log('qq oauth error ', e)
    //     global.$utils.toast.error(e);
    //   })
    // }
  },
  callback(style, dd) {
    // 登录回调
    let data = {}
    data.style = style
    if (style === 'wechat') {
      data.code = dd.code
    }
    if (style === 'qq') {
      data.openid = dd.openid
      data.access_token = dd.access_token
      data.expires_time = dd.expires_in
    }
    global.$utils.api.load('authOauthCallback', data, 'get')
      .then((result) => {
        // console.log(result.data)
        if (result.status) {
          global.$utils.toast.success('登录成功')
          // 设置登录
          global.$utils.data.set('auth', 'login', true)
          global.$utils.data.set('auth', 'userinfo', result.data)
        }
        // this.back(result)
        global.$utils.url.go(-1)
      })
  },
  // 发送短信
  sendsms(mobile) {
    return new Promise((resolve, reject) => {
      global.$utils.api.load('authSendsms', {
          mobile: mobile
        }, 'get')
        .then((result) => {
          if (result.status) {
            global.$utils.toast.success('发送成功')
            resolve(true)
          }
          resolve(null)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default auth
