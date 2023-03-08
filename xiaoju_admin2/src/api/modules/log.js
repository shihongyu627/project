// initial state
import * as base from './base.js'
const smsLogName = '/admin/api/smsLog'
const sysLogName = '/admin/api/sysLog'
const sysUpLogName = '/admin/api/sysUpLog'

const obj = base.setBaseUrl('smsLog', smsLogName)
const obj1 = base.setBaseUrl('sysLog', sysLogName)
const obj2 = base.setBaseUrl('sysUpLog', sysUpLogName)
const a = Object.assign(obj, obj1, obj2)
export default a
