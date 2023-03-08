import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import styles from "./class.module.scss";

class End extends Component {
  config = {
    navigationBarTitleText: "帮助分类"
  };

  constructor(props) {
    super(props);
    this.state = {
      lists: []
    };
  }

  componentWillMount() {
    let params = this.$router.params;
    console.log(params.class_id);
    if (params.name) {
      Taro.setNavigationBarTitle({ title: params.name });
    }
    let d = {};
    d.type = 1;
    d.class_id = params.class_id;
    global.$utils.api.load("orderHelpListClass", d).then(result => {
      let lists = result.data;
      this.setState({
        lists: lists
      });
    });
  }

  // 跳转详情
  detailBtn(item) {
    let id = item.id;
    let title = item.title;
    Taro.navigateTo({
      url: `/pages/help/info?id=${id}&title=${title}`
    });
  }

  render() {
    return (
      <View className={styles.page}>
        {this.state.lists.map((item, index) => (
          <View
            key={index}
            className={styles.ends_item}
            onClick={this.detailBtn.bind(this, item)}
          >
            <View className={styles.ends_wp}>
              <View>{item.title}</View>
            </View>
          </View>
        ))}
      </View>
    );
  }
}

export default End;
