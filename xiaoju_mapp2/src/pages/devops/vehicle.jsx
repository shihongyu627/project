import Taro, { Component } from "@tarojs/taro";
import { View, Image, Input, Picker, Text } from "@tarojs/components";
import { AtIcon, AtFloatLayout } from "taro-ui";
import { connect } from "@tarojs/redux";
import styles from "./vehicle.module.scss";
import namePng from "../../assets/img/vihice_1.png";
import namedPng from "../../assets/img/bind_3.png";
import filterPng from "../../assets/img/filter.png";
import { FilterModal, StoreModal } from "../components";

class Vehicle extends Component {
  config = {
    navigationBarTitleText: "监控列表",
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      psize: 10,
      lnglat: "",
      device_no: "",
      store_id: "",
      store_name: "",
      list: [
        // {
        //   title: "小驹景区电动观光车",
        //   device_no: "300015",
        //   name: "009059432",
        //   shop_name: "观光车",
        //   dianliang: "59",
        //   GPS: "3",
        //   status_name: "在线",
        //   address: "广西壮族自治区柳州市兴柳路区柳州市兴柳路",
        //   biaoji: "故障车,调度车,暂停使用"
        // }
      ],
      device_count_sum: "",
      device_count_online_sum: "",
      device_count_offline_sum: "",
      device_count_battery0_sum: "",
      isFilterOpened: false,
      isStoreOpened: false,
      filterData: {},
      query: {},
      lineTag: "" // 圈选中标签
    };
  }

  componentDidMount() {
    this.devopsStoreList();
    //  获取位置
    // this.getLocation();
  }

  // 检查权限
  checkAuth = auth => {
    let auth_ll = this.props.devops.auth_info || [];
    for (let index = 0; index < auth_ll.length; index++) {
      const element = auth_ll[index];
      if (auth == element) {
        return true;
      }
    }
    return false;
  };

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
              this.getDeviceList();
            }
          );
        }
        Taro.hideNavigationBarLoading();
      }
    });
  };

  //输入编码
  handleErweimaChange = e => {
    console.log(e.detail.value, "输入车辆编码");
    this.setState({
      isFilterOpened: false,
      isStoreOpened: false,
      device_no: e.detail.value
    });
  };

  // 获取位置
  getLocation = async () => {
    let that = this;
    Taro.getLocation({
      type: "gcj02",
      success: async res => {
        // 当前位置经纬度
        const lng = res.longitude;
        const lat = res.latitude;
        console.log(lng, lat, "经纬度");
        const lnglat = lng + "," + lat;
        console.log(lnglat, res, "123456");
        that.setState(
          {
            lng: lng,
            lat: lat,
            lnglat: lnglat
          },
          () => {
            this.getDeviceList();
          }
        );
      }
    });
  };

  //运营人员的常规数据统计
  devopsSimpleInfo(param = {}) {
    let q = param || {};
    q.store_id = this.state.store_id;
    global.$utils.api.load("devopsopsimpleinfo", q, "post").then(res => {
      console.log(res);
      if (res.code > 0) {
        let totalList = res.data.sum_list || [];
        let device_count_sum = "";
        let device_count_online_sum = "";
        let device_count_offline_sum = "";
        let device_count_battery0_sum = "";
        totalList.map(item => {
          if (item.key == "device_count_sum") {
            device_count_sum = item.value;
          }
          if (item.key == "device_count_online_sum") {
            device_count_online_sum = item.value;
          }
          if (item.key == "device_count_offline_sum") {
            device_count_offline_sum = item.value;
          }
          if (item.key == "device_count_battery0_sum") {
            device_count_battery0_sum = item.value;
          }
        });
        this.setState({
          device_count_sum,
          device_count_online_sum,
          device_count_offline_sum,
          device_count_battery0_sum
        });
      } else {
        global.$utils.toast.error(res.message);
      }
    });
  }
  // 设备列表
  getDeviceList() {
    Taro.showNavigationBarLoading();
    let d = {};
    d.store_id = this.state.store_id || "";
    d.lnglat = this.state.lnglat;
    d.device_no = this.state.device_no || "";
    d.page = this.state.page;
    d.psize = this.state.psize;
    d.scene = "devops_list";
    let dd = { ...d, ...this.state.filterData, ...(this.state.query || {}) };
    global.$utils.api
      .load("devopsdeviceListsBylnglat", dd, "post")
      .then(result => {
        let datas = result.data || [];
        if (datas) {
          let list = datas.list || [];
          list.map(item => {
            if (item.tags) {
              let tagsArrs = item.tags || "";
              item.tagArr = tagsArrs.split(",");
            } else {
              item.tagArr = [];
            }
          });
          this.setState(
            {
              list: this.state.page === 1 ? [] : this.state.list,
              device_count_sum: datas.device_count_sum,
              device_count_online_sum: datas.device_count_online_sum,
              device_count_offline_sum: datas.device_count_offline_sum,
              device_count_battery0_sum: datas.device_count_battery0_sum,
              device1_count_online_sum: datas.device1_count_online_sum,
              device1_count_offline_sum: datas.device1_count_offline_sum,
              device2_count_online_sum: datas.device2_count_online_sum,
              device2_count_offline_sum: datas.device2_count_offline_sum
            },
            () => {
              this.setState(
                {
                  list:
                    this.state.page === 1 ? list : this.state.list.concat(list)
                },
                () => {
                  Taro.hideNavigationBarLoading();
                  Taro.stopPullDownRefresh();
                }
              );
            }
          );
        }
      });
  }
  // 跳转详情
  vehicleBtn(item) {
    Taro.navigateTo({
      url: `/pages/devops/device?device_no=${item.device_no}`
    });
  }
  // 故障处理
  faultTree = (item, e) => {
    e.stopPropagation();
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));

    Taro.navigateTo({
      url: `/pages/repair/index?device_no=${item.device_no}&repair_id=${item.id}`
    });
  };
  onPullDownRefresh() {
    this.setState(
      {
        page: 1
      },
      () => {
        this.getDeviceList();
      }
    );
    setTimeout(() => {
      Taro.hideNavigationBarLoading();
      Taro.stopPullDownRefresh();
    }, 3000);
  }

  onReachBottom() {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.getDeviceList();
      }
    );
  }
  // 条件筛选
  getSelect = () => {
    console.log("条件筛选");
    this.setState({
      isFilterOpened: true,
      isStoreOpened: false
    });
  };
  onChangeFilter = (data, isval) => {
    console.log("onChangeFilter", data, isval);
    this.setState(
      {
        isFilterOpened: false,
        isStoreOpened: false,
        filterData: data
      },
      () => {
        this.onPullDownRefresh();
      }
    );
  };

  // 选择多区域
  selectStoreList = () => {
    console.log("多区域选择");
    this.setState({
      isStoreOpened: true,
      isFilterOpened: false
    });
  };
  onChangeStore = (data, isval) => {
    console.log("onChangeStore", data, isval);
    this.setState(
      {
        isFilterOpened: false,
        isStoreOpened: false,
        store_id: data.store_id,
        store_name: data.store_name
      },
      () => {
        this.onPullDownRefresh();
      }
    );
  };

  onClickCircle = (tag = "") => {
    console.log("onClickCircle", tag);
    let { lineTag } = this.state;
    this.setState({
      isFilterOpened: false,
      isStoreOpened: false
    });
    if (lineTag == tag) {
      this.setState({
        lineTag: ""
      });
      this.setState({
        query: {}
      });
      this.onPullDownRefresh();
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
    this.setState({ query });
    this.onPullDownRefresh();
  };
  render() {
    const {
      list,
      device_count_sum,
      device_count_online_sum,
      device_count_offline_sum,
      device_count_battery0_sum,
      device1_count_online_sum,
      device1_count_offline_sum,
      device2_count_online_sum,
      device2_count_offline_sum,
      lineTag
    } = this.state;
    return (
      <View className={styles.page}>
        <View className={styles.selectAddress}>
          <View
            className={styles.item_box}
            onClick={() => {
              this.selectStoreList();
            }}
          >
            <Text className={styles.name_txt}>选择区域</Text>
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
        <View className={styles.fault_input}>
          <View className={styles.inputsdd}>
            <Input
              type='number'
              className='input'
              value={this.state.device_no}
              placeholder='请输入车辆编号'
              confirmType='done'
              onInput={this.handleErweimaChange.bind(this)}
            />
          </View>
          <View
            className={styles.fault_input_left}
            onClick={this.getDeviceList.bind(this)}
          >
            <Image src={namedPng}></Image>
          </View>
          <View
            className={styles.fault_input_right}
            onClick={this.getSelect.bind(this)}
          >
            <Image src={filterPng}></Image>
          </View>
        </View>
        {list.map((item, index) => (
          <View
            key={index}
            className={styles.Vehicle_box}
            onClick={this.vehicleBtn.bind(this, item)}
          >
            <View className={styles.Vehicle_top}>
              <View className={styles.Vehicle_top_title}>{item.name}</View>

              {this.checkAuth("/devops/device/upfeedback") ? (
                <View
                  className={styles.Vehicle_top_l}
                  onClick={this.faultTree.bind(this, item)}
                >
                  <Image
                    src={namePng}
                    className={styles.Vehicle_top_img}
                  ></Image>
                  <View className={styles.Vehicle_top_txt}>故障上报</View>
                </View>
              ) : null}
            </View>
            <View className={styles.Vehicle_item}>
              <View className={styles.Vehicle_item_txt}>
                车辆编号： {item.device_no}
              </View>
              <View className={styles.Vehicle_item_txt}>
                产品名称： {item.product_name}
              </View>
            </View>
            <View className={styles.Vehicle_item}>
              <View className={styles.Vehicle_item_txt}>
                电源电压： {item.battery_vv || ""}
              </View>
              <View className={styles.Vehicle_item_txt}>
                电源电量：
                {parseFloat(item.battery_rr) > 0 ? (
                  item.battery_rr
                ) : (
                  <Text className={styles.Vehicle_item_txt_red}>
                    {item.battery_rr}
                  </Text>
                )}
              </View>
            </View>
            <View className={styles.Vehicle_item}>
              <View className={styles.Vehicle_item_txt}>
                车锁状态：
                {item.lock_status == 0 ? (
                  item.lock_status_name
                ) : (
                  <Text className={styles.Vehicle_item_txt_green}>
                    {item.lock_status_name}
                  </Text>
                )}
              </View>
              <View className={styles.Vehicle_item_txt}>
                车辆状态：
                {item.online_status == 1 ? (
                  item.online_status_name
                ) : (
                  <Text className={styles.Vehicle_item_txt_red}>
                    {item.online_status_name}
                  </Text>
                )}
              </View>
            </View>
            <View
              className={styles.Vehicle_item}
              style={{ "justify-content": "flex-start" }}
            >
              <View
                className={styles.Vehicle_item_txt}
                style={{ width: "100%" }}
              >
                运营区域： {item.store_name || ""}
              </View>
            </View>
            <View className={styles.Vehicle_tgb}>
              {item.tagArr.map((it, key) => (
                <View key={key} className={styles.Vehicle_tgb_item}>
                  {it}
                </View>
              ))}
            </View>
            <View className={styles.Vehicle_content}>
              <View className={styles.Vehicle_content_top}>
                <View className={styles.Vehicle_content_br}></View>
                <View className={styles.Vehicle_content_title}>
                  末次定位 {item.location_time}{" "}
                  {item.distance > 0 ? "(" + item.distance + "m)" : ""}
                  <View className={styles.kong}></View>
                </View>
              </View>
              <View className={styles.Vehicle_content_address}>
                {item.address}
              </View>
            </View>
          </View>
        ))}
        <AtFloatLayout
          className={styles.AtFloatLayout_box}
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
          <View>零电车：{device_count_battery0_sum || 0}</View>
        </View>
      </View>
    );
  }
}

const mapStoreToProps = store => ({
  user: store.user,
  devops: store.devops,
  config: store.config
});
const mapDispatchToProps = dispatch => ({
  dispatch: dispatch
});
export default connect(mapStoreToProps, mapDispatchToProps)(Vehicle);
