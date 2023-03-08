import { Component } from "react";

import { Image, View, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";
import navBar_back from "@assets/image/navBar_back.png";
import navBar_back1 from "@assets/image/navBar_back1.png";

export default class Index extends Component {
  state = {
    swiperCurrent: 0
  };

  onChangeCurrent = e => {
    let that=this
    that.props.swiperCurrent(e.detail.current);
  };
  render() {
    const { swiperCurrent, banner_list,changeCurrent=()=>{} } = this.props;
    return (
      <View className="homeInfoSwiper">
        <Swiper
          className="homeInfoSwiper-swiper"
          indicatorColor="rgba(0, 0, 0, .3)"
          indicatorActiveColor="#fff"
          circular
          indicatorDots
          autoplay
          interval={2000}
          current={swiperCurrent}
          // onChange={this.onChangeCurrent.bind(this)}
          onChange={(e)=>{
            changeCurrent(e.detail.current)
          }}
        >
          {banner_list.map((item, index) => (
            <SwiperItem key={index} className="index-swiper-item">
              {item ? (
                <Image
                  // src={global.$utils.loadimg.load(item)}
                  className="homeInfoSwiper-swiper-img"
                  src={global.$utils.loadimg.load(item)}
                  mode="aspectFill"
                  onClick={() => {
                    console.log(item, "轮播详情");
                    if (!item.url) {
                      return;
                    }
                    Taro.navigateTo({
                      url: item.url
                    });
                  }}
                />
              ) : (
                ""
              )}
            </SwiperItem>
          ))}
        </Swiper>
      </View>
    );
  }
}
