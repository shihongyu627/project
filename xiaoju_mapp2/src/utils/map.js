import Taro from "@tarojs/taro";
// 地图
const map = {
  // 搜索设备
  searchDevice: async (params = {}) => {
    try {
      let res = await global.$utils.api.load(
        "userSearchDevice",
        params,
        "get",
        {
          toast: false,
          toasterror: false,
          loading: false
        }
      );
      if (res) {
        console.log(res, "查询设备");
        let results = (res.data && res.data.results) || [];
        let mm = [];
        results.map(item => {
          let a = {};
          a.id = parseInt(item.name);
          a.latitude = item.location.latitude;
          a.longitude = item.location.longitude;
          a.width = "48px";
          a.height = "48px";
          a.title = item.name;
          a.ariaLabel = item.name;
          a.iconPath = require("../assets/icons/bicycle.png");
          a.param = {
            device_no: item.name,
            lng: item.location.longitude,
            lat: item.location.latitude,
            distance: item.location.distance
          };
          mm.push(a);
        });
        console.log("searchDevice mm", mm);
        return mm;
      } else {
        return [];
      }
    } catch (error) {
      console.log("map searchDevice error", error);
      // global.$utils.toast.error('查询车辆错误')
      return [];
    }
  },

  searchDeviceName: async (params = {}) => {
    try {
      let res = await global.$utils.api.load(
        "userSearchDevice",
        params,
        "get",
        {
          toast: false,
          toasterror: false,
          loading: false
        }
      );
      if (res) {
        console.log(res, "查询设备");
        let results = (res.data && res.data.results) || [];
        let mm = [];
        results.map(item => {
          let a = {};
          // a.id= item.name + ',' + item.location.latitude + ',' + item.location.longitude + ',' + item.location.distance
          a.id = parseInt(item.name);
          a.latitude = item.location.latitude;
          a.longitude = item.location.longitude;
          a.width = "48px";
          a.height = "48px";
          // a.title = item.name // 骑行界面不需要显示设备号
          a.ariaLabel = item.name;
          (a.iconPath = require("../assets/icons/bicycle.png")),
            (a.param = {
              device_no: item.name,
              lng: item.location.longitude,
              lat: item.location.latitude,
              distance: item.location.distance
            });
          // a.callout= {
          //   content: '车辆编号：' + item.location.latitude + '\r\n' + '车辆名称：' + item.location.longitude,
          //   bgColor: "#fff",
          //   padding: "5px",
          //   borderRadius: "2px",
          //   borderWidth: "1px",
          //   borderColor: "#07c160",
          //   marginBottom: "10px",
          // }
          mm.push(a);
        });
        console.log("searchDevice mm", mm);
        return mm;
      } else {
        return [];
      }
    } catch (error) {
      console.log("map searchDevice error", error);
      // global.$utils.toast.error('查询车辆错误')
      return [];
    }
  },
  // 通过标注点集合获取标注点信息
  getDeviceInfo(id, mm = []) {
    let info = {};
    mm.map(item => {
      if (item.id == id) {
        info = item;
      }
    });
    console.log("getDeviceInfo", info);
    return info;
  }
};
export default map;
