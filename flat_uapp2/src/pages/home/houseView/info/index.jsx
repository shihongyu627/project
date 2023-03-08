import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { SubmitBtn, IndexList } from "@component";
import { getWindowHeight } from "@utils/style";
import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      roomInfo: {}
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    this.setState(
      {
        id
      },
      () => {
        this.load();
      }
    );
  }

  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let url = `${global.base_host}/customer/flat/make/${this.state.id}`;
    d.id = this.state.id;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let obj = (res.data && res.data.flatRoomResponse) || {};
          obj.tagArr = [];
          if (obj.labelName) {
            obj.tagArr = obj.labelName.split(",");
          }
          obj.content = obj.lightspot;
          obj.title = obj.name;
          this.setState({
            detail: res.data,
            roomInfo: obj
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  //导航
  handleSubmit = () => {
    console.log("导航");
    let { roomInfo } = this.state;
    if (roomInfo && roomInfo.gnote) {
      let arr = roomInfo.gnote.split(",");
      let lat = arr[1];
      let lng = arr[0];
      if (process.env.TARO_ENV === "rn") {
        let MapLinking = require("react-native-map-linking").default;
        MapLinking.markLocation(
          { lat: lat, lng: lng },
          roomInfo.flatName,
          roomInfo.site
        );
      } else {
        Taro.openLocation({
          latitude: Number(lat),
          longitude: Number(lng),
          name: roomInfo.flatName,
          address: roomInfo.site
        }).then(res => {
          console.log(res);
        });
      }
    }
  };
  goInfo = data => {
    let infoId = data.id;
    let infoTitle = data.title;
    Taro.navigateTo({
      url: `/pages/homeInfo/index?id=${infoId}&title=${infoTitle}`
    });
  };
  render() {
    let { detail, roomInfo } = this.state;
    return (
      <View className='publicDevice'>
        <ScrollView
          className='scrollDom'
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className='publicDevice-detail'>
            <IndexList info={roomInfo} goInfo={this.goInfo}></IndexList>
          </View>
          <View className='publicDevice-br' />
          <View className='publicDevice-box'>
            <View className='publicDevice-box-item'>
              <View className='publicDevice-box-item-title'>预约时间</View>
              <View className='publicDevice-box-item-content'>
                <View className='publicDevice-box-item-content-one'>
                  {detail.seeTime}
                </View>
              </View>
            </View>
            <View className='publicDevice-box-item'>
              <View className='publicDevice-box-item-title'>联系方式</View>
              <View className='publicDevice-box-item-content'>
                <View className='publicDevice-box-item-content-one'>
                  姓名：{detail.name}
                </View>
              </View>
              <View className='publicDevice-box-item-content'>
                <View className='publicDevice-box-item-content-one'>
                  电话：{detail.phone}
                </View>
              </View>
            </View>
            <View
              className='publicDevice-box-item publicDevice-box-items'
              style={{ borderBottomWidth: 0 }}
            >
              <View className='publicDevice-box-item-title publicDevice-box-items-titles'>
                备注
              </View>
              <View className='publicDevice-box-item-content'>
                <View className='publicDevice-box-item-content-one'>
                  {detail.descr}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <SubmitBtn
          title='导航路线'
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
