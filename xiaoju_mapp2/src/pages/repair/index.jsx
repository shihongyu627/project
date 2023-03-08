import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Map,
  CoverView,
  CoverImage,
  Image,
  Text,
  Input,
  Textarea
} from "@tarojs/components";
import { AtImagePicker } from "taro-ui";

import styles from "./index.module.scss";
import namedPng from "../../assets/img/black_saoma.png";
import namedPng2 from "../../assets/img/repair_1.png";

class Fault extends Component {
  config = {
    navigationBarTitleText: "故障上报"
  };

  static defaultProps = {
    current: 0,
    longitude: "",
    latitude: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      device_no: "",
      content: "",
      isSubmit: false,
      markers: [],
      address: "",
      points: [],
      filesOne: [],
      filesTwo: [],
      list: [
        {
          title: "刹车异常"
        },
        {
          title: "方向盘故障"
        },
        {
          title: "轮胎没气"
        },
        {
          title: "链条脱落"
        },
        {
          title: "车锁破坏"
        },
        {
          title: "二维码损坏"
        },
        {
          title: "车座损坏"
        },
        {
          title: "脚踏损坏"
        },
        {
          title: "车锁打不开"
        },
        {
          title: "车没电了"
        },
        {
          title: "车辆不走"
        },
        {
          title: "付款锁没开"
        },
        {
          title: "无法关锁"
        },
        {
          title: "关锁后订单还在计费"
        }
        // {
        //   title: "其他部位"
        // }
      ],
      arrId: [],
      imgArrOne: [],
      imgArrTwo: []
    };
  }

  componentWillMount() {
    let params = this.$router.params;
    console.log(params);
    this.setState({
      device_no: params.device_no || "",
      order_id: params.order_id || "",
      scene: params.scene || ""
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
            that.setMap();
          }
        );
      }
    });
  }
  // 获取位置，设置标记点
  setMap() {
    // let mm = []
    // let m = {
    //   id: 1,
    //   latitude: this.state.latitude,
    //   longitude: this.state.longitude,
    // }
    // mm.push(m)
    // this.setState({
    //   markers: mm
    // })
  }
  // 移动坐标
  onTap(e) {
    if (e.type == "end" && (e.causedBy == "scale" || e.causedBy == "drag")) {
      console.log(e);
      var that = this;
      this.mapCtx = Taro.createMapContext("map4select");
      this.mapCtx.getCenterLocation({
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
        }
      });
    }
  }

  //输入编码
  handleErweimaChange = e => {
    console.log(e.detail.value, "输入编码");
    this.setState({
      device_no: e.detail.value
    });
  };
  //问题
  handleChange(event) {
    this.setState({
      content: event.target.value
    });
  }
  // 图片
  onChangeOne(files) {
    console.log(11111);
    var that = this;
    let array = [];
    for (let i = 0; i < files.length; i++) {
      let element = files[i].url;

      Taro.uploadFile({
        url: `${global.app_host}/api/upload/uploadimage`,
        filePath: element,
        name: "file",
        formData: {
          user: "test"
        },
        success(res) {
          const imgData = JSON.parse(res.data);
          array.push(imgData.data.url);
          console.log(res, "333333333");
          that.setState({
            imgArrOne: array
          });
        }
      });
    }
    this.setState({
      filesOne: files
    });
  }
  // 图片
  onChangeTwo(files) {
    console.log(11111);
    var that = this;
    let array = [];
    for (let i = 0; i < files.length; i++) {
      let element = files[i].url;
      Taro.uploadFile({
        url: `${global.app_host}/api/upload/uploadimage`,
        filePath: element,
        name: "file",
        formData: {
          user: "test"
        },
        success(res) {
          const imgData = JSON.parse(res.data);
          array.push(imgData.data.url);
          console.log(res, "333333333");
          that.setState({
            imgArrTwo: array
          });
        }
      });
    }
    this.setState({
      filesTwo: files
    });
  }
  onFail(mes) {
    console.log(mes);
  }
  onImageClick(index, file) {
    console.log(index, file, "5555555");
  }
  //提交
  faultSubmit = () => {
    console.log(this.state.imgArrOne);
    let imgArrOne = this.state.imgArrOne;
    let imgArrTwo = this.state.imgArrTwo;
    let imgArr = [...imgArrOne, ...imgArrTwo];
    if (imgArr.length == 0) {
      // 弹窗显示
      Taro.showModal({
        title: "提示",
        content: "请上传故障部位照片",
        showCancel: false,
        confirmText: "我知道了"
      });
      return;
    }
    if (this.state.content.length < 5) {
      // 弹窗显示
      Taro.showModal({
        title: "提示",
        content: "故障描述至少5字",
        showCancel: false,
        confirmText: "我知道了"
      });
      return;
    }
    let gallery = imgArr.join(",");
    let d = {};
    d.device_no = this.state.device_no;
    d.order_id = this.state.order_id || "";
    d.scene = this.state.scene || "";
    d.title = this.state.arrId.join(",");
    d.content = this.state.content;
    d.address_info = this.state.address;

    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    latitude = String(latitude).replace(/^(.*\..{4}).*$/, "$1");
    latitude = Number(latitude);

    longitude = String(longitude).replace(/^(.*\..{4}).*$/, "$1");
    longitude = Number(longitude);

    d.address_lnglat = longitude + "," + latitude;

    d.gallery = gallery;
    this.setState({
      isSubmit: true
    });
    global.$utils.api
      .load("devopsrepairCreate", d)
      .then(result => {
        if (result.code > 0) {
          global.$utils.toast.success(result.message);
          setTimeout(() => {
            global.$utils.url.back();
          }, 800);
        } else {
          this.setState({
            isSubmit: false
          });
          // 弹窗显示
          Taro.showModal({
            title: "提示",
            content: result.message,
            showCancel: false,
            confirmText: "我知道了"
          });
        }
      })
      .catch(e => {
        console.log("faultSubmit e", e);
        this.setState({
          isSubmit: false
        });
      });
  };
  // 选择损坏部位
  onActive = id => {
    console.log(id);
    const arrId = this.state.arrId;

    if (arrId.includes(id)) {
      arrId.splice(arrId.indexOf(id), 1);
    } else {
      if (arrId.length == 2) {
        return;
      }
      arrId.push(id);
    }
    console.log(arrId);

    this.setState({
      arrId
    });
  };

  // 扫码
  handleQrcode = async () => {
    let device_no = await global.$utils.qrcode.scan();
    if (device_no) {
      this.setState({
        device_no: device_no
      });
    }
  };

  render() {
    return (
      <View className={styles.page}>
        <View className={styles.fault_input}>
          <Input
            className="input"
            value={this.state.device_no}
            type="text"
            placeholder="请扫描故障车二维码或输入编码"
            onChange={this.handleErweimaChange.bind(this)}
          />
          <View
            className={styles.fault_input_right}
            onClick={this.handleQrcode.bind(this)}
          >
            <Image src={namedPng}></Image>
          </View>
        </View>

        <View className={styles.fault_body}>
          <View className={styles.fault_title}>请选择故障类型</View>
          <View className={styles.fault_list}>
            {this.state.list.map((item, index) => (
              <View
                className={[
                  styles.fault_item,
                  this.state.arrId.includes(item.title) && styles.onActive
                ]}
                key={index}
                onClick={this.onActive.bind(this, item.title)}
              >
                {item.title}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.ontaps}>
          <View className={styles.mapsets}>请确定故障车辆当前位置</View>
          <View className={styles.location}>
            <View className={styles.location_wp}>
              <View>
                <Image className={styles.imgBtns} src={namedPng2} />
              </View>
              <View>
                <View>{this.state.address}</View>
              </View>
            </View>
            {/* <View className={styles.location_item}>拖动地图可修改位置</View> */}
          </View>
          <View className={styles.maps}>
            <View className={styles.mapsTop}>
              <Map
                id="map4select"
                className={styles.tops}
                show-location
                longitude={this.state.longitude}
                latitude={this.state.latitude}
                include-points={this.state.points}
                markers={this.state.markers}
                onRegionChange={this.onTap}
              >
                <CoverView className={styles.icons}>
                  <CoverImage
                    src={require("../../assets/img/weiss.png")}
                  ></CoverImage>
                </CoverView>
              </Map>
            </View>
          </View>
        </View>
        <View className={styles.photo_box}>
          <View className={styles.photo}>请上传车辆故障部位照片</View>
          <View className={styles.fault_pick}>
            <AtImagePicker
              files={this.state.filesOne}
              onChange={this.onChangeOne.bind(this)}
              onImageClick={this.onImageClick.bind(this)}
              count={1}
              length={1}
              className={styles.fault_pick_item}
            />
            <AtImagePicker
              files={this.state.filesTwo}
              onChange={this.onChangeTwo.bind(this)}
              onImageClick={this.onImageClick.bind(this)}
              count={1}
              length={1}
              className={styles.fault_pick_item}
            />
          </View>
        </View>

        <View className={styles.fault_area}>
          <View className={styles.fault_area_title}>
            请对车辆故障问题进行描述
          </View>
          <View className={styles.testea}>
            <Textarea
              value={this.state.content}
              onInput={this.handleChange.bind(this)}
              placeholder="请输入车辆的具体故障"
              maxlength={20}
            />
          </View>
        </View>
        <View className={styles.fault_submit_box}>
          <View
            className={styles.fault_submit}
            onClick={this.faultSubmit}
            style={{ background: !this.state.isSubmit ? "#fce63e" : "#cccc" }}
          >
            {this.state.isSubmit ? "正在提交故障" : "提交"}
          </View>
        </View>
      </View>
    );
  }
}

export default Fault;
