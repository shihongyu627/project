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

import { InputText, SubmitBtn, BoxUpload, UploadImage } from "@component";
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
      title: "",
      content: "",
      images: [],
      imageVal: false,
      submitVal: true
    };
  }
  componentDidMount() {}

  async componentWillUnmount() {}
  handleSubmit = () => {
    let { title, content, images, submitVal } = this.state;
    let d = {};
    d.title = title;
    d.content = content;
    d.gallery = images.join(",");
    if (!title) {
      global.$utils.toast.text("请输入标题");
      return;
    }
    if (!content) {
      global.$utils.toast.text("请输入反馈内容");
      return;
    }
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    $utils.api
      .load("feedbackAdd", d, "post", { loading: false, login: true })
      .then(result => {
        $utils.toast.text(result.message);
        if (result.code == 1) {
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
        $utils.toast.text("操作异常");
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
  //文本
  changeContent = e => {
    this.setState({
      content: e.detail.value
    });
  };
  onChageTitle = data => {
    this.setState({
      title: data
    });
  };
  render() {
    let { title, content } = this.state;
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
            <InputText
              title="标题："
              placeholder="请输入标题"
              onInput={this.onChageTitle}
              value={title}
            ></InputText>
          </View>
          <View className="feedBack-box">
            <View className="feedBack-box-Textarea">
              <Textarea
                className="feedBack-box-Textarea-box"
                style="background:#FBFBFB;width:100%;min-height:30px"
                autoHeight
                placeholder="请描述问题，以便我们更好的为您服务"
                value={content}
                onInput={this.changeContent.bind(this)}
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
