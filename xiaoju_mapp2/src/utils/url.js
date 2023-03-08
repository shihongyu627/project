import Taro from '@tarojs/taro'

const url = {
  navigator: {},
  // 加载
  push: function (config) {
    return Taro.navigateTo(config)
  },
  // 返回
  back: function (config = { delta: 1 }) {
    return Taro.navigateBack(config)
  },
  // native view
  // view: function (view) {
  //   // return view
  // }
  getUrlKey: function (urlurl, name) {
    urlurl = decodeURIComponent(urlurl)
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(urlurl) || ['', ''])[1].replace(/\+/g, '%20')) || null
  },
  setUrlKey: function (json) {
    let urlurl = '';
		for(var k in json){
			let value = json[k] !==undefined ? json[k] : '';
			urlurl += `&${k}=${encodeURIComponent(value)}`
		}
		return urlurl ? urlurl.substring(1) : ''
  }
}

export default url
