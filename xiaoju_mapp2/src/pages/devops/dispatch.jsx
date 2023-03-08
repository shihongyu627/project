import Taro, { Component } from "@tarojs/taro";
import { View, Textarea, Picker } from "@tarojs/components";
import namedPng from "../../assets/img/black_saoma.png";
import namedPng1 from "../../assets/img/mark_1.png";
import namedPng2 from "../../assets/img/mark_2.png";
import namedPng3 from "../../assets/img/mark_3.png";
import namedPng4 from "../../assets/img/mark_4.png";
import namedPng5 from "../../assets/img/mark_5.png";

import styles from "./dispatch.module.scss";

class Mark extends Component {
  config = {
    navigationBarTitleText: "车辆调度"
  };

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      device_no: "",
      infoList: [
        {
          title: "故障车辆",
          id: 1
        },
        {
          title: "闲置车辆",
          id: 2
        },
        {
          title: "超区车辆",
          id: 3
        },
        {
          title: "站外车辆",
          id: 4
        }
      ],
      idArr: [],
      latitude: "",
      longitude: "",
      address: "",
      type: ""
    };
  }

  componentWillMount() {
   
  }
  componentDidMount() {
    let params = this.$router.params;
    console.log(params);
    this.setState({
      device_no: params.device_no || "",
    });
    this.lodetop();
  }
  // 获取位置
  lodetop() {
    var that = this;
    Taro.getLocation({
      type: "gcj02",
      success(res) {
        global.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(resv) {
            let address = resv.result.address;
            that.setState({
              address: address
            });
          }
        });
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setState(
          {
            latitude: latitude,
            longitude: longitude
          },
          () => {
            // 设置定位点
          }
        );
      }
    });
  }
  //输入编码
  handleErweimaChange = e => {
    console.log(e.detail.value, "输入车辆编码");
    this.setState({
      device_no: e.detail.value
    });
  };
  // 车辆扫码
  handleQrcode = async () => {
    let device_no = await global.$utils.qrcode.scan();
    if (device_no) {
      this.setState({
        device_no: device_no
      });
    }
  };
  //选择标记
  onClickSelect = id => {
    let a = [];
    a.push(id);
    this.setState({
      idArr: a,
      type: id
    });
  };
  //提交
  faultSubmit = () => {
    console.log(this.state.imgArr);
    let imgArr = this.state.imgArr;
    let d = {};
    d.type = this.state.type;
    d.device_no = this.state.device_no;
    d.content = this.state.content;
    d.s_address = this.state.address;

    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    latitude = String(latitude).replace(/^(.*\..{4}).*$/, "$1");
    latitude = Number(latitude);

    longitude = String(longitude).replace(/^(.*\..{4}).*$/, "$1");
    longitude = Number(longitude);

    d.s_lnglat = longitude + "," + latitude;

    global.$utils.api.load("devopsstartdispatch", d).then(result => {
      if (result.code > 0) {
        global.$utils.toast.success(result.message);
        setTimeout(() => {
          global.$utils.url.back();
        }, 800);
      } else {
        global.$utils.toast.error(result.message);
      }
    });
  };

  render() {
    let { device_no, infoList, idArr } = this.state;
    return (
      <View className={styles.page}>
        <View className={styles.fault_input}>
          <View className={styles.inputsdd}>
            <Input
              type="number"
              selection-start="-1"
              selection-end="-1"
              className="input"
              value={device_no}
              placeholder="请扫描车辆二维码或输入编码"
              onInput={this.handleErweimaChange.bind(this)}
            />
          </View>
          <View
            className={styles.fault_input_right}
            onClick={this.handleQrcode.bind(this)}
          >
            <Image src={namedPng}></Image>
          </View>
        </View>
        <View className={styles.mark_info}>
          <View className={styles.mark_info_title}>请选择调度类型</View>
          <View className={styles.mark_info_box}>
            {infoList.map((item, index) => (
              <View
                className={[
                  styles.mark_info_item,
                  idArr.includes(item.id) && styles.onActive
                ]}
                onClick={this.onClickSelect.bind(this, item.id)}
              >
                <View className={styles.mark_title}>{item.title}</View>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.fault_submit_box}>
          <View className={styles.fault_submit} onClick={this.faultSubmit}>
            提交
          </View>
        </View>
      </View>
    );
  }
}

export default Mark;
