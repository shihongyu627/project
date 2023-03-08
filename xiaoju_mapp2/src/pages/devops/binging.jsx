import Taro, { Component } from "@tarojs/taro";
import { View, Button, Image, Input, Text } from "@tarojs/components";
import styles from "./binging.module.scss";
import namedPng from "../../assets/img/black_saoma.png";
import namedPng1 from "../../assets/img/bind_1.png";
import namedPng2 from "../../assets/img/bind_2.png";
import namedPng3 from "../../assets/img/bind_3.png";
import namedPng4 from "../../assets/img/bind_4.png";
import namedPng5 from "../../assets/img/bind_5.png";
import namedPng6 from "../../assets/img/bind_6.png";

class Binging extends Component {
  config = {
    navigationBarTitleText: "车辆绑定",
    enablePullDownRefresh: true
  };

  constructor(props) {
    super(props);
    this.state = {
      device_no: "",
      imei: "",
      OPEN_LOCK: 0,
      CLOSE_LOCK: 0,
      FIND_DEVICE: 0,
      PAUSE_LOCK: 0,
      PAUSE_UNLOCK: 0,
      NOW_LOCATION: 0,
      checkbind: 0,
      list: [
        {
          title: "开锁",
          img: namedPng1,
          type: "OPEN_LOCK",
          id: 1
        },
        {
          title: "临时锁车",
          img: namedPng2,
          type: "PAUSE_LOCK",
          id: 2
        },
        {
          title: "寻车",
          img: namedPng3,
          type: "FIND_DEVICE",
          id: 3
        },
        {
          title: "临时开锁",
          img: namedPng4,
          type: "PAUSE_UNLOCK",
          id: 4
        },
        {
          title: "定位",
          img: namedPng5,
          type: "NOW_LOCATION",
          id: 5
        },
        {
          title: "关锁",
          img: namedPng6,
          type: "CLOSE_LOCK",
          id: 6
        }
      ],
      idArr: []
    };
  }

  componentDidMount() {}

  //输入编码
  handleErweimaChange = e => {
    console.log(e.detail.value, "输入车辆编码");
    this.setState({
      device_no: e.detail.value,
      checkbind: 0
    });
  };
  handleErweimaiemiChange = e => {
    console.log(e.detail.value, "输入中控编码");
    this.setState({
      imei: e.detail.value,
      checkbind: 0
    });
  };

  // 车辆扫码
  handleQrcode = async () => {
    let device_no = await global.$utils.qrcode.scan();
    if (device_no) {
      this.setState({
        device_no: device_no,
        checkbind: 0
      });
    }
  };
  // 中控扫码
  handleiemiQrcode = async () => {
    let imei = await global.$utils.qrcode.imei();
    if (imei) {
      this.setState({
        imei: imei,
        checkbind: 0
      });
    }
  };
  onClickSelect = (id, type, title) => {
    let { idArr } = this.state;
    let d = {};
    d.device_no = this.state.device_no;
    d.imei = this.state.imei;
    let tipTitle = `${title}中`;
    Taro.showLoading({
      title: tipTitle
    });
    if (type == "OPEN_LOCK") {
      d.action = "OPEN_LOCK";
    }
    if (type == "CLOSE_LOCK") {
      d.action = "CLOSE_LOCK";
    }
    if (type == "FIND_DEVICE") {
      d.action = "FIND_DEVICE";
    }
    if (type == "PAUSE_LOCK") {
      d.action = "PAUSE_LOCK";
    }
    if (type == "PAUSE_UNLOCK") {
      d.action = "PAUSE_UNLOCK";
    }
    if (type == "NOW_LOCATION") {
      d.action = "NOW_LOCATION";
    }

    global.$utils.api.load("devopsdevicetest", d).then(result => {
      if (result.code == 1) {
        Taro.hideLoading()
        idArr.push(id);
        // 开锁
        if (d.action == "OPEN_LOCK") {
          this.setState({
            OPEN_LOCK: 1
          });
        }
        // 关锁
        if (d.action == "CLOSE_LOCK") {
          this.setState({
            CLOSE_LOCK: 1
          });
        }
        // 临时锁车
        if (d.action == "PAUSE_LOCK") {
          this.setState({
            PAUSE_LOCK: 1
          });
        }
        // 临时开锁
        if (d.action == "PAUSE_UNLOCK") {
          this.setState({
            PAUSE_UNLOCK: 1
          });
        }
        // 寻车
        if (d.action == "FIND_DEVICE") {
          this.setState({
            FIND_DEVICE: 1
          });
        }
        // 定位
        if (d.action == "NOW_LOCATION") {
          this.setState({
            NOW_LOCATION: 1
          });
        }
        let mese = result.message;
        global.$utils.toast.success(mese);
        this.setState({
          idArr
        });
      } else {
        Taro.hideLoading()
        let mese = result.message;
        global.$utils.toast.error(mese);
        // 开锁
        if (d.action == "OPEN_LOCK") {
          this.setState({
            OPEN_LOCK: 2
          });
        }
        // 关锁
        if (d.action == "CLOSE_LOCK") {
          this.setState({
            CLOSE_LOCK: 2
          });
        }
        // 临时锁车
        if (d.action == "PAUSE_LOCK") {
          this.setState({
            PAUSE_LOCK: 2
          });
        }
        // 临时开锁
        if (d.action == "PAUSE_UNLOCK") {
          this.setState({
            PAUSE_UNLOCK: 2
          });
        }
        // 寻车
        if (d.action == "FIND_DEVICE") {
          this.setState({
            FIND_DEVICE: 2
          });
        }
        // 定位
        if (d.action == "NOW_LOCATION") {
          this.setState({
            NOW_LOCATION: 2
          });
        }
      }
    });
  };
  // 测试
  roll(url) {
    let d = {};
    d.device_no = this.state.device_no;
    d.imei = this.state.imei;

    if (url == "OPEN_LOCK") {
      d.action = "OPEN_LOCK";
    }
    if (url == "CLOSE_LOCK") {
      d.action = "CLOSE_LOCK";
    }
    if (url == "FIND_DEVICE") {
      d.action = "FIND_DEVICE";
    }
    if (url == "PAUSE_LOCK") {
      d.action = "PAUSE_LOCK";
    }
    if (url == "PAUSE_UNLOCK") {
      d.action = "PAUSE_UNLOCK";
    }
    if (url == "NOW_LOCATION") {
      d.action = "NOW_LOCATION";
    }

    global.$utils.api.load("devopsdevicetest", d).then(result => {
      if (result.code == 1) {
        // 开锁
        if (d.action == "OPEN_LOCK") {
          this.setState({
            OPEN_LOCK: 1
          });
        }
        // 关锁
        if (d.action == "CLOSE_LOCK") {
          this.setState({
            CLOSE_LOCK: 1
          });
        }
        // 临时锁车
        if (d.action == "PAUSE_LOCK") {
          this.setState({
            PAUSE_LOCK: 1
          });
        }
        // 临时开锁
        if (d.action == "PAUSE_UNLOCK") {
          this.setState({
            PAUSE_UNLOCK: 1
          });
        }
        // 寻车
        if (d.action == "FIND_DEVICE") {
          this.setState({
            FIND_DEVICE: 1
          });
        }
        // 定位
        if (d.action == "NOW_LOCATION") {
          this.setState({
            NOW_LOCATION: 1
          });
        }
      } else {
        let mese = result.message;
        global.$utils.toast.error(mese);
        // 开锁
        if (d.action == "OPEN_LOCK") {
          this.setState({
            OPEN_LOCK: 2
          });
        }
        // 关锁
        if (d.action == "CLOSE_LOCK") {
          this.setState({
            CLOSE_LOCK: 2
          });
        }
        // 临时锁车
        if (d.action == "PAUSE_LOCK") {
          this.setState({
            PAUSE_LOCK: 2
          });
        }
        // 临时开锁
        if (d.action == "PAUSE_UNLOCK") {
          this.setState({
            PAUSE_UNLOCK: 2
          });
        }
        // 寻车
        if (d.action == "FIND_DEVICE") {
          this.setState({
            FIND_DEVICE: 2
          });
        }
        // 定位
        if (d.action == "NOW_LOCATION") {
          this.setState({
            NOW_LOCATION: 2
          });
        }
      }
    });
  }

  // 车辆检测
  detectionBtn() {
    let d = {};
    d.device_no = this.state.device_no;
    d.imei = this.state.imei;
    global.$utils.api.load("devopsdevicecheckbind", d).then(result => {
      let message = result.message;
      let code = result.code;
      let bind = result.data.bind;
      Taro.showModal({
        title: "车辆检测结果",
        content: message,
        showCancel: false,
        success: () => {
          // 解绑
          if (code == 1) {
            if (bind == 1) {
              this.setState({
                checkbind: 2,
                OPEN_LOCK: 0,
                CLOSE_LOCK: 0,
                FIND_DEVICE: 0,
                PAUSE_LOCK: 0,
                PAUSE_UNLOCK: 0,
                NOW_LOCATION: 0
              });
            }
          }
          // 绑定
          if (code == 1) {
            if (bind == 0) {
              this.setState({
                checkbind: 1,
                OPEN_LOCK: 0,
                CLOSE_LOCK: 0,
                FIND_DEVICE: 0,
                PAUSE_LOCK: 0,
                PAUSE_UNLOCK: 0,
                NOW_LOCATION: 0
              });
            }
          }
          // 检测
          if (code <= 0) {
            this.setState({
              checkbind: 0,
              OPEN_LOCK: 0,
              CLOSE_LOCK: 0,
              FIND_DEVICE: 0,
              PAUSE_LOCK: 0,
              PAUSE_UNLOCK: 0,
              NOW_LOCATION: 0
            });
          }
          console.log(code, "4444");
        }
      });
    });
  }
  // 车辆绑定
  tiedBtn() {
    Taro.showModal({
      title: "车辆绑定",
      content: "确定绑定此车辆吗？",
      success: res => {
        if (res.confirm) {
          let d = {};
          d.device_no = this.state.device_no;
          d.imei = this.state.imei;
          global.$utils.api.load("devopsdevicebind", d).then(result => {
            let message = result.message;
            Taro.showModal({
              title: "车辆绑定结果",
              content: message,
              showCancel: false,
              success: () => {
                this.setState({
                  checkbind: 0,
                  OPEN_LOCK: 0,
                  CLOSE_LOCK: 0,
                  FIND_DEVICE: 0,
                  PAUSE_LOCK: 0,
                  PAUSE_UNLOCK: 0,
                  NOW_LOCATION: 0
                });
              }
            });
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  }
  // 车辆解绑
  unbindBtn() {
    Taro.showModal({
      title: "车辆解绑",
      content: "确定解绑此车辆吗？",
      success: res => {
        if (res.confirm) {
          let d = {};
          d.device_no = this.state.device_no;
          d.imei = this.state.imei;
          global.$utils.api.load("devopsdeviceunbind", d).then(result => {
            let message = result.message;
            Taro.showModal({
              title: "车辆解绑结果",
              content: message,
              showCancel: false,
              success: () => {
                this.setState({
                  checkbind: 0,
                  OPEN_LOCK: 0,
                  CLOSE_LOCK: 0,
                  FIND_DEVICE: 0,
                  PAUSE_LOCK: 0,
                  PAUSE_UNLOCK: 0,
                  NOW_LOCATION: 0
                });
              }
            });
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  }

  render() {
    const {
      OPEN_LOCK,
      CLOSE_LOCK,
      FIND_DEVICE,
      PAUSE_LOCK,
      PAUSE_UNLOCK,
      NOW_LOCATION,
      checkbind,
      idArr,
      list
    } = this.state;

    return (
      <View className={styles.page}>
        {/* 车辆扫码 */}
        <View style='margin-top:20px'>
          <View className={styles.fault_input}>
            <View className={styles.inputsdd}>
              <Input
                type='number'
                selection-start='-1'
                selection-end='-1'
                className='input'
                value={this.state.device_no}
                placeholder='请扫描车辆二维码编号'
                onInput={this.handleErweimaChange.bind(this)}
              />
            </View>

            <View
              className={styles.fault_input_right}
              onClick={this.handleQrcode.bind(this)}
            >
              <Image src={namedPng}></Image>
            </View>
          </View>
          <View className={styles.fault_input}>
            <Input
              className='input'
              value={this.state.imei}
              type='number'
              placeholder='请扫描中控二维码编号'
              onInput={this.handleErweimaiemiChange.bind(this)}
            />
            <View
              className={styles.fault_input_right}
              onClick={this.handleiemiQrcode.bind(this)}
            >
              <Image src={namedPng}></Image>
            </View>
          </View>
          <View className={styles.bingrollBtn}>
            {checkbind == 0 ? (
              <View
                className={styles.detection}
                onClick={this.detectionBtn.bind(this)}
              >
                车辆检测
              </View>
            ) : (
              ""
            )}
            {checkbind == 1 ? (
              <View
                className={styles.detectionBtns}
                onClick={this.tiedBtn.bind(this)}
              >
                车辆绑定
              </View>
            ) : (
              ""
            )}
            {checkbind == 2 ? (
              <View
                className={styles.detectionBtn}
                onClick={this.unbindBtn.bind(this)}
              >
                车辆解绑
              </View>
            ) : (
              ""
            )}
          </View>
        </View>
        <View className={styles.bind_info}>
          <View className={styles.bind_info_title}>选择类型开始检测</View>
          <View className={styles.bind_info_box}>
            {list.map((item, index) => (
              <View
                className={[
                  styles.bind_info_item,
                  idArr.includes(item.id) && styles.onActive
                ]}
                onClick={this.onClickSelect.bind(
                  this,
                  item.id,
                  item.type,
                  item.title
                )}
              >
                <Image src={item.img} className={styles.bind_img}></Image>
                <View className={styles.bind_title}>{item.title}</View>
              </View>
            ))}
          </View>
        </View>
        {/* 车辆测试项目 */}
        {/* <View style="margin-top:20px">
          <View className={styles.fault_item}>
            <View className={styles.fault_title}>开锁</View>
            <View className={styles.fault_wp}>
              {OPEN_LOCK == 0 ? (
                <View className={styles.fault_texts_wp}></View>
              ) : (
                ""
              )}
              {OPEN_LOCK == 1 ? (
                <View className={styles.fault_texts}>已通过</View>
              ) : (
                ""
              )}
              {OPEN_LOCK == 2 ? (
                <View className={styles.fault_texts_wp}>未通过</View>
              ) : (
                ""
              )}
              <View
                className={styles.bingBtn}
                onClick={this.roll.bind(this, `OPEN_LOCK`)}
              >
                测试
              </View>
            </View>
          </View>
          <View className={styles.fault_item}>
            <View className={styles.fault_title}>临时锁车</View>
            <View className={styles.fault_wp}>
              {PAUSE_LOCK == 0 ? (
                <View className={styles.fault_texts_wp}></View>
              ) : (
                ""
              )}
              {PAUSE_LOCK == 1 ? (
                <View className={styles.fault_texts}>已通过</View>
              ) : (
                ""
              )}
              {PAUSE_LOCK == 2 ? (
                <View className={styles.fault_texts_wp}>未通过</View>
              ) : (
                ""
              )}
              <View
                className={styles.bingBtn}
                onClick={this.roll.bind(this, `PAUSE_LOCK`)}
              >
                测试
              </View>
            </View>
          </View>
          <View className={styles.fault_item}>
            <View className={styles.fault_title}>寻车</View>
            <View className={styles.fault_wp}>
              {FIND_DEVICE == 0 ? (
                <View className={styles.fault_texts_wp}></View>
              ) : (
                ""
              )}
              {FIND_DEVICE == 1 ? (
                <View className={styles.fault_texts}>已通过</View>
              ) : (
                ""
              )}
              {FIND_DEVICE == 2 ? (
                <View className={styles.fault_texts_wp}>未通过</View>
              ) : (
                ""
              )}
              <View
                className={styles.bingBtn}
                onClick={this.roll.bind(this, `FIND_DEVICE`)}
              >
                测试
              </View>
            </View>
          </View>
          <View className={styles.fault_item}>
            <View className={styles.fault_title}>临时开锁</View>
            <View className={styles.fault_wp}>
              {PAUSE_UNLOCK == 0 ? (
                <View className={styles.fault_texts_wp}></View>
              ) : (
                ""
              )}
              {PAUSE_UNLOCK == 1 ? (
                <View className={styles.fault_texts}>已通过</View>
              ) : (
                ""
              )}
              {PAUSE_UNLOCK == 2 ? (
                <View className={styles.fault_texts_wp}>未通过</View>
              ) : (
                ""
              )}
              <View
                className={styles.bingBtn}
                onClick={this.roll.bind(this, `PAUSE_UNLOCK`)}
              >
                测试
              </View>
            </View>
          </View>
          <View className={styles.fault_item}>
            <View className={styles.fault_title}>定位</View>
            <View className={styles.fault_wp}>
              {NOW_LOCATION == 0 ? (
                <View className={styles.fault_texts_wp}></View>
              ) : (
                ""
              )}
              {NOW_LOCATION == 1 ? (
                <View className={styles.fault_texts}>已通过</View>
              ) : (
                ""
              )}
              {NOW_LOCATION == 2 ? (
                <View className={styles.fault_texts_wp}>未通过</View>
              ) : (
                ""
              )}
              <View
                className={styles.bingBtn}
                onClick={this.roll.bind(this, `NOW_LOCATION`)}
              >
                测试
              </View>
            </View>
          </View>

          <View className={styles.fault_item}>
            <View className={styles.fault_title}>关锁</View>
            <View className={styles.fault_wp}>
              {CLOSE_LOCK == 0 ? (
                <View className={styles.fault_texts_wp}></View>
              ) : (
                ""
              )}
              {CLOSE_LOCK == 1 ? (
                <View className={styles.fault_texts}>已通过</View>
              ) : (
                ""
              )}
              {CLOSE_LOCK == 2 ? (
                <View className={styles.fault_texts_wp}>未通过</View>
              ) : (
                ""
              )}
              <View
                className={styles.bingBtn}
                onClick={this.roll.bind(this, `CLOSE_LOCK`)}
              >
                测试
              </View>
            </View>
          </View>
        </View> */}
      </View>
    );
  }
}

export default Binging;
