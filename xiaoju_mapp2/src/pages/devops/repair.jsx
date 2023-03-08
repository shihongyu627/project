import Taro, { Component } from "@tarojs/taro";
import { View, Button, Image, Text } from "@tarojs/components";

import styles from "./repair.module.scss";
import namePng from "../../assets/img/devops_repair_1.png";

class Breakdown extends Component {
  config = {
    navigationBarTitleText: "故障列表",
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
          title: "全部",
          status: ""
        },
        {
          title: "处理中",
          status: 2
        },
        {
          title: "已处理",
          status: 10
        }
      ],
      list: []
    };
  }

  //  导航栏的头部
  onActive = (index, val) => {
    this.setState(
      {
        active_index: index,
        active_status: val.status,
        page: 1
      },
      () => {
        this.repairList(val.status);
      }
    );
  };

  componentDidMount() {
    this.repairList();
  }
  // 订单列表
  repairList(status = "") {
    Taro.showNavigationBarLoading();
    let d = {};
    d.status = status || this.state.active_status;
    d.page = this.state.page;
    d.psize = this.state.psize;
    global.$utils.api.load("devopsrepairLists", d).then(result => {
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
  // 跳转详情
  repairInfo(item) {
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
      url: `/pages/devops/record?device_no=${item.device_no}&repair_id=${item.id}`
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
                        {item.device_info.name}
                      </View>
                    </View>
                    <View className={styles.states}>{item.action_name}</View>
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
                    <View className={styles.addres_item}>
                      <View className={styles.addres_item_title}>
                        故障部位：
                      </View>
                      <View className={styles.addres_item_txt}>
                        {item.title}
                      </View>
                    </View>
                    <View className={styles.addres_item}>
                      <View className={styles.addres_item_title}>
                        故障描述：
                      </View>
                      <View className={styles.addres_item_txt}>
                        {item.content}
                      </View>
                    </View>
                    <View className={styles.addres_item}>
                      <View className={styles.addres_item_title}>
                        创建时间：
                      </View>
                      <View className={styles.addres_item_txt}>
                        {item.create_time}
                      </View>
                    </View>
                    <View className={styles.buttonBtn}>
                      {item.status == 10 ? (
                        ""
                      ) : (
                        <View
                          className={styles.dispose}
                          onClick={this.faultTree.bind(this, item)}
                        >
                          故障处理
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

export default Breakdown;
