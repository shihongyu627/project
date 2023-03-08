// webview
const webview = {
  go (url) { // 网页
    let base = '/pages/common/webview'
    let query = {
      src: url
    }

    global.$utils.url.push({ page: base, query: query })
  }
}

export default webview
