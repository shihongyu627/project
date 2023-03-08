import Taro, { Component } from "@tarojs/taro";
import { View, Map, CoverView, CoverImage } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import styles from "./waiting.module.scss";

class Waiting extends Component {
  config = {
    navigationBarTitleText: "关锁等待"
  };

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      device_no: "",
      markers: [],
      polygons: [],
      isuse: false,
      time: 0,
      battery: 0,
      mile: 0,
      money: 0,
      lng: "",
      lat: "",
      device_type: "",
      order_id: ""
    };
  }

  componentWillMount() {}

  componentDidMount() {
    let params = this.$router.params || {};
    console.log(params);
    this.setState(
      {
        device_no: params.device_no || "",
        order_id: params.order_id
      },
      () => {
        this.checkNow();
      }
    );
  }

  componentDidShow() {
    this.getLocation();
    this.xxl = setInterval(() => {
      if (this.state.isuse) {
        this.checkNow();
      }
    }, 1000);
  }

  componentDidHide() {
    if (this.xxl) {
      clearInterval(this.xxl);
    }
  }

  componentWillUnmount() {
    if (this.xxl) {
      clearInterval(this.xxl);
    }
  }

  // 检查当前订单是否有用车
  checkNow = () => {
    let d = {};
    if(this.state.lng && this.state.lat) {
      d.lnglat = this.state.lng + "," + this.state.lat;
    }
    global.$utils.api
      .load("orderNow", d, "get", {
        toast: false,
        toasterror: false,
        loading: false
      })
      .then(result => {
        // 无订单  跳转到详情页
        if (result.code == -1) {
          if (this.xxl) {
            clearInterval(this.xxl);
          }
          let order_id = this.state.order_id;
          let end = 8;
          Taro.redirectTo({
            url: `/pages/order/info?order_id=${order_id}&end=${end}`
          });
        }

        if (result.code >= 1) {
          let order_info = result.data || {};
          this.setState({
            isuse: true,
            order_id: order_info.order_id,
            device_no: order_info.device_no,
            battery: order_info.battery || 0,
            time: order_info.time || 0,
            money: order_info.money || 0,
            mile: order_info.mile || 0
          });
        } else {
          this.setState(
            {
              isuse: false,
              order_id: null,
              device_type: null,
              device_no: null
            },
            () => {
              if (this.xxl) {
                clearInterval(this.xxl);
              }
            }
          );
        }
        if (result.code == 1) {
          let device_type = result.data.device_type;

          let arrearun = result.data.device_info.area_stop_points;
          let arreastop = result.data.device_info.area_run_points;
          let arrrun = arrearun.split("|");
          let arrstop = arreastop.split("|");

          // 停车点
          let mm = [];
          arrstop.map(item => {
            if (item) {
              let a = {};
              a.longitude = Number(item.split(";")[0].split(",")[0]);
              a.latitude = Number(item.split(";")[0].split(",")[1]);
              a.width = "30px";
              a.height = "30px";
              a.iconPath = require("../../assets/img/stop.png");
              mm.push(a);
            }
          });

          // 停车区域
          let polygons = [];
          arrrun.map(item => {
            if (item) {
              let points = [];
              let array = item.split(";");

              for (let i = 0; i < array.length; i++) {
                let b = {};
                b.latitude = array[i].split(",")[1];
                b.longitude = array[i].split(",")[0];
                points.push(b);
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
            markers: mm,
            polygons: polygons,
            device_type: device_type
          });
        }
      });
  };

  // 获取位置
  getLocation = async () => {
    let that = this;
    // 回到原来位置
    let mpCtx = Taro.createMapContext("map4select");
    mpCtx.moveToLocation();
    Taro.getLocation({
      type: "gcj02",
      success: async res => {
        console.log("getLocation success", res);
        if (!res) {
          return;
        }
        const lng = res.longitude;
        const lat = res.latitude;
        that.setState({
          lng: lng,
          lat: lat
        });

        // 骑行期间，不查询附近车辆
        if (this.state.isuse) {
          that.setState({
            markers: []
          });
          return;
        }

        // 检查当前订单
        this.checkNow();
      }
    });
  };

  // 故障关锁
  handleRepair = (order_id, device_no) => {
    Taro.navigateTo({
      url: `/pages/repair/index?device_no=${device_no}&order_id=${order_id}&scene=end_order`
    });
  };

  render() {
    return (
      <View className={styles.page}>
        <Map
          id='map4select'
          className={styles.map}
          show-location
          longitude={this.state.lng}
          latitude={this.state.lat}
          polygons={this.state.polygons}
          markers={this.state.markers}
          style='position:fixed;top:0;left:0;right:0;bottom:0;height:100%'
        ></Map>
        {this.state.device_type == 1 ? (
          <CoverView className={styles.use_box}>
            <CoverView className={styles.use_t}>
              正在用车：
              <CoverView style='color:#666;width: 150px'>
                {this.state.device_no}
              </CoverView>
            </CoverView>
            <CoverView className={styles.show_box}>
              <CoverView className={styles.num_box}>
                <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.mile}
                  </CoverView>
                  <CoverView className={styles.num_t2}>骑行里程(km) </CoverView>
                </CoverView>
                <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.time}
                  </CoverView>
                  <CoverView className={styles.num_t2}>使用时长(min)</CoverView>
                </CoverView>
                <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.money}
                  </CoverView>
                  <CoverView className={styles.num_t2}>骑行费用(元)</CoverView>
                </CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        ) : (
          ""
        )}

        {this.state.device_type == 2 ? (
          <CoverView className={styles.use_box}>
            <CoverView className={styles.use_t}>
              正在用车：
              <CoverView style='color:#666;width: 150px'>
                {this.state.device_no}
              </CoverView>
            </CoverView>
            <CoverView className={styles.show_box}>
              <CoverView className={styles.num_box}>
                <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.battery}
                  </CoverView>
                  <CoverView className={styles.num_t2}>剩余电量(%) </CoverView>
                </CoverView>
                <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.time}
                  </CoverView>
                  <CoverView className={styles.num_t2}>使用时长(min)</CoverView>
                </CoverView>
                <CoverView className={styles.num_b}>
                  <CoverView className={styles.num_t}>
                    {this.state.mile}
                  </CoverView>
                  <CoverView className={styles.num_t2}>续航里程(km)</CoverView>
                </CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        ) : (
          ""
        )}
        <CoverView className={styles.submit_box_stop}>
          <CoverView className={styles.submit_btn_stop}>
            <CoverView>
              <CoverImage
                src={require("../../assets/icons/stopc.png")}
                className={styles.stopImg}
              />
            </CoverView>
            <CoverView style='width: 100%;display: flex;'>
              <CoverView className={styles.stop_item}>请手动关锁</CoverView>
              <CoverView
                className={styles.stop_item_btn}
                onClick={this.handleRepair.bind(
                  this,
                  this.state.order_id,
                  this.state.device_no
                )}
              >
                故障关锁
              </CoverView>
            </CoverView>
          </CoverView>
        </CoverView>
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
export default connect(mapStoreToProps, mapDispatchToProps)(Waiting);
