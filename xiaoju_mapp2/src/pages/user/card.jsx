import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";

import styles from "./card.module.scss";

class Card extends Component {
  constructor(props) {
    super(props);
  }

  config = {
    navigationBarTitleText: "我的卡券"
  };

  render() {
    return (
      <View className={styles.page}>
        <View className={styles.notice}>
          <View>
            <Image
              style='width: 160px;height: 160px; margin-left: 10px;'
              src={require("../../assets/img/wu.png")}
            />
          </View>
          <View style='margin-top: -20px;'>暂无内容</View>
        </View>
      </View>
    );
  }
}

export default Card;
