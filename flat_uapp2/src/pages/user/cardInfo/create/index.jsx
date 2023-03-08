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

import {
  InputText,
  SubmitBtn,
  CardBoxUpload,
  CardUploadImage,
  SelectTypeRn
} from "@component";
import { getWindowHeight } from "@utils/style";
import cardInfo_icon from "@assets/image/cardInfo_warn.png";
import card_one from "@assets/image/card_one.png";
import card_two from "@assets/image/card_two.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      tel: "",
      cardNo: "",
      images: [],
      imageVal: false,
      imagesTwo: [],
      imageValTwo: false,
      roomNameList: [],
      roomData: [],
      roomName: "",
      roomId: "",
      type: "",
      submitVal: true
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let type = params.type;
    console.log(id, "传过来的值");
    this.setState(
      {
        id,
        type
      },
      () => {
        if (id) {
          this.onload();
        }
      }
    );
    this.roomnoPageList();
  }

  async componentWillUnmount() {}
  //查询房间号
  onload = () => {
    Taro.showLoading({
      title: "loading"
    });
    let url = `${global.base_host}/customer/flat/live/${this.state.id}`;
    global.$utils.api
      .load(url, {}, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          console.log(res);
          let name = data.name;
          let tel = data.phonenumber;
          let cardNo = data.idCard;
          let roomId = data.roomId;
          let roomName = data.roomName;
          let images = data.frontUrl && data.frontUrl.split(",");
          let imagesTwo = data.reverseUrl && data.reverseUrl.split(",");
          console.log(imagesTwo);
          this.setState({
            name,
            tel,
            images,
            imagesTwo,
            cardNo,
            roomId,
            roomName,
            imageVal: true,
            imageValTwo: true
          });
        } else {
          global.$utils.toast.text(res.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  roomnoPageList = () => {
    let d = {};
    global.$utils.api
      .load("roomnoPageList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let roomData = res.rows || [];
          let roomNameList = [];
          roomData.map(item => {
            roomNameList.push(item.name);
          });
          this.setState({
            roomData,
            roomNameList
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  changeName = data => {
    this.setState({
      name: data
    });
  };
  changeTel = data => {
    this.setState({
      tel: data
    });
  };
  changeCardNo = data => {
    this.setState({
      cardNo: data
    });
  };
  //选择房间
  selectRoomIndex = data => {
    let { roomData } = this.state;
    if (roomData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(roomData[data], "传过来的索引取类型值");
    let obj = roomData[data];
    let roomName = obj.name;
    let roomId = obj.id;
    this.setState({
      roomName,
      roomId
    });
  };
  handleSubmit = () => {
    let {
      name,
      tel,
      id,
      cardNo,
      roomId,
      images,
      imagesTwo,
      type,
      submitVal
    } = this.state;
    let frontUrl = images.join(",");
    let reverseUrl = imagesTwo.join(",");
    let d = {};
    if (type == 1) {
      d.realName = name;
    } else {
      d.name = name;
    }
    if (id) {
      d.id = id;
    }
    d.phonenumber = tel;
    if (type != 1) {
      d.roomId = roomId;
    }
    d.frontUrl = frontUrl;
    d.reverseUrl = reverseUrl;
    d.idCard = cardNo;
    let val = global.$utils.isPhoneNumber.isAvailable(tel);
    // Taro.eventCenter.trigger("refreshDevice", true);
    if (!roomId && type != 1) {
      global.$utils.toast.text("请选择房间号");
      return;
    }
    if (!name) {
      global.$utils.toast.text("请输入姓名");
      return;
    }
    if (!val) {
      global.$utils.toast.text("请输入正确的手机号");
      return;
    }
    if (!cardNo) {
      global.$utils.toast.text("请输入身份证号");
      return;
    }
    if (!frontUrl) {
      global.$utils.toast.text("请上传身份证正面照片");
      return;
    }
    if (!reverseUrl) {
      global.$utils.toast.text("请上传身份证反面照片");
      return;
    }
    Taro.showLoading({
      title: "loading"
    });
    let method = "post";
    if (id) {
      method = "put";
    }
    let url = "liveAdd";
    if (type == 1) {
      url = "authReal";
    }
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    console.log(d, url, "提交的数据");
    global.$utils.api
      .load(url, d, method, { loading: false, login: true })
      .then(res => {
        global.$utils.toast.text(res.msg);
        if (res.code == 200) {
          if (res.data && res.data.token) {
            $utils.data.set("CustomerToken", res.data.token);
          }
          setTimeout(() => {
            Taro.navigateBack();
          }, 500);
        } else {
          this.setState({
            submitVal: true
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          submitVal: true
        });
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };
  setAvatar = src => {
    let images = this.state.images;
    images.push(src);
    if (images.length >= 1) {
      images = images.slice(0, 1);
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
  setAvatarTwo = src => {
    let imagesTwo = this.state.imagesTwo;
    imagesTwo.push(src);
    if (imagesTwo.length >= 1) {
      imagesTwo = imagesTwo.slice(0, 1);
      this.setState({
        imageValTwo: true,
        imagesTwo
      });
      return;
    }
    this.setState({
      imagesTwo
    });
  };
  getImagesTwo = data => {
    this.setState({
      imagesTwo: data,
      imageValTwo: false
    });
  };
  render() {
    let { roomNameList, roomName, name, tel, cardNo, type } = this.state;
    return (
      <View className="cardInfoCreate">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className="cardInfoCreate-header">
            <Image
              className="cardInfoCreate-header-img"
              src={cardInfo_icon}
              mode="aspectFill"
            />
            <View className="cardInfoCreate-header-text">
              提示：一个房间最多可填写3人
            </View>
          </View>
          <View className="cardInfoCreate-br" />
          <View className="cardInfoCreate-box">
            {type != 1 ? (
              <SelectTypeRn
                title="房间号"
                listName={roomNameList}
                selectIndex={this.selectRoomIndex}
                typeName={roomName}
              ></SelectTypeRn>
            ) : null}
            <InputText
              title="姓名"
              type="text"
              onInput={this.changeName}
              className="cardInfoCreate-box-title"
              value={name}
            ></InputText>
            <InputText
              title="手机号"
              type="text"
              onInput={this.changeTel}
              className="cardInfoCreate-box-title"
              value={tel}
            ></InputText>
            <InputText
              title="身份证号"
              type="text"
              onInput={this.changeCardNo}
              className="cardInfoCreate-box-title"
              value={cardNo}
            ></InputText>
            <InputText
              title="上传身份信息"
              type="text"
              placeholder=""
              value={""}
              disabled
              className="cardInfoCreate-box-title"
            ></InputText>
            <View className="cardInfoCreate-box-uploadBox">
              <View className="cardInfoCreate-box-imageBox">
                {this.state.images.map((item, index) => (
                  <View
                    className="cardInfoCreate-box-imageBox-imageItem"
                    key={index}
                  >
                    <CardUploadImage
                      getImages={this.getImages}
                      info={{
                        image: item,
                        index: index,
                        images: this.state.images
                      }}
                    ></CardUploadImage>
                  </View>
                ))}
                {this.state.imageVal ? null : (
                  <CardBoxUpload
                    className="cardInfoCreate-box-imageBox-imageItem"
                    style="padding:15px"
                    title="添加图片"
                    setImage={false}
                    source={card_one}
                    setImg={this.setAvatar}
                    count={1}
                  />
                )}
              </View>
              <View className="cardInfoCreate-box-imageBox">
                {this.state.imagesTwo.map((item, index) => (
                  <View
                    className="cardInfoCreate-box-imageBox-imageItem"
                    key={index}
                  >
                    <CardUploadImage
                      getImages={this.getImagesTwo}
                      info={{
                        image: item,
                        index: index,
                        images: this.state.imagesTwo
                      }}
                    ></CardUploadImage>
                  </View>
                ))}
                {this.state.imageValTwo ? null : (
                  <CardBoxUpload
                    className="cardInfoCreate-box-imageBox-imageItem"
                    style="padding:15px"
                    title="添加图片"
                    setImage={false}
                    source={card_two}
                    setImg={this.setAvatarTwo}
                    count={1}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <SubmitBtn title="提交" handleSubmit={this.handleSubmit}></SubmitBtn>
      </View>
    );
  }
}

export default Index;
