/*
 * @Author: lvlongfei
 * @Date: 2021-05-13 09:20:10
 * @Description: 路由管理api
 */
import request from '@/utils/request'

var api_list = {
  getRouteList: function(data) { // 路由列表
    return request({
      url: '/face-route/manager/routeList',
      method: 'post',
      data: data
    })
  },
  delRoute: function(data) { // 删除路由
    return request({
      url: '/face-route/manager/routeDel',
      method: 'post',
      data: data
    })
  },
  addRoute: function(data) { // 添加路由
    return request({
      url: '/face-route/manager/routeAdd',
      method: 'post',
      data: data
    })
  },
  editRoute: function(data) { // 编辑路由
    return request({
      url: '/face-route/manager/routeEdit',
      method: 'post',
      data: data
    })
  },
  selChannel: function(data) { // 渠道下拉
    return request({
      url: '/face-route/manager/channel/' + data,
      method: 'get'
    })
  },
  selDevice: function() { // 设备下拉
    return request({
      url: '/face-route/manager/deviceModel',
      method: 'get'
    })
  },
  selAlgorithm: function(data) { // 算法下拉
    return request({
      url: '/face-route/manager/algorithm/' + data,
      method: 'get'
    })
  },
  selApp: function(data1, data2) {
    return request({
      url: '/face-route/manager/appId/' + data1 + '/' + data2,
      method: 'get'
    })
  },
  selBusinessType: function() { // 业务类型下拉
    return request({
      url: '/face-route/manager/businessType',
      method: 'get'
    })
  },
  selScene: function() { // 业务场景下拉
    return request({
      url: '/face-route/manager/sceneList',
      method: 'get'
    })
  },
  selVersion: function(data1, data2, data3, data4) { // 算法下拉
    return request({
      url: '/face-route/manager/version/' + data1 + '/' + data2 + '/' + data3 + '/' + data4,
      method: 'get'
    })
  },
  selConfList: function(data) { // 下拉通用接口
    return request({
      url: '/face-route/manager/conditionlist',
      method: 'post',
      data: data
    })
  },
  routerOption: function(data) { // 路由详情下拉接口
    return request({
      url: '/face-route/manager/routeOption',
      method: 'post',
      data: data
    })
  }
}

export default api_list
