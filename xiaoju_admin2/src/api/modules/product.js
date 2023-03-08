// initial state
import * as base from './base.js'
const baseName = '/admin/api/product'
const className = '/admin/api/productClass'

const obj = base.setBaseUrl('product', baseName)
const obj1 = base.setBaseUrl('productClass', className)
const a = Object.assign(obj, obj1, {})
export default a
