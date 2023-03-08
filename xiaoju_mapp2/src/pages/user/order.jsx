import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import styles from "./order.module.scss";

class Order extends Component {
  config = {
    navigationBarTitleText: "骑行订单",
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      psize: 10,
      active_index: 0,
      actives: [
        {
          title: "全部",
          status: ""
        },
        {
          title: "骑行中",
          status: 1
        },
        {
          title: "已完成",
          status: 10
        }
      ],
      list: []
    };
  }

  onActive = (index, val) => {
    this.setState(
      {
        active_index: index,
        active_status: val.status
      },
      () => {
        this.roderList(val.status);
      }
    );
  };

  componentDidMount() {
    this.roderList();
  }

  // 订单列表
  roderList(status = "") {
    Taro.showNavigationBarLoading();
    let d = {};
    d.order_type = 0;
    d.status = status || this.state.active_status;
    d.page = this.state.page;
    d.psize = this.state.psize;
    global.$utils.api.load("userOrderList", d).then(result => {
      let list = result.data || [];
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

  // 跳转订单详情
  justOrder(item) {
    if (item.status == 1) {
      // 骑行页面
      Taro.reLaunch({
        url: `/pages/index/index?device_no=${item.device_no}`
      });
    } else {
      Taro.navigateTo({
        url: `/pages/order/info?order_id=${item.order_id}&order_status=${item.status}`
      });
    }
  }

  onPullDownRefresh() {
    this.setState(
      {
        page: 1
      },
      () => {
        this.roderList();
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
        this.roderList();
      }
    );
  }

  render() {
    const { list, actives } = this.state;
    return (
      <View className={styles.page}>
        <View
          className={styles.fault_list}
          style='display: flex;justify-content: space-around;'
        >
          {actives.map((item, index) => (
            <View
              className={
                this.state.active_index == index
                  ? styles.fault_item_wp
                  : styles.fault_item +
                    (this.state.active_index == index ? " styles.onActive" : "")
              }
              key={index}
              onClick={this.onActive.bind(this, index, item)}
            >
              {item.title}
              <View
                className={styles.myTask_br}
                style={{
                  display: this.state.active_index == index ? "block" : "none"
                }}
              ></View>
            </View>
          ))}
        </View>
        <View className={styles.serial}>
          <View className={styles.serial_item}>
            {list.map((item, index) => (
              <View
                key={index}
                className={styles.serial_wp}
                onClick={this.justOrder.bind(this, item)}
              >
                <View className={styles.order_ser}>
                  <View className={styles.vehicle}>
                    <View className={styles.vehicle_item}>
                      订单编号 {item.order_no}
                    </View>
                    <View className={styles.states}>{item.status_name}</View>
                  </View>
                  <View className={styles.scenic}>
                    <View className={styles.times}>
                      {item.product_name}
                      <Text className={styles.testBtn}>|</Text>
                      {item.start_time}
                    </View>
                    <View className={styles.addres}>
                      <View className={styles.adresyuan}>
                        <View className={styles.yuan}></View>
                        <View
                          className={styles.addres_item}
                          style='width: 180px;word-wrap:break-word'
                        >
                          {item.s_address}
                        </View>
                      </View>
                      <View className={styles.money}>{item.order_money}元</View>
                    </View>
                    <View className={styles.adresyuan}>
                      <View className={styles.yuan_wp}></View>
                      <View
                        className={styles.addres_item}
                        style='width: 180px;word-wrap:break-word'
                      >
                        {item.e_address}
                      </View>
                    </View>
                    <View className={styles.message}>
                      <View className={styles.fodc}>
                        骑行时间：{item.time}
                      </View>
                      <View className={styles.doces}>
                        (含骑行车费{item.order_money}元)
                      </View>
                    </View>
                    <View className={styles.buttonBtn}></View>
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

export default Order;
