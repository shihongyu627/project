import { Component } from "react";

import { Image, View } from "@tarojs/components";
import "./index.scss";
import newsRead from "@assets/image/newsRead.png";
import home_icon from "@assets/image/home_icon.png";

export default class Index extends Component {
  state = {
    icon: newsRead
  };

  render() {
    const {
      is_back,
      title,
      background,
      rightIcon,
      className,
      style,
      type,
      onClick = () => {},
      onRightClick = () => {}
    } = this.props;
    let { icon } = this.state;
    return (
      <View
        className={className + " NewsNavBarbox"}
        style={{
          ...style,
          backgroundColor: background ? background : ""
        }}
      >
        <Image
          className="NewsNavBarbox-back"
          src={icon}
          onClick={() => {
            onClick();
          }}
        ></Image>
        <View
          className="NewsNavBarbox-title"
          style={{
            color: this.props.color ? this.props.color : "#fff"
          }}
        >
          {title}
        </View>
        <View className="NewsNavBarbox-right"></View>
      </View>
    );
  }
}
