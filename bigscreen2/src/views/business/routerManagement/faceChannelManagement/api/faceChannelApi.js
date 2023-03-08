/*
 * @Author: lvlongfei
 * @Date: 2021-05-11 11:05:28
 * @Description: 人脸渠道管理api
 */
import request from '@/utils/request'

var api_list = {
  getChannelList: function(data) { // 渠道列表
    return request({
      url: '/face-route/manager/channelList',
      method: 'post',
      data: data
    })
  },
  addChannel: function(data) { // 添加渠道
    return request({
      url: '/face-route/manager/channelAdd',
      method: 'post',
      data: data
    })
  },
  editChannel: function(data) { // 编辑渠道
    return request({
      url: '/face-route/manager/channelEdit',
      method: 'post',
      data: data
    })
  },
  delChannel: function(data) { // 删除渠道
    return request({
      url: '/face-route/manager/channelDel',
      method: 'post',
      data: data
    })
  },
  downLoadNotice: function(data) { // 业务开通通知单下载
    return request({
      url: '/face-route/manager/noticeDownload/' + data.channelId + '/' + data.pass,
      method: 'get'
    })
  }
}
export default api_list

