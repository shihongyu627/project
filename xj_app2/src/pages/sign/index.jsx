import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Picker,
  Textarea,
  ScrollView,
  Image
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Dimensions, Platform } from "react-native";
import { SubmitBtn, SignName } from "@component";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/share/share_qq.png";
import FourPng from "@assets/share/share_qzone.png";
import iconDelPng from "@assets/image/iconDel.png";
import noCheckedPng from "@assets/image/noChecked.png";
import signCheckPng from "@assets/image/checked.png";
import SignatureCapture from "react-native-signature-capture";
import dayjs from "dayjs";
import signNamePng from "@assets/image/signName.png";
import "./index.scss";
import { BottomModal } from "beeshell";
import { Button } from "teaset";
let { height, width } = Dimensions.get("window");
import store from "../../store";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batch_id: "",
      submitVal: true,
      sign_status: "",
      type: "",
      signPathName: "",
      sign_img1: "",
      sign_list: [],
      signPathName2: "",
      sign_img2: "",
      user_type: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let batch_id = params.batch_id;
    let type = params.type;
    let sign_status = params.sign_status;
    let user_type = params.user_type;

    this.setState(
      {
        batch_id,
        sign_status,
        type,
        user_type
      },
      () => {
        this.signlist();
      }
    );
  }

  async componentWillUnmount() {}
  handleSubmit = () => {
    let {
      submitVal,
      signPathName,
      batch_id,
      sign_status,
      type,
      sign_img1,
      signPathName2,
      sign_img2
    } = this.state;
    let d = {};
    d.batch_id = batch_id;
    d.sign_img = sign_img1 || signPathName;
    d.sign_img2 = sign_img2 || signPathName2;
    let url = "troubleBatchsign";
    if (sign_status == 1) {
      url = "troubleSubmitbatchreply";
    }
    if (type == "check") {
      url = "batchreplypass";
      d.pass_status = "1";
    }
    $utils.api
      .load(url, d, "post", { loading: false, login: true })
      .then(result => {
        $utils.toast.text(result.message);
        if (result.code == 1) {
          $utils.auth.checklogin();
          setTimeout(() => {
            Taro.eventCenter.trigger("refreshRecordInfo", true);
            Taro.eventCenter.trigger("refreshRecordList", true);
            Taro.navigateBack();
          }, 1000);
        } else {
          this.setState({
            submitVal: true
          });
        }
      })
      .catch(err => {
        $utils.toast.text("操作异常");
        console.log(err);
        this.setState({
          submitVal: true
        });
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  setAvatar = signPathName => {
    this.setState(
      {
        signPathName: $utils.loadimg.load(signPathName)
      },
      () => {
        this.bottomModalD.close();
      }
    );
  };
  //签名列表
  signlist = () => {
    let d = {};
    $utils.api
      .load("signlist", d, "post", { loading: false, login: true })
      .then(res => {
        if (res.code == 1) {
          this.setState({
            sign_list: res.data || []
          });
        }
      })
      .catch(err => {
        $utils.toast.text("操作异常");
        console.log(err);
      });
  };
  //删除签名
  onClickDelSign = sign_img => {
    Taro.showModal({
      title: "提示",
      content: "是否删除该签名",
      confirmText: "是",
      confirmColor: "#0A74E9"
    }).then(res1 => {
      if (res1.confirm) {
        this.delsign(sign_img);
        return;
      } else if (res1.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  delsign = sign_img => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.sign_img = sign_img;
    $utils.api
      .load("delsign", d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.message);
        if (res.code == 1) {
          setTimeout(() => {
            this.signlist();
          }, 500);
        }
      })
      .catch(err => {
        $utils.toast.text("操作异常");
        Taro.hideLoading();
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  render() {
    let {
      title,
      content,
      type,
      signShow,
      signPathName,
      sign_img1,
      sign_list,
      signPathName2,
      sign_img2,
      user_type
    } = this.state;
    return (
      <View className="signBoxPage">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className="signBoxPage-br" />
          <View className="signBoxPage-box">
            <View className="signBoxPage-box-imageBox-title">签名1</View>
            <View className="signBoxPage-box-imageBox">
              <Image
                className="signBoxPage-box-imageBox-imageItem"
                src={signPathName ? signPathName : signNamePng}
                mode="aspectFill"
                onClick={() => {
                  this.bottomModalD.open();
                }}
              />
              {sign_list.map(item => {
                return (
                  <View className="signBoxPage-box-imageBox-imageItem">
                    <Image
                      className="signBoxPage-box-imageBox-iconDelPng"
                      src={iconDelPng}
                      mode="aspectFill"
                      onClick={() => {
                        this.onClickDelSign(item.sign_img);
                      }}
                    />
                    <Image
                      className="signBoxPage-box-imageBox-signCheckPng"
                      src={
                        signPathName == item.sign_img
                          ? signCheckPng
                          : noCheckedPng
                      }
                      mode="aspectFill"
                      onClick={() => {
                        this.setState({
                          signPathName: item.sign_img
                        });
                      }}
                    />
                    <Image
                      className="signBoxPage-box-imageBox-imageItem"
                      src={item.sign_img}
                      mode="aspectFill"
                      onClick={() => {
                        this.setState({
                          signPathName: item.sign_img
                        });
                      }}
                    />
                  </View>
                );
              })}
            </View>
            {user_type == 2 ? (
              <View className="signBoxPage-box-imageBox-title">签名2</View>
            ) : null}
            {user_type == 2 ? (
              <View className="signBoxPage-box-imageBox">
                <Image
                  className="signBoxPage-box-imageBox-imageItem"
                  src={signPathName2 ? signPathName2 : signNamePng}
                  mode="aspectFill"
                  onClick={() => {
                    this.bottomModalD.open();
                  }}
                />
                {sign_list.map(item => {
                  return (
                    <View className="signBoxPage-box-imageBox-imageItem">
                      <Image
                        className="signBoxPage-box-imageBox-iconDelPng"
                        src={iconDelPng}
                        mode="aspectFill"
                        onClick={() => {
                          this.onClickDelSign(item.sign_img);
                        }}
                      />
                      <Image
                        className="signBoxPage-box-imageBox-signCheckPng"
                        src={
                          signPathName2 == item.sign_img
                            ? signCheckPng
                            : noCheckedPng
                        }
                        onClick={() => {
                          this.setState({
                            signPathName2: item.sign_img
                          });
                        }}
                        mode="aspectFill"
                      />
                      <Image
                        className="signBoxPage-box-imageBox-imageItem"
                        src={item.sign_img}
                        mode="aspectFill"
                        onClick={() => {
                          this.setState({
                            signPathName2: item.sign_img
                          });
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        </ScrollView>
        <BottomModal
          title="签名"
          cancelable={true}
          screenHeight={height + (Platform.OS == "ios" ? 0 : 40)}
          leftLabelText=""
          rightLabelText=""
          ref={c => {
            this.bottomModalD = c;
          }}
        >
          <SignName setImg={this.setAvatar} />
        </BottomModal>
        <SubmitBtn title="提交" handleSubmit={this.handleSubmit}></SubmitBtn>
      </View>
    );
  }
}

export default Index;
