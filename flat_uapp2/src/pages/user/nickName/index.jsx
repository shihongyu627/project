import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";

import { InputText, SubmitBtn } from "@component";
import "./index.scss";
// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickName: ""
    };
  }
  componentDidMount() {
    let params = getCurrentInstance().router.params;
    let nickName = params.nickName || "";
    this.setState({
      nickName
    });
  }

  async componentWillUnmount() {}

  onChageNickName = data => {
    this.setState({
      nickName: data
    });
  };
  handleSubmit = () => {
    let { nickName } = this.state;
    if (!nickName) {
      return $utils.toast.text("请输入昵称");
    }
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.nick = nickName;
    console.log("提交", d);
    $utils.api
      .load("nickAuth", d, "get", { loading: false, login: true })
      .then(result => {
        if (result.code == 200) {
          $utils.toast.success("修改成功");
          $utils.data.set("CustomerToken", result.data.token);
          // $utils.auth.sync();
          // $utils.url.pop();
          setTimeout(() => {
            Taro.navigateBack();
          }, 500);
        } else {
          $utils.toast.text(result.msg);
        }
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 1200);
  };
  render() {
    let { nickName } = this.state;
    return (
      <View className='nickNameEdit'>
        <View className='nickNameEdit-box'>
          <InputText
            title='昵称：'
            placeholder='请输入昵称'
            onInput={this.onChageNickName}
            value={nickName + ""}
          ></InputText>
        </View>
        <SubmitBtn
          title='确认提交'
          handleSubmit={this.handleSubmit}
        ></SubmitBtn>
      </View>
    );
  }
}

export default Index;
