import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { SubmitBtn, BoxUpload, UploadImage, CommonSelect } from "@component";
import { getWindowHeight } from "@utils/style";
import rightPng from "@assets/image/right.png";
import BoxUpload_1 from "@assets/image/BoxUpload_1.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageVal: false,
      listName: [],
      listData: [],
      name: "请选择",
      staffId: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let type = params.type;
    console.log(id, type, "传过来的值");
    this.setState(
      {
        id,
        type
      },
      () => {
        this.staffnoPageList();
      }
    );
  }

  async componentWillUnmount() {}
  staffnoPageList = () => {
    let d = {};
    let { type } = this.state;
    if (type == 1) {
      d.type = 1;
    }
    if (type == 2) {
      d.type = 3;
    }
    global.$utils.api
      .load("staffnoPageList", d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let listData = res.rows || [];
          let listName = [];
          listData.map(item => {
            listName.push(item.name);
          });
          this.setState({
            listData,
            listName
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  //下拉刷新
  onPullDownRefresh = () => {};
  //去评价
  handleSubmit = () => {
    let { type, images, staffId, id } = this.state;
    if (images.length == 0) {
      $utils.toast.text("请上传图片");
      return;
    }
    if (!staffId) {
      $utils.toast.text("请选择处理人");
      return;
    }
    let imageStr = images.join(",") || "";
    let url = "";
    let d = {};
    if (type == 1) {
      url = "propertyCleanEdit";
      d.finishUrl = imageStr;
    }
    if (type == 2) {
      url = "propertyRepairsEdit";
      d.maintainUrl = imageStr;
    }
    d.state = "5";
    d.staffId = staffId;
    d.id = id;
    global.$utils.api
      .load(url, d, "put", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          Taro.eventCenter.trigger("refreshPropertyRecord", true);
          setTimeout(() => {
            Taro.navigateBack();
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
  //选择类型
  selectIndex = data => {
    let { listData } = this.state;
    if (listData.length == 0) {
      return;
    }
    console.log(data, "传过来的索引");
    console.log(listData[data], "传过来的索引取类型值");
    let obj = listData[data];
    let name = obj.name;
    let staffId = obj.id;
    this.setState({
      name,
      staffId
    });
  };
  render() {
    let { detail, stepsList, listName, name } = this.state;
    return (
      <View className='propertyCreate'>
        <View className='propertyCreate-br'></View>
        <View className='propertyCreate-box'>
          <View className='propertyCreate-imageBox'>
            <View className='propertyCreate-imageBox-title'>拍照上传</View>
            {this.state.images.map((item, index) => (
              <View className='propertyCreate-imageBox-imageItem' key={index}>
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
                className='propertyCreate-imageBox-imageItem'
                style='padding:15px'
                title='添加图片'
                setImage={false}
                source={BoxUpload_1}
                setImg={this.setAvatar}
                count={5}
              />
            )}
          </View>
        </View>
        <View className='propertyCreate-selectBox'>
          <View className='propertyCreate-selectBox-left'>选择处理人</View>
          <View className='propertyCreate-selectBox-right'>
            <CommonSelect
              listName={listName}
              selectIndex={this.selectIndex}
              className='propertyCreate-selectBox-right-text'
              title={name}
            ></CommonSelect>
            <Image
              className='propertyCreate-selectBox-right-img'
              src={rightPng}
            ></Image>
          </View>
        </View>

        <SubmitBtn title='提交' handleSubmit={this.handleSubmit}></SubmitBtn>
      </View>
    );
  }
}

export default Index;
