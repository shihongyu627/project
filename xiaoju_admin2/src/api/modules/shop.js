// initial state
import * as base from './base.js'
const baseName = '/admin/api/shop'
const accountName = '/admin/api/shopAccount'
const withdrawName = '/admin/api/shopWithdraw'
const arecordRecordsName = '/admin/api/shopAccountRecords'
const storeName = '/admin/api/shopStore'
const storeFeeName = '/admin/api/shopStoreFee'
const storeAreaName = '/admin/api/shopStoreArea'
const storeTimeName = '/admin/api/shopStoreTime'
const storeTagName = '/admin/api/shopStoreTag'

// 区域的全部围栏区域
const storeAreaAllArea = storeAreaName + '/allArea'

// 区域分组下拉
const storeDropGroupList = storeName + '/dropGroupList'

// 关闭标签
const shopStoreTagClose = storeTagName + '/closeTag'

const obj = base.setBaseUrl('shop', baseName)
const obj1 = base.setBaseUrl('shopAccount', accountName)
const obj2 = base.setBaseUrl('shopWithdraw', withdrawName)
const obj3 = base.setBaseUrl('shopAccountRecords', arecordRecordsName)
const obj4 = base.setBaseUrl('shopStore', storeName)
const obj5 = base.setBaseUrl('shopStoreFee', storeFeeName)
const obj6 = base.setBaseUrl('shopStoreArea', storeAreaName)
const obj7 = base.setBaseUrl('shopStoreTime', storeTimeName)
const obj8 = base.setBaseUrl('shopStoreTag', storeTagName)
const a = Object.assign(obj, obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, { storeAreaAllArea, storeDropGroupList, shopStoreTagClose })
export default a
