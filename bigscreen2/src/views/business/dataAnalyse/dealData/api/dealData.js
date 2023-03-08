/*
 * @Author: lvlongfei
 * @Date: 2021-09-08 14:15:30
 * @Description: 交易数据api
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
  //交易概览（原型上部）
  getDealOverview: function(data) {
    return request({
      url: "/bigscreen/analysis/dealOverview",
      method: "post",
      data: data
    });
  },
  //终端凭证交易趋势
  getDealTrend: function(data) {
    return request({
      url: "/bigscreen/analysis/devDealTrend",
      method: "post",
      data: data
    });
  }
};

export default api_list;
