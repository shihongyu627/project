import Taro, { Component } from "@tarojs/taro";
import { View, Label, Button, Text, Image, RichText } from "@tarojs/components";

import styles from "./rule.module.scss";
import logo from "../../assets/img/logo.png";

class Rule extends Component {
  config = {
    navigationBarTitleText: "计价规则",
  };

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      base: false,
      device_no: "",
      feeInfo: {},
      imgs: ""
    };
  }

  componentDidMount() {
    let params = this.$router.params;
    if (params.title) {
      Taro.setNavigationBarTitle({ title: params.title });
    }
    console.log("params", params);
    if (params) {
      this.setState(
        {
          base: params.base ? true : false,
          device_no: params.device_no || "",
          feeInfo: {}
        },
        () => {
          if (!params.base) {
            if (!params.isorder) {
              if (params.device_no) {
                this.ruleInfo();
              }
            } else {
              this.setState({
                feeInfo: params // 订单详情页面解构的费用规则
              });
            }
          }
        }
      );
    }
    if (params.order_id) {
      let d = {};
      d.order_id = params.order_id;
      global.$utils.api.load("orderInfo", d).then(result => {
        console.log(result, "444444444");
        let imgs = result.data.device_info.product_image;
        this.setState({
          imgs: imgs
        });
      });
    }
  }

  ruleInfo() {
    let d = {};
    d.device_no = this.state.device_no;
    global.$utils.api.load("deviceInfo", d).then(res => {
      let feeInfo = res.data || {};
      let imgs = res.data.image
        ? res.data.image
        : res.data.product_image
        ? res.data.product_image
        : "";
      this.setState({
        feeInfo: feeInfo.fee_info || {},
        imgs: imgs
      });
    });
  }
  render() {
    const { feeInfo, imgs } = this.state;
    return (
      <View className={styles.pages}>
        {!this.state.base ? (
          <View className={styles.page}>
            <View className={styles.header_pic}>
              <Image src={imgs} mode='heightFix' />
            </View>
            <View className={styles.header_txt}>
              <Text>{feeInfo.min_base}</Text>分钟内
              <Text>{feeInfo.fee_base}</Text>元
            </View>
            <View className={styles.rule_txt}>
              <View className={styles.rule_radius}></View>
              <View className={styles.rule_title}>
                预充值<Text>{feeInfo.fee_recharge}</Text>元
              </View>
            </View>
            <View className={styles.rule_content}>
              预充值金额为车辆押金，成功还车时，扣除消费金额之外的押金将原路退还。
            </View>
            <View className={styles.rule_txt}>
              <View className={styles.rule_radius}></View>
              <View className={styles.rule_title}>
                骑行计费规则
              </View>
            </View>
            <View className={styles.rule_content}>
              开始用车后，<Text>{feeInfo.min_base}</Text>分钟收费
              <Text>{feeInfo.fee_base}</Text>元，超出后
              每<Text>{feeInfo.min_next}</Text>分钟，按照
              <Text>{feeInfo.fee_next_min}</Text>元收费。
            </View>
            <View className={styles.rule_txt}>
              <View className={styles.rule_radius}></View>
              <View className={styles.rule_title}>非定点还车调度费</View>
            </View>
            <View className={styles.rule_content}>
              未在指定停车点还车，违规还车收取
              <Text>{feeInfo.fee_dispatch}</Text>元调度费
            </View>
            <View className={styles.rule_txt}>
              <View className={styles.rule_radius}></View>
              <View className={styles.rule_title}>超区调度费</View>
            </View>
            <View className={styles.rule_content}>
              未在指定服务区内还车，违规还车收取
              <Text>{feeInfo.fee_dispatch_outrun}</Text>元超区调度费
            </View>
          </View>
        ) : (
          ""
        )}

        {this.state.base ? (
          <View className={styles.page}>
            <View className={styles.header_pic_logo}>
              <Image src={logo} mode='heightFix' />
            </View>
            <View className={styles.header_txt}>骑行预充值，结束自动退费</View>

            <View className={styles.rule_txt}>
              <View className={styles.rule_radius}></View>
              <View className={styles.rule_title}>预充值</View>
            </View>
            <View className={styles.rule_content}>
              预充值金额为车辆押金，成功还车时，扣除消费金额之外的押金将全部原路退还
            </View>
            <View className={styles.rule_txt}>
              <View className={styles.rule_radius}></View>
              <View className={styles.rule_title}>骑行计费</View>
            </View>
            <View className={styles.rule_content}>
              开始用车后，每计费时长收取指定费用，不足时长，按照最低时长计费
            </View>
            <View className={styles.rule_txt}>
              <View className={styles.rule_radius}></View>
              <View className={styles.rule_title}>调度费</View>
            </View>
            <View className={styles.rule_content}>
              请在服务区内停车点还车，违规还车收取调度费
            </View>
          </View>
        ) : (
          ""
        )}
      </View>
    );
  }
}

export default Rule;
