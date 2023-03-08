import Taro, { Component } from "@tarojs/taro";
import { View, Image, Input, Picker, Text } from "@tarojs/components";
import { AtIcon, AtFloatLayout } from "taro-ui";
import { StoreModal } from "../components";

import styles from "./closeLock.module.scss";
// import namePng from "../../assets/img/devops_repair_1.png";
import namedPng from "../../assets/img/bind_3.png";
import namePng1 from "../../assets/img/dispatch_1.png";
import namePng2 from "../../assets/img/dispatch_2.png";

class CloseLock extends Component {
  config = {
    navigationBarTitleText: "强制关锁",
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      psize: 10,
      active_index: 0,
      active_status: 1,
      actives: [
        {
          title: "骑行中",
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
      device_no: "",
      store_id: "",
      store_name: "",
      isStoreOpened: false
    };
  }

  //  导航栏的头部
  onActive = (index, val) => {
    this.setState(
      {
        active_index: index,
        active_status: val.status,
        page: 1,
        isStoreOpened: false
      },
      () => {
        this.orderList();
      }
    );
  };

  componentDidMount() {
    this.devopsStoreList();
    //  获取位置
    this.getLocation();
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
              this.orderList();
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
      device_no: e.detail.value,
      isStoreOpened: false
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
            this.orderList();
          }
        );
      }
    });
  };

  // 选择多区域
  selectStoreList = () => {
    console.log("多区域选择");
    this.setState({
      isStoreOpened: true
    });
  };
  onChangeStore = (data, isval) => {
    console.log("onChangeStore", data, isval);
    this.setState(
      {
        isStoreOpened: false,
        store_id: data.store_id,
        store_name: data.store_name,
      },
      () => {
        this.orderList();
      }
    );
  };

  // 订单列表
  orderList = () => {
    Taro.showNavigationBarLoading();
    let d = {};
    d.store_id = this.state.store_id || "";
    d.lnglat = this.state.lnglat;
    d.device_no = this.state.device_no || "";
    d.status = this.state.active_status;
    d.page = this.state.page;
    d.psize = this.state.psize;
    global.$utils.api.load("devopsorderlists", d).then(result => {
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
  };
  // 跳转详情
  repairInfo(item) {
    Taro.navigateTo({
      url: `/pages/devops/device?device_no=${item.device_no}`
    });
  }
  // 故障处理
  faultTree = (item, e) => {
    e.stopPropagation();
    let that = this;
    Taro.showModal({
      title: "提示",
      content: "是否强制关锁",
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
    d.order_id = item.order_id;
    d.device_no = item.device_no;
    d.e_address = this.state.address;
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    latitude = String(latitude).replace(/^(.*\..{4}).*$/, "$1");
    latitude = Number(latitude);
    longitude = String(longitude).replace(/^(.*\..{4}).*$/, "$1");
    longitude = Number(longitude);
    d.e_lnglat = longitude + "," + latitude;
    global.$utils.api.load("devopscloseorder", d).then(result => {
      if (result.code > 0) {
        global.$utils.toast.success(result.message);
        setTimeout(() => {
          this.setState(
            {
              page: 1
            },
            () => {
              this.orderList();
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
        this.orderList();
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
        this.orderList();
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
        <AtFloatLayout
          className={styles.AtFloatLayout_box}
          isOpened={this.state.isStoreOpened}
        >
          <StoreModal onChangeFilter={this.onChangeStore} />
        </AtFloatLayout>
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
            className={styles.fault_input_right}
            onClick={this.orderList.bind(this)}
          >
            <Image src={namedPng}></Image>
          </View>
        </View>
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
                      <View className={styles.vehicle_item}>
                        订单编号：{item.order_no}
                      </View>
                    </View>
                    <View className={styles.states}>{item.status_name}</View>
                  </View>

                  <View className={styles.scenic}>
                    <View className={styles.CloseLock_title}>
                      <View className={styles.CloseLock_title1}>
                        {item.device_name}
                      </View>
                      <View className={styles.CloseLock_title2}>
                        {item.device_no}
                      </View>
                    </View>
                    <View className={styles.addres_content}>
                      <View className={styles.addres_content_item}>
                        <View className={styles.addres_content_item_l}>
                          <Image
                            src={namePng1}
                            className={styles.addres_content_icon}
                          ></Image>
                        </View>
                        <View className={styles.addres_content_txt}>
                          {item.s_address}
                        </View>
                      </View>
                      <View className={styles.addres_content_item}>
                        <View className={styles.addres_content_item_l}>
                          <Image
                            src={namePng2}
                            className={styles.addres_content_icon}
                          ></Image>
                        </View>
                        {item.e_address ? (
                          <View className={styles.addres_content_txt}>
                            {item.e_address}
                          </View>
                        ) : (
                          <View className={styles.addres_content_txt}>--</View>
                        )}
                      </View>
                    </View>
                    <View className={styles.buttonBtn}>
                      <View className={styles.CloseLock_box}>
                        <View className={styles.CloseLock_content}>
                          <View className={styles.CloseLock_content_price}>
                            <View
                              className={styles.CloseLock_content_price_num}
                            >
                              {item.order_money}
                            </View>
                            <View
                              className={styles.CloseLock_content_price_txt}
                            >
                              元
                            </View>
                          </View>
                          <View className={styles.CloseLock_content_txt}>
                            (含骑行车费{item.order_device_money}元)
                          </View>
                        </View>
                        <View className={styles.CloseLock_content_text}>
                          <View>{item.start_time}</View>
                          <View className={styles.CloseLock_content_text_l}>
                            时长{item.time}
                          </View>
                        </View>
                      </View>
                      {item.status == 10 ? (
                        ""
                      ) : (
                        <View
                          className={styles.dispose}
                          onClick={this.faultTree.bind(this, item)}
                        >
                          强制关锁
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }
}

export default CloseLock;
