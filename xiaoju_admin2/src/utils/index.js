// import Vue from 'vue'
import config from './config'
import storage from './storage'
import image from './image'
import time from './time'
import toast from './toast'
import url from './url'
import loading from './loading'
import data from './data'
import player from './player'
import view from './view'
import api from '../api'

// 注入方法
let utils = {
	config,
	storage,
	image,
	time,
	toast,
	url,
	loading,
	data,
	player,
	view,
	api,
}

// Vue.prototype.webview = webview		// 网页
// Vue.prototype.storage = storage		// 存储
// Vue.prototype.appconfig = appconfig	// 配置
// Vue.prototype.pay = pay				// 支付
// Vue.prototype.scanner = scanner		// 扫描
// Vue.prototype.auth = auth			// 认证
// Vue.prototype.push = push			// 推送
// Vue.prototype.savepicture = savepicture			// 保存图片
// Vue.prototype.loadimg = loadimg			// 加载图片
// Vue.prototype.datetime = datetime			// 格式化时间
// Vue.prototype.toast = toast			// 提示

// Vue.use(util)

window.$utils = utils
export default utils
