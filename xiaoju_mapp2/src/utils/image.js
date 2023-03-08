// 加载图片
const loadimg = {
    // 加载图片
  load: function (url) {
    if (typeof (url) === 'string') {
      // 检测是否是data:image
      if (url && url.indexOf('data:image') >= 0) {
        return url
      }
      // 添加服务器root
      if (url) {
        if (url.indexOf('http') >= 0  || url.indexOf('//') == 0) {
          if (url.indexOf('//') == 0) {
            url = 'http:' + url
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
        url = global.img_host + '' + url
      }
      let img = url
      return img
    } else {
      return url
    }
  }
}
export default loadimg
