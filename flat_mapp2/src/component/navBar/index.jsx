import { Component } from "react";

import { Image, View } from "@tarojs/components";
import "./index.scss";
import navBar_back from "@assets/image/navBar_back.png";
import navBar_back1 from "@assets/image/navBar_back1.png";

export default class Index extends Component {
  state = {
    icon: this.props.color=='#fff' ? navBar_back : navBar_back1
  };

  render() {
    const {
      is_back,
      title,
      background,
      rightIcon,
      className,
      style,
      onClick = () => {},
      onRightClick = () => {}
    } = this.props;
    let { icon } = this.state;
    return (
      <View
        className={className+" navBar_box"}
        style={{
          ...style,background: background ? background : ""
        }}
      >
        {!is_back ? (
          <Image
            className="navBar_box-back"
            src={icon}
            onClick={() => {
              onClick();
            }}
          ></Image>
        ) : null}
        <View
          className="navBar_box-title"
          style={{
            color: this.props.color ? this.props.color : "#fff"
          }}
        >
          {title}
        </View>
        {rightIcon && process.env.TARO_ENV !== "weapp" ? (
          <Image
            className="navBar_box-right"
            src={rightIcon}
            onClick={() => {
              onRightClick();
            }}
          ></Image>
        ) : null}
      </View>
    );
  }
}
