// 处理微信跳转超过10层
import Taro from "@tarojs/taro"

const PAGE_LEVEL_LIMIT = 10

export default function jumpUrl (url,params,options = {} ) {
    const pages = Taro.getCurrentPages()
    let method = options.method || 'navigateTo'
    if (url && typeof url === 'string') {
      if (method === 'navigateTo' && pages.length >= PAGE_LEVEL_LIMIT - 3) {
        method = 'redirectTo'
      }
  
      if (method === 'navigateToByForce') {
        method = 'navigateTo'
      }
  
      if (method === 'navigateTo' && pages.length == PAGE_LEVEL_LIMIT) {
        method = 'redirectTo'
      }
      if(params){
        let q='?'
        for(let i in params){
          q += i+"="+params[i]+ '&'
        }
        q = q.slice(0,q.lastIndexOf('&'))
        url = url.split('?')[0]+q
      }

      Taro[method]({
        url
      })
    }
  }