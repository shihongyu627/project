// initial state
import * as base from './base.js'
const baseName = '/admin/api/auth'
const baseNameRule = '/admin/api/authRule'
const baseNameGroup = '/admin/api/authGroup'
const baseNameAccess = '/admin/api/authAccess'
const baseNameType = '/admin/api/authType'

const authCheck = baseName + '/check'
const authLogin = baseName + '/login'
const authLogout = baseName + '/logout'
const authUpPassword = baseName + '/upPassword'

const authRuleMainDropTree = baseNameRule + '/mainDropTree'

const obj = base.setBaseUrl('auth', baseName)
const obj1 = base.setBaseUrl('authRule', baseNameRule)
const obj2 = base.setBaseUrl('authGroup', baseNameGroup)
const obj3 = base.setBaseUrl('authAccess', baseNameAccess)
const obj4 = base.setBaseUrl('authType', baseNameType)
const a = Object.assign(obj, obj1, obj2, obj3, obj4, { authCheck, authLogin, authLogout, authUpPassword, authRuleMainDropTree })
export default a
