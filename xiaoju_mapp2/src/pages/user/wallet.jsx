import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";

import styles from "./wallet.module.scss";
import namedPng11 from "../../assets/img/userCar_right.png";

class Wallet extends Component {
  config = {
    navigationBarTitleText: "我的钱包"
  };
  constructor(props) {
    super(props);
    this.state = {
      userList: [
        {
          title: "我的骑行卡",
          name: "我的骑行卡",
          note: "",
          url: "/pages/user/card"
        },
        {
          title: "我的优惠券",
          name: "优惠券",
          note: "",
          url: "/pages/user/card"
        },
        {
          title: "我的预存余额",
          name: "预存余额",
          note: "",
          url: "/pages/user/card"
        }
        // {
        //   title: "购买骑行卡",
        //   name: "去购买骑行卡",
        //   note: "套餐用车限时购",
        //   url: "/pages/user/card"
        // }
        // {
        //   title: "兑换码",
        //   name: "兑换码",
        //   note: '兑换骑行优惠',
        //   url: '/pages/user/card'
        // }
      ]
    };
  }

  onClickBtn(val) {
    Taro.navigateTo({
      url: val.url
    });
    Taro.setNavigationBarTitle({
      title: val.title
    });
  }

  render() {
    let { userList } = this.state.userList;
    return (
      <View className={styles.page}>
        {userList.map((item, index) => {
          return (
            <View key={index}>
              <View
                className={styles.useLists}
                onClick={this.onClickBtn.bind(this, item)}
              >
                <View className={styles.user_footer_item} key={index}>
                  <View className={styles.user_footer_item_left}></View>
                  <View className={styles.user_footer_item_left_txt}>
                    {item.name}
                  </View>
                  <View className={styles.user_footer_item_right}>
                    <Text className={styles.user_footer_item_left_note}>
                      {item.note}
                    </Text>
                    <Image className={styles.imgBtnsRight} src={namedPng11} />
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

export default Wallet;
