import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";

import styles from "./agree.module.scss";

import namedPng11 from "../../assets/img/userCar_right.png";

class RideBike extends Component {
  config = {
    navigationBarTitleText: "骑车用户服务协议与隐私政策"
  };

  agreementBtn() {
    Taro.navigateTo({
      url: "/pages/user/feedback"
    });
  }

  handleUrl(url) {
    global.$utils.url.push({ url: url });
  }

  render() {
    return (
      <View className={styles.page}>
        <View className={styles.rideBk}></View>
        <View
          className={styles.notice}
          onClick={this.handleUrl.bind(
            this,
            "/pages/web/index?title=景区单车用户服务协议"
          )}
        >
          <View className={styles.regards}>
            <View className={styles.agreement}>景区单车用户服务协议</View>
            <View className={styles.user_footer_item_righ}>
              <Image className={styles.imgBtnsRight} src={namedPng11} />
            </View>
          </View>
        </View>

        <View
          className={styles.notice}
          onClick={this.handleUrl.bind(
            this,
            "/pages/web/index?title=景区电动观光车用户服务协议"
          )}
        >
          <View className={styles.regards}>
            <View className={styles.agreement}>景区电动观光车用户服务协议</View>
            <View className={styles.user_footer_item_righ}>
              <Image className={styles.imgBtnsRight} src={namedPng11} />
            </View>
          </View>
        </View>

        <View
          className={styles.notice}
          onClick={this.handleUrl.bind(
            this,
            "/pages/web/index?title=个人信息保护及隐私政策"
          )}
        >
          <View className={styles.regards}>
            <View className={styles.agreement}>个人信息保护及隐私政策</View>
            <View className={styles.user_footer_item_righ}>
              <Image className={styles.imgBtnsRight} src={namedPng11} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default RideBike;
