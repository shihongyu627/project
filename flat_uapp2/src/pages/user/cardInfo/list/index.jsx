import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, ScrollView, Image, Input, Text } from "@tarojs/components";
import "./index.scss";
import { BoxEmpty, CardInfoList, SubmitBtn, CommonSelect } from "@component";
import cardInfo_icon from "@assets/image/cardInfo_warn.png";
import cardInfo_bg from "@assets/image/cardInfo_bg.png";

import cardInfo_change from "@assets/image/cardInfo_change.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    roomNameList: [],
    roomData: [],
    roomName: "",
    roomId: "",
    height: 667,
    actions: [
      {
        label: "个人实名",
        value: "1"
      },
      {
        label: "共同居住人实名",
        value: "2"
      }
    ],
    actionsWeapp: ["个人实名", "共同居住人实名"],
    userInfo: {}
  };

  componentDidMount() {
    // Taro.setNavigationBarColor({
    //   frontColor: "#000000",
    //   backgroundColor: "#ffffff"
    // });
    // this.load();
    const info = Taro.getSystemInfoSync();
    this.setState({
      height: info.windowHeight
    });
  }
  componentWillUnmount() {}
  componentDidShow() {
    this.setState(
      {
        list: [],
        pageIndex: 1
      },
      () => {
        this.userData();
      }
    );
  }
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
          let roomId = "";
          let roomName = "";
          if (roomData && roomData.length > 0) {
            let cc = roomData[0];
            roomName = cc.name || "";
            roomId = cc.id || "";
          }
          this.setState(
            {
              roomData,
              roomNameList,
              roomName,
              roomId
            },
            () => {
              if (roomId) {
                this.load();
              }
            }
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    d.roomId = this.state.roomId;
    global.$utils.api
      .load("liveList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let v = res.rows || [];
          let listOld = this.state.list;
          let listNew = [];
          let list = [];
          v.map(item => {
            listNew.push(item);
          });
          list = [...listOld, ...listNew];
          console.log(list);
          this.setState({
            list: list
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
  onPullDownRefresh = () => {
    this.setState(
      {
        list: [],
        pageIndex: 1
      },
      () => {
        this.userData();
      }
    );
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  userData = () => {
    let { list, userInfo } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    global.$utils.api
      .load("getInfo", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          userInfo = res.user || {};
          $utils.data.set("userInfo", userInfo || {});
          $utils.data.set("isLogin", true);
          global.isLogin = true;
          let cc = {};
          cc.name = userInfo.realName;
          cc.idCard = userInfo.idCard;
          cc.phonenumber = userInfo.phonenumber;
          cc.type = 1;
          if (userInfo.isReal == 1) {
            list.push(cc);
          }
          this.setState(
            {
              list,
              userInfo
            },
            () => {
              this.roomnoPageList();
            }
          );
        } else {
          this.roomnoPageList();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  //选择类型
  selectIndex = data => {
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
  getOnClick = (data, type) => {
    console.log(data);
    if (type == "del") {
      Taro.showModal({
        title: "温馨提示",
        content: "是否删除身份信息？"
      }).then(res => {
        if (res.confirm) {
          this.delOnClick(data);
          return true;
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      });
      return;
    }
    Taro.navigateTo({
      url: `/pages/user/cardInfo/create/index?id=${data.id}`
    });
  };
  delOnClick = data => {
    Taro.showLoading({
      title: "loading"
    });
    let url = `${global.base_host}/customer/flat/live/delStatus/${data.id}`;
    global.$utils.api
      .load(url, {}, "DELETE", { loading: false, login: true })
      .then(res => {
        global.$utils.toast.text(res.msg);
        if (res.code == 200) {
          setTimeout(() => {
            this.setState(
              {
                list: [],
                pageIndex: 1
              },
              () => {
                this.load();
              }
            );
          }, 500);
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  handleSubmit = () => {
    let { actionsWeapp, actions, userInfo } = this.state;
    if (userInfo.isReal == 1) {
      Taro.navigateTo({
        url: `/pages/user/cardInfo/create/index?`
      });
      return;
    }
    if (process.env.TARO_ENV === "rn") {
      this._actionsheet.open();
    } else {
      Taro.showActionSheet({
        itemList: actionsWeapp,
        success: function(res) {
          console.log(res.tapIndex);
          let data = actions[res.tapIndex] || "";
          if (data.value == 1) {
            Taro.navigateTo({
              url: `/pages/user/cardInfo/create/index?type=${data.value}`
            });
            return;
          }
          Taro.navigateTo({
            url: `/pages/user/cardInfo/create/index?`
          });
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      });
    }
  };
  render() {
    let { list, height, roomNameList, roomName, actions } = this.state;
    let RnActionsheet = null;
    if (process.env.TARO_ENV === "rn") {
      let { Actionsheet } = require("beeshell");
      RnActionsheet = Actionsheet;
    }
    return (
      <View className='cardInfoBox'>
        <View className='cardInfoBox-header'>
          <Image
            className='cardInfoBox-header-img'
            src={cardInfo_icon}
            mode='aspectFill'
          />
          <View className='cardInfoBox-header-text'>
            提示：一个房间最多可填写3人
          </View>
        </View>
        <View className='cardInfoBox-house'>
          <Image
            className='cardInfoBox-house-bg'
            src={cardInfo_bg}
            mode='aspectFill'
          />
          <View className='cardInfoBox-house-content'>
            <View className='cardInfoBox-house-content-title'>当前房屋</View>
            <View className='cardInfoBox-house-content-flex'>
              <View className='cardInfoBox-house-content-flex-address'>
                {roomName || "暂无房屋"}
              </View>
              <View className='cardInfoBox-house-content-flex-right'>
                <Image
                  className='cardInfoBox-house-content-flex-right-img'
                  src={cardInfo_change}
                  mode='aspectFill'
                />
                <CommonSelect
                  listName={roomNameList}
                  selectIndex={this.selectIndex}
                  className='cardInfoBox-house-content-flex-right-text'
                  title='切换'
                ></CommonSelect>
              </View>
            </View>
          </View>
        </View>
        <View className='cardInfoBox-list'>
          {list.map((item, index) => (
            <CardInfoList
              info={item}
              getOnClick={this.getOnClick}
              key={index}
            ></CardInfoList>
          ))}
          {list.length == 0 ? <BoxEmpty title='暂无身份信息'></BoxEmpty> : null}
        </View>
        {process.env.TARO_ENV === "rn" ? (
          <RnActionsheet
            ref={c => {
              this._actionsheet = c;
            }}
            data={actions}
            cancelable
            header='认证类型'
            useSafeAreaView
            offsetY={height + 20}
            onPressConfirm={item => {
              if (item.value == 1) {
                Taro.navigateTo({
                  url: `/pages/user/cardInfo/create/index?type=${item.value}`
                });
                return;
              }
              Taro.navigateTo({
                url: `/pages/user/cardInfo/create/index?`
              });
            }}
            onPressCancel={() => {
              console.log("cancel");
            }}
          ></RnActionsheet>
        ) : null}
        {list.length != 2 ? (
          <SubmitBtn title='添加' handleSubmit={this.handleSubmit}></SubmitBtn>
        ) : null}
      </View>
    );
  }
}
