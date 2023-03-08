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

import styles from "./checkReport.module.scss";
import namedPng from "../../assets/img/black_saoma.png";
// import namedPng2 from "../../assets/img/repair_1.png";
import namedPng3 from "../../assets/img/checkReport_1.png";
import namedPng4 from "../../assets/img/checkReport_2.png";
import namedPng5 from "../../assets/img/checkReport_3.png";

class CheckReport extends Component {
  config = {
    navigationBarTitleText: "巡检上报"
  };

  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      device_no: "",
      content: "",
      markers: [],
      address: "",
      points: [],
      files: [],
      list: [
        {
          title: "车把手"
        },
        {
          title: "刹车"
        },
        {
          title: "方向盘"
        },
        {
          title: "轮胎"
        },
        {
          title: "脚踏板"
        },
        {
          title: "链条"
        },
        {
          title: "电池"
        },
        {
          title: "车座"
        },
        {
          title: "车锁"
        },
        {
          title: "二维码"
        },
        {
          title: "按钮"
        },
        {
          title: "外观"
        },
        {
          title: "其它"
        },
      ],
      arrId: [],
      imgArr: [],
      infoList: [
        {
          title: "日常打卡",
          img: namedPng3,
          id: 1
        },
        {
          title: "结束运营",
          img: namedPng4,
          id: 2
        },
        {
          title: "例行巡检",
          img: namedPng5,
          id: 3
        }
      ],
      idArr: []
    };
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
          () => {}
        );
      }
    });
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
  onChange(files) {
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
            imgArr: array
          });
        }
      });
    }

    this.setState({
      files: files
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
    console.log(this.state.imgArr);
    let imgArr = this.state.imgArr;
    let gallery = imgArr.join(",");
    let d = {};
    d.type=this.state.type
    d.device_no = this.state.device_no;
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

    global.$utils.api.load("devopsPatrolCreate", d).then(result => {
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
  // 选择损坏部位
  onActive = id => {
    console.log(id);
    const arrId = this.state.arrId;
    if (arrId.includes(id)) {
      arrId.splice(arrId.indexOf(id), 1);
    } else {
      console.log(123);

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
  //选择标记
  onClickSelect = id => {
    let a = [];
    a.push(id);
    this.setState({
      idArr: a,
      type:id
    });
  };
  render() {
    let { infoList, idArr } = this.state;
    return (
      <View className={styles.page}>
        <View className={styles.fault_input}>
          <Input
            className='input'
            value={this.state.device_no}
            type='text'
            placeholder='请扫描故障车二维码或输入编码'
            onChange={this.handleErweimaChange.bind(this)}
          />
          <View
            className={styles.fault_input_right}
            onClick={this.handleQrcode.bind(this)}
          >
            <Image src={namedPng}></Image>
          </View>
        </View>
        <View className={styles.mark_info}>
          <View className={styles.mark_info_title}>选择巡检类型</View>
          <View className={styles.mark_info_box}>
            {infoList.map((item, index) => (
              <View
                className={[
                  styles.mark_info_item,
                  idArr.includes(item.id) && styles.onActives
                ]}
                onClick={this.onClickSelect.bind(this, item.id)}
              >
                {/* <Image src={item.img} className={styles.mark_img}></Image> */}
                <View className={styles.mark_title}>{item.title}</View>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.fault_body}>
          <View className={styles.fault_title}>请选择巡检部位</View>
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
        <View className={styles.photo_box}>
          <View className={styles.photo}>请上传巡检车辆及周围环境</View>
          <View className={styles.fault_pick}>
            <AtImagePicker
              files={this.state.files}
              onChange={this.onChange.bind(this)}
              onImageClick={this.onImageClick.bind(this)}
            />
          </View>
        </View>

        <View className={styles.fault_area}>
          <View className={styles.fault_area_title}>备注信息</View>
          <View className={styles.testea}>
            <Textarea
              value={this.state.content}
              onInput={this.handleChange.bind(this)}
              placeholder='请输入备注进行描述'
            />
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

export default CheckReport;
