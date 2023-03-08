import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Map,
  Image,
  Button,
  CoverView,
  CoverImage,
  Text,
  Picker,
  Input
} from "@tarojs/components";
import { AtFloatLayout, AtIcon } from "taro-ui";

import styles from "./map.module.scss";
import namedPng from "../../assets/img/map_list.png";
import namedPng1 from "../../assets/img/bind_3.png";
import mapSearchPng from "../../assets/img/mapSearch.png";
import selectPng from "../../assets/img/select.png";
import { FilterModal, StoreModal } from "../components";

class Vehicle extends Component {
  config = {
    navigationBarTitleText: "车辆分布"
  };

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      lng: "",
      lat: "",
      isOpened: false,
      devInfo: {},
      device_no: "",
      store_id: "",
      store_name: "",
      ploygons: [],
      includePoints: [],
      device_count_sum: "",
      device_count_online_sum: "",
      device_count_offline_sum: "",
      device_count_outarea_sum: "",
      device1_count_online_sum: "",
      device1_count_offline_sum: "",
      device2_count_online_sum: "",
      device2_count_offline_sum: "",
      isFilterOpened: false,
      isStoreOpened: false,
      isInput: false,
      starData: {},
      filterData: {},
      lineTag: "" // 圈选中标签
    };
  }
  componentDidMount() {
    this.devopsStoreList();
    this.getLocation();
  }
  componentDidShow() {
    this.setState({
      isOpened: false,
      isFilterOpened: false,
      isStoreOpened: false
    });
  }

  devopsStoreList = () => {
    Taro.showNavigationBarLoading();
    let d = {};
    global.$utils.api.load("devopsopstorelists", d).then(result => {
      if (result.code > 0) {
        let datas = result.data || [];
        if (datas.length > 0) {
          // 全部门店
          let store_id_arr = [];
          datas.map(item => {
            store_id_arr.push(item.store_id);
          });
          this.setState(
            {
              store_id: store_id_arr.join(",")
            },
            () => {
              this.devopsSimpleInfo();
            }
          );
        }
        Taro.hideNavigationBarLoading();
      }
    });
  };

  //运营人员的常规数据统计
  devopsSimpleInfo = () => {
    // 获取骑行区域和停车区域
    this.storeRunStopArea(this.state.store_id);
    let dd = {};
    dd.store_id = this.state.store_id;
    if (this.state.lng && this.state.lat) {
      dd.lnglat = this.state.lng + "," + this.state.lat;
    }
    dd.page = 1;
    dd.psize = 1000;
    dd.scene = "devops_list";
    this.setState(
      {
        starData: dd
      },
      () => {
        this.getStoreDeviceList();
      }
    );
    // let q = {};
    // q.store_id = this.state.store_id;
    // global.$utils.api.load("devopsopsimpleinfo", q).then(res => {
    //   console.log(res);
    //   if (res.code > 0) {
    //     let totalList = res.data.sum_list || [];
    //     let device_count_sum = "";
    //     let device_count_online_sum = "";
    //     let device_count_offline_sum = "";
    //     let device_count_outarea_sum = "";
    //     totalList.map(item => {
    //       if (item.key == "device_count_sum") {
    //         device_count_sum = item.value;
    //       }
    //       if (item.key == "device_count_online_sum") {
    //         device_count_online_sum = item.value;
    //       }
    //       if (item.key == "device_count_offline_sum") {
    //         device_count_offline_sum = item.value;
    //       }
    //       if (item.key == "device_count_outarea_sum") {
    //         device_count_outarea_sum = item.value;
    //       }
    //     });
    //     this.setState({
    //       device_count_sum,
    //       device_count_online_sum,
    //       device_count_offline_sum,
    //       device_count_outarea_sum
    //     });
    //   }
    // });
  };

  // 获取骑行区域和停车区域
  storeRunStopArea = store_id => {
    let q = {};
    q.store_id = store_id;
    global.$utils.api.load("devopsopstoreArealists", q).then(res => {
      console.log(res);
      if (res.code > 0) {
        // 绘制骑行区域
        let runAreaList = res.data.run_area_list || [];
        let ploygons_run = [];
        runAreaList.map(item => {
          let points = [];
          item.points_arr.map(vv => {
            let vv_arr = vv.split(",");
            points.push({
              longitude: vv_arr[0],
              latitude: vv_arr[1]
            });
          });
          ploygons_run.push({
            points,
            zIndex: 1,
            strokeColor: "#00800040",
            fillColor: "#00800040"
          });
        });

        // 绘制停车区域
        let stopAreaList = res.data.stop_area_list || [];
        let ploygons_stop = [];
        stopAreaList.map(item => {
          let points = [];
          item.points_arr.map(vv => {
            let vv_arr = vv.split(",");
            points.push({
              longitude: vv_arr[0],
              latitude: vv_arr[1]
            });
          });
          ploygons_stop.push({
            points,
            zIndex: 2,
            strokeColor: "#FF450040",
            fillColor: "#FF450040"
          });
        });

        // 绘制骑行区域和停车区域
        let ploygons = [...ploygons_run, ...ploygons_stop];
        console.log("ploygons", ploygons);
        this.setState({
          ploygons
        });
      }
    });
  };

  // 获取区域的设备列表
  getStoreDeviceList = async (scene = "", query = {}) => {
    // 设置定位点
    let mm = await this.searchDevice(query);
    this.setState({
      markers: mm
    });
    // 搜索设备号，则地图跳转到该点
    if (scene == "search_device_no") {
      // 取第一个值的经纬度，并设置地图中心点
      if (mm.length > 0) {
        let xx = mm[0];
        this.setState({
          includePoints: [
            {
              longitude: xx.longitude,
              latitude: xx.latitude
            }
          ]
        });
      }
    } else {
      // 可视范围-全部设备
      let includePoints = [];
      if (mm) {
        mm.map(item => {
          if (item.longitude > 0 && item.latitude > 0) {
            includePoints.push({
              longitude: item.longitude,
              latitude: item.latitude
            });
          }
        });
        this.setState({
          includePoints: includePoints
        });
      }
    }
  };

  // 拖动
  onMove = async e => {
    this.setState({
      isOpened: false,
      isFilterOpened: false,
      isStoreOpened: false
    });
    // eslint-disable-next-line no-unused-vars
    let that = this;
    if (e.type == "end" && (e.causedBy == "scale" || e.causedBy == "drag")) {
      console.log(e);
      this.mapCtx = Taro.createMapContext("map4select");
      this.mapCtx.getCenterLocation({
        type: "gcj02",
        success: async res => {
          let latitude = res.latitude;
          let longitude = res.longitude;
          latitude = String(latitude).replace(/^(.*\..{6}).*$/, "$1");
          latitude = Number(latitude);
          longitude = String(longitude).replace(/^(.*\..{6}).*$/, "$1");
          longitude = Number(longitude);
          console.log("onMove lnglat:", longitude, latitude);
          // let q = {};
          // q.style = 2;
          // q.center = latitude + "," + longitude;
          // q.radius = 5000;
          // q.lnglat = longitude + "," + latitude;
          // q.page = this.state.page;
          // q.psize = this.state.psize;
          // q.scene = "devops_map";
          // let mm = await this.searchDevice(q);
          // that.setState({
          //   markers: mm
          // });
        }
      });
    }
  };

  // 获取位置
  getLocation = async () => {
    let that = this;
    // 回到原来位置
    let mpCtx = Taro.createMapContext("map4select");
    mpCtx.moveToLocation();
    Taro.getLocation({
      type: "gcj02",
      success: async res => {
        const lng = res.longitude;
        const lat = res.latitude;
        console.log(lng, lat);
        that.setState({
          lng: lng,
          lat: lat
        });
        // // 设置定位点
        // let q = {};
        // q.style = 2;
        // q.center = lat + "," + lng;
        // q.lnglat = lng + "," + lat;
        // q.radius = 5000;
        // q.page = this.state.page;
        // q.psize = this.state.psize;
        // q.scene = "devops_map";
        // let mm = await this.searchDevice(q);
        // that.setState({
        //   markers: mm
        // });
      }
    });
  };

  // 搜索设备
  searchDevice = async (query = {}) => {
    try {
      let obj = {
        ...this.state.starData,
        ...this.state.filterData,
        device_no: this.state.device_no,
        store_id: this.state.store_id,
        ...query
      };
      let res = await global.$utils.api.load(
        "devopsdeviceListsBylnglat",
        obj,
        "post",
        {
          toast: false,
          toasterror: false,
          loading: false
        }
      );
      if (res) {
        console.log(res, "查询设备");
        let datas = res.data || {};
        let results = (res.data && res.data.list) || [];
        this.setState({
          device_count_sum: datas.device_count_sum,
          device_count_online_sum: datas.device_count_online_sum,
          device_count_offline_sum: datas.device_count_offline_sum,
          device_count_outarea_sum: datas.device_count_outarea_sum,
          device1_count_online_sum: datas.device1_count_online_sum,
          device1_count_offline_sum: datas.device1_count_offline_sum,
          device2_count_online_sum: datas.device2_count_online_sum,
          device2_count_offline_sum: datas.device2_count_offline_sum
        });
        let mm = [];
        results.map(item => {
          let a = {};
          a.id = parseInt(item.device_no);
          a.latitude = item.lat;
          a.longitude = item.lng;
          a.width = "42px";
          a.height = "42px";
          a.title = item.device_no;
          a.ariaLabel = item.device_no;
          a.iconPath = require("../../assets/icons/car_type1.png");
          if (item.type == 1) {
            a.iconPath = require("../../assets/icons/car_type1.png");
            if (item.online_status == 0) {
              a.iconPath = require("../../assets/icons/car_type1_no.png");
            }
          }
          if (item.type == 2) {
            a.iconPath = require("../../assets/icons/car_type2.png");
            if (item.online_status == 0) {
              a.iconPath = require("../../assets/icons/car_type2_no.png");
            }
          }
          a.param = {
            device_no: item.device_no,
            lng: item.lng,
            lat: item.lat,
            distance: item.distance
          };
          mm.push(a);
        });
        return mm;
      } else {
        return [];
      }
    } catch (error) {
      console.log("map searchDevice error", error);
      // global.$utils.toast.error('查询车辆错误')
      return [];
    }
  };

  markerClick = e => {
    console.log("markerClick", e);
    this.getDeviceInfo(e.detail.markerId);
    // global.$utils.url.push({
    //   url: "/pages/devops/device?" + "device_no=" + e.detail.markerId
    // });
  };
  getDeviceInfo = device_no => {
    let d = {};
    d.device_no = device_no;
    global.$utils.api.load("devopsdeviceinfo", d).then(result => {
      if (result.code > 0) {
        let devInfo = result.data || {};
        if (devInfo.tags) {
          let tagsArrs = devInfo.tags || "";
          devInfo.tagArr = tagsArrs.split(",");
        } else {
          devInfo.tagArr = [];
        }
        this.setState({
          isOpened: true,
          isFilterOpened: false,
          isStoreOpened: false,
          devInfo: devInfo
        });
      }
    });
  };

  //列表展示
  getVehicle = () => {
    Taro.navigateTo({
      url: "/pages/devops/vehicle"
    });
  };
  //查看车辆详情
  handleDetails = device_no => {
    console.log("查看详情");
    global.$utils.url.push({
      url: "/pages/devops/device?" + "device_no=" + device_no
    });
  };
  handleClose = () => {
    this.setState({
      isOpened: false,
      isFilterOpened: false,
      isStoreOpened: false
    });
  };
  //筛选
  getSelect = () => {
    console.log("筛选");
    this.setState({
      isFilterOpened: true,
      isStoreOpened: false,
      isOpened: false
    });
  };
  onChangeFilter = (data, isval) => {
    console.log("onChangeFilter", data, isval);
    this.setState(
      {
        isFilterOpened: false,
        isStoreOpened: false,
        isOpened: false,
        filterData: data
      },
      () => {
        this.getStoreDeviceList();
      }
    );
  };

  // 选择多区域
  selectStoreList = () => {
    console.log("多区域选择");
    this.setState({
      isStoreOpened: true,
      isFilterOpened: false,
      isOpened: false
    });
  };
  onChangeStore = (data, isval) => {
    console.log("onChangeStore", data, isval);
    this.setState(
      {
        isStoreOpened: false,
        isFilterOpened: false,
        isOpened: false,
        store_id: data.store_id,
        store_name: data.store_name
      },
      () => {
        this.devopsSimpleInfo();
      }
    );
  };

  handleContentChange = e => {
    console.log(e.detail.value, "输入车辆编码");
    this.setState({
      device_no: e.detail.value
    });
  };

  onClickCircle = (tag = "") => {
    console.log("onClickCircle", tag);
    let { lineTag } = this.state;
    this.setState({
      isOpened: false,
      isFilterOpened: false,
      isStoreOpened: false
    });
    if (lineTag == tag) {
      this.setState({
        lineTag: ""
      });
      this.getStoreDeviceList("", {});
      return;
    } else {
      this.setState({
        lineTag: tag
      });
    }
    let query = {};
    switch (tag) {
      case "device1_online":
        query = {
          type: 1,
          online_status: 1
        };
        break;
      case "device1_offline":
        query = {
          type: 1,
          online_status: "0"
        };
        break;
      case "device2_online":
        query = {
          type: 2,
          online_status: 1
        };
        break;
      case "device2_offline":
        query = {
          type: 2,
          online_status: "0"
        };
        break;
      default:
        break;
    }
    this.getStoreDeviceList("", query);
  };

  render() {
    let {
      devInfo,
      device_count_sum,
      device_count_online_sum,
      device_count_offline_sum,
      device_count_outarea_sum,
      device1_count_online_sum,
      device1_count_offline_sum,
      device2_count_online_sum,
      device2_count_offline_sum,
      ploygons,
      lineTag
    } = this.state;
    return (
      <View className={styles.page}>
        <Map
          id='map4select'
          className={styles.map}
          show-location
          longitude={this.state.lng}
          latitude={this.state.lat}
          polygons={ploygons}
          includePoints={this.state.includePoints}
          markers={this.state.markers}
          onMarkertap={this.markerClick.bind(this)}
          style='position:fixed;top:0;left:0;right:0;bottom:0;height:100%'
          onRegionChange={this.onMove}
        ></Map>
        <View className={styles.selectAddress}>
          <View
            className={styles.item_box}
            onClick={() => {
              this.selectStoreList();
            }}
          >
            <View className={styles.name_txt}>选择区域</View>
            <View className={styles.picker_icon}>
              {this.state.store_name && (
                <View className={styles.addressName}>
                  {this.state.store_name}
                </View>
              )}
              {!this.state.store_name && (
                <View className={styles.addressMsg}>请选择</View>
              )}
              <AtIcon
                className={styles.address_right}
                value='chevron-right'
                size='15'
                color='#000'
              ></AtIcon>
            </View>
          </View>
        </View>
        {/* <CoverView className={styles.icons}>
          <cover-image
            src={require("../../assets/img/weiss.png")}
          ></cover-image>
        </CoverView> */}

        <CoverView className={styles.tool_box}>
          <CoverImage
            src={require("../../assets/icons/i_tool_1.png")}
            className={styles.icon}
            onClick={this.getLocation.bind(this)}
          />
        </CoverView>
        <CoverView className={styles.mapSearchPng}>
          <CoverImage
            src={mapSearchPng}
            className={styles.icon}
            onClick={() => {
              this.setState({
                isInput: !this.state.isInput
              });
            }}
          />
        </CoverView>
        <CoverView className={styles.tool_boxs}>
          <CoverImage
            src={namedPng}
            className={styles.icon}
            onClick={this.getVehicle.bind(this)}
          />
        </CoverView>
        <CoverView className={styles.selectPng}>
          <CoverImage
            src={selectPng}
            className={styles.icon}
            onClick={this.getSelect.bind(this)}
          />
        </CoverView>
        <AtFloatLayout
          className={styles.AtFloatLayout_box}
          isOpened={this.state.isOpened}
          // title="这是个标题"
          // onClose={this.handleClose.bind(this)}
        >
          <View className={styles.map_topWp}>
            <View className={styles.map_title}>{devInfo.name}</View>
            <View
              className={styles.map_details}
              onClick={this.handleDetails.bind(this, devInfo.device_no)}
            >
              查看车辆详情
            </View>
          </View>
          <View className={styles.Vehicle_item}>
            <View className={styles.Vehicle_item_txt}>
              车辆编号： {devInfo.device_no}
            </View>
            <View className={styles.Vehicle_item_txt}>
              产品名称： {devInfo.product_name}
            </View>
          </View>
          <View className={styles.Vehicle_item}>
            <View className={styles.Vehicle_item_txt}>
              电源电压： {devInfo.battery_vv || ""}
            </View>
            <View className={styles.Vehicle_item_txt}>
              电源电量： {parseInt(devInfo.battery_r_value)}%
            </View>
          </View>
          <View className={styles.Vehicle_item}>
            <View className={styles.Vehicle_item_txt}>
              车锁状态： {devInfo.lock_status_name}
            </View>
            <View className={styles.Vehicle_item_txt}>
              车辆状态： {devInfo.online_status_name}
            </View>
          </View>
          <View className={styles.Vehicle_item}>
            <View className={styles.Vehicle_item_txt} style={{ width: "100%" }}>
              运营区域： {devInfo.store_name || ""}
            </View>
          </View>
          <View className={styles.Vehicle_tgb}>
            {devInfo.tagArr.map(item => (
              <View className={styles.Vehicle_tgb_item}>{item}</View>
            ))}
          </View>
          <View className={styles.Vehicle_content}>
            <View className={styles.Vehicle_content_top}>
              <View className={styles.Vehicle_content_br}></View>
              <View className={styles.Vehicle_content_title}>
                末次定位 {devInfo.location_time}
                <CoverView className={styles.kong}></CoverView>
              </View>
            </View>
            <View className={styles.Vehicle_content_address}>
              {devInfo.address}
            </View>
          </View>
        </AtFloatLayout>
        {this.state.isInput ? (
          <View className={styles.fault_input}>
            <View className={styles.inputsdd}>
              <Input
                type='number'
                className='input'
                value={this.state.device_no}
                placeholder='请输入车辆编号'
                confirmType='done'
                onInput={this.handleContentChange.bind(this)}
              />
            </View>
            <View
              className={styles.fault_input_right}
              onClick={() => {
                this.getStoreDeviceList("search_device_no");
              }}
            >
              <Image src={namedPng1}></Image>
            </View>
          </View>
        ) : null}
        <AtFloatLayout
          className={styles.AtFloatLayout_box_fliter}
          isOpened={this.state.isFilterOpened}
        >
          <FilterModal onChangeFilter={this.onChangeFilter} />
        </AtFloatLayout>
        <AtFloatLayout
          className={styles.AtFloatLayout_box}
          isOpened={this.state.isStoreOpened}
        >
          <StoreModal onChangeFilter={this.onChangeStore} />
        </AtFloatLayout>
        <View className={styles.simpleinfo_Box}>
          <View
            className={styles.simpleinfo_icon}
            style={{
              background: lineTag == "device1_online" ? "#fff" : "#41b59a",
              border: "2px solid #41b59a"
            }}
            onClick={this.onClickCircle.bind(this, "device1_online")}
          >
            <View className={styles.simpleinfo_num}>
              {device1_count_online_sum || 0}
            </View>
          </View>
          <View
            className={styles.simpleinfo_icon}
            style={{
              background: lineTag == "device2_online" ? "#fff" : "#fb9924",
              border: "2px solid #fb9924"
            }}
            onClick={this.onClickCircle.bind(this, "device2_online")}
          >
            <View className={styles.simpleinfo_num}>
              {device2_count_online_sum || 0}
            </View>
          </View>
          <View
            className={styles.simpleinfo_icon}
            style={{
              background: lineTag == "device1_offline" ? "#fff" : "#707070",
              border: "2px solid #41b59a"
            }}
            onClick={this.onClickCircle.bind(this, "device1_offline")}
          >
            <View className={styles.simpleinfo_num}>
              {device1_count_offline_sum || 0}
            </View>
          </View>
          <View
            className={styles.simpleinfo_icon}
            style={{
              background: lineTag == "device2_offline" ? "#fff" : "#707070",
              border: "2px solid #fb9924"
            }}
            onClick={this.onClickCircle.bind(this, "device2_offline")}
          >
            <View className={styles.simpleinfo_num}>
              {device2_count_offline_sum || 0}
            </View>
          </View>
        </View>
        <View className={styles.simpleinfo_wp}>
          <View>总车数：{device_count_sum || 0}</View>
          <View>在线车：{device_count_online_sum || 0}</View>
          <View>离线车：{device_count_offline_sum || 0}</View>
          <View>超区车：{device_count_outarea_sum || 0}</View>
        </View>
      </View>
    );
  }
}

export default Vehicle;
