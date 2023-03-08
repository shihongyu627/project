// initial state

import * as base from './base.js'
const baseName = '/admin/api/user'
const withdrawName = '/admin/api/userWithdraw'
const arecordRecordsName = '/admin/api/userAccountRecords'
const rechargeName = '/admin/api/userRecharge'
const bankName = '/admin/api/userLevel'
const realName = '/admin/api/userReal'
const whiteName = '/admin/api/userWhite'
const blackName = '/admin/api/userBlack'

const userQueryMoney = baseName + '/queryMoney'
const userQueryMonthMoney = baseName + '/queryMonthMoney'
const userRechargeRecharge = rechargeName + '/recharge'

const obj =  base.setBaseUrl('user', baseName)
const obj1 = base.setBaseUrl('userWithdraw', withdrawName)
const obj2 = base.setBaseUrl('userAccountRecords', arecordRecordsName)
const obj3 = base.setBaseUrl('userBank', bankName)
const obj4 = base.setBaseUrl('userReal', realName)
const obj5 = base.setBaseUrl('userRecharge', rechargeName)
const obj6 = base.setBaseUrl('userWhite', whiteName)
const obj7 = base.setBaseUrl('userBlack', blackName)
const a = Object.assign(obj,obj1,obj2,obj3,obj4,obj5,obj6,obj7, {userQueryMoney, userQueryMonthMoney, userRechargeRecharge})
export default a
