import { Component } from "react";

import { Image, View, Text, Textarea } from "@tarojs/components";
import "./index.scss";
import BoxUpload_1 from "@assets/image/BoxUpload_1.png";
import Taro from "@tarojs/taro";
import TextLabel from "../TextLabel";
import Accordion from "react-native-collapsible/Accordion";
import UploadImage from "../uploadImage";
import ItemWatermark from "../ItemWatermark";
import SelectTypeRn from "../SelectTypeRn";
import downPng from "@assets/image/projectBottom.png";
import { TextInput, Keyboard } from "react-native";
import { Input } from "teaset";
export default class Index extends Component {
  static defaultProps = {
    ...Component.defaultProps,
    disabled: false,
    placeholder: "请输入"
  };
  constructor(props) {
    super(props);
    this.state = {
      content: props.info?.content || "",
      images: props.info?.gallery ? props.info?.gallery?.split(",") : [],
      imageVal: false,
      levellistName: ["一般", "较大", "严重"],
      levellistData: [
        {
          name: "一般",
          id: 1
        },
        {
          name: "较大",
          id: 5
        },
        {
          name: "严重",
          id: 10
        }
      ],
      level: props.info.level == 10 ? 10 : props.info.level == 5 ? 5 : 1,
      levelName:
        props.info.level == 10
          ? "严重"
          : props.info.level == 5
          ? "较大"
          : "一般",
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
      stopId: props.info.is_stop_work == 1 ? 1 : 0,
      stopName: props.info.is_stop_work == 1 ? "是" : "否",
      value: 0,
      day: props.info.handle_day || "",
      is_onFocus: false,
      height: 0
    };
  }
  componentDidMount() {
    this.setState({
      content: this.props.info?.content || ""
    });
    // Taro.onKeyboardHeightChange(res => {
    //   Taro.pageScrollTo({
    //     scrollTop: res.height,
    //     duration: 200,
    //   })
    //     .then(res => {
    //       console.log(res, "成功");
    //     })
    //     .catch(err => {
    //       console.log(err, "失败");
    //     });
    // });
  }
  componentWillUnmount() {
    //移除监听
    // Taro.offKeyboardHeightChange();
  }
  setAvatar = src => {
    let images = this.state.images;
    images.push(src);
    // if (images.length >= 5) {
    //   images = images.slice(0, 5);
    //   this.setState({
    //     imageVal: true,
    //     images
    //   });
    //   return;
    // }
    this.setState(
      {
        images
      },
      () => {
        this.props.onSetAvatar(images.join(","), this.props.index);
      }
    );
  };
  getImages = data => {
    this.setState(
      {
        images: data,
        imageVal: false
      },
      () => {
        this.props.onSetAvatar(data.join(","), this.props.index);
      }
    );
  };
  //文本
  changeContent = e => {
    this.setState(
      {
        content: e.detail.value
      },
      () => {
        this.props.onChangeContent(e.detail.value, this.props.index);
      }
    );
  };
  onFocus = selector => {};
  changeDay = e => {
    this.setState(
      {
        day: e.detail.value
      },
      () => {
        this.props.onChangeDay(e.detail.value, this.props.index);
      }
    );
  };
  selectlevelIndex = data => {
    console.log(data, "等级");
    let { levellistData } = this.state;
    let obj = levellistData[data];
    let levelName = obj.name;
    let levelId = obj.id;
    this.setState(
      {
        levelName,
        levelId
      },
      () => {
        this.props.onSelectlevelIndex(obj.id, obj.name, this.props.index);
      }
    );
  };
  selectStopIndex = data => {
    console.log(data, "是否停工");
    let { stoplistData } = this.state;
    let obj = stoplistData[data];
    let stopName = obj.name;
    let stopId = obj.id;
    this.setState(
      {
        stopName,
        stopId
      },
      () => {
        this.props.selectStopIndex(obj.id, obj.name, this.props.index);
      }
    );
  };
  // onFocus = () => {
  //   this.props.onFocusChange();
  // };
  render() {
    let { info, index } = this.props;
    let { content, images, value, day, is_onFocus, height } = this.state;
    console.log(content, info?.content);
    return (
      <View className="ItemCreateRecord">
        <View className="ItemCreateRecord-title">隐患照片</View>
        <View className="ItemCreateRecord-box-imageBox">
          {(info?.gallery ? info?.gallery?.split(",") || [] : []).map(
            (item, index) => (
              <View
                className="ItemCreateRecord-box-imageBox-imageItem"
                key={index}
              >
                <UploadImage
                  getImages={this.getImages}
                  info={{
                    image: item,
                    index: index,
                    images: this.state.images
                  }}
                ></UploadImage>
              </View>
            )
          )}
          {this.state.imageVal ? null : (
            <ItemWatermark
              className="ItemCreateRecord-box-imageBox-imageItem"
              title="添加图片"
              setImage={false}
              source={BoxUpload_1}
              setImg={this.setAvatar}
              count={5}
            />
          )}
        </View>
        <View className="ItemCreateRecord-title">隐患描述</View>
        <View className={"ItemCreateRecord-TextareaBox "}>
          {/* <Textarea
            className="ItemCreateRecord-TextareaBox-content"
            style="background:#F2F2F2;width:100%;min-height: 120px"
            // autoHeight
            placeholder="请输入隐患描述"
            value={content + ""}
            onInput={this.changeContent.bind(this)}
            adjustPosition={true}
            id="textarea_id"
          /> */}
          <Input
            className="ItemCreateRecord-TextareaBox-content"
            multiline={true}
            style={{ textAlignVertical: "top", borderWidth: 0 }}
            numberOfLines={10}
            value={info?.content || "" + ""}
            placeholder={"请输入隐患描述"}
            onChangeText={content => {
              this.props.onChangeContent(content, this.props.index);
            }}
          />
        </View>
        <View className="ItemCreateRecord-title">隐患分类</View>
        <View
          className="ItemCreateRecord-inputBox"
          onClick={() => {
            let jsonData = JSON.stringify(info);
            Taro.navigateTo({
              url: `/pages/project/category/index?index=${index}&jsonData=${jsonData}`
            });
          }}
        >
          <View className="ItemCreateRecord-inputBox-title">
            {info.category_full_name || "请选择隐患标题"}
          </View>
          <Image
            className="ItemCreateRecord-inputBox-image"
            src={downPng}
            mode="aspectFill"
          />
        </View>
        <View className="ItemCreateRecord-title">隐患等级</View>
        <SelectTypeRn
          title="隐患等级"
          listName={this.state.levellistName}
          selectIndex={this.selectlevelIndex}
          typeName={
            info.level == 10 ? "严重" : info.level == 5 ? "较大" : "一般"
          }
          placeholder="可选择隐患等级"
        ></SelectTypeRn>
        {/* <View className="ItemCreateRecord-title">是否停工</View> */}
        {/* <SelectTypeRn
          title="是否停工"
          listName={this.state.stoplistName}
          selectIndex={this.selectStopIndex}
          typeName={info.is_stop_work == 1 ? "是" : "否"}
          placeholder="可选择工程状态"
        ></SelectTypeRn>
        <View className="ItemCreateRecord-title">整改天数</View> */}

        {/* <View className={"ItemCreateRecord-inputBox "} id="day_id">
          <Input
            className="ItemCreateRecord-inputBox-content"
            placeholder="请输入整改天数"
            onInput={this.changeDay.bind(this)}
            onFocus={this.onFocus.bind(this, "day_id")}
            value={info.handle_day || "" + ""}
            type="number"
          />
          {info.handle_day ? (
            <View className="ItemCreateRecord-inputBox-date">
              限于{info.end_date}前
            </View>
          ) : null}
        </View> */}
        {/* <View className="ItemCreateRecord-title">签名</View> */}
      </View>
    );
  }
}
