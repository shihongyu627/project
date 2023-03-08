/*
 * @Author: lvlongfei
 * @Date: 2021-09-08 15:19:20
 * @Description: 活动运营数据api
 */
import request from '@/utils/request'

var api_list = {
  getDeviceModelList: function(data) {
    return request({
      url: '/face-route/manager/deviceModelList',
      method: 'post',
      data: data
    })
  }
}

export default api_list
