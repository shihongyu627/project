import React, { Component } from "react";

import { Picker, View, Text } from "@tarojs/components";
import "./index.scss";
import dayjs from "dayjs";
import Taro from "@tarojs/taro";

export default class Index extends Component {
  state = {
    ranges: [[], [], []],
    address_value: [0, 0, 0],
    index: 0, //显示日期,
    AreaDroplist: [
      {
        id: 11,
        pid: 10,
        name: "上城区",
        code: "330102",
        sort: 50,
        status: 1,
        tree: [
          {
            id: 12,
            pid: 11,
            name: "清波街道",
            code: "330102001",
            sort: 50,
            status: 1,
            tree: [
              {
                id: 13,
                pid: 11,
                name: "湖滨街道1",
                code: "111",
                sort: 50,
                status: 1,
                tree: null
              },
              {
                id: 14,
                pid: 11,
                name: "小营街道2",
                code: "222",
                sort: 50,
                status: 1,
                tree: null
              },
              {
                id: 15,
                pid: 11,
                name: "南星街道3",
                code: "333",
                sort: 50,
                status: 1,
                tree: null
              }
            ]
          },
          {
            id: 13,
            pid: 11,
            name: "湖滨街道",
            code: "330102003",
            sort: 50,
            status: 1,
            tree: [
              {
                id: 13,
                pid: 11,
                name: "湖滨街道3",
                code: "111",
                sort: 50,
                status: 1,
                tree: null
              },
              {
                id: 14,
                pid: 11,
                name: "小营街道4",
                code: "222",
                sort: 50,
                status: 1,
                tree: null
              },
              {
                id: 15,
                pid: 11,
                name: "南星街道5",
                code: "333",
                sort: 50,
                status: 1,
                tree: null
              }
            ]
          }
        ]
      },
      {
        id: 18,
        pid: 10,
        name: "下城区",
        code: "330103",
        sort: 50,
        status: 1,
        tree: [
          {
            id: 19,
            pid: 18,
            name: "长庆街道",
            code: "330103006",
            sort: 50,
            status: 1,
            tree: [
              {
                id: 13,
                pid: 11,
                name: "湖滨街道7",
                code: "111",
                sort: 50,
                status: 1,
                tree: null
              },
              {
                id: 14,
                pid: 11,
                name: "小营街道6",
                code: "222",
                sort: 50,
                status: 1,
                tree: null
              },
              {
                id: 15,
                pid: 11,
                name: "南星街道9",
                code: "333",
                sort: 50,
                status: 1,
                tree: null
              }
            ]
          },
          {
            id: 20,
            pid: 18,
            name: "武林街道",
            code: "330103002",
            sort: 50,
            status: 1,
            tree: [
              {
                id: 13,
                pid: 11,
                name: "湖滨街道10",
                code: "111",
                sort: 50,
                status: 1,
                tree: null
              },
              {
                id: 14,
                pid: 11,
                name: "小营街道12",
                code: "222",
                sort: 50,
                status: 1,
                tree: null
              },
              {
                id: 15,
                pid: 11,
                name: "南星街道13",
                code: "333",
                sort: 50,
                status: 1,
                tree: null
              }
            ]
          }
        ]
      }
    ]
  };
  componentDidMount() {
    // this.load();
    this.pickerSetRange();
  }
  load = () => {
    Taro.showLoading({
      title: "loading"
    });
    let d = {};
    d.pageNum = this.state.pageIndex;
    d.pageSize = 10;
    d.orderByColumn = "id";
    d.isAsc = "descending";
    global.$utils.api
      .load("https://upreport.idocore.com/api/area/drop", d, "get", false)
      .then(res => {
        if (res.code > 0) {
          let v = res.data || [];
          console.log(v);
          this.setState(
            {
              AreaDroplist: this.state.list
            },
            () => {
              this.pickerSetRange();
            }
          );
          console.log(v);
          // 选择器设置选择范围
        }
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      Taro.hideLoading();
    }, 300);
  };
  // 选择器设置选择范围
  pickerSetRange = (value = [0, 0, 0]) => {
    console.log("pickerSetRange");
    let areaDroplist = this.state.AreaDroplist || [];
    // 更新range范围
    let range = [];
    console.log(areaDroplist, 999);
    areaDroplist.map(item => {
      let x = {};
      x.id = item.id;
      x.code = item.code;
      x.name = item.name;
      x.tree = [];
      if (item.tree) {
        item.tree.map(item2 => {
          let xx = {};
          xx.id = item2.id;
          xx.code = item2.code;
          xx.name = item2.name;
          xx.tree = [];
          x.tree.push(xx);
          if (item2.tree) {
            item2.tree.map(item3 => {
              let xxx = {};
              xxx.id = item3.id;
              xxx.code = item3.code;
              xxx.name = item3.name;
              xx.tree.push(xxx);
            });
          }
        });
      }
      range.push(x);
    });
    console.log("pickerSetRange range", range);
    let pickerRange = [
      range,
      range[value[0]].tree,
      range[value[0]].tree[0].tree
    ]; //, range[value[0]].tree
    this.setState(
      {
        ranges: pickerRange
      },
      () => {
        // 触发选择器
        let e = {};
        e.detail = {};
        e.column = value[0];
        e.value = value[1];
        this.pickerColumnChange(e);
      }
    );
    console.log("pickerSetRange ranges", pickerRange);
  };
  // 选择器确认
  pickerChange = e => {
    console.log("pickerChange", e);
    let value = e.detail.value;
    console.log("pickerChange value", value);
    // 获取选中项
    let pickerRange = this.state.ranges;
    let v1 = pickerRange[0][value[0]]; // 第一列值
    let v2 = pickerRange[1][value[1]]; // 第二列值
    let v3 = pickerRange[2][value[2]]; // 第三列值
    console.log("pickerChange v1 v2", v1, v2, v3);
    // 获取选中的值
    this.setState(
      {
        address_value: value,
        provinces_code: v1.code,
        provinces_name: v1.name,
        city_code: v2.code,
        city_name: v2.name,
        district_code: v3.code,
        district_name: v3.name,
        address: v2.name
      },
      () => {
        console.log("address_value", this.state.address_value);
        console.log(v1.code, "楼", v2.code, "层", v3.code, "室");
      }
    );
  };
  // 弹出弹窗选择地址
  pickerClick = () => {
    console.log("pickerClick");
    let address_value = this.state.address_value || [0, 0];
    this.pickerSetRange(address_value);
  };
  // 选择器列变化
  pickerColumnChange = e => {
    console.log("pickerColumnChange", e);
    console.log("pickerColumnChange", e);
    let value = e.detail;
    console.log("pickerColumnChange value", value);
    // 更新range范围
    let pickerRange = this.state.ranges;
    console.log("pickerColumnChange ranges", pickerRange);
    let address_value = this.state.address_value || [0, 0, 0];
    if (value.column == 0) {
      address_value = [value.value, 0, 0];
      console.log("pickerColumnChange ranges.value", pickerRange);
      pickerRange = [
        pickerRange[0],
        pickerRange[0][value.value].tree,
        pickerRange[0][value.value].tree[0].tree
      ];
    }
    if (value.column == 1) {
      console.log(value, "aaaaaaaa", pickerRange);
      let one = this.state.address_value[0];
      pickerRange = [
        pickerRange[0],
        pickerRange[0][one].tree,
        pickerRange[0][one].tree[value.value].tree
      ];
      address_value = [address_value[0], value.value];
    }
    if (value.column == 2) {
      address_value = [address_value[0], address_value[1], value.value];
    }
    this.setState({
      ranges: pickerRange,
      address_value: address_value
    });
  };
  // 选择器取消区
  pickerCancel = () => {
    console.log("pickerCancel");
  };
  //小程序选择类型
  onChangeType = e => {
    let index = e.detail.value;
    this.props.selectIndex(index);
  };
  render() {
    let { title, typeName, listName, className } = this.props;
    return (
      <View>
        <Picker
          mode="multiSelector"
          onClick={this.pickerClick.bind(this)}
          range={this.state.ranges}
          rangeKey={"name"}
          value={this.state.address_value}
          onCancel={this.pickerCancel.bind(this)}
          onChange={this.pickerChange.bind(this)}
          onColumnChange={this.pickerColumnChange.bind(this)}
        >
          <View className="SelectType_texts" className={className}>
            {title}
          </View>
        </Picker>
      </View>
    );
  }
}
