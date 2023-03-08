import React, { Component } from "react";
import { connect } from "react-redux";
import VConsole from "@kafudev/react-native-vconsole";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: process.env.NODE_ENV === "development" ? true : false
    };
  }
  render() {
    return <VConsole showBtn={this.state.show || this.props.vconsole.VConsole || false} />;
  }
}


const mapStoreToProps = (store) => ({
  vconsole: store.VConsole,
})
const mapDispatchToProps = (dispatch) => ({
  // dispatch: dispatch
})
export default connect(mapStoreToProps, mapDispatchToProps)(Index)
