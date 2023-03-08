import Taro, { Component } from "@tarojs/taro";
import { View, Label, Button, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {AtModal} from "taro-ui";
import { loginSuccess, logoutSuccess } from "../../actions/user";
import styles from "./index.module.scss";

let { screenWidth, screenHeight } = Taro.getSystemInfoSync();
class Index extends Component {
  config = {
    navigationBarTitleText: "登录"
  };

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      bg: props.config.share_login_img
        ? global.$utils.image.load(props.config.share_login_img)
        : "",
      phones: 1,
      isbindmobile: false,
      height: 667,
      isOpened: false,
      show_img: props.config.share_login_show_img
        ? global.$utils.image.load(props.config.share_login_show_img)
        : ""
    };
  }
  componentDidMount = async () => {
    // let params = this.$router.params;
    this.setState({
      height: Taro.getSystemInfoSync().windowHeight
    });
    console.log(Taro.getSystemInfoSync());
  };

  // 微信检测登录token
  async getUserLoginToken() {
    // 重新登录
    try {
      let res = await Taro.login();
      if (res.code) {
        // 发起网络请求
        let d = {
          code: res.code
        };
        let r = await global.$utils.api.load("weappCheck", d, "post", {
          toast: false,
          toasterror: false,
          loading: false
        });
        if (r.code === 1 && r.data) {
          this.props.dispatch(logoutSuccess());
          global.token = (r.data && r.data.token) || "";
        }
      } else {
        global.$utils.toast.error("登录授权过期" + res.errMsg);
        console.log("登录失败！" + res.errMsg);
      }
    } catch (error) {
      console.log("登录失败！" + error.message);
    }
  }
  // 微信检测登录code
  async getUserLoginCode() {
    // 重新登录
    try {
      let res = await Taro.login();
      if (res.code) {
        return res.code;
      }
      return "";
    } catch (error) {
      return "";
    }
  }
  //获取iv encryptedData
   getUserProfile=()=> {
    // 重新登录
    let that=this
    Taro.getUserProfile({
      desc: "用于完善个人资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        let loginData = {
          encryptedData: res.encryptedData,
          iv: res.iv,
        };
        that.getUserInfo(loginData)
      }
    });
  }
  // 微信
  getUserInfo = async (loginData) => {
    console.log(loginData,'授权信息xxxxxxxxxx');
    // if (!loginData) {
    //   global.$utils.toast.error("请先允许授权");
    //   return;
    // }
    try {
      Taro.showLoading({
        title: "授权中"
      });
      let code = await this.getUserLoginCode();
      if (code) {
        let d = {
          code: code,
          iv: loginData.iv,
          encryptedData: loginData.encryptedData
        };
        let r = await global.$utils.api.load("weappLogin", d, "post");
        if (r) {
          if (r.code <= 0) {
            global.$utils.toast.error(r.message);
          }
          if (r.code === 1) {
            this.setState(
              {
                phones: 2
              },
              () => {
                // 保存用户信息
                this.props.dispatch(loginSuccess(r.data));
                global.token = (r.data && r.data.token) || "";
              }
            );
          }
        }
      }
      Taro.hideLoading();
    } catch (error) {
      Taro.hideLoading();
    }
  };
  // 获取手机号
  getPhoneNumber(e) {
    if (!e.detail.encryptedData) {
      global.$utils.toast.error("请允许授权手机号");
      return;
    }
    let d = {
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    };
    global.$utils.api.load("weappDecrypt", d).then(res => {
      if (res.code <= 0) {
        global.$utils.toast.error(res.message);
      }
      if (res.code == 1) {
        this.setState({
          phones: 2
        });
        let mobile = res.data.phoneNumber;
        let userInfo = this.props.user.userInfo || {};
        userInfo.user_mobile = mobile;
        // 保存用户信息
        this.props.dispatch(loginSuccess(userInfo));
        global.$utils.data.set("userInfo", global.userInfo);
        this.bindmobile(mobile);
      }
    });
  }
  // 绑定手机号
  bindmobile(mobile) {
    let d = {};
    d.mobile = mobile;
    d.is_code = 0;
    global.$utils.api.load("userBindmobile", d).then(res => {
      if (res.code <= 0) {
        global.$utils.toast.error(res.message);
      }
      if (res.code == 1) {
        this.setState(
          {
            isbindmobile: true
          },
          () => {
            // 跳转到首页
            Taro.reLaunch({
              url: "/pages/index/index"
            });
            // if (this.props.config.share_login_show_img) {
            //   this.setState({
            //     isOpened: true
            //   });
            //   // 跳转用户教育
            //   // Taro.reLaunch({
            //   //   url: "/pages/auth/useauth"
            //   // });
            // } else {
            //   // 跳转到首页
            //   Taro.reLaunch({
            //     url: "/pages/index/index"
            //   });
            // }
          }
        );
      }
    });
  }
  // 支付宝授权
  getAuthCode() {
    Taro.getAuthCode({
      scopes: "auth_user",
      success: resv => {
        //获取用户信息
        let code = resv.authCode;
        Taro.getAuthUserInfo({
          success: res => {
            console.log(res);
            let d = {};
            d.code = code;
            d.nick_name = res.nickName;
            d.avatar = res.avatar;
            global.$utils.api.load("alipayLogin", d).then(r => {
              if (r.code === 1) {
                global.userInfo = r.data || {};
                global.mobile = r.data && r.data.mobile;
                global.token = (r.data && r.data.token) || "";
                global.islogin = r.data && r.data.uid ? true : false;
                global.$utils.data.set("userInfo", global.userInfo);
                global.$utils.data.set("token", global.token);
                global.$utils.data.set("mobile", global.mobile);
                global.$utils.data.set("islogin", global.islogin);
                Taro.reLaunch({
                  url: "/pages/index/index"
                });
              } else {
                global.token = (r.data && r.data.token) || "";
                global.$utils.data.set("token", global.token);
                global.$utils.toast.error(r.message);
              }
            });
          }
        });
      }
    });
  }

  handleUrl(url) {
    global.$utils.url.push({ url: url });
  }
  componentWillUnmount() {
    if (!this.state.isbindmobile) {
      console.log("componentDidHide clear token");
      // 未授权手机号退出
      this.props.dispatch(logoutSuccess());
      global.$utils.data.set("userInfo", {});
      global.$utils.data.set("token", "");
      global.$utils.data.set("mobile", "");
      global.$utils.data.set("islogin", false);
      global.islogin = false;
      global.token = "";
      // Taro.reLaunch({
      //   url: "/pages/index/index"
      // });
    }
  }
  //关闭弹窗
  closeModel = () => {
    this.setState(
      {
        isOpened: false
      },
      () => {
        setTimeout(() => {
          Taro.reLaunch({
            url: "/pages/index/index"
          });
        }, 50);
      }
    );
  };
  render() {
    return (
      <View
        className={styles.page}
        style={{ height: `${this.state.height}px` }}
      >
        <Image
          src={this.state.bg}
          className={styles.bg}
          style={{ height: Taro.pxTransform(screenHeight) }}
          onClick={() => {
            if (this.props.config.share_login_url) {
              this.handleUrl(
                "/pages/web/index?url=" +
                  this.props.config.share_login_url +
                  "&title=推广"
              );
            }
          }}
        />
        <View className={styles.submit_box}>
          {process.env.TARO_ENV === "weapp" ? (
            <View>
              {this.state.phones == 1 ? (
                <Button
                  size='small'
                  type='primary'
                  open-type='getUserInfo'
                  className={styles.submit_btn}
                  // onGetUserInfo={this.getUserInfo.bind(this)}
                  onClick={this.getUserProfile.bind(this)}
                >
                  微信用户一键登录
                </Button>
              ) : (
                <Button
                  size='small'
                  type='primary'
                  open-type='getPhoneNumber'
                  className={styles.phone_btn}
                  onGetPhoneNumber={this.getPhoneNumber.bind(this)}
                >
                  授权手机号
                </Button>
              )}
            </View>
          ) : (
            <Button
              size='small'
              type='primary'
              openType='getUserInfo'
              className={styles.submit_btn}
              onTap={this.getAuthCode.bind(this)}
            >
              支付宝快速认证
            </Button>
          )}
          {/* <Button size='small' type='primary' openType='getUserInfo' className={styles.submit_btn} onGetUserInfo={this.getInfo.bind(this)}>微信用户快速认证</Button> */}
          {/* <Button size='small'plain openType='getPhoneNumber' className={styles.phone_btn} onGetPhoneNumber={this.getPhone.bind(this)}>手机号注册/登录</Button> */}
        </View>
        <View className={styles.notice_box}>
          <Label className={styles.notice}>
            点击立即授权表示已阅读并同意
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
        <AtModal closeOnClickOverlay={false} isOpened={this.state.isOpened}>
          <View className={styles.modelBox}>
            <Image
              src={this.state.show_img}
              className={styles.show_img}
              mode='widthFix'
            />
            <View
              className={styles.modelBtn}
              onClick={this.closeModel.bind(this)}
            >
              我知道了
            </View>
          </View>
          {/* <AtModalAction>
            <Button onClick={this.closeModel.bind(this)}>开始骑行</Button>
          </AtModalAction> */}
        </AtModal>
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
