// initial state
import * as base from './base.js'
const baseName = '/admin/api/repair'
const recordName = '/admin/api/repairRecord'
const patrolName = '/admin/api/patrol'

const obj = base.setBaseUrl('repair', baseName)
const obj1 = base.setBaseUrl('repairRecord', recordName)
const obj2 = base.setBaseUrl('patrol', patrolName)
const a = Object.assign(obj,obj1,obj2, {})
export default a
