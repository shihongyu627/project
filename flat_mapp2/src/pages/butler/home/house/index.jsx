import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Image, Text } from "@tarojs/components";
import "./index.scss";
import { HouseList, BoxEmpty, CommonSearch, SubmitBtn } from "@component";

import housePng from "@assets/image/house_icon.png";

export default class Index extends Component {
  state = {
    pageIndex: 1,
    list: [],
    oldlist: [],
    Newlist: [],
    dataTotal: 0,
    selectName: "",
    height: 667,
    buildingName: "",
    floorName: "",
    roomName: "",
    roomId: "",
    flatId: ""
  };

  componentDidMount() {
    const { windowHeight } = Taro.getSystemInfoSync();
    let params = getCurrentInstance().router.params;
    let flatId = params.flatId;
    this.setState(
      {
        height: windowHeight,
        flatId
      },
      () => {
        this.load();
      }
    );
  }
  componentWillUnmount() {}
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.orderByColumn = "id";
    d.isAsc = "descending";
    d.flatId = this.state.flatId;
    global.$utils.api
      .load("roomnoPage", d, "get", false)
      .then(res => {
        if (res.code == 200) {
          let objData = res.data || {};
          console.log(objData);
          let list = [];
          let oldlist = [];
          let Newlist = [];
          for (const key in objData) {
            const element = objData[key];
            let cc = {};
            cc.name = key;
            cc.type = 1;
            cc.children = [];
            cc.elementObj = element;
            if (cc.elementObj) {
              let oneObj = cc.elementObj || {};
              for (const key1 in oneObj) {
                const element1 = oneObj[key1];
                let c1 = {};
                c1.name = key1;
                c1.elementObj1 = element1;
                c1.children = [];
                c1.type = 2;
                cc.children.push(c1);
                if (c1.elementObj1) {
                  let twoObj = c1.elementObj1;
                  for (const key2 in twoObj) {
                    const element2 = twoObj[key2];
                    let c2 = {};
                    c2.name = key2;
                    c2.type = 3;
                    c2.elementObj2 = element2;
                    c2.children = element2;
                    c1.children.push(c2);
                  }
                }
              }
            }
            list.push(cc);
            oldlist.push(cc);
            Newlist.push(cc);
          }
          this.setState({
            list,
            oldlist,
            Newlist
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
  //滑动加载
  onReachBottom = () => {
    let { dataTotal, list } = this.state;
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1
      },
      () => {
        if (dataTotal > list.length) {
          this.load();
        }
      }
    );
  };
  searchList = () => {
    this.setState(
      {
        pageIndex: 1,
        list: []
      },
      () => {
        this.load();
      }
    );
  };
  //选择房屋
  onClickConfrim = data => {
    let { list, buildingName, floorName, roomName } = this.state;
    let arr = [];
    //1是楼号  2 是楼层  3是房间号
    if (data.type == 1) {
      buildingName = data.name;
    }
    if (data.type == 2) {
      floorName = data.name;
    }
    if (data.type == 3) {
      roomName = data.name;
      let obj = data.elementObj2 || {};
      this.setState({
        roomName,
        roomId: obj.id
      });
      return;
    }
    list.map(item => {
      if (data.name == item.name) {
        arr = item.children;
      }
    });
    this.setState({
      buildingName,
      floorName,
      list: arr,
      Newlist: arr
    });
  };

  //搜索
  searchConfirm = data => {
    let { Newlist } = this.state;
    if (!data) {
      this.setState({
        list: Newlist
      });
      return;
    }
    let arr = [];
    Newlist.map(item => {
      var str = item.name;
      if (str.indexOf(data) != -1) {
        arr.push(item);
      }
    });
    this.setState({
      list: arr
    });
  };
  selectClick = data => {
    console.log(data, 999);
    //1楼号  2 层数  3房间号
    let {
      list,
      buildingName,
      floorName,
      roomName,
      oldlist,
      Newlist
    } = this.state;
    let arr = [];
    //1是楼号  2 是楼层  3是房间号
    if (data == 1) {
      buildingName = buildingName;
      floorName = "";
      roomName = "";
      arr = oldlist;
    }
    console.log(arr, 99999);
    if (data == 2) {
      buildingName = buildingName;
      floorName = floorName;
      roomName = "";
      oldlist.map(item => {
        if (item.name == buildingName) {
          arr = item.children;
        }
      });
    }
    if (data == 3) {
      roomName = roomName;
      this.setState({
        roomName
      });
      return;
    }
    this.setState({
      buildingName,
      floorName,
      roomName,
      list: arr,
      Newlist: arr
    });
  };
  //确认选择房源
  handleSubmit = () => {
    let { roomId, buildingName, floorName, roomName } = this.state;
    let name = buildingName + "-" + floorName + "-" + roomName;
    let d = {};
    d.roomId = roomId;
    d.name = name;
    Taro.eventCenter.trigger("refreshHouseData", d); //合同列表
    Taro.navigateBack();
  };
  render() {
    let {
      list,
      selectName,
      height,
      buildingName,
      floorName,
      roomName
    } = this.state;
    return (
      <View className='houseSelect'>
        <CommonSearch searchConfirm={this.searchConfirm}></CommonSearch>
        <View className='houseSelect-header'>
          <Image
            className='houseSelect-header-housePng'
            src={housePng}
            mode='aspectFill'
          />
          <View className='houseSelect-header-selectName'>
            <View
              className='houseSelect-header-selectNames'
              onClick={() => {
                this.selectClick(1);
              }}
            >
              {buildingName ? `${buildingName}  -` : ""}
            </View>
            <View
              className='houseSelect-header-selectNames'
              onClick={() => {
                this.selectClick(2);
              }}
            >
              {floorName ? `${floorName}  -` : ""}
            </View>
            <View
              className='houseSelect-header-selectNames'
              onClick={() => {
                this.selectClick(3);
              }}
            >
              {roomName}
            </View>
          </View>
        </View>
        <ScrollView
          className='scrollDom'
          scrollY
          lowerThreshold={90}
          style={{
            height: process.env.TARO_ENV === "rn" ? height - 260 : height - 90
          }}
        >
          <View className='houseSelect-list'>
            {list.map((item, index) => (
              <HouseList
                info={item}
                key={index}
                onClickConfrim={this.onClickConfrim}
              ></HouseList>
            ))}
            {list.length == 0 ? <BoxEmpty title='暂无房源'></BoxEmpty> : null}
          </View>
          <View className='houseSelect-bottomBr'></View>
        </ScrollView>
        <SubmitBtn title='确认' handleSubmit={this.handleSubmit}></SubmitBtn>
      </View>
    );
  }
}
