import Taro, { Component } from "@tarojs/taro";
import { View, CoverImage, CoverView } from "@tarojs/components";
import "./index.scss";
export default class Index extends Component {
  state = {};
  componentDidMount() {}
  componentDidShow() {}

  render() {
    let { picImgSrc, title } = this.props;
    return (
      <CoverView className="FilterModalBox">
        <CoverView className="PhotoModal">
          <CoverView className="title">{title}</CoverView>
          <CoverImage className='picImgSrc' mode='widthFix' src={picImgSrc} />
          <CoverView
            className="btn"
            onClick={() => {
              this.props.comfirmOnClick();
            }}
          >
            我知道了
          </CoverView>
        </CoverView>
      </CoverView>
    );
  }
}
