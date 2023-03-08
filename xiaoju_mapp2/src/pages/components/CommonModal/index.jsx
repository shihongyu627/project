import Taro, { Component } from "@tarojs/taro";
import { View, Checkbox, CoverView } from "@tarojs/components";
import "./index.scss";
export default class Index extends Component {
  state = {};
  componentDidMount() {}
  componentDidShow() {}

  render() {
    let { content, title } = this.props;
    return (
      <CoverView className="FilterModalBox">
        <CoverView className="commonModal">
          <CoverView className="title">{title}</CoverView>
          <CoverView className="content">{content}</CoverView>
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
