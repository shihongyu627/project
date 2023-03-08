import React,{ Component } from "react";

import { Image, View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {};
  delImage = (image, index) => {
    console.log(image);
    let that=this
    //删除图片
    Taro.showModal({
      title: "提示",
      content: "是否删除重新上传",
      success: function (res) {
        if (res.confirm) {
          let images = that.props.info.images || [];
          images.splice(index, 1);
          setTimeout(() => {
            that.props.getImages(images);
          }, 300);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  };

  render() {
    const { info, title, onClick = () => {} } = this.props;
    return (
      <View
        className='uploadImage_Item1'
        onClick={this.delImage.bind(this, info.image, info.index)}
      >
        <Image
          className='uploadImage_Item1'
          src={info.image}
        />
      </View>
    );
  }
}
