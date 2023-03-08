import config from '../../build/config'
// 加载图片
var loadimg = {
  // 加载图片
  load: function(url, type = 0) {
    let isOSSThumb = true
    let isQiNiuThumb = true
    // 检测是否是data:image
    if (url && url.indexOf('data:image') >= 0) {
      return url
    }
    // 添加服务器root
    if (url) {
      if (url.indexOf('http') >= 0 || url.indexOf('//') == 0) {
        // 协议头重置-当前请求的协议头
        // 判断是否https
        let protocol = window.location.protocol
        console.log('http protocol', protocol)
        if(protocol == 'https:'){
            if (url.indexOf('http:') >= 0) {
                url.replace("http:","https:")　
            }
        }

        // 二维码
        if (url.indexOf('bshare') >= 0 || url.indexOf('topscan') >= 0 || url.indexOf('qrcode') >= 0) {
          return url
        }
        // 七牛图片
        if (isQiNiuThumb) {
          if (url.indexOf('?') >= 0) {
            return url + '&imageView2/2/w/1080/h/1080/q/75' // 七牛图片压缩
          } else {
            return url + '?imageView2/2/w/1080/h/1080/q/75' // 七牛图片压缩
          }
        }
        // oss图片
        if (isOSSThumb) {
          if (url.indexOf('?') >= 0) {
            return url + '&x-oss-process=image/auto-orient,1/resize,p_68/quality,q_90' // 图片压缩
          } else {
            return url + '?x-oss-process=image/auto-orient,1/resize,p_68/quality,q_90' // 图片压缩
          }
        }
        return url
      }
      // 如果开头/ 去掉
      if (url.indexOf('/') === 0) {
        url = url.substring(1)
      }
      // /upload/ueditor/ 去掉
      if (url.indexOf('upload/ueditor/') >= 0) {
        url = url.substring(url.indexOf('upload/ueditor/'))
      }

      return config.IMAGE_HOST + '/' + url
    }
    return url
  },
}
export default loadimg
