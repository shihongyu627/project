// initial state
import * as base from './base.js'
const baseName = '/admin/api/order'
const orderGoodsName = '/admin/api/orderGoods'
const tplRateName = '/admin/api/orderTplRate'
const paymentRefundName = '/admin/api/paymentRefund'

const orderCancel = baseName + '/cancel'
const orderDelete = baseName + '/del'
const orderComplete = baseName + '/complete'
const orderRefund = baseName + '/refund'
const orderRefundLine = baseName + '/refundline'
const paymentRefund = paymentRefundName + '/lists'

const orderLatlngs = baseName + '/latlngs'

const obj = base.setBaseUrl('order', baseName)
const obj1 = base.setBaseUrl('orderGoods', orderGoodsName)
const obj2 = base.setBaseUrl('orderTplRate', tplRateName)
const obj3 = base.setBaseUrl('paymentRefund', paymentRefundName)

const a = Object.assign(obj, obj1, obj2, obj3,{orderLatlngs, orderCancel, orderDelete, orderComplete, orderRefund, orderRefundLine,paymentRefund})
export default a
