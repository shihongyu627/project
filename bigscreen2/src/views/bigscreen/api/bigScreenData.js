/*
 * @Author: lvlongfei
 * @Date: 2021-09-11 11:06:18
 * @Description: 大屏页面api
 */
import request from '@/utils/request'

var api_list = {
  getdayDataInfo: function(data) {
    return request({
      url: '/bigscreen/bigscreenMonitor/dayDataInfo',
      method: 'post',
      data: data
    })
  },
  getconstantlyInfo: function(data) {
    return request({
      url: '/bigscreen/bigscreenMonitor/constantlyInfo',
      method: 'post',
      data: data
    })
  },
  getbrokenLineTrend: function(data) {
    return request({
      url: '/bigscreen/bigscreenMonitor/brokenLineTrend',
      method: 'get',
      data: data
    })
  }
}

export default api_list
