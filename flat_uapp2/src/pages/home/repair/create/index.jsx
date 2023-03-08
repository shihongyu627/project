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
  UploadImage,
  AtNavBar
} from "@component";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/share/share_qq.png";
import FourPng from "@assets/share/share_qzone.png";
import BoxUpload_1 from "@assets/image/BoxUpload_1.png";
import commonBgPng from "@assets/image/common_bg.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomNameList: [],
      roomData: [],
      roomName: "",
      roomId: "",
      date: "", //预约日期
      time: "", //预约时间
      list: [],
      typeId: "",
      images: [],
      imageVal: false,
      content: "",
      height: 667,
      submitVal: true
    };
  }
  componentDidMount() {
    Taro.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ffffff"
    });
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let title = params.title;
    let price = params.price;
    const { windowHeight } = Taro.getSystemInfoSync();
    console.log(id, title, price, "传过来的值");
    this.setState(
      {
        id,
        title,
        price,
        height: windowHeight
      },
      () => {
        this.repairsTypeList();
        this.roomnoPageList();
      }
    );
  }
  componentDidShow() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("light-content");
    }
  }
  componentDidHide() {
    if (process.env.TARO_ENV === "rn") {
      //app设置状态栏字体颜色
      let { StatusBar } = require("react-native");
      StatusBar.setBarStyle("dark-content");
    }
  }
  //报修类型
  repairsTypeList = () => {
    let d = {};
    global.$utils.api
      .load("repairsTypeList", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          console.log(res);
          let list = res.rows || [];
          const width = list.length * 70;
          this.setState({
            width,
            list
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
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
            item.roomName = item.name;
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
  changeContent = e => {
    this.setState({
      content: e.detail.value
    });
  };
  handleSubmit = () => {
    let { date, time, typeId, roomId, content, images, submitVal } = this.state;
    let d = {};
    let seeTime = date + " " + time;
    let imgUrl = images.join(",");
    d.makeTime = seeTime;
    d.type = typeId;
    d.descr = content;
    d.roomId = roomId;
    d.imgUrl = imgUrl;
    d.state = "0";
    if (!typeId) {
      global.$utils.toast.text("请选择报修类型");
      return;
    }
    if (!roomId) {
      global.$utils.toast.text("请选择房间号");
      return;
    }
    if (!imgUrl) {
      global.$utils.toast.text("请上传图片");
      return;
    }
    if (!date) {
      global.$utils.toast.text("请选择预约日期");
      return;
    }
    if (!time) {
      global.$utils.toast.text("请选择预约时间");
      return;
    }
    console.log(d, "提交的数据");
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    Taro.showLoading({
      title: "loading"
    });
    global.$utils.api
      .load("RepairsAdd", d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
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
  //选择日期
  selectData = data => {
    this.setState({
      date: data
    });
  };
  //选择时间
  selectTime = data => {
    console.log("预约时间", data);
    this.setState({
      time: data
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
    let roomName = obj.roomName;
    let roomId = obj.id;
    this.setState({
      roomName,
      roomId
    });
  };

  render() {
    let {
      roomNameList,
      roomName,
      date,
      price,
      title,
      width,
      list,
      typeId,
      height
    } = this.state;
    return (
      <View className="repairCreate">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: height - 90 }}
        >
          <View className="repairCreate-header">
            <Image
              className="repairCreate-header-img"
              src={commonBgPng}
              mode="aspectFill"
            />
            <View className="repairCreate-header-content">
              <AtNavBar
                title="预约报修"
                background="rgba(0, 0, 0, 0)"
                color="#fff"
                onClick={() => {
                  Taro.navigateBack();
                }}
              ></AtNavBar>
            </View>
          </View>
          <View className="repairCreate-top">
            <View className="repairCreate-top-title">报修类型</View>
            <ScrollView scrollX scrollWithAnimation>
              <View className="repairCreate-top-box" style={{ width: width }}>
                {list.map((item, index) => (
                  <View
                    className="repairCreate-top-box-item"
                    onClick={() => {
                      this.setState({
                        typeId: item.id
                      });
                    }}
                    key={index}
                  >
                    <Image
                      className="repairCreate-top-box-item-img"
                      src={
                        typeId == item.id
                          ? global.$utils.loadimg.load(item.brightUrl)
                          : global.$utils.loadimg.load(item.darkUrl)
                      }
                    ></Image>
                    <View
                      className={
                        "repairCreate-top-box-item-title " +
                        (typeId == item.id
                          ? "repairCreate-top-box-item-titles"
                          : "")
                      }
                    >
                      {item.name}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          <View className="repairCreate-box">
            <SelectTypeRn
              title="报修房屋"
              listName={roomNameList}
              selectIndex={this.selectRoomIndex}
              typeName={roomName}
            ></SelectTypeRn>
            <View className="repairCreate-box-Textarea">
              <Textarea
                className="repairCreate-box-Textarea-box"
                style="background:#FBFBFB;width:100%;min-height:30px"
                autoHeight
                placeholder="请描述问题，以便我们更好的为您服务"
                onInput={this.changeContent.bind(this)}
              />
            </View>
            <View className="repairCreate-box-imageBox-title">
              *最多上传5张照片
            </View>
            <View className="repairCreate-box-imageBox">
              {this.state.images.map((item, index) => (
                <View
                  className="repairCreate-box-imageBox-imageItem"
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
                  className="repairCreate-box-imageBox-imageItem"
                  style="padding:15px"
                  title="添加图片"
                  setImage={false}
                  source={BoxUpload_1}
                  setImg={this.setAvatar}
                  count={5}
                />
              )}
            </View>
            <DatePickerRn
              title="预约日期"
              selectData={this.selectData}
            ></DatePickerRn>
            <TimePickerRn
              title="预约时间"
              selectTime={this.selectTime}
              date={date}
            ></TimePickerRn>
            {/* <View
              className={
                positionVal
                  ? "repairCreate-box-Textarea"
                  : "repairCreate-box-Textareas"
              }
            >
              <Textarea
                className="repairCreate-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="请输入"
                onFocus={this.onFocus.bind(this)}
                onBlur={this.onBlur.bind(this)}
              />
            </View> */}
          </View>
          <View className="repairCreate-bottomBr"></View>
        </ScrollView>
        <SubmitBtn
          title="提交申请"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
