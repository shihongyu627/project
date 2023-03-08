import React, { Component } from "react";

import { Picker, View, Map, } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  state = {
  };
  componentDidMount() {}
  render() {
    let { longitude, latitude, markers, className } = this.props;
    return (
      <View>
        <Map
          id='map4select'
          className='map_box'
          show-location
          longitude={longitude}
          latitude={latitude}
          markers={markers}
        ></Map>
      </View>
    );
  }
}
