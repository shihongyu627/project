import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Picker,
  Map,
  CoverView,
  CoverImage
} from "@tarojs/components";
import Taro from "@tarojs/taro";

import {
  Picker as PickerTime,
  DatePickerRn,
  BoxUpload,
  UploadImage,
  AtNavBar,
  SelectTypeRn,
  ShareSheet
} from "@component";
import BoxUpload_1 from "@assets/image/BoxUpload_1.png";
import weissPng from "@assets/image/address_icon.png";

import dayjs from "dayjs";
import "./index.scss";
// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageVal: false,
      startTime: dayjs(new Date()).format("YYYY-MM-DD"),
      markers: [],
      points: [],
      listName: ["美国", "中国", "巴西", "日本"],
      listData: [
        {
          name: "美国",
          id: 1
        },
        {
          name: "中国",
          id: 2
        },
        {
          name: "巴西",
          id: 3
        },
        {
          name: "日本",
          id: 4
        }
      ],
      name: ""
    };
  }
  componentDidMount() {
    Taro.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#ffffff"
    });
    if (process.env.TARO_ENV === "rn") {
      let { NativeModules, StatusBar, LogBox } = require("react-native");
      StatusBar.setBarStyle("dark-content"); // 设置状态栏样式 dark-content | light-content
      LogBox.ignoreAllLogs();
      setTimeout(
        () => {
          NativeModules.RNBootSplash.hide(true); // 隐藏启动屏
        },
        process.env.NODE_ENV === "development" ? 200 : 1500
      );
    }
  }

  async componentWillUnmount() {}
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
  getDateTime = data => {
    console.log(data, 555);
    this.setState({
      repairTime: data
    });
  };
  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    });
  };
  guideMap = () => {
    if (process.env.TARO_ENV === "rn") {
      let MapLinking = require("react-native-map-linking").default;
      MapLinking.markLocation(
        { lat: 39.810077, lng: 115.723142 },
        "测试导航",
        "测试导航"
      );
    } else {
      Taro.openLocation({
        latitude: Number(39.810077),
        longitude: Number(115.723142),
        name: "测试导航",
        address: `活动地点：测试导航`
      }).then(res => {
        console.log(res);
      });
    }
  };
  goTab = () => {
    Taro.switchTab({
      url: "/pages/user/index"
    });
  };
  goPage = () => {
    if (process.env.TARO_ENV === "rn") {
      let d = {};
      d.type = "image";
      d.image = "http://weixiu.kafukeji.com/admin/profile/upload/2021/11/27/b1490763-da1c-46a4-bf0d-c1f2033c036a.jpg?imageView2/2/w/1080/h/1080/q/75&imageView2/2/w/1080/h/1080/q/75";
      d.platform = ["wechat", "wxcircle", "download"];
      global.$utils.share.board(d);
    } else {
      this.setState({
        showShare: true
      });
    }
  };
  selectIndex = data => {
    let { listData } = this.state;
    if (listData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(listData[data], "传过来的索引取类型值");
    let obj = listData[data];
    let name = obj.name;
    let id = obj.id;
    this.setState({
      name,
      id
    });
  };
  onChange = e => {
    let index = [e.detail.value];
    let dataList = this.state.listData;
    let selectData = dataList[index];
    console.log(selectData);
    this.setState({
      selectorChecked: selectData.name || "",
      selectorIDChecked: selectData.id || ""
    });
  };
  copyBtn = () => {
    // let data = global.$utils.toast.modal("提示", "提示1") || "";
    // if (!data) {
    //   return;
    // }
    Taro.setClipboardData({
      data: "33333",
      success: function(res) {
        Taro.getClipboardData({
          success: function(res) {
            console.log(res.data); // data
          }
        });
      }
    });
  };
  onCloseShare = data => {
    this.setState({
      showShare: data
    });
  };
  render() {
    return (
      <View className='index'>
        <AtNavBar
          title='查看巡检记录'
          background='#fff'
          color='#333'
          onClick={() => {
            Taro.navigateBack();
          }}
        ></AtNavBar>
        <View className='index_picker_time'>
          <PickerTime getDateTime={this.getDateTime}></PickerTime>
        </View>
        {process.env.TARO_ENV === "rn" ? (
          <DatePickerRn></DatePickerRn>
        ) : (
          <Picker
            start={this.state.startTime}
            mode='date'
            onChange={this.onDateChange}
          >
            <View className='picker'>当前选择：{this.state.dateSel}</View>
          </Picker>
        )}
        {process.env.TARO_ENV === "rn" ? (
          <View className='select_box'>
            <View className='select_title'>国家</View>
            <View className='select_title'>
              {this.state.name || "请选择国家"}
              <SelectTypeRn
                title='选择国家'
                listName={this.state.listName}
                selectIndex={this.selectIndex}
              ></SelectTypeRn>
            </View>
          </View>
        ) : (
          <Picker
            mode='selector'
            range={this.state.listName}
            onChange={this.onChange}
          >
            <View className='picker'>
              当前选择：{this.state.selectorChecked}
            </View>
          </Picker>
        )}
        <View className='index_Map_guide' onClick={this.guideMap.bind(this)}>
          导航
        </View>
        <View className='index_goTab' onClick={this.goTab.bind(this)}>
          tab跳转
        </View>
        <View className='index_goPage' onClick={this.goPage.bind(this)}>
          <View className='index_goPage_title'>页面跳转传参</View>
        </View>
        <View
          className='index_goPage'
          onClick={() => {
            this.copyBtn();
          }}
        >
          <View className='index_goPage_title'>复制</View>
        </View>
        <View className='imageBox'>
          {this.state.images.map((item, index) => (
            <View className='imageItem' key={index}>
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
              className='imageItem'
              style='padding:15px'
              title='添加图片'
              setImage={false}
              source={BoxUpload_1}
              setImg={this.setAvatar}
              count={5}
            />
          )}
        </View>
        <View className='mapsTop'>
          <Map
            id='map4select'
            className='tops'
            show-location
            longitude={this.state.longitude}
            latitude={this.state.latitude}
            include-points={this.state.points}
            markers={this.state.markers}
            onRegionChange={this.onTap}
          >
            <CoverView className='icons'>
              <CoverImage src={weissPng}></CoverImage>
            </CoverView>
          </Map>
        </View>
        <View className='index_goTab' onClick={this.goTab.bind(this)}>
          tab跳转
        </View>
        {process.env.TARO_ENV === "rn" ? null : (
          <ShareSheet filePath='http://weixiu.kafukeji.com/admin/profile/upload/2021/11/27/b1490763-da1c-46a4-bf0d-c1f2033c036a.jpg?imageView2/2/w/1080/h/1080/q/75&imageView2/2/w/1080/h/1080/q/75' showShare={this.state.showShare} onCloseShare={this.onCloseShare} />
        )}
      </View>
    );
  }
}

export default Index;
