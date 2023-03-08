const Loadimg = (url: string):string => {
  let isQiNiuThumb = true;
  if (typeof url === "string") {
    // 检测是否是data:image
    if (url && url.indexOf("data:image") >= 0) {
      return url;
    }
    // 添加服务器root
    if (url) {
      if (url.indexOf("http") >= 0) {
        // 七牛图片
        if (url.indexOf("img.static") >= 0) {
          if (isQiNiuThumb) {
            if (url.indexOf("?") >= 0) {
              return url + "&imageView2/2/w/1080/h/1080/q/75"; // 七牛图片压缩
            } else {
              return url + "?imageView2/2/w/1080/h/1080/q/75"; // 七牛图片压缩
            }
          }
        }
        return url;
      }
      // 如果开头/ 去掉
      if (url.indexOf("/") === 0) {
        url = url.substring(1);
      }
      // /upload/ueditor/ 去掉
      if (url.indexOf("upload/ueditor/") >= 0) {
        url = url.substring(url.indexOf("upload/ueditor/"));
      }
      url = "/" + url;
    }
    return url;
  }
  return url;
};

export default Loadimg;
