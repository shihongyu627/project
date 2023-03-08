/*
 * @Author: lvlongfei
 * @Date: 2021-09-08 15:06:20
 * @Description: 部署数据api
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
  getorganDeployDeviceRanking: function(data) {
    return request({
      url: "/bigscreen/analysis/organDeployDeviceRanking",
      method: "post",
      data: data
    });
  },
  //部署概览
  getorDeployOverview: function(data) {
    return request({
      url: "/bigscreen/analysis/deployOverview",
      method: "post",
      data: data
    });
  },
  //终端部署统计
  getorDevDeployArea: function(data) {
    return request({
      url: "/bigscreen/analysis/devDeployArea",
      method: "post",
      data: data
    });
  },
  //机构覆盖率统计
  getorYdAndYljgDeployMonth: function(data) {
    return request({
      url: "/bigscreen/analysis/ydAndYljgDeployMonth",
      method: "post",
      data: data
    });
  },
  //医院终端详情
  getorganDeployDeviceDetail: function(data) {
    return request({
      url: "/bigscreen/analysis/organDeployDeviceDetail",
      method: "post",
      data: data
    });
  },
  //筛选下拉
  getmedinsOption: function(data) {
    return request({
      url: "/bigscreen/analysis/medinsOption",
      method: "post",
      data: data
    });
  }
};

export default api_list;
