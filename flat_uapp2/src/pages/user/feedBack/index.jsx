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
  DatePickerRn,
  TimePickerRn,
  SelectTypeRn,
  BoxUpload,
  UploadImage
} from "@component";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/share/share_qq.png";
import FourPng from "@assets/share/share_qzone.png";
import BoxUpload_1 from "@assets/image/BoxUpload_1.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomNameList: [],
      roomData: [],
      date: "", //预约日期
      time: "", //预约时间
      roomName: "",
      roomId: "",
      list: [
        {
          typeId: 1,
          title: "功能建议"
        },
        {
          typeId: 2,
          title: "内容建议"
        },
        {
          typeId: 3,
          title: "BUG反馈"
        }
      ],
      typeId: 1,
      images: [],
      imageVal: false,
      content: "",
      submitVal: true
    };
  }
  componentDidMount() {
    this.roomnoPageList();
  }

  async componentWillUnmount() {}
  //查询房间号
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
  handleSubmit = () => {
    let { images, tel, date, content, typeId, roomId, submitVal } = this.state;
    let d = {};
    d.content = content;
    d.type = typeId;
    d.roomNo = roomId;
    d.imgUrl = images.join(",");
    if (!typeId) {
      global.$utils.toast.text("请选择反馈内容");
      return;
    }
    if (!roomId) {
      global.$utils.toast.text("请选择房屋");
      return;
    }
    // if (!typeId) {
    //   global.$utils.toast.text("请选择房屋");
    //   return;
    // }
    // Taro.showLoading({
    //   title: "loading"
    // });
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    console.log(d, "刷新成功");
    global.$utils.api
      .load("feedback", d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          Taro.navigateBack();
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
    }, 500);
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
  onChangeContent = e => {
    console.log(e.detail.value);
    this.setState({
      content: e.detail.value
    });
  };
  render() {
    let {
      roomNameList,
      roomName,
      date,
      price,
      title,
      list,
      typeId
    } = this.state;
    return (
      <View className="feedBack">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className="feedBack-br" />
          <View className="feedBack-top">
            <View className="feedBack-top-title">反馈内容</View>
            <View className="feedBack-top-box">
              {list.map((item, index) => (
                <View
                  className={
                    "feedBack-top-box-item " +
                    (item.typeId == typeId ? "feedBack-top-box-items" : "")
                  }
                  onClick={() => {
                    this.setState({
                      typeId: item.typeId
                    });
                  }}
                  key={index}
                >
                  {item.title}
                </View>
              ))}
            </View>
          </View>
          <View className="feedBack-box">
            <SelectTypeRn
              title="房屋"
              listName={roomNameList}
              selectIndex={this.selectRoomIndex}
              typeName={roomName}
            ></SelectTypeRn>
            <View className="feedBack-box-Textarea">
              <Textarea
                className="feedBack-box-Textarea-box"
                style="background:#FBFBFB;width:100%;min-height:30px"
                autoHeight
                placeholder="请描述问题，以便我们更好的为您服务"
                onInput={this.onChangeContent.bind(this)}
              />
            </View>
            <View className="feedBack-box-imageBox-title">
              *最多上传5张照片
            </View>
            <View className="feedBack-box-imageBox">
              {this.state.images.map((item, index) => (
                <View className="feedBack-box-imageBox-imageItem" key={index}>
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
                  className="feedBack-box-imageBox-imageItem"
                  style="padding:15px"
                  title="添加图片"
                  setImage={false}
                  source={BoxUpload_1}
                  setImg={this.setAvatar}
                  count={5}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <SubmitBtn
          title="提交反馈"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
