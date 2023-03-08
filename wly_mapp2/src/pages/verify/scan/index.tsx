import { Component } from "react";
import { View, Image, Input } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import { scanQRCode } from "@/utils/wx";
import loadimgUtil from "@/utils/loadimg";
import VConsole from "vconsole";

export default class Index extends Component {
  state = {
    width: 750,
    height: 667,
    isOpened: false,
    code: "",
    verifyInfo: {},
    num: 1
  };
  componentWillMount() {}

  componentDidMount() {
    const info = Taro.getSystemInfoSync();
    const { windowHeight } = info;
    this.setState({
      height: windowHeight
    });
    if (!Taro.getStorageSync("verifyToken")) {
      Taro.redirectTo({
        url: `/pages/verify/auth/index`
      });
    }
    let verifyInfo = Taro.getStorageSync("verifyInfo");
    this.setState({
      verifyInfo
    });
  }

  componentDidShow() {}
  onClickScan = async () => {
    let code = await scanQRCode();
    if (!code) {
      Taro.showToast({
        title: "无效码",
        icon: "none",
        duration: 1500
      });
      return;
    }
    Taro.navigateTo({
      url: `/pages/verify/info/index?code=${code}`
    });
  };
  onClickOut = () => {
    let con;
    con = confirm("是否切换账号？");
    if (con === true) {
      Taro.removeStorageSync("verifyToken");
      Taro.removeStorageSync("verifyInfo");
      Taro.redirectTo({
        url: `/pages/verify/auth/index`
      });
    }
    // Taro.showModal({
    //   title: "提示",
    //   content: "是否切换账号？",
    //   success: function(res) {
    //     if (res.confirm) {
    //       console.log("用户点击确定");

    //     } else if (res.cancel) {
    //       console.log("用户点击取消");
    //     }
    //   }
    // });
  };
  //code
  changeValNum = e => {
    this.setState({
      code: e.detail.value
    });
  };
  setVConsole = () => {
    let { num } = this.state;
    num += 1;
    if (num == 10) {
      const vConsole = new VConsole();
    }
    this.setState({
      num
    });
  };
  render() {
    let { isOpened, code, height, verifyInfo, num } = this.state;
    return (
      <View className='scan_box' style={{ height: `${height}px` }}>
        <View>
          <View className='scan_headerBox'>
            {/* <Image src={loadimgUtil(verifyInfo.head)} className="headImg" /> */}
            <View>
              <View className='uname'>{verifyInfo.uname}</View>
              <View className='username'>{verifyInfo.username}</View>
            </View>
          </View>
          <View
            className='scan_title'
            onClick={() => {
              this.setVConsole();
            }}
          >
            选择核销方式
          </View>
        </View>
        <View>
          <View className='scan_btn' onClick={this.onClickScan.bind(this)}>
            扫码核销
          </View>
          <View
            className='scan_btn scan_btn1'
            onClick={() => {
              this.setState({
                isOpened: true
              });
            }}
          >
            手动核销
          </View>
          <View
            className='scan_btn scan_btn2'
            onClick={() => {
              this.onClickOut();
            }}
          >
            切换账号
          </View>
        </View>
        {isOpened ? (
          <View className='modal'>
            <View className='box'>
              <View className='title'>手动核销</View>
              <Input
                className='input'
                onInput={this.changeValNum.bind(this)}
                type='text'
                placeholder='请输入核销码'
              />
              <View className='btnBox'>
                <View
                  className='btn1'
                  onClick={() => {
                    this.setState({
                      isOpened: false
                    });
                  }}
                >
                  取消
                </View>
                <View
                  className='btn2'
                  onClick={() => {
                    if (!code) {
                      Taro.showToast({
                        title: "请输入核销码",
                        icon: "none",
                        duration: 1500
                      });
                      return;
                    }
                    this.setState(
                      {
                        isOpened: false,
                        code: ""
                      },
                      () => {
                        Taro.navigateTo({
                          url: `/pages/verify/info/index?code=${code}`
                        });
                      }
                    );
                  }}
                >
                  确认
                </View>
              </View>
            </View>
            <View className='br'></View>
          </View>
        ) : null}
      </View>
    );
  }
}
