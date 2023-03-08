import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { AtTextarea, AtImagePicker } from "taro-ui";

import styles from "./feedback.module.scss";

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      imgArr: []
    };
  }

  config = {
    navigationBarTitleText: "问题反馈"
  };

  // 图片
  onChange(files) {
    let that = this;
    let array = [];
    for (let i = 0; i < files.length; i++) {
      let element = files[i].url;
      Taro.uploadFile({
        url: global.app_host + "/api/upload/uploadimage",
        filePath: element,
        name: "file",
        formData: {
          place: "common"
        },
        success(res) {
          const imgData = JSON.parse(res.data);
          array.push(imgData.data.url);
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
  handleClick = () => {
    let d = {};
    d.title = this.state.title;
    d.gallery = (this.state.imgArr || []).join(",");
    d.content = this.state.content;
    global.$utils.api
      .load("userFeedback", d)
      .then(result => {
        if (result.code >= 1) {
          global.$utils.toast.success(result.message);
          setTimeout(() => {
            global.$utils.url.back();
          }, 800);
        } else {
          global.$utils.toast.error(result.message);
        }
      })
      .catch(() => {
        global.$utils.toast.error("提交失败");
      });
  };

  render() {
    return (
      <View className={styles.page}>
        <View className={styles.titles}>
          <AtTextarea
            count={false}
            value={this.state.title}
            className={styles.content}
            placeholder='请输入文字标题'
            onChange={events => {
              this.setState({
                title: events.target.value
              });
            }}
          />
        </View>
        <View className={styles.photo}>
          <View className={styles.phoneWp}>
            上传图片 <Text className={styles.required}>(必填)</Text>
          </View>
          <View className={styles.fault_pick}>
            <AtImagePicker
              files={this.state.files}
              onChange={this.onChange.bind(this)}
              onImageClick={this.onImageClick.bind(this)}
            />
          </View>
        </View>
        <AtTextarea
          value={this.state.content}
          className={styles.content}
          maxLength={100}
          height={400}
          placeholder='请详细说明,以便于我们解决问题'
          onChange={event => {
            this.setState({
              content: event.target.value
            });
          }}
        />
        <Button
          className={styles.submit_btn}
          onClick={this.handleClick.bind(this)}
        >
          提交问题
        </Button>
      </View>
    );
  }
}

export default Feedback;
