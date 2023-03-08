import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";

import styles from "./about.module.scss";

import namedPng11 from "../../assets/img/userCar_right.png";

class About extends Component {
  config = {
    navigationBarTitleText: "关于小驹"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleUrl(url) {
    global.$utils.url.push({ url: url });
  }

  render() {
    return (
      <View className={styles.page}>
        <View className={styles.regarders}></View>
        <View
          className={styles.notice}
          onClick={this.handleUrl.bind(
            this,
            "/pages/web/index?title=景区单车用户服务协议&url=/api/about/agreement1/f/html"
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
            "/pages/web/index?title=景区电动观光车用户服务协议&url=/api/about/agreement2/f/html"
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
            "/pages/web/index?title=个人信息保护及隐私政策&url=/api/about/agreement/f/html"
          )}
        >
          <View className={styles.regards}>
            <View className={styles.agreement}>个人信息保护及隐私政策</View>
            <View className={styles.user_footer_item_righ}>
              <Image className={styles.imgBtnsRight} src={namedPng11} />
            </View>
          </View>
        </View>
        <View
          className={styles.notice}
          onClick={this.handleUrl.bind(this, "/pages/web/index?title=关于我们&url=/api/about/about/f/html")}
        >
          <View className={styles.regards}>
            <View className={styles.agreement}>关于我们</View>
            <View className={styles.user_footer_item_righ}>
              <Image className={styles.imgBtnsRight} src={namedPng11} />
            </View>
          </View>
        </View>
        {/* <View
          className={styles.notice}
          onClick={this.handleUrl.bind(this, "/pages/web/index?title=我的客服&url=/api/about/hotline/f/html")}
        >
          <View className={styles.regards}>
            <View className={styles.agreement}>我的客服</View>
            <View className={styles.user_footer_item_righ}>
              <Image className={styles.imgBtnsRight} src={namedPng11} />
            </View>
          </View>
        </View> */}
      </View>
    );
  }
}

export default About;
