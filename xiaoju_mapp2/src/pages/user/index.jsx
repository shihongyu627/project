import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { logoutSuccess } from "../../actions/user";
import styles from "./index.module.scss";

class Index extends Component {
  config = {
    navigationBarTitleText: "个人中心"
  };

  constructor(props) {
    super(props);
    let userInfo = props.user || {};
    this.state = {
      order_total: "",
      order_run_count: "",
      uname: userInfo.user_nick || "小驹用户",
      uphone: userInfo.user_mobile || "",
      avatar:
        global.$utils.image.load(userInfo.user_head) ||
        require("../../assets/img/useravatar.jpg"),
      userList: [
        {
          title: "我的钱包",
          note: "查看",
          url: "/pages/user/wallet",
          pic: require("../../assets/img/mony.png")
        },
        {
          title: "骑行订单",
          url: "/pages/user/order",
          pic: require("../../assets/img/cart.png")
        },
        {
          title: "计费规则",
          note: "计费规则",
          url: "/pages/order/rule?base=1",
          pic: require("../../assets/img/guize.png")
        },
        {
          title: "客服中心",
          url: "/pages/user/service",
          pic: require("../../assets/img/kefu.png")
        },
        // {
        //   title: "问题反馈",
        //   url: "/pages/user/feedback",
        //   pic: require("../../assets/img/wenti.png")
        // },
        {
          title: "关于小驹",
          url: "/pages/user/about",
          pic: require("../../assets/img/xju.png")
        }
      ]
    };
  }

  componentDidShow() {
    global.$utils.api.load("userInfo").then(result => {
      let order_total = result.data.order_total;
      let order_run_count = result.data.order_run_count;
      let is_operator = result.data.is_operator;
      this.setState({
        order_total: order_total,
        order_run_count: order_run_count,
        is_operator: is_operator
      });
    });
  }

  onClickBtn(val) {
    Taro.navigateTo({
      url: val.url
    });
  }

  // 运维入口
  operAtion() {
    Taro.navigateTo({
      url: "/pages/devops/index"
    });
  }

  // 退出登录
  delectBtn = async () => {
    Taro.clearStorageSync();
    this.props.dispatch(logoutSuccess());
    Taro.redirectTo({
      url: "/pages/auth/index"
    });
  };

  render() {
    let { userList } = this.state;
    return (
      <View className={styles.page}>
        <View className={styles.avatarbox}>
          <Image src={this.state.avatar} className={styles.avatarimg}></Image>
          <View>
            <View className={styles.avatarname}>{this.state.uname}</View>
            <View className={styles.avatarphone}>{this.state.uphone}</View>
          </View>
        </View>
        <View className={styles.indesBox}></View>
        {userList.map((item, index) => (
          <View
            key={index}
            className={styles.useLists}
            onClick={this.onClickBtn.bind(this, item)}
          >
            <View
              className={
                index == 5 ? styles.user_footer_items : styles.user_footer_item
              }
              key={index}
            >
              <View className={styles.user_footer_item_left}></View>
              <View className={styles.user_footer_item_left_pic}>
                <Image className={styles.imgBtns} src={item.pic} />
              </View>
              <View className={styles.user_footer_item_left_txt}>
                {item.title}
              </View>
              <View className={styles.user_footer_item_right}>
                {index == 1 ? (
                  <Text className={styles.user_footer_item_left_note}>
                    累计骑行{this.state.order_total}次,正在骑行订单
                    {this.state.order_run_count}笔
                  </Text>
                ) : (
                  <Text className={styles.user_footer_item_left_note}>
                    {item.note}
                  </Text>
                )}
                <Image
                  className={styles.imgBtnsRight}
                  src={require("../../assets/img/userCar_right.png")}
                />
              </View>
            </View>
          </View>
        ))}
        {this.state.is_operator == 1 ? (
          <View className={styles.useLists} onClick={this.operAtion.bind(this)}>
            <View className={styles.user_footer_item_wp}>
              <View className={styles.user_footer_item_left}></View>
              <View className={styles.user_footer_item_left_pic}>
                <Image
                  className={styles.imgBtns}
                  src={require("../../assets/img/operation.png")}
                />
              </View>
              <View className={styles.user_footer_item_left_txt}>智能运维</View>
              <View className={styles.user_footer_item_right}>
                <Image
                  className={styles.imgBtnsRight}
                  src={require("../../assets/img/userCar_right.png")}
                />
              </View>
            </View>
          </View>
        ) : (
          ""
        )}
        <View className={styles.drop} onClick={this.delectBtn.bind(this)}>
          退出登录
        </View>
      </View>
    );
  }
}

const mapStoreToProps = store => ({
  user: store.user,
  config: store.config
});
const mapDispatchToProps = dispatch => ({
  dispatch: dispatch
});
export default connect(mapStoreToProps, mapDispatchToProps)(Index);
