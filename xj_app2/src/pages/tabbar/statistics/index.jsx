import React, { Component } from "react";
import Taro from "@tarojs/taro";

import {
  View,
  Text,
  Image,
  Swiper,
  SwiperItem,
  Picker,
  ScrollView,
  Input
} from "@tarojs/components";

import "./index.scss";
import {
  BoxEmpty,
  FilterDrawer,
  FooterLine,
  MonthPicker,
  YearPicker,
  ProjectPicker,
  TextLabel
} from "@component";
import Accordion from "react-native-collapsible/Accordion";
import currencyPng from "@assets/image/currency.png";
import { getWindowHeight } from "@utils/style";
import dayjs from "dayjs";
import categorydownPng from "@assets/image/categorydown.png";
import Recordnochecked from "@assets/image/Recordnochecked.png";
import Recordchecked from "@assets/image/Recordchecked.png";
import closePng from "@assets/image/close.png";
import { Drawer } from "teaset";
import { Progress } from "beeshell";
class Phonebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listName: [],
      listData: [],
      projectName: "",
      projectId: "",
      filterList: [
        {
          title: "整改状态",
          type: "handle_status",
          children: [
            {
              title: "全部",
              params: "",
              value: "",
              type: "handle_status"
            },
            {
              title: "未整改",
              params: "0",
              value: "0",
              type: "handle_status"
            },
            {
              title: "已整改",
              params: 10,
              value: 10,
              type: "handle_status"
            }
          ]
        },
        {
          title: "隐患等级",
          type: "level",
          children: [
            {
              title: "全部",
              params: "",
              value: "",
              type: "level"
            },
            {
              title: "一般",
              params: "1",
              value: "1",
              type: "level"
            },
            {
              title: "较大",
              params: 5,
              value: 5,
              type: "level"
            },
            {
              title: "严重",
              params: 10,
              value: 10,
              type: "level"
            }
          ]
        },
        {
          title: "是否停工",
          type: "is_stop_work",
          children: [
            {
              title: "全部",
              params: "",
              value: "",
              type: "is_stop_work"
            },
            {
              title: "施工中",
              params: "0",
              value: "0",
              type: "is_stop_work"
            },
            {
              title: "已停工",
              params: 1,
              value: 1,
              type: "is_stop_work"
            }
          ]
        }
      ],
      drawer: null,
      selectTagArr: [],
      tagNum: 0,
      selectTagData: [],
      category_id: "",
      handle_status: "",
      is_stop_work: "",
      level: "",
      list: [],
      search: "",
      isSearch: false,
      isTitle: false,
      date: dayjs(new Date()).format("YYYY") || "",
      monthNameList: [
        "全部",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
      ],
      monthName: "",
      yearName: dayjs(new Date()).format("YYYY") || "",
    };
  }

  async componentDidMount() {
    Taro.eventCenter.on("refreshStatisticsSearch", val => {
      let { isTitle } = this.state;
      console.log("搜索", isTitle);
      let title = "隐患统计";
      if (!isTitle) {
        title = "工程统计";
      }
      this.setState(
        {
          isTitle: !isTitle,
          projectId: "",
          projectName: ""
        },
        () => {
          Taro.setNavigationBarTitle({
            title: title
          });
          this.loadData();
        }
      );
    });
    await this.groupkv();
    await this.projectDroplist();
    await this.loadData();
  }
  componentWillUnmount() {
    Taro.eventCenter.off("refreshStatisticsSearch");
  }
  groupkv = async () => {
    let d = {};
    let result = {};
    try {
      result = await $utils.api.load("batchCategory", d, "get", false);
      if (result.data) {
        console.log(result.data);
        let v = result.data.list;
        let { filterList } = this.state;
        let obj = {};
        obj.title = "隐患类型";
        obj.type = "category_id";
        let arr = [];
        v.map(item => {
          let dd = {};
          dd.title = item.name;
          dd.params = item.category_id;
          dd.type = "category_id";
          arr.push(dd);
        });
        let all = {
          title: "全部",
          params: "",
          value: "",
          type: "category_id"
        };
        arr.unshift(all);
        obj.children = arr;
        filterList.unshift(obj);
        this.setState({
          filterList
        });
      }
    } catch (error) {
      // Taro.hideLoading();
    }
  };
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
    let {
      isTitle,
      date,
      projectId,
      category_id,
      handle_status,
      is_stop_work,
      level
    } = this.state;
    let d = {};
    let result = {};
    let type = 2;
    if (!isTitle) {
      type = 1;
    }
    d.type = type;
    d.date = date;
    d.project_id = projectId;
    d.category_id = category_id;
    d.handle_status = handle_status;
    d.is_stop_work = is_stop_work;
    d.level = level;
    try {
      result = await $utils.api.load("troubleStatistics", d, "get", false);
      if (result.data) {
        let v = result.data.list || [];
        this.setState({
          list: v
        });
        console.log(v);
      }
    } catch (error) {
      console.log(error, "异常");
    }
    setTimeout(() => {
      Taro.hideLoading();
    }, 500);
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
        this.loadData();
      }
    );
  };
  //输入框失去焦点隐藏
  onBlur = () => {
    this.setState({
      isSearch: false
    });
  };
  //下拉刷新
  onPullDownRefresh = () => {
    Taro.showLoading({
      title: "loading"
    });
    this.setState(
      {
        date: dayjs(new Date()).format("YYYY") || "",
        yearName: dayjs(new Date()).format("YYYY") || "",
        monthName:"",
        projectId: "",
        projectName: ""
      },
      () => {
        this.resetHandleClick();
      }
    );
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };
  //日期
  selectMonthData = data => {
    let { date } = this.state;
    if (date == data) {
      return;
    }
    console.log(date);
    this.setState(
      {
        date: data
      },
      () => {
        this.loadData();
      }
    );
  };
  selectlevelIndex = data => {
    let { listData, projectId } = this.state;
    let obj = listData[data];
    let projectName = obj.name;
    if (projectId == obj.id) {
      return;
    }
    projectId = obj.id;
    this.setState(
      {
        projectName,
        projectId
      },
      () => {
        this.loadData();
      }
    );
  };
  //过滤筛选
  setFilter = () => {
    let { filterList } = this.state;
    setTimeout(() => {
      let showDrawer = Drawer.open(this.renderFilterDrawer(), "right");
    }, 5);
  };
  renderFilterDrawer = () => {
    let { filterList } = this.state;
    return (
      <FilterDrawer
        resetHandleClick={this.resetHandleClick}
        onSubmitClick={this.onSubmitClick}
        filterList={filterList}
      />
    );
  };
  resetHandleClick = () => {
    console.log("重置");
    this.setState(
      {
        selectTagArr: [],
        selectTagData: [],
        projectId: "",
        category_id: "",
        handle_status: "",
        is_stop_work: "",
        level: ""
      },
      () => {
        this.loadData();
      }
    );
  };
  onSubmitClick = data => {
    let { filterList } = this.state;
    let arr = [];
    let selectTagData = [];
    data.map(item => {
      item.children.map(subItem => {
        if (subItem.active) {
          arr.push(subItem);
          selectTagData.push(item);
        }
      });
    });
    let category_id = "";
    let handle_status = "";
    let is_stop_work = "";
    let level = "";
    console.log(arr, 99999);
    arr.map(key => {
      if (key.type == "category_id") {
        category_id = key.params;
      }
      if (key.type == "handle_status") {
        handle_status = key.params;
      }
      if (key.type == "is_stop_work") {
        is_stop_work = key.params;
      }
      if (key.type == "level") {
        level = key.params;
      }
    });

    let tagNum = 0;
    arr.map(key => {
      if (key.title == "全部") {
        tagNum = tagNum + 1;
      }
    });
    this.setState(
      {
        selectTagArr: arr,
        tagNum,
        selectTagData,
        category_id,
        handle_status,
        is_stop_work,
        level
      },
      () => {
        this.loadData();
      }
    );
  };
  //关闭标签
  closeTag = (dataItem, dataSubItem) => {
    let { selectTagArr, selectTagData, filterList } = this.state;
    let category_id = "";
    let handle_status = "";
    let is_stop_work = "";
    let level = "";
    selectTagArr.map((item, index) => {
      if (item.type == dataSubItem.type) {
        selectTagArr.splice(index, 1);
        selectTagData.splice(index, 1);
      }
    });
    const _filterList = filterList.map(menu => {
      if (menu.type === dataItem.type) {
        menu.children.forEach(menuItem => {
          menuItem.active = false;
        });
      }
      return menu;
    });
    const target = _filterList.find(v => v.type == dataItem.type);
    const child = target.children.find(v => v.params == dataSubItem.params);
    let tagNum = 0;
    selectTagArr.map(key => {
      if (key.type == "category_id") {
        category_id = key.value;
      }
      if (key.type == "handle_status") {
        handle_status = key.value;
      }
      if (key.type == "is_stop_work") {
        is_stop_work = key.value;
      }
      if (key.type == "level") {
        level = key.value;
      }
      if (key.title == "全部") {
        tagNum = tagNum + 1;
      }
    });
    this.setState(
      {
        selectTagArr,
        selectTagData,
        filterList: _filterList,
        category_id,
        handle_status,
        is_stop_work,
        level,
        tagNum
      },
      () => {
        this.loadData();
      }
    );
  };
  //年
  selectYearData = data => {
    let { monthName } = this.state;
    let date = "";
    if (!monthName) {
      date = data;
    } else {
      date = data + "-" + monthName;
    }
    this.setState(
      {
        yearName: data,
        date
      },
      () => {
        this.loadData();
      }
    );
  };

  //月
  selectMonthData = data => {
    let index = data || 0;
    let { monthNameList, yearName } = this.state;
    let monthName = monthNameList[index];
    let date = yearName + "-" + monthName;
    if (monthName == "全部") {
      date = yearName;
      monthName = "";
    } else {
      date = yearName + "-" + monthName;
    }
    this.setState(
      {
        date,
        monthName
      },
      () => {
        this.loadData();
      }
    );
  };
  render() {
    let {
      selectTagArr,
      filterList,
      list,
      isSearch,
      isTitle,
      date,
      tagNum,
      yearName
    } = this.state;
    console.log(selectTagArr);
    return (
      <View className="statistics">
        <View className="statistics-header">
          <YearPicker
            selectData={this.selectYearData}
            yearName={yearName}
            className="statistics-header-left"
          ></YearPicker>
          <MonthPicker
            selectIndex={this.selectMonthData}
            className="statistics-header-leftTwo"
            listName={this.state.monthNameList}
            monthName={this.state.monthName}
          ></MonthPicker>
          {!isTitle ? (
            <ProjectPicker
              title="选择项目"
              className="statistics-header-middle"
              listName={this.state.listName}
              selectIndex={this.selectlevelIndex}
              typeName={this.state.projectName}
            />
          ) : null}
          <View
            className="statistics-header-right"
            onClick={() => {
              this.setFilter();
            }}
          >
            <View className="statistics-header-right-title">更多</View>
            <Image
              className="statistics-header-right-image"
              src={categorydownPng}
              // src={imageVal ? categorytopPng : categorydownPng}
              mode="aspectFill"
            />
          </View>
        </View>
        {selectTagArr.length > 0 && tagNum != selectTagArr.length ? (
          <View className="statistics-wrapp">
            <ScrollView scrollX scrollWithAnimation>
              <View className="statistics-tagBox">
                {filterList.map((item, index) => {
                  return (
                    <View className="statistics-tagBoxss" key={index}>
                      {item.children.map((subItem, sindex) => {
                        return subItem.active && subItem.title != "全部" ? (
                          <View
                            key={sindex}
                            className="statistics-tagBox-item"
                            onClick={() => {
                              this.closeTag(item, subItem);
                            }}
                          >
                            <View className="statistics-tagBox-title">
                              {subItem.title}
                            </View>
                            <Image
                              className="statistics-tagBox-closePng"
                              src={closePng}
                              mode="aspectFill"
                            />
                          </View>
                        ) : null;
                      })}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        ) : null}
        {isSearch ? (
          <View className="statistics-inputBox">
            <Input
              className="statistics-input"
              placeholder="请输入工程"
              focus
              onConfirm={this.onConfirm}
              confirmType="search"
              onBlur={this.onBlur.bind(this)}
              onInput={this.onInput.bind(this)}
            />
          </View>
        ) : null}
        {list.length > 0 ? (
          <View className="statistics-progressBox">
            {list.map((item, index) => {
              return (
                <View className="statistics-progressBox-item" key={index}>
                  <TextLabel
                    className="statistics-progressBox-item-title"
                    num={1}
                    content={item.item_name}
                  />
                  <Progress
                    style={{ width: 200 }}
                    barStyle={{
                      backgroundColor: index % 2 == 0 ? "#3ED4F6" : "#52B7F8",
                      height: 20
                    }}
                    easing={true}
                    percent={isTitle ? item.project_percent : item.item_percent}
                  />
                  <View className="statistics-progressBox-item-num">
                    {isTitle ? item.project_count : item.item_count}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <BoxEmpty title="暂无统计"></BoxEmpty>
        )}
      </View>
    );
  }
}
export default Phonebook;
