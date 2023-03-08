import Taro, { Component } from "@tarojs/taro";
import { View, Checkbox, CoverView ,CoverImage,Image} from "@tarojs/components";
import "./index.scss";
import { AtActivityIndicator } from "taro-ui";
export default class Index extends Component {
  state = {
    cancel: false
  };
  componentDidMount() {}
  componentDidShow() {}

  render() {
    let { title, isOpened, icon, atActivityIndicator } = this.props;
    return (
      <View>
        {isOpened ? (
          <View className="AtModalContent_wrapp">
            <View className="AtModalContent_box">
              {icon ? (
                <Image
                  className="AtModalContent_icon"
                  mode="widthFix"
                  src={icon}
                />
              ) : null}
              {atActivityIndicator ? (
                <AtActivityIndicator size={64}></AtActivityIndicator>
              ) : null}
              <View className="AtModalContent_title">{title}</View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
