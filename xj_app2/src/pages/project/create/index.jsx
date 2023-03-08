import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { View, ScrollView, Image, Input } from "@tarojs/components";
import "./index.scss";
import currencyPng from "@assets/image/currency.png";
import projectEditPng from "@assets/image/projectEdit.png";
import projectRatePng from "@assets/image/projectRate.png";
import projectRecordPng from "@assets/image/projectRecord.png";
import projectRightPng from "@assets/image/projectRight.png";
import addProjectPng from "@assets/image/addProject.png";
import downloadFilePng from "@assets/image/downloadFile.png";
import iconDelPng from "@assets/image/iconDel.png";
import noCheckedPng from "@assets/image/noChecked.png";
import signCheckPng from "@assets/image/checked.png";
import signNamePng from "@assets/image/signName.png";

import SignatureCapture from "react-native-signature-capture";
import Accordion from "react-native-collapsible/Accordion";
import Geolocation from "@react-native-community/geolocation";
import {
  BoxEmpty,
  ItemCreateRecord,
  FooterLine,
  TextLabel,
  SelectTypeRn,
  SignName
} from "@component";
import downPng from "@assets/image/down.png";
import topPng from "@assets/image/top.png";
import delPng from "@assets/image/del.png";
import dayjs from "dayjs";
import { Dimensions, Platform } from "react-native";
let { height, width } = Dimensions.get("window");
import store from "../../../store";
import { BottomModal } from "beeshell";
import { Button } from "teaset";
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 667,
      list: [{}],
      activeSections: [0],
      selectCategory: {},
      id: "",
      submitVal: true,
      stoplistName: ["是", "否"],
      stoplistData: [
        {
          name: "是",
          id: 1
        },
        {
          name: "否",
          id: 0
        }
      ],
      handle_day: "",
      is_stop_work: "",
      end_date: "",
      signShow: false,
      signPathName: "",
      signPathName2: "",
      handle_endtime: "",
      sign_list: [],
      sign_img1: "",
      sign_img2: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    let setBatchList = $utils.data.get("setBatchList") || {};
    let list = setBatchList.list || [{}];
    let handle_day = setBatchList.handle_day || "";
    let is_stop_work = setBatchList.is_stop_work || "";
    let end_date = setBatchList.end_date || "";
    let signPathName = setBatchList.signPathName || "";
    let signPathName2 = setBatchList.signPathName2 || "";
    let sign_img1 = setBatchList.sign_img1 || "";
    let sign_img2 = setBatchList.sign_img2 || "";
    Taro.eventCenter.on("refreshCategory", val => {
      if (val) {
        let newObj = JSON.parse(val);
        let index = newObj.index;
        let lists = this.state.list;
        let oldObj = lists[index];
        // oldObj.category_id = newObj?.category_id;
        oldObj.category_full_name = newObj.category_full_name;
        oldObj.title = newObj.title;
        oldObj.score_arr = newObj.score_arr;
        oldObj.idsArr = newObj.idsArr;
        oldObj.category_ids = newObj.category_ids.join(",");
        lists[index] = oldObj;
        this.setState({
          list: lists
        });
      }
    });

    this.setState(
      {
        id,
        list,
        handle_day,
        is_stop_work,
        end_date,
        signPathName,
        signPathName2,
        sign_img1,
        sign_img2
      },
      () => {
        this.signlist();
      }
    );
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshCategory");
  }
  //签名列表
  signlist = () => {
    let d = {};
    $utils.api
      .load("signlist", d, "post", { loading: false, login: true })
      .then(res => {
        if (res.code == 1) {
          this.setState({
            sign_list: res.data || []
          });
        }
      })
      .catch(err => {
        $utils.toast.text("操作异常");
        console.log(err);
      });
  };
  setMenu = state => {
    this.setState({
      state
    });
  };
  //删除录用，必须保持一个不可删除
  delList = index => {
    let { list } = this.state;
    if (list.length <= 1) {
      return;
    }
    Taro.showModal({
      title: "提示",
      content: "是否删除该录入",
      confirmText: "是",
      confirmColor: "#0A74E9"
    }).then(res1 => {
      if (res1.confirm) {
        list.splice(index, 1);
        console.log(list);
        this.setState({
          list
        });
        $utils.toast.text("删除成功");
        return;
      } else if (res1.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  _renderHeader = (section, index) => {
    let { activeSections, list } = this.state;
    let isActive = activeSections.indexOf(index);
    return (
      <View className="projectCreate-titleRn_box">
        <View className="projectCreate-titleRn_box-left">
          <View className="projectCreate-titleRn-stitle">隐患{index + 1}</View>
          <TextLabel
            content={section.title}
            className="projectCreate-titleRn"
            num={1}
          />
        </View>
        <View className="projectCreate-right">
          {list.length > 1 ? (
            <Image
              className="projectCreate-right-delPng"
              src={delPng}
              mode="aspectFill"
              onClick={() => {
                this.delList(index);
              }}
            />
          ) : null}
          <Image
            className="projectCreate-right-image"
            src={isActive == -1 ? downPng : topPng}
            mode="aspectFill"
          />
        </View>
      </View>
    );
  };
  _updateSections = activeSections => {
    this.setState({ activeSections });
  };
  _renderContent = (section, index) => {
    return (
      <ItemCreateRecord
        onFocusChange={this.onFocusChange}
        info={section}
        index={index}
        onSetAvatar={this.onSetAvatar}
        onChangeContent={this.onChangeContent}
        onSelectlevelIndex={this.onSelectlevelIndex}
        selectStopIndex={this.selectStopIndex}
        onChangeDay={this.onChangeDay}
      />
    );
  };
  //图片
  onSetAvatar = (data, index) => {
    let { list } = this.state;
    list[index].gallery = data;
    console.log(data, "获取隐患图片");
    this.setState({
      list
    });
  };
  //隐患内容
  onChangeContent = (data, index) => {
    let { list } = this.state;
    list[index].content = data;
    this.setState({
      list
    });
  };
  //隐患等级[1=一般，5=较大，10=严重]
  onSelectlevelIndex = (id, name, index) => {
    let { list } = this.state;
    list[index].level = id;
    this.setState({
      list
    });
  };
  //是否停工[0=否，1=是]
  selectStopIndex = data => {
    let { stoplistData } = this.state;
    let obj = stoplistData[data];
    let is_stop_work = obj.id;
    this.setState({
      is_stop_work
    });
  };
  //整改天数
  changeDay = e => {
    let data = e.detail.value;
    let { list } = this.state;
    let reg = /^[0-9]*$/; //正则表达式
    let regData = new RegExp(reg);
    if (!regData.test(data)) {
      return;
    }
    let endDate = dayjs()
      .add(data, "day")
      .format("YYYY-MM-DD");
    let handle_endtime = dayjs(endDate).unix();
    console.log(handle_endtime);
    // list[index].handle_day = data;
    // list[index].end_date = endDate;
    // list[index].handle_endtime = handle_endtime;
    this.setState({
      handle_day: data,
      end_date: endDate,
      handle_endtime
    });
  };
  onFocusChange = () => {
    console.log("聚焦");
    // this.refs.body.scrollToEnd({animated: true})
  };
  //新增
  addProjectCreate = () => {
    let { list } = this.state;
    list.push({});
    this.setState({
      list
    });
  };
  //提交
  handleSubmit = () => {
    let {
      list,
      id,
      submitVal,
      handle_day,
      is_stop_work,
      handle_endtime,
      sign_img,
      signPathName,
      signPathName2,
      sign_img1,
      sign_img2
    } = this.state;
    list.map(item => {
      if (!item.scene) {
        item.scene = "app_up";
      }
      if (!item.level) {
        item.level = "1";
      }
    });
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.project_id = id;
    d.trouble_arr = list;
    d.is_stop_work = is_stop_work;
    d.handle_day = handle_day;
    d.handle_endtime = handle_endtime;
    d.sign_img = signPathName;
    d.sign_img2 = signPathName2;
    if (!submitVal) {
      return;
    }
    this.setState({
      submitVal: false
    });
    $utils.api
      .load("createbatch", d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.message);
        if (res.code == 1) {
          $utils.auth.checklogin();
          setTimeout(() => {
            $utils.data.set("setBatchList", {});
            Taro.navigateBack();
          }, 1000);
        } else {
          this.setState({
            submitVal: true
          });
        }
      })
      .catch(err => {
        $utils.toast.text("操作异常");
        console.log(err);
        this.setState({
          submitVal: true
        });
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 2500);
  };
  //保存
  handleSave = () => {
    let {
      list,
      is_stop_work,
      handle_day,
      end_date,
      signPathName,
      signPathName2,
      sign_img1,
      sign_img2
    } = this.state;
    let dd = {};
    dd.is_stop_work = is_stop_work;
    dd.handle_day = handle_day;
    dd.end_date = end_date;
    dd.signPathName = signPathName;
    dd.signPathName2 = signPathName2;
    dd.sign_img1 = sign_img1;
    dd.sign_img2 = sign_img2;
    dd.list = list;
    Taro.showModal({
      title: "提示",
      content: "是否保存录入",
      confirmText: "是",
      confirmColor: "#0A74E9"
    }).then(res1 => {
      if (res1.confirm) {
        $utils.data.set("setBatchList", dd);
        $utils.toast.text("保存成功");
        return;
      } else if (res1.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  setAvatar = signPathName => {
    let { signShow } = this.state;
    if (!signShow) {
      this.setState(
        {
          signPathName: $utils.loadimg.load(signPathName)
        },
        () => {
          this.bottomModalD.close();
        }
      );
      return;
    }
    this.setState(
      {
        signPathName2: $utils.loadimg.load(signPathName)
      },
      () => {
        this.bottomModalD.close();
      }
    );
  };
  //删除签名
  onClickDelSign = sign_img => {
    Taro.showModal({
      title: "提示",
      content: "是否删除该签名",
      confirmText: "是",
      confirmColor: "#0A74E9"
    }).then(res1 => {
      if (res1.confirm) {
        this.delsign(sign_img);
        return;
      } else if (res1.cancel) {
        console.log("用户点击取消");
      }
    });
  };
  delsign = sign_img => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.sign_img = sign_img;
    $utils.api
      .load("delsign", d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.message);
        if (res.code == 1) {
          setTimeout(() => {
            this.signlist();
          }, 500);
        }
      })
      .catch(err => {
        $utils.toast.text("操作异常");
        Taro.hideLoading();
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1500);
  };
  render() {
    let {
      menuList,
      state,
      list,
      is_stop_work,
      handle_day,
      end_date,
      signPathName,
      signShow,
      signPathName2,
      sign_list,
      sign_img1,
      sign_img2
    } = this.state;
    return (
      <View className="projectCreate">
        <ScrollView scrollY ref="body">
          <Accordion
            sections={list}
            activeSections={this.state.activeSections}
            // renderSectionTitle={this._renderSectionTitle}
            renderHeader={this._renderHeader}
            onChange={this._updateSections}
            renderContent={this._renderContent}
            underlayColor="#dcebfb"
            sectionContainerStyle={{ marginTop: 10, overflow: "hidden" }}
            containerStyle={{ overflow: "hidden" }}
          />
          <View className="projectCreate-footer">
            <View className="projectCreate-footer-top">
              <View className="projectCreate-footer-left">
                <Image
                  className="projectCreate-footer-image"
                  src={addProjectPng}
                  mode="aspectFill"
                />
                <View
                  className="projectCreate-footer-title"
                  onClick={() => {
                    this.addProjectCreate();
                  }}
                >
                  新增录入
                </View>
              </View>
              {/* <View className="projectCreate-footer-left">
                <Image
                  className="projectCreate-footer-image"
                  src={downloadFilePng}
                  mode="aspectFill"
                />
                <View className="projectCreate-footer-title">下载</View>
              </View> */}
            </View>
            <View className="projectCreate-title">是否停工</View>
            <SelectTypeRn
              title="是否停工"
              listName={this.state.stoplistName}
              selectIndex={this.selectStopIndex}
              typeName={is_stop_work == 1 ? "是" : "否"}
              placeholder="可选择工程状态"
            ></SelectTypeRn>
            <View className="projectCreate-title">整改天数</View>

            <View className={"projectCreate-inputBox "} id="day_id">
              <Input
                className="projectCreate-inputBox-content"
                placeholder="请输入整改天数"
                onInput={this.changeDay.bind(this)}
                value={handle_day || "" + ""}
                type="number"
              />
              {handle_day ? (
                <View className="projectCreate-inputBox-date">
                  限于{end_date}前
                </View>
              ) : null}
            </View>
            <View className="projectCreate-title">签名1</View>
            <View className="projectCreate-signBox">
              <Image
                className="projectCreate-signBox-signNamePng"
                src={signPathName ? signPathName : signNamePng}
                mode="aspectFill"
                onClick={() => {
                  this.setState(
                    {
                      signShow: false
                    },
                    () => {
                      this.bottomModalD.open();
                    }
                  );
                }}
              />
              {sign_list.map(item => {
                return (
                  <View className="projectCreate-signBox-signNamePngBox">
                    <Image
                      className="projectCreate-signBox-iconDelPng"
                      src={iconDelPng}
                      mode="aspectFill"
                      onClick={() => {
                        this.onClickDelSign(item.sign_img);
                      }}
                    />
                    <Image
                      className="projectCreate-signBox-signCheckPng"
                      src={
                        signPathName == item.sign_img ? signCheckPng : noCheckedPng
                      }
                      onClick={() => {
                        this.setState({
                          signPathName: item.sign_img
                        });
                      }}
                      mode="aspectFill"
                    />
                    <Image
                      className="projectCreate-signBox-signNamePng"
                      src={item.sign_img}
                      mode="aspectFill"
                      onClick={() => {
                        this.setState({
                          signPathName: item.sign_img
                        });
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <View className="projectCreate-title">签名2</View>
            <View className="projectCreate-signBox">
              <View className="projectCreate-signBox-signNamePngBox">
                <Image
                  className="projectCreate-signBox-signNamePng"
                  src={signPathName2 ? signPathName2 : signNamePng}
                  mode="aspectFill"
                  onClick={() => {
                    this.setState(
                      {
                        signShow: true
                      },
                      () => {
                        this.bottomModalD.open();
                      }
                    );
                  }}
                />
              </View>
              {sign_list.map(item => {
                return (
                  <View className="projectCreate-signBox-signNamePngBox">
                    <Image
                      className="projectCreate-signBox-iconDelPng"
                      src={iconDelPng}
                      mode="aspectFill"
                      onClick={() => {
                        this.onClickDelSign(item.sign_img);
                      }}
                    />
                    <Image
                      className="projectCreate-signBox-signCheckPng"
                      src={
                        signPathName2 == item.sign_img ? signCheckPng : noCheckedPng
                      }
                      mode="aspectFill"
                      onClick={() => {
                        this.setState({
                          signPathName2: item.sign_img
                        });
                      }}
                    />
                    <Image
                      className="projectCreate-signBox-signNamePng"
                      src={item.sign_img}
                      mode="aspectFill"
                      onClick={() => {
                        this.setState({
                          signPathName2: item.sign_img
                        });
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <View
              className="projectCreate-footer-btnSave"
              onClick={() => {
                this.handleSave();
              }}
            >
              保存录入
            </View>
            <View
              className="projectCreate-footer-btnSubmit"
              onClick={() => {
                this.handleSubmit();
              }}
            >
              提交录入
            </View>
          </View>
          <BottomModal
            title="签名"
            cancelable={true}
            leftLabelText=""
            rightLabelText=""
            screenHeight={height + (Platform.OS == "ios" ? 0 : 40)}
            ref={c => {
              this.bottomModalD = c;
            }}
          >
            <SignName setImg={this.setAvatar} />
          </BottomModal>
        </ScrollView>
      </View>
    );
  }
}
