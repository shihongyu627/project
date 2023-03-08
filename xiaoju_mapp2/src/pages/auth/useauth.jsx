import Taro, { Component } from "@tarojs/taro";
import { View, Button, Label, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import styles from "./useauth.module.scss";

let { screenWidth, screenHeight } = Taro.getSystemInfoSync();
class Useauth extends Component {
  config = {
    navigationBarTitleText: "温馨提示"
  };

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      bg: props.config.share_login_show_img
        ? global.$utils.image.load(props.config.share_login_show_img)
        : ''
    };
  }
  componentDidMount() {}

  toHome() {
    // 直接跳转
    Taro.reLaunch({
      url: "/pages/index/index"
    });
  }

  handleUrl(url) {
    global.$utils.url.push({ url: url });
  }
  render() {
    return (
      <View className={styles.page}>
        <Image
          src={this.state.bg}
          className={styles.bg}
          style={{ height: Taro.pxTransform(screenHeight) }}
        />
        <View className={styles.submit_box}>
          <View>
            <Button
              size='small'
              type='primary'
              className={styles.phone_btn}
              onClick={this.toHome.bind(this)}
            >
              马上骑行
            </Button>
          </View>
        </View>
        <View className={styles.notice_box}>
          <Label className={styles.notice}>
            点击骑行表示已阅读并同意
            <Label
              style='color:#ffc40f'
              onClick={this.handleUrl.bind(
                this,
                "/pages/web/index?title=个人信息保护及隐私政策&url=/api/about/agreement/f/html"
              )}
            >
              《法律条款与隐私政策》
            </Label>
          </Label>
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
  // dispatch: dispatch
});
export default connect(mapStoreToProps, mapDispatchToProps)(Useauth);
