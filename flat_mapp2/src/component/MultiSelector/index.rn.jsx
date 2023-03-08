import React, { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.scss";
import { Datepicker, BottomModal, Timepicker, Scrollpicker } from "beeshell";
import { Drawer, Button, Label } from "teaset";
import { Text, DeviceEventEmitter } from "react-native";
import dayjs from "dayjs";

export default class Index extends Component {
  state = {
    name: "",
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
    ],
    index: 0, //显示日期
    range: [[], [], []],
    value: [0, 0, 0],
    listName: [[], [], []],
    oneObj: {},
    twoObj: {},
    threeObj: {}
  };
  componentDidMount() {
    let { AreaDroplist } = this.state;
    let range = [];
    AreaDroplist.map(item => {
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
    this.setState(
      {
        range
      },
      () => {
        this.changeSelector();
      }
    );
  }
  changeSelector = () => {
    let { range, value } = this.state;
    const s1list = [];
    const s2list = [];
    const s3list = [];
    const s1Allist = [];
    const s2Allist = [];
    const s3Allist = [];
    const s1 = this.state.value[0];
    const s2 = this.state.value[1];
    const s3 = this.state.value[2];
    if (range) {
      range.map(item => {
        s1list.push(item.name);
        s1Allist.push(item);
      });
    }
    if (range && range[s1] && range[s1].tree) {
      range[s1].tree.map(item => {
        s2list.push(item.name);
        s2Allist.push(item);
      });
    }
    if (
      range &&
      range[s1] &&
      range[s1].tree &&
      range[s1].tree[s2] &&
      range[s1].tree[s2].tree
    ) {
      range[s1].tree[s2].tree.map(item => {
        s3list.push(item.name);
        s3Allist.push(item);
      });
    }
    const s1v = s1Allist[s1] || {};
    const s2v = s2Allist[s2] || {};
    const s3v = s3Allist[s3] || {};
    console.log(s1list, s2list, s3list);
    console.log(s1, s2, s3);
    console.log(s1v, s2v, s3v);
    this.setState({
      listName: [s1list, s2list, s3list],
      value: [s1, s2, s3],
      oneObj: s1v,
      twoObj: s2v,
      threeObj: s3v
    });
  };
  render() {
    let { style, title } = this.props;
    return (
      <View
        style={{
          // ...styles.container,
          backgroundColor: "#f6f6f6",
          minHheight: 380
        }}
      >
        <View className="DatepickerRn_boxHeader">
          <Button
            className="DatepickerRn_boxBtn"
            titleStyle={{ color: "#555" }}
            title="取消"
            type="link"
            onPress={() => {
              setTimeout(() => {
                DeviceEventEmitter.emit("removeAllOverlay", {});
              }, 50);
            }}
          />
          <Label className="DatepickerRn_boxTitle">选择房间</Label>
          <Button
            className="DatepickerRn_boxBtn"
            titleStyle={{ color: "#FFC300" }}
            title="完成"
            type="link"
            onPress={() => {
              let { oneObj, twoObj, threeObj } = this.state;
              setTimeout(() => {
                this.props.selectData(oneObj, twoObj, threeObj);
              }, 100);
              DeviceEventEmitter.emit("removeAllOverlay", {});
            }}
          />
        </View>
        <Scrollpicker
          list={this.state.listName}
          value={this.state.value}
          proportion={[1, 1, 1]}
          onChange={(columnIndex, rowIndex) => {
            console.log(columnIndex, rowIndex);
            const vv = this.state.value;
            vv[columnIndex] = rowIndex;
            if (columnIndex == 0) {
              vv[1] = 0;
              vv[2] = 0;
            }
            if (columnIndex == 1) {
              vv[2] = 0;
            }
            if (columnIndex == 2) {
            }
            this.setState(
              {
                value: vv
              },
              () => {
                this.changeSelector();
              }
            );
          }}
        />
      </View>
    );
  }
}
