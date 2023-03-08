/*
 * @Author: lvlongfei
 * @Date: 2021-09-08 14:06:20
 * @Description: 激活数据api
 */
import request from "@/utils/request";

var api_list = {
  getDeviceModelList: function(data) {
    return request({
      url: "/face-route/manager/deviceModelList",
      method: "post",
      data: data
    });
  },
  //激活数据总数及凭证激活百分比（原型上部）
  getActivedOverview: function(data) {
    return request({
      url: "/bigscreen/analysis/activedOverview",
      method: "post",
      data: data
    });
  },
  //终端激活凭证占比
  getActivedPercent: function(data) {
    return request({
      url: "/bigscreen/analysis/devActivedPercent",
      method: "post",
      data: data
    });
  },
  //终端激活医保电子凭证走势
  getActivedTrend: function(data) {
    return request({
      url: "/bigscreen/analysis/devActivedTrend",
      method: "post",
      data: data
    });
  }
};

export default api_list;
