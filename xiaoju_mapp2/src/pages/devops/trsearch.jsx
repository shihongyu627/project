import Taro, { Component } from "@tarojs/taro";
import { View, Map, CoverView, CoverImage } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import styles from "./trsearch.module.scss";

class OrderInfo extends Component {
  config = {
    navigationBarTitleText: "骑行轨迹"
  };

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      points: [],
      width: 2,
      strokeColor: "#3cbca3",
      borderWidth: 5,
      latitude: "",
      longitude: "",
      end: "",
      includePoints: [],
      polygons: [],
      device_no: "",
      trid: "",
      device_id: ""
    };
  }

  componentDidMount() {
    let params = this.$router.params;
    this.setState(
      {
        device_id: params.device_id,
        trid: params.trid,
        device_no: params.device_no
      },
      () => {
        this.getLocation();
      }
    );
  }

  componentWillUnmount() {}

  // 自身位置
  getLocation() {
    let that = this;
    Taro.getLocation({
      type: "gcj02",
      success(res) {
        console.log(res, 9999);
        const longitude = res.longitude;
        const latitude = res.latitude;
        that.setState(
          {
            longitude: longitude,
            latitude: latitude
          },
          () => {
            // 设置定位点
            that.setMap(longitude, latitude);
          }
        );
      }
    });
  }

  // 获取位置，设置标记点
  setMap(longitude, latitude) {
    let { markers, includePoints } = this.state;
    let mm = [
      {
        id: 1,
        width: "30px",
        height: "30px",
        latitude: Number(latitude),
        longitude: Number(longitude),
        iconPath: require("../../assets/icons/selfAddress.png"),
        // label: {
        //   content: "您所在的位置",
        //   textAlign: "center",
        //   anchorY: -55,
        //   color: "#000000",
        //   fontSize: 15,
        //   padding: 2,
        //   bgColor: "#ffffff88"
        // }
        callout: {
          color: "#147FF9",
          content: "您所在的位置",
          fontSize: 12,
          borderRadius: 5,
          bgColor: "#fff",
          padding: 5,
          textAlign: "center",
          display: "ALWAYS"
        }
      }
    ];
    markers.push(...mm);
    includePoints.push({
      longitude: longitude,
      latitude: latitude
    });
    this.setState(
      {
        markers: markers
      },
      () => {
        this.trsearch(this.state.device_id || "", this.state.trid || "");
        this.getDeviceInfo();
      }
    );
  }
  // 查询车辆信息
  getDeviceInfo = () => {
    let d = {};
    d.device_no = this.state.device_no;
    global.$utils.api
      .load("devopsdeviceinfo", d)
      .then(result => {
        console.log(result, "车辆信息");

        if (result.code <= 0) {
          global.$utils.toast.error("车辆信息错误");
          return;
        }
        let areaRun = result.data.area_run_points_list;
        let arrStop = result.data.area_stop_points_list;
        // 多个区域用 | 分隔
        // let arr = arreaRun.split("|");
        // let arrstop = arreaStop.split("|");
        // 停车点
        let mm = [];
        arrStop.map(item => {
          if (item) {
            let g = {};
            g.longitude = item.lng;
            g.latitude = item.lat;
            g.width = "30px";
            g.height = "30px";
            g.iconPath = require("../../assets/img/stop.png");
            g.id = parseInt(item.id);
            g.name = item.name;
            mm.push(g);
          }
        });

        // 骑行区域
        let polygons = [];
        areaRun.map(item => {
          if (item) {
            let points = [];
            // ; 分隔 每个区域的值
            let array = item.points.split(";");
            for (let i = 0; i < array.length; i++) {
              if (array[i]) {
                let b = {};
                b.latitude = array[i].split(",")[1];
                b.longitude = array[i].split(",")[0];
                points.push(b);
              }
            }
            let a = {};
            a.points = points;
            a.fillColor = "#40E0D088";
            a.strokeColor = "#40E0D0";
            a.strokeWidth = 2;
            a.zIndex = 1;
            polygons.push(a);
          }
        });
        // 停车区域
        arrStop.map(item => {
          if (item) {
            let points = [];
            let array = item.points.split(";");
            for (let i = 0; i < array.length; i++) {
              if (array[i]) {
                let dd = {};
                dd.latitude = array[i].split(",")[1];
                dd.longitude = array[i].split(",")[0];
                points.push(dd);
              }
            }

            let c = {};
            c.points = points;
            c.fillColor = "#1E90FF88";
            c.strokeColor = "#147FF9";
            c.strokeWidth = 2;
            c.zIndex = 1;
            polygons.push(c);
          }
        });
        this.setState({
          polygons: polygons,
          markers: mm
        });
      })
      .catch(() => {
        global.$utils.toast.error("查询车辆错误");
      });
  };
  trsearch(device_id, trid) {
    let { markers, includePoints } = this.state;
    let that = this;
    let q = {};
    q.device_id = device_id;
    q.trid = trid;
    global.$utils.api.load("devopsTrsearch", q).then(res => {
      let tracks = res.data.tracks;
      if (tracks[0].counts !== 0) {
        let points_wp = [];
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].points.map(item => {
            let obj = item.location;
            points_wp.push(obj);
          });

          let arr = tracks[i].endPoint.location;
          let endPointindex = arr.lastIndexOf(",");
          let endPointlongitude = Number(arr.substring(0, endPointindex));
          let endPointlatitude = Number(
            arr.substring(endPointindex + 1, arr.length)
          );

          let array = tracks[i].startPoint.location;
          let startPointindex = array.lastIndexOf(",");
          let startPointlongitude = Number(array.substring(0, startPointindex));
          let startPointlatitude = Number(
            array.substring(startPointindex + 1, array.length)
          );
          let mm = [
            {
              id: 2,
              latitude: endPointlatitude,
              longitude: endPointlongitude,
              width: "50px",
              height: "50px",
              iconPath: require("../../assets/icons/zhong.png")
            },
            {
              id: 3,
              latitude: startPointlatitude,
              longitude: startPointlongitude,
              width: "50px",
              height: "50px",
              iconPath: require("../../assets/icons/qi.png")
            }
          ];
          markers.push(...mm);
          that.setState({
            markers: markers
          });
        }

        let points = [];
        for (let i = 0; i < points_wp.length; i++) {
          let index = points_wp[i].lastIndexOf(",");
          let longitude = points_wp[i].substring(0, index);
          let latitude = points_wp[i].substring(index + 1, points_wp[i].length);
          let obj = { latitude, longitude };
          includePoints.push(obj);
          points.push(obj);
        }
        that.setState({
          points: points,
          includePoints
        });
      }
    });
  }

  render() {
    let { markers } = this.state;
    return (
      <View className={styles.page}>
        <Map
          className={styles.map}
          show-location
          longitude={this.state.longitude}
          include-points={this.state.points}
          latitude={this.state.latitude}
          includePoints={this.state.includePoints}
          polygons={this.state.polygons}
          polyline={[
            {
              points: this.state.points,
              color: this.state.strokeColor,
              width: this.state.width,
              borderWidth: this.state.borderWidth
            }
          ]}
          markers={this.state.markers}
          style="position:fixed;top:0;left:0;right:0;bottom:0;height:100%"
        ></Map>
      </View>
    );
  }
}

const mapStoreToProps = store => ({
  user: store.user,
  config: store.config
});
const mapDispatchToProps = dispatch => ({
  dispatch: dispatch
});
export default connect(mapStoreToProps, mapDispatchToProps)(OrderInfo);
