/*
 * @Author: lvlongfei
 * @Date: 2021-05-13 14:31:10
 * @Description: 日志查询api
 */
import request from '@/utils/request'

var api_list = {
  getlogList: function(data) { // 日志审计列表
    return request({
      url: '/face-route/manager/logList',
      method: 'post',
      data: data
    })
  },
  selChannel: function() { // 渠道下拉
    return request({
      url: '/face-route/manager/channel',
      method: 'get'
    })
  },
  selDevice: function() { // 设备下拉
    return request({
      url: '/face-route/manager/deviceModel',
      method: 'get'
    })
  },
  selAlgorithm: function() { // 算法下拉
    return request({
      url: '/face-route/manager/algorithm',
      method: 'get'
    })
  },
  selBusinessType: function() { // 业务类型下拉
    return request({
      url: '/face-route/manager/businessType',
      method: 'get'
    })
  },
  selConfList: function(data) { // 下拉通用接口
    return request({
      url: '/face-route/manager/conditionlist',
      method: 'post',
      data: data
    })
  }
}

export default api_list
