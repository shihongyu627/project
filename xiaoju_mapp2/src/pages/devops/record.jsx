import Taro, { Component } from "@tarojs/taro";
import { View, Textarea, Picker } from "@tarojs/components";
import { AtImagePicker, AtList, AtListItem } from "taro-ui";

import styles from "./record.module.scss";

class Record extends Component {
  config = {
    navigationBarTitleText: "添加维修记录"
  };

  static defaultProps = {
    current: 0,
    longitude: "",
    latitude: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      selector: ["处理中", "待检测", "待维修", "处理完成"],
      selectorChecked: "处理状态",
      repair_id: "",
      device_no: "",
      content: "",
      files: [],
      imgArr: []
    };
  }

  componentWillMount() {
    let params = this.$router.params;
    console.log(params);
    this.setState({
      device_no: params.device_no || "",
      repair_id: params.repair_id || ""
    });
  }

  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    });
  };

  //问题
  handleChange(event) {
    this.setState({
      content: event.target.value
    });
  }
  // 图片
  onChangeImg(files) {
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
  onImageClick(index, file) {}
  //提交
  faultSubmit = () => {
    console.log(this.state.imgArr);
    let imgArr = this.state.imgArr;
    let gallery = imgArr.join(",");
    let selectorChecked = this.state.selectorChecked;

    let selector =
      selectorChecked == "处理中"
        ? "1"
        : selectorChecked == "待检测"
        ? "2"
        : selectorChecked == "待维修"
        ? "3"
        : selectorChecked == "处理完成"
        ? "10"
        : "";

    let d = {};
    d.repair_id = this.state.repair_id;
    d.device_no = this.state.device_no;
    d.text = this.state.content;
    d.gallery = gallery;
    d.action_name = this.state.selectorChecked;
    d.action = selector;
    global.$utils.api.load("devopsrepairAddrecord", d).then(result => {
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
    return (
      <View className={styles.page}>
        <View className={styles.fault_area}>
          <View className={styles.fault_area_title}>处理内容</View>
          <View className={styles.testea}>
            <Textarea
              value={this.state.content}
              onInput={this.handleChange.bind(this)}
              placeholder="请输入处理内容..."
            />
          </View>
        </View>
        <View className={styles.photo_box}>
          <View className={styles.photo}>上传处理图片</View>
          <View className={styles.fault_pick}>
            <AtImagePicker
              files={this.state.files}
              onChange={this.onChangeImg.bind(this)}
              onImageClick={this.onImageClick.bind(this)}
            />
          </View>
        </View>

        <View className={styles.pageSection}>
          <View>
            <Picker
              mode="selector"
              range={this.state.selector}
              onChange={this.onChange}
            >
              <AtList  hasBorder={false}>
                <AtListItem
                  title="处理状态"
                  extraText={this.state.selectorChecked}
                  arrow="right"
                  hasBorder={false}
                />
              </AtList>
            </Picker>
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

export default Record;
