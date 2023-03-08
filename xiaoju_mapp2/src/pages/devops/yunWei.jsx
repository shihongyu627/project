import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtIcon, AtFloatLayout } from "taro-ui";
import { StoreModal } from "../components";

import styles from "./yunWei.module.scss";

class YunWei extends Component {
  config = {
    navigationBarTitleText: "运维数据"
  };

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      store_id: "",
      totalList: [],
      nowList: [],
      isStoreOpened: false
    };
  }

  componentDidMount() {
    let params = this.$router.params;
    console.log(params);
    this.devopsStoreList();
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

  devopsSimpleInfo() {
    let q = {};
    q.store_id = this.state.store_id;
    global.$utils.api.load("devopsopsimpleinfo", q, "post").then(res => {
      console.log(res);
      if (res.code > 0) {
        let totalList = res.data.sum_list || [];
        let nowList = res.data.day_list || [];
        this.setState({
          totalList,
          nowList
        });
      } else {
        global.$utils.toast.error(res.message);
      }
    });
  }

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
        this.devopsSimpleInfo();
      }
    );
  };

  render() {
    let { totalList, nowList } = this.state;
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
        {totalList.length > 0 ? (
          <View className={styles.YunWei_box}>
            <View className={styles.YunWei_header}>
              <View className={styles.YunWei_header_br}></View>
              <View className={styles.YunWei_header_title}>总数据</View>
            </View>
            <View className={styles.YunWei_content}>
              {totalList.map((item, index) => (
                <View className={styles.YunWei_item} key={index}>
                  <View className={styles.YunWei_item_num}>{item.value}</View>
                  <View className={styles.YunWei_item_title}>{item.name}</View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
        {nowList.length > 0 ? (
          <View className={styles.YunWei_box}>
            <View className={styles.YunWei_header}>
              <View className={styles.YunWei_header_br}></View>
              <View className={styles.YunWei_header_title}>今日数据</View>
            </View>
            <View className={styles.YunWei_content}>
              {nowList.map((item, index) => (
                <View className={styles.YunWei_item} key={index}>
                  <View className={styles.YunWei_item_num}>{item.value}</View>
                  <View className={styles.YunWei_item_title}>{item.name}</View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

export default YunWei;
