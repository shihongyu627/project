import React, { Component } from "react";
import { connect } from "react-redux";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };

    // todo 可以控制小程序debug调试
  }
  render() {
    return null;
  }
}


const mapStoreToProps = (store) => ({
  vconsole: store.VConsole,
})
const mapDispatchToProps = (dispatch) => ({
  // dispatch: dispatch
})
export default connect(mapStoreToProps, mapDispatchToProps)(Index)
