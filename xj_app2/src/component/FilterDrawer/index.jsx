import { Component } from "react";

import { Image, View, Input } from "@tarojs/components";
import "./index.less";
import filterBgPng from "@assets/image/filter_bg.png";
import { DeviceEventEmitter } from "react-native";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  constructor(props) {
    super(props);
    this.state = {
      newList: props.filterList || []
    };
  }
  render() {
    let { newList } = this.state;
    return (
      <View className="drawerWrap">
        <View className="drawerWrap-title">条件筛选</View>
        <View className="drawerWrap-box">
          {(newList || []).map((item, sindex) => {
            return (
              <View className="drawerWrap-box-wrap" key={sindex}>
                <View className="drawerWrap-box-wrap-title">{item.title}</View>
                <View className="drawerWrap-box-wrap-item">
                  {item.children.map((subItem, index) => {
                    return (
                      <View
                        key={index}
                        className={
                          "drawerWrap-box-wrap-item-stitle " +
                          (subItem.active
                            ? "drawerWrap-box-wrap-item-active"
                            : "")
                        }
                        onClick={() => {
                          const _filterList = newList.map(menu => {
                            if (menu.type === item.type) {
                              menu.children.forEach(menuItem => {
                                menuItem.active =
                                  menuItem.params == subItem.params;
                                menu.active = menuItem.params == subItem.params;
                              });
                            }
                            return menu;
                          });
                          const target = _filterList.find(
                            v => v.type == item.type
                          );
                          const child = target.children.find(
                            v => v.params == subItem.params
                          );
                          this.setState({
                            newList: _filterList
                          });
                        }}
                      >
                        {subItem.title}
                        {subItem.active ? (
                          <Image
                            className="drawerWrap-box-wrap-item-filterBgPng"
                            src={filterBgPng}
                            mode="aspectFill"
                          />
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
        <View className="drawerWrap-footerWrap">
          <View
            className="drawerWrap-footerWrap-footerbtn  drawerWrap-footerWrap-resetbtn"
            onClick={() => {
              const _filterList = newList.map(menu => {
                menu.children.forEach(menuItem => {
                  menuItem.active = false;
                });
                return menu;
              });
              this.setState(
                {
                  newList: _filterList
                },
                () => {
                  this.props.resetHandleClick();
                }
              );
            }}
          >
            重置
          </View>
          <View
            className="drawerWrap-footerWrap-footerbtn  drawerWrap-footerWrap-okbtn"
            onClick={() => {
              DeviceEventEmitter.emit("removeAllOverlay", {});
              this.props.onSubmitClick(newList);
            }}
          >
            确定
          </View>
        </View>
      </View>
    );
  }
}
