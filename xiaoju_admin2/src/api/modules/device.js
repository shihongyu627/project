// initial state
import * as base from './base.js'
const baseName = '/admin/api/device'
const allowName = '/admin/api/deviceAllow'
const tagsRecordName = '/admin/api/deviceTagsRecord'
const batteryRecordName = '/admin/api/deviceBatteryRecord'
const openRecordName = '/admin/api/deviceOpenRecord'
const OpenRefund = '/admin/api/deviceOpenRecordAction'

const searchDevice = baseName + '/searchDevice'
const swapDevice = baseName + '/swapDevice'
const updateDevice = baseName + '/updateDevice'
const controlDevice = baseName + '/controlDevice'
const refreshDevice = baseName + '/refreshDevice'
const refreshMqttDevice = baseName + '/refreshMqttDevice'
const deviceLatlngs = baseName + '/latlngs'
const deviceQuery = baseName + '/queryDevice'
const deviceGetEmqxClient = baseName + '/getEmqxClient'

const deviceBatteryRecordDataTotal = batteryRecordName + '/batteryDataTotal'
const deviceBatteryRecordDataSync = batteryRecordName + '/batteryDataSync'

const obj = base.setBaseUrl('device', baseName)
const obj1 = base.setBaseUrl('deviceAllow', allowName)
const obj2 = base.setBaseUrl('deviceTagsRecord', tagsRecordName)
const obj3 = base.setBaseUrl('deviceBatteryRecord', batteryRecordName)
const obj4 = base.setBaseUrl('deviceOpenRecord', openRecordName)
const obj5 = base.setBaseUrl('OpenRefund', OpenRefund)
const a = Object.assign(obj, obj1, obj2, obj3, obj4,obj5, { deviceLatlngs, deviceQuery, searchDevice, swapDevice, updateDevice, controlDevice, refreshDevice,refreshMqttDevice, deviceGetEmqxClient, deviceBatteryRecordDataTotal, deviceBatteryRecordDataSync,OpenRefund })
export default a
