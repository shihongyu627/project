import Taro, { Component } from "@tarojs/taro";
import { View, Image, Button, Text } from "@tarojs/components";

import styles from "./dispatchList.module.scss";
import namePng from "../../assets/img/devops_repair_1.png";
import namePng1 from "../../assets/img/dispatch_1.png";
import namePng2 from "../../assets/img/dispatch_2.png";

class DispatchList extends Component {
  config = {
    navigationBarTitleText: "车辆调度",
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
      page: 1,
      psize: 10,
      active_index: 0,
      actives: [
        {
          title: "调度中",
          status: 1
        },
        {
          title: "已完成",
          status: 10
        }
      ],
      list: [],
      latitude: "",
      longitude: "",
      address: "",
      type: ""
    };
  }

  //  导航栏的头部
  onActive = (index, val) => {
    this.setState(
      {
        active_index: index,
        active_status: val.status
      },
      () => {
        this.repairList(val.status);
      }
    );
  };

  componentWillMount() {}
  componentDidShow() {
    this.lodetop();
  }
  componentDidMount() {
    this.repairList();
  }
  // 订单列表
  repairList(status = "1") {
    Taro.showNavigationBarLoading();
    let d = {};
    d.dispatch_status = status || this.state.active_status;
    d.page = this.state.page;
    d.psize = this.state.psize;
    global.$utils.api.load("devopsdispatchlists", d).then(result => {
      let list = result.data.list || [];
      this.setState(
        {
          list: this.state.page === 1 ? [] : this.state.list
        },
        () => {
          this.setState(
            {
              list: this.state.page === 1 ? list : this.state.list.concat(list)
            },
            () => {
              Taro.hideNavigationBarLoading();
              Taro.stopPullDownRefresh();
            }
          );
        }
      );
    });
  }
  // 获取位置
  lodetop() {
    var that = this;
    Taro.getLocation({
      type: "gcj02",
      success(res) {
        global.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(resv) {
            let address = resv.result.address;
            that.setState({
              address: address
            });
          }
        });
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setState(
          {
            latitude: latitude,
            longitude: longitude
          },
          () => {
            // 设置定位点
          }
        );
      }
    });
  }
  // 跳转详情
  repairInfo(item) {
    Taro.navigateTo({
      url: `/pages/devops/device?device_no=${item.device_no}`
    });
  }
  // 结束调度
  faultTree = (item, e) => {
    e.stopPropagation();
    let that = this;
    Taro.showModal({
      title: "提示",
      content: "是否结束调度",
      success(res) {
        if (res.confirm) {
          that.handleConfirm(item);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  };
  handleConfirm = item => {
    let d = {};
    d.dispatch_id = item.id;
    d.device_no = item.device_no;
    d.e_address = this.state.address;
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    latitude = String(latitude).replace(/^(.*\..{4}).*$/, "$1");
    latitude = Number(latitude);
    longitude = String(longitude).replace(/^(.*\..{4}).*$/, "$1");
    longitude = Number(longitude);
    d.e_lnglat = longitude + "," + latitude;
    global.$utils.api.load("devopsenddispatch", d).then(result => {
      if (result.code > 0) {
        global.$utils.toast.success(result.message);
        setTimeout(() => {
          this.setState(
            {
              page: 1
            },
            () => {
              this.repairList();
            }
          );
        }, 800);
      } else {
        global.$utils.toast.error(result.message);
      }
    });
  };
  onPullDownRefresh() {
    this.setState(
      {
        page: 1
      },
      () => {
        this.repairList();
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
        this.repairList();
      }
    );
  }
  faultSubmit = () => {
    Taro.navigateTo({
      url: "/pages/devops/dispatch"
    });
  };
  render() {
    const { list, actives } = this.state;
    return (
      <View className={styles.page}>
        <View className={styles.fault_list}>
          {actives.map((item, index) => (
            <View
              className={[
                styles.fault_item,
                this.state.active_index == index && styles.onActive
              ]}
              key={index}
              onClick={this.onActive.bind(this, index, item)}
            >
              {item.title}
            </View>
          ))}
        </View>

        <View className={styles.serial}>
          <View className={styles.serial_item}>
            {list.map(item => (
              <View
                key={item.device_no}
                className={styles.serial_wp}
                onClick={this.repairInfo.bind(this, item)}
              >
                <View className={styles.order_ser}>
                  <View className={styles.vehicle}>
                    <View className={styles.render_l}>
                      <Image
                        src={namePng}
                        className={styles.render_icon}
                      ></Image>
                      <View className={styles.vehicle_item}>
                        {item.device_name}
                      </View>
                    </View>
                    <View className={styles.states}>
                      {item.dispatch_status_name}
                    </View>
                  </View>

                  <View className={styles.scenic}>
                    <View className={styles.addres_item}>
                      <View className={styles.addres_item_title}>
                        设备编号：
                      </View>
                      <View className={styles.addres_item_txt}>
                        {item.device_no}
                      </View>
                    </View>
                    <View className={styles.addres_item}>
                      <View className={styles.addres_item_title}>
                        运营区域：
                      </View>
                      <View className={styles.addres_item_txt}>
                        {item.store_name}
                      </View>
                    </View>
                    <View className={styles.addres_content}>
                      <View className={styles.addres_content_item}>
                        <View className={styles.addres_content_item_l}>
                          <Image
                            src={namePng1}
                            className={styles.addres_content_icon}
                          ></Image>
                          <View className={styles.addres_content_title}>
                            起始位置：
                          </View>
                        </View>
                        {item.s_address ? (
                          <View className={styles.addres_content_txt}>
                            {item.s_address}
                          </View>
                        ) : (
                          <View className={styles.addres_content_txt}>--</View>
                        )}
                      </View>
                      <View className={styles.addres_content_item}>
                        <View className={styles.addres_content_item_l}>
                          <Image
                            src={namePng2}
                            className={styles.addres_content_icon}
                          ></Image>
                          <View className={styles.addres_content_title}>
                            结束位置：
                          </View>
                        </View>
                        {item.e_address ? (
                          <View className={styles.addres_content_txt}>
                            {item.e_address}
                          </View>
                        ) : (
                          <View className={styles.addres_content_txt}>--</View>
                        )}
                      </View>
                      <View className={styles.addres_content_item}>
                        <View className={styles.addres_content_item_l}>
                          <Image
                            src={namePng1}
                            className={styles.addres_content_icon}
                          ></Image>
                          <View className={styles.addres_content_title}>
                            开始时间：
                          </View>
                        </View>
                        {item.s_time ? (
                          <View className={styles.addres_content_txt}>
                            {item.s_time}
                          </View>
                        ) : (
                          <View className={styles.addres_content_txt}>--</View>
                        )}
                      </View>
                      <View className={styles.addres_content_item}>
                        <View className={styles.addres_content_item_l}>
                          <Image
                            src={namePng1}
                            className={styles.addres_content_icon}
                          ></Image>
                          <View className={styles.addres_content_title}>
                            结束时间：
                          </View>
                        </View>
                        {item.e_time ? (
                          <View className={styles.addres_content_txt}>
                            {item.e_time}
                          </View>
                        ) : (
                          <View className={styles.addres_content_txt}>--</View>
                        )}
                      </View>
                    </View>
                    <View className={styles.buttonBtn}>
                      {item.dispatch_status == 10 ? (
                        ""
                      ) : (
                        <View
                          className={styles.dispose}
                          onClick={this.faultTree.bind(this, item)}
                        >
                          结束调度
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.fault_submit_box}>
          <View className={styles.fault_submit} onClick={this.faultSubmit}>
            车辆调度
          </View>
        </View>
      </View>
    );
  }
}

export default DispatchList;
