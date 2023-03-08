import Taro, { Component } from "@tarojs/taro";
import { View, Label, Button, Image, RichText } from "@tarojs/components";
import styles from "./info.module.scss";

class Rule extends Component {
  config = {
    navigationBarTitleText: "帮助详情"
  };

  constructor(props) {
    super(props);
    this.state = {
      helpInfo: {}
    };
  }

  componentDidMount() {
    let params = this.$router.params;
    if (params.title) {
      Taro.setNavigationBarTitle({ title: params.title });
    }
    if (params.id) {
      this.helpInfo(params.id);
    }
  }

  helpInfo = id => {
    let d = {};
    d.id = id;
    global.$utils.api.load("orderHelpdetail", d).then(res => {
      let helpInfo = res.data || {};
      this.setState({
        helpInfo: helpInfo
      });
    });
  };

  render() {
    const { helpInfo } = this.state;
    return (
      <View className={styles.page}>
        <View className={styles.titles}>
          {/* <View className={styles.titleInfo}>{helpInfo.title}</View> */}
          <RichText nodes={helpInfo.detail} />
        </View>
      </View>
    );
  }
}

export default Rule;
