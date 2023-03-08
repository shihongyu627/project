// initial state
import * as base from './base.js'
const baseName = '/admin/api/help'
const className = '/admin/api/helpClass'

const obj = base.setBaseUrl('help', baseName)
const obj1 = base.setBaseUrl('helpClass', className)
const a = Object.assign(obj, obj1)
export default a
