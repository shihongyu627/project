import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import {
  View,
  ScrollView,
  Button,
  Image,
  Swiper,
  SwiperItem
} from "@tarojs/components";
import "./index.scss";
import currencyPng from "@assets/image/currency.png";
import projectEditPng from "@assets/image/projectEdit.png";
import projectRatePng from "@assets/image/projectRate.png";
import projectRecordPng from "@assets/image/projectRecord.png";
import projectRightPng from "@assets/image/projectRight.png";
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 667,
      menuList: [
        {
          title: "隐患录入",
          icon: projectEditPng,
          url: `/pages/project/create/index`
        },
        {
          title: "隐患记录",
          icon: projectRecordPng,
          url: "/pages/project/record/index"
        },
        {
          title: "评分明细",
          icon: projectRatePng,
          url: "/pages/project/grade/list/index"
        }
      ],
      id: "",
      detail: {},
      galleryArr: []
    };
  }

  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let title = params.title;
    let id = params.id;
    Taro.setNavigationBarTitle({
      title: title
    });
    this.setState(
      {
        title,
        id
      },
      () => {
        this.load();
      }
    );
  }
  load = () => {
    let { id } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.project_id = id;
    global.$utils.api
      .load("projectDetail", d, "get", false)
      .then(res => {
        if (res.data) {
          let data = res.data;
          let galleryArr = data?.gallery?.split(",") || [];
          this.setState({
            galleryArr,
            detail: data
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
  goToUrl = (url, type) => {
    let { id } = this.state;
    if (!url) {
      return $utils.toast.text("暂未开放");
    }
    Taro.navigateTo({
      url: url + `?id=${id}`
    });
  };
  render() {
    let { menuList, detail, galleryArr } = this.state;
    return (
      <View className="projectInfo">
        <View className="projectInfo-header">
          <Swiper className="projectInfo-currencyPng" indicatorDots>
            {galleryArr.map((item, index) => (
              <SwiperItem key={index} className="projectInfo-currencyPng">
                {item ? (
                  <Image
                    src={$utils.loadimg.load(item)}
                    onClick={() => {
                      if (!item) {
                        return;
                      }
                      $utils.image.preview(galleryArr, index);
                    }}
                    className="projectInfo-currencyPng-img"
                    mode="aspectFill"
                  />
                ) : (
                  ""
                )}
              </SwiperItem>
            ))}
          </Swiper>
          {detail.content ? (
            <View className="projectInfo-title">{detail.content}</View>
          ) : null}
        </View>
        {menuList.map((item, index) => {
          return (
            <View
              className="projectInfo-item"
              key={index}
              onClick={() => {
                this.goToUrl(item.url, item.type);
              }}
            >
              <View className="projectInfo-item-right">
                <Image
                  className="projectInfo-item-currencyPng"
                  src={item.icon}
                  mode="aspectFill"
                />
                <View className="projectInfo-item-title">{item.title}</View>
              </View>
              <Image
                className="projectInfo-item-projectRightPng"
                src={projectRightPng}
                mode="aspectFill"
              />
            </View>
          );
        })}
      </View>
    );
  }
}
