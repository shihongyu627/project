import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { FooterLine, TextLabel, BoxEmpty, Stepper } from "@component";
import dayjs from "dayjs";
import { getWindowHeight } from "@utils/style";
import "./index.scss";
import downPng from "@assets/image/categorydown.png";
import topPng from "@assets/image/categorytop.png";
import nocheckedPng from "@assets/image/noChecked.png";
import checkedPng from "@assets/image/checked.png";
import Accordion from "react-native-collapsible/Accordion";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now_active: -1,
      active: 0,
      activeList: [],
      list: [],
      screenY: 667,
      activeSections: [0],
      idsArr: [],
      dataArr: [],
      categoryIdArr: [],
      index: 0
    };
  }
  componentDidMount() {
    const info = Taro.getSystemInfoSync();
    let params = getCurrentInstance().router.params;
    let index = params.index;
    let jsonData = params.jsonData;
    let jsonDataObj = JSON.parse(jsonData) || {};
    let idsArr = jsonDataObj.idsArr || [];
    let dataArr = jsonDataObj.score_arr || [];
    let categoryIdArr = (jsonDataObj?.category_ids || "").split(",") || [];
    const { windowHeight } = info;
    this.setState(
      {
        screenY: windowHeight,
        index,
        idsArr,
        dataArr,
        categoryIdArr
      },
      () => {
        this.onLoad();
      }
    );
  }

  async componentWillUnmount() {}
  onLoad = () => {
    let { dataArr } = this.state;
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    $utils.api
      .load("batchCategory", d, "get", { loading: true })
      .then(result => {
        if (result.data) {
          let list = result.data.list || [];
          list.map(item => {
            item.total = 0;
            dataArr.map(menu => {
              if (item.category_id == menu.category_id1) {
                item.total += 1;
              }
            });
          });
          this.setState(
            {
              list: list
            },
            () => {
              this.onActive(
                0,
                (this.state.list && this.state.list[0]?.children[0]) || []
              );
            }
          );
        }
      });
    Taro.showLoading({
      title: "loading"
    });
  };
  _renderHeader = (section, index) => {
    let { activeSections } = this.state;
    let isActive = activeSections.indexOf(index);
    return (
      <View
        className="category-contentBox-leftBox"
        style={{ backgroundColor: isActive != -1 ? "#fff" : "#E9E9E9" }}
      >
        <View className="category-contentBox-leftBox-title">
          <View
            className="category-contentBox-leftBox-titleColor"
            style={{ color: isActive != -1 ? "#0A75E8" : "#333" }}
          >
            {section.name}
            {section.total > 0 ? (
              <View className="category-contentBox-leftBox-total">
                {section.total}
              </View>
            ) : null}
          </View>
          <Image
            className={"category-contentBox-leftBox-image"}
            src={isActive == -1 ? downPng : topPng}
            mode="aspectFill"
          />
        </View>
      </View>
    );
  };
  _updateSections = activeSections => {
    this.setState({ activeSections, active: 0 }, () => {
      if (activeSections.length == 1) {
        let index = activeSections[0];
        this.onActive(
          0,
          (this.state.list && this.state.list[index]?.children[0]) || []
        );
      }
    });
  };
  _renderContent = section => {
    let { active } = this.state;
    return (
      <View>
        {section.children.map((item, index) => {
          return (
            <View
              className="category-contentBox-leftBox-title"
              style={{
                backgroundColor: active == index ? "#fff" : "#F6F6F6"
              }}
              onClick={() => {
                this.onActive(index, item);
              }}
              key={index}
            >
              <View
                className="category-contentBox-leftBox-br"
                style={{
                  backgroundColor: active == index ? "#0a75e8" : "#F6F6F6"
                }}
              ></View>
              <View
                className="category-contentBox-leftBox-stitle"
                style={{
                  color: active == index ? "#0A75E8" : "#333"
                }}
              >
                {item.name}
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  onActive = (index, data) => {
    this.setState({
      active: index,
      activeList: data?.score_list || []
    });
  };
  onChangeStepper = (num, data) => {
    let { list } = this.state;
    if (data.id) {
      list.map(item => {
        item.children.map(item1 => {
          (item1?.score_list || []).map(item2 => {
            if (data.id == item2.id) {
              item2.score = num;
            }
          });
        });
      });
    }
    this.setState({
      list
    });
  };
  selectItem = data => {
    let { idsArr, dataArr, list, categoryIdArr } = this.state;
    let index = idsArr.indexOf(data?.id);
    let mindex = categoryIdArr.indexOf(data?.category_id1);
    // if (mindex == -1 && dataArr.length > 0) {
    //   $utils.toast.text("请选择相同分类下选项");
    //   return;
    // }
    if (index == -1) {
      idsArr.push(data?.id);
      categoryIdArr.push(data?.category_id1);
      dataArr.push(data);
    } else {
      idsArr.splice(index, 1);
      dataArr.splice(index, 1);
    }
    list.map(item => {
      item.total = 0;
      dataArr.map(menu => {
        if (item.category_id == menu.category_id1) {
          item.total += 1;
        }
      });
    });
    this.setState({
      idsArr,
      dataArr,
      list,
      categoryIdArr
    });
  };
  //重置
  onReset = () => {
    let { list } = this.state;
    this.setState(
      {
        idsArr: [],
        dataArr: []
      },
      () => {
        this.onLoad();
      }
    );
  };
  //确认
  onConfirm = () => {
    let { dataArr, list, index, idsArr } = this.state;
    let category_idArr = []; //一级分类id
    let titleArr = []; //一级分类名称
    let stitleArr = []; //二级分类名称
    dataArr.map((item, index) => {
      // if (index == 0) {
      //   title = item.category_name1;
      //   category_id = item.category_id1;
      // }
      let title = item.category_name1;
      let newTitle =
        item.category_name1 + "/" + item.category_name2 + "/" + item.title;
      stitleArr.push(newTitle);
      titleArr.push(item.category_name1);
      category_idArr.push(item.category_id1);
    });
    console.log(titleArr, category_idArr, 88899);
    let newTitleArr = [];
    for (var i = 0; i < titleArr.length; i++) {
      if (newTitleArr.indexOf(titleArr[i]) === -1) {
        newTitleArr.push(titleArr[i]);
      }
    }
    let newCategory_idArr = [];
    for (var i = 0; i < category_idArr.length; i++) {
      if (newCategory_idArr.indexOf(category_idArr[i]) === -1) {
        newCategory_idArr.push(category_idArr[i]);
      }
    }
    console.log(newTitleArr, newCategory_idArr);
    let obj = {};
    obj.title = newTitleArr.join("/");
    obj.category_full_name = stitleArr.join("\n");
    obj.score_arr = dataArr;
    obj.category_ids = newCategory_idArr;
    obj.index = index;
    obj.idsArr = idsArr;
    console.log(idsArr, 99999999999);
    let dataStr = JSON.stringify(obj);
    Taro.eventCenter.trigger("refreshCategory", dataStr);
    Taro.navigateBack();
  };
  render() {
    let { screenY, activeList, list, idsArr, dataArr } = this.state;
    return (
      <View className="category">
        <View className="category-contentBox">
          <ScrollView
            className="category-contentBox-leftBox"
            scrollY
            scrollWithAnimation
          >
            <Accordion
              sections={list}
              activeSections={this.state.activeSections}
              // renderSectionTitle={this._renderSectionTitle}
              renderHeader={this._renderHeader}
              onChange={this._updateSections}
              renderContent={this._renderContent}
              underlayColor="#dcebfb"
              containerStyle={{ overflow: "hidden" }}
            />
          </ScrollView>
          <ScrollView scrollY scrollWithAnimation lowerThreshold={90}>
            <View className="category-contentBox-rightBox">
              {(activeList || []).map((item, index) => (
                <View
                  key={index}
                  className="category-contentBox-rightBox-rightItem"
                >
                  <View className="category-contentBox-rightBox-rightItem-top">
                    <TextLabel
                      className="category-contentBox-rightBox-rightItem-title"
                      content={item.title}
                      num={2}
                    />
                    <Image
                      className="category-contentBox-rightBox-rightItem-image"
                      src={
                        idsArr.indexOf(item.id) == -1
                          ? nocheckedPng
                          : checkedPng
                      }
                      mode="aspectFill"
                      onClick={() => {
                        this.selectItem(item);
                      }}
                    />
                  </View>
                  <View className="category-contentBox-rightBox-rightItem-bottom">
                    <View className="category-contentBox-rightBox-rightItem-text">
                      请打分：
                    </View>
                    <View className="category-contentBox-rightBox-rightItem-Stepper">
                      <Stepper
                        onChangeStepper={this.onChangeStepper}
                        info={item}
                      ></Stepper>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <View className="category-footer">
          <View className="category-footer-item">
            <View className="category-footer-title">已选择</View>
            <View className="category-footer-num">{dataArr.length}/64</View>
          </View>
          <View
            className="category-footer-btnReset"
            onClick={() => {
              this.onReset();
            }}
          >
            重置
          </View>
          <View
            className="category-footer-btnConfirm"
            onClick={() => {
              this.onConfirm();
            }}
          >
            确认
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
