// 加载图片
const loadimg =
  // 加载图片
  (url: string) => {
    // 检测是否是data:image
    if (url && url.indexOf('data:image') >= 0) {
      return url;
    }
    // 添加服务器root
    const domain =
      window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    // console.log('loadimg domain', domain);
    if (url) {
      if (url.indexOf('http') >= 0 || url.indexOf('https') >= 0) {
        return url;
      }
      return domain + url;
    } else {
      return url;
    }
  };

export default loadimg;
