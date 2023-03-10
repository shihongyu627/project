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
import {
  InputText,
  SubmitBtn,
  BoxUpload,
  UploadImage,
  SignName
} from "@component";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/share/share_qq.png";
import FourPng from "@assets/share/share_qzone.png";
import BoxUpload_1 from "@assets/image/BoxUpload_1.png";
import signNamePng from "@assets/image/signName.png";
import iconDelPng from "@assets/image/iconDel.png";
import noCheckedPng from "@assets/image/noChecked.png";
import signCheckPng from "@assets/image/checked.png";
import SignatureCapture from "react-native-signature-capture";
import dayjs from "dayjs";
import "./index.scss";
import store from "../../../store";
let { height, width } = Dimensions.get("window");
console.log(height);
import { BottomModal } from "beeshell";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      images: [],
      imageVal: false,
      type: "",
      trouble_id: "",
      title: "",
      batch_id: "",
      submitVal: true,
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
    let type = params.type;
    let trouble_id = params.trouble_id;
    let title = params.title;
    let batch_id = params.batch_id;
    let user_type = params.user_type;

    Taro.setNavigationBarTitle({
      title: title
    });
    this.setState(
      {
        type,
        trouble_id,
        title,
        batch_id,
        user_type
      },
      () => {
        if (type == "createreply") {
          this.troubledetail();
        } else {
          this.signlist();
        }
      }
    );
  }

  async componentWillUnmount() {}
  troubledetail = () => {
    let { trouble_id } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.trouble_id = trouble_id;
    global.$utils.api
      .load("troubledetail", d, "get", false)
      .then(res => {
        if (res.data) {
          let data = res.data;
          let latest_reply = data.latest_reply || {};
          let images = latest_reply.gallery.split(",");
          this.setState({
            content: latest_reply.content || "",
            images
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  handleSubmit = () => {
    let {
      submitVal,
      content,
      images,
      type,
      trouble_id,
      batch_id,
      signPathName,
      sign_img1,
      signPathName2,
      sign_img2
    } = this.state;
    let d = {};
    d.content = content;
    d.gallery = images.join(",");
    console.log(type);
    let url = "batchreplypass";
    let text = "??????????????????????????????";
    if (type == "createreply") {
      url = "troubleSavereply";
      text = "?????????????????????";
      d.trouble_id = trouble_id;
    } else {
      d.batch_id = batch_id;
      d.pass_status = 2;
      d.sign_img = signPathName;
      d.sign_img2 = signPathName2;
    }
    if (!content) {
      $utils.toast.text(text);
      return;
    }
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    $utils.api
      .load(url, d, "post", { loading: false, login: true })
      .then(result => {
        $utils.toast.text(result.message);
        if (result.code == 1) {
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
        $utils.toast.text("????????????");
        console.log(err);
        this.setState({
          submitVal: true
        });
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  setAvatar = src => {
    let images = this.state.images;
    images.push(src);
    if (images.length >= 5) {
      images = images.slice(0, 5);
      this.setState({
        imageVal: true,
        images
      });
      return;
    }
    this.setState({
      images
    });
  };
  getImages = data => {
    this.setState({
      images: data,
      imageVal: false
    });
  };
  //??????
  changeContent = e => {
    this.setState({
      content: e.detail.value
    });
  };
  onChageTitle = data => {
    this.setState({
      title: data
    });
  };
  setSignAvatar = signPathName => {
    this.setState(
      {
        signPathName: $utils.loadimg.load(signPathName)
      },
      () => {
        this.bottomModalD.close();
      }
    );
  };
  //????????????
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
        $utils.toast.text("????????????");
        console.log(err);
      });
  };
  //????????????
  onClickDelSign = sign_img => {
    Taro.showModal({
      title: "??????",
      content: "?????????????????????",
      confirmText: "???",
      confirmColor: "#0A74E9"
    }).then(res1 => {
      if (res1.confirm) {
        this.delsign(sign_img);
        return;
      } else if (res1.cancel) {
        console.log("??????????????????");
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
        $utils.toast.text("????????????");
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
      signPathName,
      sign_list,
      sign_img1,
      signPathName2,
      sign_img2,
      user_type
    } = this.state;
    return (
      <View className="recordCreate">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className="recordCreate-br" />
          <View className="recordCreate-box">
            <View className="recordCreate-box-Textarea">
              <View className="recordCreate-box-Textarea-title">
                {type == "createreply" ? "????????????" : "?????????????????????"}
              </View>
              <View className="recordCreate-box-TextareaBox">
                <Textarea
                  className="recordCreate-box-TextareaBox-content"
                  style="background:#F2F2F2;width:100%;"
                  autoHeight
                  placeholder={
                    type == "createreply"
                      ? "?????????????????????"
                      : "??????????????????????????????"
                  }
                  value={content}
                  onInput={this.changeContent.bind(this)}
                />
              </View>
            </View>

            <View className="recordCreate-box-imageBox-title">??????</View>
            <View className="recordCreate-box-imageBox">
              {this.state.images.map((item, index) => (
                <View
                  className="recordCreate-box-imageBox-imageItem"
                  key={index}
                >
                  <UploadImage
                    getImages={this.getImages}
                    info={{
                      image: item,
                      index: index,
                      images: this.state.images
                    }}
                  ></UploadImage>
                </View>
              ))}
              {this.state.imageVal ? null : (
                <BoxUpload
                  className="recordCreate-box-imageBox-imageItem"
                  title="????????????"
                  setImage={false}
                  source={BoxUpload_1}
                  setImg={this.setAvatar}
                  count={5}
                />
              )}
            </View>
            {type == "createreply" ? null : (
              <View>
                <View className="recordCreate-box-imageBox-title">??????1</View>
                <View className="recordCreate-box-imageBox">
                  <View className="recordCreate-box-imageBox-imageItemBox">
                    <Image
                      className="recordCreate-box-imageBox-imageItem"
                      src={signPathName ? signPathName : signNamePng}
                      mode="aspectFill"
                      onClick={() => {
                        this.bottomModalD.open();
                      }}
                    />
                  </View>
                  {sign_list.map(item => {
                    return (
                      <View className="recordCreate-box-imageBox-imageItemBox">
                        <Image
                          className="recordCreate-box-imageBox-iconDelPng"
                          src={iconDelPng}
                          mode="aspectFill"
                          onClick={() => {
                            this.onClickDelSign(item.sign_img);
                          }}
                        />
                        <Image
                          className="recordCreate-box-imageBox-signCheckPng"
                          src={
                            signPathName == item.sign_img
                              ? signCheckPng
                              : noCheckedPng
                          }
                          onClick={() => {
                            this.setState({
                              signPathName: item.sign_img
                            });
                          }}
                          mode="aspectFill"
                        />
                        <Image
                          className="recordCreate-box-imageBox-imageItem"
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
                  <View className="recordCreate-box-imageBox-title">??????2</View>
                ) : null}
                {user_type == 2 ? (
                  <View className="recordCreate-box-imageBox">
                    <View className="recordCreate-box-imageBox-imageItemBox">
                      <Image
                        className="recordCreate-box-imageBox-imageItem"
                        src={signPathName2 ? signPathName2 : signNamePng}
                        mode="aspectFill"
                        onClick={() => {
                          this.bottomModalD.open();
                        }}
                      />
                    </View>
                    {sign_list.map(item => {
                      return (
                        <View className="recordCreate-box-imageBox-imageItemBox">
                          <Image
                            className="recordCreate-box-imageBox-iconDelPng"
                            src={iconDelPng}
                            mode="aspectFill"
                            onClick={() => {
                              this.onClickDelSign(item.sign_img);
                            }}
                          />
                          <Image
                            className="recordCreate-box-imageBox-signCheckPng"
                            src={
                              signPathName2 == item.sign_img
                                ? signCheckPng
                                : noCheckedPng
                            }
                            mode="aspectFill"
                            onClick={() => {
                              this.setState({
                                signPathName2: item.sign_img
                              });
                            }}
                          />
                          <Image
                            className="recordCreate-box-imageBox-imageItem"
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
            )}
          </View>
          <View className="bottomBr"></View>
        </ScrollView>
        <SubmitBtn title="??????" handleSubmit={this.handleSubmit}></SubmitBtn>
        <BottomModal
          title="??????"
          cancelable={true}
          screenHeight={height + (Platform.OS == "ios" ? 0 : 40)}
          leftLabelText=""
          rightLabelText=""
          ref={c => {
            this.bottomModalD = c;
          }}
        >
          <SignName setImg={this.setSignAvatar} />
        </BottomModal>
      </View>
    );
  }
}

export default Index;
