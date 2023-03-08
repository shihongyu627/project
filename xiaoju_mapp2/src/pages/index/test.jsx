import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";

class Test extends Component {
  config = {
    navigationBarTitleText: "蓝牙测试"
  };
  constructor(props) {
    super(props);
    this.state = {
      device_no: "500004",
      deviceId: "E2:50:A7:F6:F8:56",
      // deviceId: "C4:95:4D:98:F5:6B",
      serviceId: "",
      uuidId: "",
      device_arr: [],
      service_arr: [],
      uuid_arr: []
    };
  }

  testD = () => {
    let staa = "0080085d4e3f2f010100010000000000";
    let aaaaa = global.$utils.bluetooth.get_len_hex(staa, 6, 13);
    console.log("staa", staa);
    console.log("aaaaa", aaaaa);
    console.log("测试AES加密");
    let aa = "AT";
    let key = "20572F52364B3F473050415811632D2B";
    console.log("明文：", aa);
    aa = global.$utils.bluetooth.str2hex(aa);
    console.log("明文HEX：", aa);
    aa = "060101012c2c62582667426601333141";
    aa = "41540000000000000000000000000000";
    console.log("明文HEX：", aa);
    aa = global.$utils.bluetooth.aes_encrypt(aa, key);
    console.log("密文：", aa);
    aa = global.$utils.bluetooth.aes_decrypt(aa, key);
    console.log("解密：", aa);
    aa = "F69A78FE795E2276194EF11287F9FCAA";
    aa = global.$utils.bluetooth.aes_decrypt(aa, key);
    console.log("解密：", aa);

    let str = global.$utils.bluetooth.str2hex(aa);
    let packet_data = global.$utils.bluetooth.packet_data("0001", str);
    console.log("蓝牙数据包：", packet_data);
  };
  openBlue = () => {
    global.$utils.bluetooth.openAdapter();
    console.log(global.$utils.bluetooth.open);
  };
  closeBlue = () => {
    global.$utils.bluetooth.closeAdapter();
    console.log(global.$utils.bluetooth.open);
  };
  startDiscovery = () => {
    global.$utils.bluetooth.startDiscovery();
  };
  stopDiscovery = () => {
    global.$utils.bluetooth.stopDiscovery();
  };
  lineDeviceConnect = async deviceId => {
    let dd = await global.$utils.bluetooth.lineDeviceConnect(deviceId);
    console.log("蓝牙数据：", dd);
    if (!dd) {
      return false;
    }
    this.setState({
      serviceId: dd.serviceId,
      write_uuidId: dd.write_uuidId,
      read_uuidId: dd.write_uuidId
    });
  };
  connectDevice = deviceId => {
    this.setState({
      deviceId: deviceId
    });
    global.$utils.bluetooth.createDeviceConnect(deviceId);
  };
  unconnectDevice = deviceId => {
    global.$utils.bluetooth.closeDeviceConnect(deviceId);
  };
  getDevices = async () => {
    let device_arr = await global.$utils.bluetooth.getDevices();
    this.setState({
      device_arr: device_arr || []
    });
  };
  getDeviceServices = async deviceId => {
    let service_arr = await global.$utils.bluetooth.getDeviceServices(deviceId);
    this.setState({
      service_arr: service_arr || []
    });
  };
  getDeviceCharacs = async (deviceId, serviceId) => {
    let uuid_arr = await global.$utils.bluetooth.getDeviceCharacs(
      deviceId,
      serviceId
    );
    this.setState({
      uuid_arr: uuid_arr || []
    });
  };
  // 发送数据
  sendData = async (deviceId, serviceId, write_uuidId, read_uuidId, token) => {
    let data = global.$utils.bluetooth.packet_data("0800", "02", token);
    let key = "20572F52364B3F473050415811632D2B";
    global.$utils.bluetooth.sendData(
      deviceId,
      serviceId,
      write_uuidId,
      read_uuidId,
      data,
      key,
      res => {
        console.log("发送数据读取数据：", res);
      }
    );
  };
  // 发送数据
  sendDataGetToken = async (deviceId, serviceId, write_uuidId, read_uuidId) => {
    let key = "20572F52364B3F473050415811632D2B";
    global.$utils.bluetooth.sendDataGetToken(
      deviceId,
      serviceId,
      write_uuidId,
      read_uuidId,
      key,
      token => {
        this.setState({
          token: token
        });
        console.log("token", token);
      }
    );
  };
  // 发送数据-切换
  sendData1 = async (deviceId, serviceId, write_uuidId, read_uuidId) => {
    // 获取token
    let key = "20572F52364B3F473050415811632D2B";
    global.$utils.bluetooth.sendDataGetToken(
      deviceId,
      serviceId,
      write_uuidId,
      read_uuidId,
      key,
      token => {
        this.setState({
          token: token
        });
        console.log("token", token);
        let data = global.$utils.bluetooth.packet_data("0800", "00", token);
        // 发送数据
        global.$utils.bluetooth.sendData(
          deviceId,
          serviceId,
          write_uuidId,
          read_uuidId,
          data,
          key,
          res => {
            console.log("发送数据读取数据：", res);
          }
        );
      }
    );
  };
  // 发送数据-通用
  sendPushData = async (
    deviceId,
    serviceId,
    write_uuidId,
    read_uuidId,
    type
  ) => {
    // 获取token
    let key = "20572F52364B3F473050415811632D2B";
    global.$utils.bluetooth.sendDataGetToken(
      deviceId,
      serviceId,
      write_uuidId,
      read_uuidId,
      key,
      token => {
        this.setState({
          token: token
        });
        let data = "";
        switch (type) {
          case "open_lock": // 开锁
            global.$utils.bluetooth.sendOpenLockLotd(
              deviceId,
              serviceId,
              write_uuidId,
              read_uuidId,
              key,
              "000000",
              res => {
                console.log("open_lock: sendOpenLockLotd res:", res);
              }
            );
            return;
            // data = global.$utils.bluetooth.packet_data(
            //   "0300",
            //   "000000000000" + "010203",
            //   token
            // );
            break;
          case "run_lock": // 激活锁
            global.$utils.bluetooth.sendRunLockLotd(
              deviceId,
              serviceId,
              write_uuidId,
              read_uuidId,
              key,
              "000000",
              res => {
                console.log("run_lock: sendRunLockLotd res:", res);
              }
            );
            return;
            break;
          case "restart_lock": // 重启锁
            global.$utils.bluetooth.sendRestartLockLotd(
              deviceId,
              serviceId,
              write_uuidId,
              read_uuidId,
              key,
              "000000",
              res => {
                console.log("restart_lock: sendRestartLockLotd res:", res);
              }
            );
            return;
            break;
          case "get_lock": // 获取锁态
            data = global.$utils.bluetooth.packet_data("0500", "01", token);
            break;
          case "get_v": // 获取电压
            data = global.$utils.bluetooth.packet_data("0200", "01", token);
            break;
          case "get_config": // 获取配置
            data = global.$utils.bluetooth.packet_data("0800", "00", token);
            break;
          case "get_mqtt": // 获取mqtt状态
            data = global.$utils.bluetooth.packet_data("1800", "01", token);
            break;
          case "sync_time": // 同步时间
            let time = Date.parse(new Date()) / 1000;
            let timehex = global.$utils.bluetooth.str2hex();
            let hexstr = global.$utils.bluetooth.hex_left_pad(timehex, 4 * 2);
            console.log("sync_time", time, timehex, hexstr);
            data = global.$utils.bluetooth.packet_data("0100", hexstr, token);
            break;
          default:
            break;
        }
        // 发送数据
        global.$utils.bluetooth.sendData(
          deviceId,
          serviceId,
          write_uuidId,
          read_uuidId,
          data,
          key,
          res => {
            console.log("发送数据读取数据：", res);
          }
        );
      }
    );
  };
  // 读取数据
  readData = async (deviceId, serviceId, uuidId) => {
    global.$utils.bluetooth.readData(deviceId, serviceId, uuidId, res => {
      console.log("读取数据：", res);
    });
  };
  render() {
    let { device_arr, service_arr, uuid_arr } = this.state;
    return (
      <View>
        <View>设备号：{this.state.device_no}</View>
        <View>蓝牙地址：{this.state.deviceId}</View>
        <Button
          onClick={this.lineDeviceConnect.bind(this, this.state.deviceId)}
        >
          直连蓝牙设备
        </Button>
        <Button onClick={this.openBlue.bind(this)}>1打开蓝牙</Button>
        <Button onClick={this.closeBlue.bind(this)}>关闭蓝牙</Button>
        <Button onClick={this.startDiscovery.bind(this)}>
          2开始搜寻蓝牙设备
        </Button>
        <Button onClick={this.stopDiscovery.bind(this)}>
          停止搜寻蓝牙设备
        </Button>
        <Button onClick={this.getDevices.bind(this)}>3获取蓝牙设备</Button>
        <View>蓝牙ID：{this.state.deviceId}</View>
        <View>服务号：{this.state.serviceId}</View>
        <View>写特征值：{this.state.write_uuidId}</View>
        <View>读特征值：{this.state.read_uuidId}</View>
        <Button onClick={this.connectDevice.bind(this, this.state.deviceId)}>
          4连接蓝牙设备
        </Button>
        <Button
          onClick={this.getDeviceServices.bind(this, this.state.deviceId)}
        >
          5查询设备服务
        </Button>
        <Button
          onClick={this.getDeviceCharacs.bind(
            this,
            this.state.deviceId,
            this.state.serviceId
          )}
        >
          6查询设备服务特征值
        </Button>
        <Button
          onClick={this.sendDataGetToken.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.write_uuidId,
            this.state.read_uuidId
          )}
        >
          xx0 = 获取TOKEN
        </Button>
        <Button
          onClick={this.sendData.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.write_uuidId,
            this.state.read_uuidId,
            this.state.token
          )}
        >
          xx1 = 发送数据
        </Button>
        <Button
          onClick={this.readData.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.read_uuidId
          )}
        >
          xx2 = 读取数据
        </Button>
        <Button
          onClick={this.sendPushData.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.write_uuidId,
            this.state.read_uuidId,
            "get_v"
          )}
        >
          xx3 = 发送数据-获取电压
        </Button>
        <Button
          onClick={this.sendPushData.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.write_uuidId,
            this.state.read_uuidId,
            "get_lock"
          )}
        >
          xx4 = 发送数据-获取锁态
        </Button>
        <Button
          onClick={this.sendPushData.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.write_uuidId,
            this.state.read_uuidId,
            "open_lock"
          )}
        >
          xx5 = 发送数据-开锁
        </Button>
        <Button
          onClick={this.sendPushData.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.write_uuidId,
            this.state.read_uuidId,
            "run_lock"
          )}
        >
          xx6 = 发送数据-激活锁
        </Button>
        <Button
          onClick={this.sendPushData.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.write_uuidId,
            this.state.read_uuidId,
            "restart_lock"
          )}
        >
          xx7 = 发送数据-重启锁
        </Button>
        <Button
          onClick={this.sendPushData.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.write_uuidId,
            this.state.read_uuidId,
            "get_mqtt"
          )}
        >
          xx8 = 发送数据-mqtt状态
        </Button>
        <Button
          onClick={this.sendPushData.bind(
            this,
            this.state.deviceId,
            this.state.serviceId,
            this.state.write_uuidId,
            this.state.read_uuidId,
            "sync_time"
          )}
        >
          xx9 = 发送数据-同步时间
        </Button>
        <Button onClick={this.unconnectDevice.bind(this, this.state.deviceId)}>
          断开蓝牙连接
        </Button>
        <View>设备服务列表，点击选中</View>
        {service_arr.map((item, index) => {
          return (
            <View
              onClick={() => {
                this.setState({ serviceId: item.uuid });
              }}
            >
              {index}、{item.isPrimary} _ {item.uuid}
            </View>
          );
        })}
        <View>设备特征值列表，点击选中</View>
        {uuid_arr.map((item, index) => {
          return (
            <View
              onClick={() => {
                this.setState({
                  write_uuidId: item.uuid,
                  read_uuidId: item.uuid
                });
              }}
            >
              {index}、{JSON.stringify(item.properties)} _ {item.uuid}
            </View>
          );
        })}
        <View>设备列表，点击选中</View>
        {device_arr.map((item, index) => {
          return (
            <View
              onClick={() => {
                this.setState({ deviceId: item.deviceId });
              }}
            >
              {index}、{item.RSSI} _ {item.name} _ {item.localName} _{" "}
              {item.deviceId} ||
              {JSON.stringify(item.advertisServiceUUIDs)} ||
              {global.$utils.bluetooth.ab2hex(item.advertisData)} ||
            </View>
          );
        })}
      </View>
    );
  }
}

export default Test;
