import Vue from 'vue'
import axios from 'axios'
import config from '../../build/config'
import qs from 'qs'
import Cookies from 'js-cookie'

import config_api from './modules/config'
import banner from './modules/banner'
import analysis from './modules/analysis'
import auth from './modules/auth'
import site from './modules/site'
import fund from './modules/fund'
import real from './modules/real'
import shop from './modules/shop'
import map from './modules/map'
import msg from './modules/msg'
import product from './modules/product'
import device from './modules/device'
import repair from './modules/repair'
import operator from './modules/operator'
import order from './modules/order'
import upload from './modules/upload'
import user from './modules/user'
import payment from './modules/payment'
import log from './modules/log'
import shorturl from './modules/shorturl'
import help from './modules/help'
import notice from './modules/notice'
import feedback from './modules/feedback'
// 配置
axios.defaults.baseURL = config.API_HOST
// axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// api 集合
const types = {}
Object.assign(types, config_api, payment, banner, analysis, shorturl, help, msg, fund, real, auth, site, operator, log, shop, map, product, device, repair, order, upload, user, notice, feedback)
// console.log(' xxxxx',types);

// 请求数据
function loadData(urlOrTypename = '', data = {}, method = 'get', config = {}, responseType = 'json') {
  // 合并配置
  let dconfig = { toast: false, toasterror: true, loading: false, loadingtext: 'Loading', login: true }
  config = Object.assign(dconfig, config)
  // 匹配api
  let url = ''
  let isBaseurl = true
  if (urlOrTypename.indexOf('http') >= 0) {
    url = urlOrTypename
    isBaseurl = false
  } else {
    url = types[urlOrTypename] + ''
    isBaseurl = true
  }
  console.log('api url :', url, ' url-typename', urlOrTypename)
  if (url !== 'undefined' && url !== null && url !== '') {
    // 设置PHPSESSID
    // data.PHPSESSID = Cookies.get('PHPSESSID') || ''
    // if (!data.PHPSESSID) {
    //     data.PHPSESSID = window.localStorage.getItem('PHPSESSID') || ''
    // }
    // axios配置
    let con = {
      method: method.toUpperCase(),
      url: url,
      responseType: responseType,
      headers: {
        AUTHORIZATION: window.localStorage.getItem('token') || '',
      },
    }
    // 去除基url
    if (isBaseurl === false) {
      con.baseURL = ''
    }
    // 拼装数据
    if (method === 'get') {
      con.params = data
    } else if (method === 'post') {
      // URLSearchParams
      con.data = qs.stringify(data)
    }
    // console.log('api data :', data)
    // 异步处理
    return new Promise((resolve, reject) => {
      // loading
      if (config.loading === true) {
        $utils.loading.show(config.loadingtext)
      }
      axios
        .request(con)
        .then((response) => {
          console.log(response)
          let result = response.data
          console.log(result)
          // 输出数据、下载文件
          if (responseType == 'json') {
            if (!result) {
              result = {}
            }
            if (result.data && result.data.token) {
              window.localStorage.setItem('token', result.data.token)
            }
          } else if (responseType == 'blob') {
            if (config.loading === true) {
              $utils.loading.hide()
            }
            // 判断是否返回code
            let blob = new Blob([result])
            if (result.type === 'application/json') {
              let reader = new FileReader()
              reader.onload = (e) => {
                let xxres = {}
                try {
                  xxres = JSON.parse(e.target.result)
                } catch (error) {
                  resolve(result)
                  return
                }
                console.log(xxres)
                if (xxres.code) {
                  // go弹出提示
                  if (xxres.code === 1) {
                    // xx
                    xxres.status = 1
                  } else if (result.code == -2000) {
                    xxres.status = 0
                    // 登录
                    if (config.login === true) {
                      $utils.url.push({ path: '/login' })
                    }
                  } else {
                    xxres.status = 0
                    // 提示
                    if (config.toasterror === true) {
                      $utils.toast.warn(xxres.message)
                    }
                  }
                  if (config.toast === true) {
                    $utils.toast.text(xxres.message)
                  }
                  if (config.loading === true) {
                    $utils.loading.hide()
                  }
                  resolve(null)
                  return
                } else {
                  //直接输出文件
                  if (response.status == 200) {
                    resolve(result)
                  } else {
                    resolve(null)
                  }
                }
              }
              return reader.readAsText(blob)
            } else {
              resolve(result)
            }
            return
            // console.log(blob)
          } else {
            // 判断是否返回code
            if (result.code) {
              // go弹出提示
            } else {
              //直接返回对应数据
              if (response.status == 200) {
                resolve(result)
              } else {
                resolve(null)
              }
            }
          }
          // console.log('api result :', result)
          // 000000 | 1
          if (result.code === 1) {
            // xx
            result.status = 1
          } else if (result.code == -2000 || result.code == -2001 || result.code == -2098 || result.code == -2099) {
            result.status = 0
            // 登录
            if (config.login === true) {
              $utils.url.push({ path: '/login' })
            }
          } else {
            result.status = 0
            // 提示
            if (config.toasterror === true) {
              let toastdesc = ''
              if (result && result.message) {
                if (result.message.length > 18) {
                  toastdesc = result.message || ''
                }
              }
              $utils.toast.warn(result.message, toastdesc)
            }
          }
          // 成功提示
          if (result.code === 1) {
            if (config.toast === true) {
              let toastdesc = ''
              if (result && result.message) {
                if (result.message.length > 18) {
                  toastdesc = result.message || ''
                }
              }
              $utils.toast.text(result.message, toastdesc)
            }
          }
          if (config.loading === true) {
            $utils.loading.hide()
          }
          resolve(result)
        })
        .catch((error) => {
          console.log('api error', error)
          if (config.loading === true) {
            $utils.loading.hide()
          }
          if (config.toasterror === true) {
            $utils.toast.error('请求错误' + error.message)
          }
          reject(new Error(null))
        })
    })
  } else {
    $utils.loading.hide()
    return new Promise((resolve, reject) => {
      if (config.toasterror === true) {
        $utils.toast.warn('Url请求错误')
      }
      resolve(null)
      // reject(null)
    })
  }
}

let api = {
  load: loadData,
}
Vue.prototype.$axios = axios

export default api
