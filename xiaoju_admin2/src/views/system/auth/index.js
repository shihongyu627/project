import * as AuthRule from './rule'
import * as AuthGroup from './group'
import * as AuthAccess from './access'
import * as AuthType from './type'
let a = Object.assign({}, AuthRule, AuthGroup, AuthAccess, AuthType)
export default a
