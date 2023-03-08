import Taro, { Component } from "@tarojs/taro";
import { View, Textarea, Picker } from "@tarojs/components";
import namedPng from "../../assets/img/black_saoma.png";
import namedPng1 from "../../assets/img/mark_1.png";
import namedPng2 from "../../assets/img/mark_2.png";
import namedPng3 from "../../assets/img/mark_3.png";
import namedPng4 from "../../assets/img/mark_4.png";
import namedPng5 from "../../assets/img/mark_5.png";

import styles from "./mark.module.scss";

class Mark extends Component {
  config = {
    navigationBarTitleText: "车辆标记"
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
          title: "超出运营区",
          img: namedPng1,
          id: 1
        },
        {
          title: "未关锁",
          img: namedPng2,
          id: 2
        },
        {
          title: "无法骑行",
          img: namedPng2,
          id: 3
        },
        {
          title: "电量不足",
          img: namedPng4,
          id: 4
        },
        {
          title: "损坏",
          img: namedPng4,
          id: 5
        },
        {
          title: "失联",
          img: namedPng5,
          id: 6
        },
        {
          title: "0电车",
          img: namedPng5,
          id: 7
        },
        {
          title: "小电池电量低",
          img: namedPng5,
          id: 8
        },
        {
          title: "长期未骑行",
          img: namedPng5,
          id: 9
        }
      ],
      idArr: [],
      content: ""
    };
  }

  componentDidMount() {
    let params = this.$router.params;
    console.log(params);
    this.setState({
      device_no: params.device_no || ""
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
    let a = this.state.idArr;
    if (a.indexOf(id) >= 0) {
      a.splice(a.indexOf(id), 1);
    } else {
      a.push(id);
    }
    console.log(a, id);
    this.setState({
      idArr: a
    });
  };
  //问题
  handleChange(event) {
    this.setState({
      content: event.target.value
    });
  }
  //提交
  faultSubmit = () => {
    let idArr = this.state.idArr;
    let tags = idArr.join(",");
    let d = {};
    d.device_no = this.state.device_no;
    d.tags = tags || "";
    d.content = this.state.content || "";
    d.gallery = "";
    global.$utils.api.load("devopsTagAdd", d).then(result => {
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
              type='number'
              // selection-start="-1"
              // selection-end="-1"
              className='input'
              value={device_no}
              placeholder='请扫描车辆二维码或输入编码'
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
          <View className={styles.mark_info_title}>请标记车辆信息</View>
          <View className={styles.mark_info_box}>
            {infoList.map((item, index) => (
              <View
                className={[
                  styles.mark_info_item,
                  idArr.includes(item.title) && styles.onActive
                ]}
                onClick={this.onClickSelect.bind(this, item.title)}
              >
                <Image src={item.img} className={styles.mark_img}></Image>
                <View className={styles.mark_title}>{item.title}</View>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.fault_area}>
          <View className={styles.fault_area_title}>标记说明</View>
          <View className={styles.testea}>
            <Textarea
              value={this.state.content}
              onInput={this.handleChange.bind(this)}
              placeholder='请输入标记说明'
            />
          </View>
        </View>
        <View className={styles.mark_text}>注意事项：</View>
        <View className={styles.mark_text}>
          1. 此功能只对车辆状态做标记处理，不影响车辆实际使用
        </View>
        <View className={styles.mark_text}>
          2. 车辆标记标签可以在管理后台及小程序查看并管理
        </View>
        <View style={{ height: "180px" }}></View>
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
