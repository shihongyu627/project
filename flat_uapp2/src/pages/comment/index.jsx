import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Picker, Textarea, ScrollView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { SubmitBtn, Rate } from "@component";
import { getWindowHeight } from "@utils/style";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      list: [
        {
          name: "服务态度",
          id: "1",
          type: "one"
        },
        {
          name: "及时性",
          id: "2",
          type: "two"
        },
        {
          name: "整洁度",
          id: "3",
          type: "three"
        }
      ],
      one: "1",
      two: "1",
      three: "1",
      type: "",
      submitVal: true
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let type = params.type;
    console.log(id, type, "传过来的值");
    let list = [
      {
        name: "服务态度",
        id: "1",
        type: "one"
      },
      {
        name: "及时性",
        id: "2",
        type: "two"
      },
      {
        name: "整洁度",
        id: "3",
        type: "three"
      }
    ];
    if (type == 2) {
      list = [
        {
          name: "服务态度",
          id: "1",
          type: "one"
        },
        {
          name: "响应速度",
          id: "2",
          type: "two"
        },
        {
          name: "维修质量",
          id: "3",
          type: "three"
        }
      ];
    }

    this.setState({
      id,
      type,
      list
    });
  }

  async componentWillUnmount() {}
  handleSubmit = () => {
    let { one, two, three, four, content, type, id, submitVal } = this.state;
    let d = {};
    d.manner = one;
    d.timeliness = two;
    d.tidiness = three;
    d.descr = content;
    let url = "";
    //保洁预约
    if (type == 1) {
      url = "CleanEvaluate";
      d.cleanId = id;
    }
    //报修预约
    if (type == 2) {
      url = "repairsEvaluate";
      d.repairsId = id;
    }
    Taro.showLoading({
      title: "loading"
    });
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    console.log(d, "提交的数据");
    global.$utils.api
      .load(url, d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          setTimeout(() => {
            Taro.eventCenter.trigger("refreshViewRecord", true);
            Taro.navigateBack();
          }, 500);
        } else {
          this.setState({
            submitVal: true
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          submitVal: true
        });
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };
  onChangeRate = (data, item) => {
    console.log(data, item);
    this.setState({
      [item.type]: data
    });
  };
  onChangeContent = e => {
    this.setState({
      content: e.detail.value
    });
  };
  render() {
    let { list } = this.state;
    return (
      <View className="comment">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className="comment-br" />
          <View className="comment-start">
            <View className="comment-start-title">星级评价</View>
            {list.map((item, index) => (
              <View className="comment-start-item">
                <View className="comment-start-item-title">{item.name}</View>
                <Rate info={item} onChangeRate={this.onChangeRate} />
              </View>
            ))}
          </View>
          <View className="comment-box">
            <View className="comment-box-items">
              <View className="comment-box-items-title">评价内容</View>
            </View>
            <View className="comment-box-Textarea">
              <Textarea
                className="comment-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="您的评价对大家很重要"
                onInput={this.onChangeContent.bind(this)}
              />
            </View>
          </View>
        </ScrollView>
        <SubmitBtn
          title="提交评价"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
