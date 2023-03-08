import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";

import styles from "./service.module.scss";

class Service extends Component {
  config = {
    navigationBarTitleText: "客服中心"
  };

  constructor(props) {
    super(props);
    this.state = {
      conment: []
    };
  }

  componentDidMount() {
    this.helpData();
  }

  helpData() {
    global.$utils.api.load("orderHelpIndex").then(result => {
      let conment = result.data.main_class;
      this.setState({
        conment: conment
      });
    });
  }

  // 类目详情
  handleUrl(its) {
    console.log(its);
    let id = its.id;
    let title = its.title;
    Taro.navigateTo({
      url: `/pages/help/info?id=${id}&title=${title}`
    });
  }

  // 分类详情
  endsBtn(item) {
    let class_id = item.class_id;
    let name = item.name;
    Taro.navigateTo({
      url: `/pages/help/class?class_id=${class_id}&name=${name}`
    });
  }

  render() {
    return (
      <View className={styles.page}>
        <View className={styles.kefuWp}>
          <Button className={styles.home_content} open-type="contact"></Button>
          <Image
            className={styles.kefu_img}
            src={require("../../assets/icons/i_tool_3.png")}
          />
        </View>
        <View className={styles.issue}>
          <View className={styles.commonissue}>常见问题</View>
          {this.state.conment.map((item, index) => (
            <View key={index} className={styles.cost}>
              <View
                className={styles.cost_left}
                onClick={this.endsBtn.bind(this, item)}
              >
                <View className={styles.napsImg}>
                  <Image className={styles.imgBtnsRight} src={item.icon} />
                </View>
                <View className={styles.items}>{item.name}</View>
              </View>
              <View className={styles.cost_right}>
                {item.top_list.map((its, ii) => (
                  <View
                    key={ii}
                    className={styles.codes}
                    onClick={this.handleUrl.bind(this, its)}
                  >
                    {its.title}
                  </View>
                ))}
              </View>
            </View>
          ))}
          <View className={styles.fooder}></View>
        </View>
      </View>
    );
  }
}

export default Service;
