import url from './url'
import webview from './webview'
import storage from './storage'
import image from './image'
import time from './time'
import toast from './toast'
import loading from './loading'
import data from './data'
import qrcode from './qrcode'
import app from './app'
// import auth from './auth'
import map from './map'
import pay from './pay'
import location from './location'
import device from './device'
import network from './network'
import bluetooth from './bluetooth'
import api from '../api'

// 注入方法
const utils = {
  webview,
  storage,
  image,
  time,
  toast,
  url,
  loading,
  data,
  app,
  qrcode,
  // auth,
  map,
  pay,
  location,
  device,
  network,
  bluetooth,
  api
}

global.$utils = utils
export default utils
