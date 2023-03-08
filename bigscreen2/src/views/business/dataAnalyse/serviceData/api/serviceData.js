/*
 * @Author: lvlongfei
 * @Date: 2021-09-08 15:28:18
 * @Description: 服务数据api
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
  //服务数据概览（原型上部）
  getServiceDataTop: function(data) {
    return request({
      url: "/bigscreen/analysis/serviceDataTop",
      method: "post",
      data: data
    });
  }
};

export default api_list;
