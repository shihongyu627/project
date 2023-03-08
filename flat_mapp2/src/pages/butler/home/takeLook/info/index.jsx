import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { SubmitBtn, IndexList } from "@component";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/image/empty_box1.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {
        // image: ThreePng,
        // title: "诺曼底公寓 武康路南京路西",
        // content: "3室1厅 | 88m² 南",
        // tagArr: ["近地铁", "独立阳台"],
        // price: 1580
      },
      roomInfo: {}
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    console.log(id, "传过来的值");
    this.setState(
      {
        id
      },
      () => {
        this.flatMake();
      }
    );
  }

  async componentWillUnmount() {}
  flatMake = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.id = this.state.id;
    let url = `${global.base_host}/maintainer/flat/make/${this.state.id}`;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          console.log(res);
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
    }, 500);
  };
  //下拉刷新
  onPullDownRefresh = () => {};
  //拨打电话
  handleSubmit = () => {
    console.log("拨打电话");
    let { detail } = this.state;
    if (!detail.phone) {
      return;
    }
    Taro.makePhoneCall({
      phoneNumber: detail.phone //仅为示例，并非真实的电话号码
    });
  };
  render() {
    let { detail, roomInfo } = this.state;
    return (
      <View className='ViewInfo'>
        <View className='ViewInfo-detail'>
          <IndexList info={roomInfo}></IndexList>
        </View>
        <View className='ViewInfo-br' />
        <View className='ViewInfo-box'>
          <View className='ViewInfo-box-item'>
            <View className='ViewInfo-box-item-title'>预约时间</View>
            <View className='ViewInfo-box-item-content'>
              <View className='ViewInfo-box-item-content-one'>
                {detail.seeTime}
              </View>
              {/* <View className="ViewInfo-box-item-content-one ViewInfo-box-item-content-two">
                星期六
              </View>
              <View className="ViewInfo-box-item-content-one ViewInfo-box-item-content-three">
                12:00
              </View> */}
            </View>
          </View>
          <View className='ViewInfo-box-item'>
            <View className='ViewInfo-box-item-title'>联系方式</View>
            <View className='ViewInfo-box-item-content'>
              <View className='ViewInfo-box-item-content-one'>
                姓名：{detail.name}
              </View>
            </View>
            <View className='ViewInfo-box-item-content'>
              <View className='ViewInfo-box-item-content-one'>
                电话：{detail.phone}
              </View>
            </View>
          </View>
          <View
            className='ViewInfo-box-item ViewInfo-box-items'
            style={{ borderBottomWidth: 0 }}
          >
            <View className='ViewInfo-box-item-title ViewInfo-box-items-titles'>
              备注
            </View>
            <View className='ViewInfo-box-item-content'>
              <View className='ViewInfo-box-item-content-one'>
                {detail.descr}
              </View>
            </View>
          </View>
        </View>
        <SubmitBtn
          title='拨打电话'
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
