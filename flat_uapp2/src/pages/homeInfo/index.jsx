import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Image, Button } from "@tarojs/components";
import "./index.scss";
import {
  ShareSheet,
  AtNavBar,
  HomeInfoSwiper,
  RichText,
  CommonMap
} from "@component";
import share_share from "@assets/image/share.png";
import kefu from "@assets/image/kefu.png";
import { getWindowHeight } from "@utils/style";
import map_address from "@assets/image/map_address.png";

export default class Index extends Component {
  state = {
    banner_list: [],
    swiperCurrent: 0,
    showShare: false, //分享状态
    tagArr: [],
    infoList: [],
    rentListInfo: [],
    descList: [],
    html: "",
    roomInfo: {},
    markers: [],
    points: [],
    latitude: "",
    longitude: "",
    type: ""
  };

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let title = params.title;
    let type = params.type;
    console.log(id, title, "传过来的值");
    this.setState(
      {
        id,
        title,
        type
      },
      () => {
        this.load();
      }
    );
  }
  load = () => {
    let d = {};
    d.id = this.state.id;
    let url = `${global.base_host}/customer/flat/room/${this.state.id}`;
    global.$utils.api
      .load(url, d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let roomInfo = res.data || {};
          let infoList = [
            {
              title: "房型",
              text: roomInfo.houseType
            },
            {
              title: "使用面积",
              text: roomInfo.acreage + " m²"
            },
            {
              title: "朝向",
              text: roomInfo.orientation
            },
            {
              title: "楼层",
              text: roomInfo.floor + "/" + roomInfo.floorNo
            }
          ]; //房源信息
          let banner_list = [];
          let tagArr = [];
          let rentListInfo = []; //租凭信息
          let descList = []; //房源信息
          let imgUrl = roomInfo.imgUrl || "";
          //租凭信息 格式化
          if (roomInfo.leaseName) {
            let arr = [];
            let leaseNameArr = roomInfo.leaseName.split(",");
            leaseNameArr.map(item => {
              item.split(":");
              arr.push(item.split(":"));
            });
            arr.map(item => {
              let obj = {};
              obj.title = item[0];
              obj.text = item[1];
              rentListInfo.push(obj);
            });
          }
          let longitude = "";
          let latitude = "";
          let markers = [];
          let points = [];
          //经纬度
          if (roomInfo.gnote) {
            let arr = roomInfo.gnote.split(",");
            latitude = arr[1];
            longitude = arr[0];
            let m = {
              id: 1,
              latitude: Number(latitude),
              longitude: Number(longitude),
              width: "30px",
              height: "35px",
              iconPath: 'https://flatoss.oss-cn-shanghai.aliyuncs.com/test/20220226/1645848205223_mapAddress.png',
              callout: {
                content: "" + "房源地址：" + (roomInfo.site || "") + "",
                bgColor: "#fff",
                padding: "5px",
                borderRadius: "2px",
                borderWidth: "1px",
                borderColor: "#07c160",
                marginBottom: "10px",
                textAlign: "center"
              }
            };
            markers.push(m);
          }
          console.log(markers);
          //房源信息 格式化
          if (roomInfo.descrName) {
            let arr = [];
            let descrNameArr = roomInfo.descrName.split(",");
            descrNameArr.map(item => {
              item.split("=");
              arr.push(item.split("="));
            });
            arr.map(item => {
              let obj = {};
              obj.name = item[0];
              obj.icon = item[1];
              descList.push(obj);
            });
          }

          if (roomInfo.labelName) {
            tagArr = roomInfo.labelName.split(",");
          }
          banner_list = imgUrl.split(",");
          // houseType 房型  acreage 面积   orientation 方向 floor楼层
          this.setState({
            banner_list,
            roomInfo,
            tagArr,
            infoList,
            rentListInfo,
            descList,
            longitude,
            latitude,
            markers,
            points
          });
        } else {
          $utils.toast.text("内容已删除或不存在");
          setTimeout(() => {
            Taro.navigateBack();
          }, 500);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  //唤醒分享
  onRightClick = () => {
    let { banner_list, roomInfo } = this.state;
    if (process.env.TARO_ENV === "rn") {
      let d = {};
      d.tool = "mini";
      d.title = roomInfo.name;
      d.text = roomInfo.lightspot;
      d.type = "mini";
      d.path = `/pages/homeInfo/index?id=${roomInfo.id}&type=share`;
      d.url = global.download_url;
      d.image = roomInfo.themeUrl;
      d.gallery = banner_list;
      d.platform = ["wechat", "wxcircle", "download"];
      global.$utils.share.board(d);
    } else {
      this.setState({
        showShare: true
      });
    }
  };
  onShareAppMessage(e) {
    let { roomInfo } = this.state;
    //这个分享的函数必须写在入口中，写在子组件中不生效
    let path = `/pages/homeInfo/index?id=${roomInfo.id}&type=share`;
    console.log(path, "分享路径");
    return {
      title: roomInfo.name,
      path: path,
      imageUrl: $utils.loadimg.load(roomInfo.themeUrl),
      success: function(res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  }
  onShareTimeline(e) {
    //这个分享的函数必须写在入口中，写在子组件中不生效
    let { roomInfo } = this.state;
    let path = `/pages/homeInfo/index?id=${roomInfo.id}&type=share`;
    console.log(path, "分享路径");
    return {
      title: roomInfo.name,
      path: path,
      imageUrl: $utils.loadimg.load(roomInfo.themeUrl),
      success: function(res) {
        console.log("转发成功:" + JSON.stringify(res));
        // this.props.handleClose(false);
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  }
  //轮播页码
  changeCurrent = data => {
    this.setState({
      swiperCurrent: data
    });
  };
  //关闭分享弹窗
  onCloseShare = data => {
    this.setState({
      showShare: data
    });
  };
  onTap = data => {
    console.log(data);
  };
  render() {
    let {
      banner_list,
      swiperCurrent,
      showShare,
      tagArr,
      infoList,
      rentListInfo,
      descList,
      roomInfo,
      longitude,
      latitude,
      type
    } = this.state;
    let WechatSDK = null;
    if (process.env.TARO_ENV === "rn") {
      WechatSDK = require("react-native-wechat-lib");
    }
    return (
      <View className='homeInfo'>
        <ScrollView
          className='scrollDom'
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className='homeInfo-header'>
            <View className='homeInfo-header-br'></View>
            <AtNavBar
              title='房源详情'
              background='#fff'
              color='#333'
              className='homeInfo-header-AtNavBar'
              onClick={() => {
                if (type == "share") {
                  Taro.switchTab({
                    url: "/pages/tabbar/index/index"
                  });
                  return;
                }
                Taro.navigateBack();
              }}
              rightIcon={share_share}
              type={type}
              onRightClick={this.onRightClick}
            ></AtNavBar>
            {/* 轮播 */}
            <HomeInfoSwiper
              swiperCurrent={swiperCurrent}
              banner_list={banner_list}
              changeCurrent={this.changeCurrent}
            />
            <View className='homeInfo-header-page'>
              <View className='homeInfo-header-page-text'>
                {swiperCurrent + 1}
              </View>
              <View className='homeInfo-header-page-text'>/</View>
              <View className='homeInfo-header-page-text'>
                {banner_list.length}
              </View>
            </View>
          </View>
          <View className='homeInfo-titleBox'>
            <View className='homeInfo-titleBox-one'>
              <View className='homeInfo-titleBox-one-title'>
                {roomInfo.name}
              </View>
              <View className='homeInfo-titleBox-one-right'>
                <View className='homeInfo-titleBox-one-right-radio'></View>
                <View className='homeInfo-titleBox-one-right-status'>
                  {roomInfo.stateName}
                </View>
              </View>
            </View>
            <View className='homeInfo-titleBox-tagBox'>
              {tagArr.map((item, index) => (
                <View className='homeInfo-titleBox-tagBox-item' key={index}>
                  {item}
                </View>
              ))}
            </View>
            <View className='homeInfo-titleBox-price'>
              <View className='homeInfo-titleBox-price-left'>
                {/* <View className='homeInfo-titleBox-price-left-one'>￥</View>
                <View className='homeInfo-titleBox-price-left-two'>
                  {roomInfo.price || 0}
                </View>
                <View className='homeInfo-titleBox-price-left-one'>/月</View> */}
              </View>
              {process.env.TARO_ENV === "rn" ? null : (
                <Image
                  className='homeInfo-titleBox-price-right'
                  src={share_share}
                  mode='aspectFill'
                  onClick={this.onRightClick.bind(this)}
                />
              )}
            </View>
          </View>

          <View className='homeInfo-info'>
            <View className='homeInfo-info-title'>房源信息</View>
            <View className='homeInfo-info-content'>
              {infoList.map((item, index) => (
                <View
                  className={
                    "homeInfo-info-content-item " +
                    (index == 0 ? "homeInfo-info-content-items" : "")
                  }
                  key={index}
                >
                  <View className='homeInfo-info-content-item-title'>
                    {item.title}
                  </View>
                  <View className='homeInfo-info-content-item-text'>
                    {item.text}
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View className='homeInfo-rent'>
            <View className='homeInfo-rent-title'>租赁信息</View>
            <View className='homeInfo-rent-rentListInfo'>
              {rentListInfo.map((item, index) => (
                <View className='homeInfo-rent-rentListInfo-item ' key={index}>
                  <View
                    className={
                      "homeInfo-rent-rentListInfo-item-title " +
                      (index % 2 == 0
                        ? "homeInfo-rent-rentListInfo-item-titles"
                        : "")
                    }
                  >
                    {item.title}
                  </View>
                  <View className='homeInfo-rent-rentListInfo-item-text'>
                    {item.text}
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View className='homeInfo-descList'>
            <View className='homeInfo-descList-title'>房源描述</View>
            <View className='homeInfo-descList-box'>
              {descList.map((item, index) => (
                <View className='homeInfo-descList-box-item ' key={index}>
                  <Image
                    className='homeInfo-descList-box-item-icon'
                    src={global.$utils.loadimg.load(item.icon)}
                    mode='aspectFill'
                  />
                  <View className='homeInfo-descList-box-item-text'>
                    {item.name}
                  </View>
                </View>
              ))}
            </View>
            <View className='homeInfo-descList-title'>房源亮点</View>
            <View className='homeInfo-descList-text'>{roomInfo.lightspot}</View>
            <View className='homeInfo-descList-title homeInfo-descList-titles'>
              交通出行
            </View>
            <View className='homeInfo-descList-text'>{roomInfo.traffic}</View>
          </View>
          <View className='homeInfo-mapBox'>
            <View className='homeInfo-mapBox-header'>
              <View className='homeInfo-mapBox-title'>位置信息</View>
              <View
                className='homeInfo-mapBox-leftTitle'
                onClick={() => {
                  if (process.env.TARO_ENV === "rn") {
                    let MapLinking = require("react-native-map-linking")
                      .default;
                    MapLinking.markLocation(
                      { lat: latitude, lng: longitude },
                      roomInfo.flatName,
                      roomInfo.site
                    );
                  } else {
                    Taro.openLocation({
                      latitude: Number(latitude),
                      longitude: Number(longitude),
                      name: roomInfo.flatName,
                      address: roomInfo.site
                    }).then(res => {
                      console.log(res);
                    });
                  }
                }}
              >
                导航
              </View>
            </View>
            <View className='homeInfo-mapBox-mapView'>
              <CommonMap
                className='homeInfo-mapBox-mapView'
                longitude={longitude}
                latitude={latitude}
                markers={this.state.markers}
                address={roomInfo.site}
              />
            </View>
          </View>
          {process.env.TARO_ENV === "rn" ? null : (
            <ShareSheet
              showShare={showShare}
              onCloseShare={this.onCloseShare}
              filePath={banner_list}
            />
          )}
          {this.state.html ? (
            <View className='homeInfo-RichText'>
              <RichText html={this.state.html}></RichText>
            </View>
          ) : null}
          <View className='homeInfo-bottomBr'></View>
        </ScrollView>
        <View className='homeInfo-footer'>
          {process.env.TARO_ENV !== "rn" ? (
            <View className='homeInfo-footer-kefuBox'>
              <Image
                className='homeInfo-footer-kefu'
                src={kefu}
                mode='aspectFill'
              />
              <Button
                className='homeInfo-footer-kefuBox-contact'
                open-type='contact'
              ></Button>
            </View>
          ) : (
            <View className='homeInfo-footer-kefuBox'>
              <Image
                className='homeInfo-footer-kefu'
                src={kefu}
                onClick={() => {
                  WechatSDK.launchMiniProgram({
                    userName: global.wechat_gh, // 小程序原始ID
                    path: "/pages/kefu/index", // 小程序页面路径
                    miniProgramType: 2 // 正式版:0，测试版:1，体验版:2
                  })
                    .then(res => {
                      console.log(res);
                      // toast.text('分享成功')
                    })
                    .catch(err => {
                      console.log(err);
                      $utils.toast.text("打开小程序出错");
                    });
                }}
                mode='aspectFill'
              />
            </View>
          )}

          <View className='homeInfo-footer-btn'>
            <View
              onClick={() => {
                console.log("电话咨询");
                if (!roomInfo.flatPhone) {
                  return;
                }
                Taro.makePhoneCall({
                  phoneNumber: roomInfo.flatPhone //仅为示例，并非真实的电话号码
                });
              }}
              className='homeInfo-footer-btn-common homeInfo-footer-btn-left'
            >
              电话咨询
            </View>
            <View
              onClick={() => {
                if (!global.isLogin) {
                  $utils.toast.isLoginModal();
                  return;
                }
                Taro.navigateTo({
                  url: `/pages/home/houseView/create/index?id=${roomInfo.id}`
                });
              }}
              className='homeInfo-footer-btn-common homeInfo-footer-btn-right'
            >
              预约看房
            </View>
          </View>
        </View>
      </View>
    );
  }
}
