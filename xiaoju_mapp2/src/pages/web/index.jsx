import Taro, { Component } from "@tarojs/taro";
import { View, WebView } from "@tarojs/components";
import styles from "./index.module.scss";

class Index extends Component {
  config = {
    navigationBarTitleText: "小驹游乐"
  };

  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
  }

  componentDidMount() {
    let params = this.$router.params;
    if (params.title) {
      Taro.setNavigationBarTitle({ title: params.title });
    }
    if (params.url) {
      let url = decodeURIComponent(params.url || '');
      if (url.indexOf("http") >= 0) {
        url = url;
      } else {
        url = global.app_host + "" + url;
      }
      console.log('web url', url)
      this.setState({
        url: url
      });
    }
  }

  render() {
    return (
      <View className={styles.page}>
        <WebView src={this.state.url} />
      </View>
    );
  }
}

export default Index;
