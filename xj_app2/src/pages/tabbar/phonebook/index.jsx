import React, { Component } from "react";
import Taro from "@tarojs/taro";

import { View, Text, Image, Input } from "@tarojs/components";

import "./index.scss";
import { BoxEmpty, ItemPhoneBook, FooterLine, ProjectPicker } from "@component";

class Phonebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
      list: [],
      bannerList: [],
      dataTotal: 0,
      project_id: "",
      isSearch: false,
      search: "",
      listName: [],
      listData: [],
      projectName: "",
      projectId: ""
    };
  }

  async componentDidMount() {
    Taro.eventCenter.on("refreshSearch", val => {
      console.log("搜索");
      this.setState({
        isSearch: true
      });
    });
    Taro.eventCenter.on("refreshMessageBadge", val => {
      this.loadData();
    });
    await this.projectDroplist();
    await this.loadData();
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshSearch");
    Taro.eventCenter.off("refreshMessageBadge");
  }
  componentDidShow() {
  }
  projectDroplist = async () => {
    let d = {};
    let result = {};
    try {
      result = await $utils.api.load("projectDroplist", d, "get", false);
      if (result.data) {
        let v = result.data || [];
        let listName = [];
        let dd = {
          name: "全部",
          id: ""
        };
        let allName = "全部";
        v.map(item => {
          listName.push(item.title);
          item.name = item.title;
          item.id = item.project_id;
        });
        listName.unshift(allName);
        v.unshift(dd);
        this.setState({
          listData: v,
          listName
        });
      }
    } catch (error) {
      console.log(error, "异常");
    }
  };
  loadData = async () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    let result = {};
    d.page = this.state.pageIndex;
    d.project_id = this.state.projectId || "";
    d.search = this.state.search || "";
    d.psize = 10;
    try {
      result = await $utils.api.load("contactlists", d, "get", {
        loading: false,
        login: true
      });
      if (result.data) {
        let v = result.data.list || [];
        this.setState({
          list: this.state.pageIndex === 1 ? v : this.state.list.concat(v),
          dataTotal: result?.data?.page?.total || 0
        });
      }
    } catch (error) {
      Taro.hideLoading();
    }
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
  };
  //下拉刷新
  onPullDownRefresh = () => {
    this.setState(
      {
        search: ""
      },
      () => {
        this.commonSearch();
      }
    );
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  //滑动加载
  onReachBottom = () => {
    let { dataTotal, list } = this.state;
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1
      },
      () => {
        if (dataTotal > list.length) {
          this.loadData();
        }
      }
    );
  };
  commonSearch = () => {
    this.setState(
      {
        list: [],
        pageIndex: 1
      },
      () => {
        this.loadData();
      }
    );
  };
  onInput = e => {
    let val = e.detail.value || "";
    this.setState({
      search: val
    });
  };
  onConfirm = e => {
    let val = e.detail.value || "";
    this.setState(
      {
        search: val
      },
      () => {
        this.commonSearch();
      }
    );
  };
  //输入框失去焦点隐藏
  onBlur = () => {
    this.setState({
      isSearch: false
    });
  };
  //选择项目
  selectlevelIndex = data => {
    let { listData } = this.state;
    let obj = listData[data];
    let projectName = obj.name;
    let projectId = obj.id;
    this.setState(
      {
        projectName,
        projectId
      },
      () => {
        this.commonSearch();
      }
    );
  };
  render() {
    let { list, isSearch } = this.state;
    return (
      <View className="phonebook">
        <View className="phonebook-header">
          <ProjectPicker
            title="选择项目"
            className="phonebook-header-left"
            listName={this.state.listName}
            selectIndex={this.selectlevelIndex}
            typeName={this.state.projectName}
          />
        </View>
        {isSearch ? (
          <View className="phonebook-inputBox">
            <Input
              className="phonebook-input"
              placeholder="请输入姓名"
              focus
              onConfirm={this.onConfirm}
              confirmType="search"
              value={this.state.search}
              onInput={this.onInput.bind(this)}
              onBlur={this.onBlur.bind(this)}
            />
          </View>
        ) : null}
        {list.map((item,index) => {
          return (
            <ItemPhoneBook key={index} info={item}></ItemPhoneBook>
          );
        })}
        {list && list.length != 0 ? (
          <FooterLine title="没有更多数据了~"></FooterLine>
        ) : (
          <BoxEmpty title="暂无内容"></BoxEmpty>
        )}
      </View>
    );
  }
}
export default Phonebook;
