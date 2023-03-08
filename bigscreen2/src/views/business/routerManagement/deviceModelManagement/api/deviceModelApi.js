/*
 * @Author: lvlongfei
 * @Date: 2021-05-12 12:06:20
 * @Description: 设备型号管理api
 */
import request from '@/utils/request'

var api_list = {
  getDeviceModelList: function(data) { // 设备型号列表
    return request({
      url: '/face-route/manager/deviceModelList',
      method: 'post',
      data: data
    })
  },
  addDeviceModel: function(data) { // 添加设备型号
    return request({
      url: '/face-route/manager/deviceModelAdd',
      method: 'post',
      data: data
    })
  },
  delDeviceModel: function(data) { // 删除设备型号
    return request({
      url: '/face-route/manager/deviceModelDel',
      method: 'post',
      data: data
    })
  },
  editDeviceModel: function(data) { // 编辑设备型号
    return request({
      url: '/face-route/manager/deviceModelEdit',
      method: 'post',
      data: data
    })
  }
}

export default api_list
