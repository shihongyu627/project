import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Picker, Textarea, ScrollView } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import {
  InputText,
  SubmitBtn,
  DatePickerRn,
  TimePickerRn,
  IndexList
} from "@component";
import { getWindowHeight } from "@utils/style";
import ThreePng from "@assets/image/empty_box1.png";

import dayjs from "dayjs";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", //名字
      tel: "", //电话
      date: "", //预约日期
      time: "", //预约时间
      typeName: "",
      positionVal: true,
      positionVals: true,
      detail: {},
      content: "",
      submitVal: true
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let id = params.id;
    console.log(id, "传过来的值");
    this.setState(
      {
        id
      },
      () => {
        this.load();
      }
    );
  }

  async componentWillUnmount() {}
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.id = this.state.id;
    let url = `${global.base_host}/customer/flat/room/${this.state.id}`;
    global.$utils.api
      .load(url, d, "get", { loading: false, login: true })
      .then(res => {
        if (res.code == 200) {
          let detail = res.data || {};
          detail.content = detail.lightspot;
          detail.title = detail.name;
          if (detail.labelName) {
            detail.tagArr = detail.labelName.split(",");
          }
          // houseType 房型  acreage 面积   orientation 方向 floor楼层
          this.setState({
            detail
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  changeName = data => {
    this.setState({
      name: data
    });
  };
  changeTel = data => {
    this.setState({
      tel: data
    });
  };
  changeContent = e => {
    this.setState({
      content: e.detail.value
    });
  };
  handleSubmit = () => {
    let { name, tel, date, time, content, detail, id, submitVal } = this.state;
    let d = {};
    d.name = name;
    d.phone = tel;
    let seeTime = date + " " + time;
    d.seeTime = seeTime;
    d.time = time;
    d.descr = content;
    d.roomId = id;
    d.state = "0";
    let val = global.$utils.isPhoneNumber.isAvailable(tel);
    if (!name) {
      global.$utils.toast.text("请输入姓名");
      return;
    }
    if (!val) {
      global.$utils.toast.text("请输入正确的联系电话");
      return;
    }
    if (!date) {
      global.$utils.toast.text("请选择看房日期");
      return;
    }
    if (!time) {
      global.$utils.toast.text("请选择看房时间");
      return;
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
    global.$utils.api
      .load("makeAdd", d, "post", { loading: false, login: true })
      .then(res => {
        $utils.toast.text(res.msg);
        if (res.code == 200) {
          setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/home/houseView/success/index?name=${name}&address=${detail.site}&time=${seeTime}`
            });
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
    }, 1000);

    console.log(d, "提交的数据");
  };
  //选择日期
  selectData = data => {
    this.setState({
      date: data
    });
  };
  //选择时间
  selectTime = data => {
    console.log("预约时间", data);
    this.setState({
      time: data
    });
  };
  onFocus = () => {
    this.setState({ scrollTop: 100 });
    // this.setState({
    //   positionVal: false
    // });
  };
  onBlur = () => {
    console.log("6666");
    this.setState({
      positionVal: true
    });
  };
  onFocusTwo = () => {
    this.setState({
      positionVals: false
    });
  };
  onBlurTwo = () => {
    console.log("6666");
    this.setState({
      positionVals: true
    });
  };
  render() {
    let {
      date,
      positionVal,
      positionVals,
      detail,
      name,
      tel,
      time
    } = this.state;
    return (
      <View className="publicDevice">
        <ScrollView
          className="scrollDom"
          scrollY
          lowerThreshold={90}
          style={{ height: getWindowHeight() }}
        >
          <View className="publicDevice-detailTitle">
            提交预约后管家会电话联系您，请保持手机通畅
          </View>
          <View className="publicDevice-detail">
            <IndexList info={detail}></IndexList>
          </View>
          <View className="publicDevice-br" />
          <View className="publicDevice-box">
            <InputText
              title="姓名"
              type="text"
              style={{ border: 0 }}
              onInput={this.changeName}
              value={name}
            ></InputText>
            <InputText
              title="联系电话"
              type="number"
              onInput={this.changeTel}
              maxlength={11}
              value={tel}
            ></InputText>
            <DatePickerRn
              title="看房日期"
              selectData={this.selectData}
            ></DatePickerRn>
            <TimePickerRn
              title="看房时间"
              selectTime={this.selectTime}
              date={date}
            ></TimePickerRn>
            <View className="publicDevice-box-items">
              <View className="publicDevice-box-items-title">
                给管家留言 (选填)
              </View>
            </View>
            <View className="publicDevice-box-Textarea">
              <Textarea
                className="publicDevice-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="请输入"
                onInput={this.changeContent.bind(this)}
              />
            </View>
            {/* <View
              className={
                positionVal
                  ? "publicDevice-box-Textarea"
                  : "publicDevice-box-Textareas"
              }
            >
              <Textarea
                className="publicDevice-box-Textarea-box"
                style="background:#fff;width:100%;min-height:30px"
                autoHeight
                placeholder="请输入"
                onFocus={this.onFocus.bind(this)}
                onBlur={this.onBlur.bind(this)}
              />
            </View> */}
          </View>
          <View className={positionVals ? "bottomBr" : "bottomBrs"}></View>
        </ScrollView>
        <SubmitBtn
          title="立即预约"
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
