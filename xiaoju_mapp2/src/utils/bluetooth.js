import Taro from "@tarojs/taro";
import CryptoJS from "../lib/crypto-js.min.js";
// 蓝牙信息
const bluetooth = {
  open: false,
  _reConnect: 0,
  // // 结束操作
  // end: async cb => {
  //   Taro.hideLoading();
  //   Taro.hideToast();
  //   await this.closeDeviceConnect();
  //   await this.closeAdapter();
  //   await this.stopDiscovery();
  //   console.log("结束蓝牙操作！");
  //   cb && cb();
  // },
  // 开启蓝牙
  openAdapter: async function() {
    try {
      let dd = await Taro.openBluetoothAdapter();
      this.open = true;
      console.log("openBluetoothAdapter success:", dd);
      console.log("openAdapter dd", dd);
      Taro.onBluetoothAdapterStateChange(res => {
        console.log("adapterState changed, now is", res);
      });
      return true;
    } catch (error) {
      console.log("openBluetoothAdapter fail:", error);
      // global.$utils.toast.error("请先开启蓝牙");
      // 弹窗显示
      Taro.showModal({
        title: "温馨提示",
        content:
          "开启蓝牙失败，请尝试:\n(1)重新打开手机蓝牙 \n(2)进入设置-微信-授权蓝牙权限 \n(3)点击重试",
        confirmText: "重试",
        success: sres => {
          if (sres.cancel) {
            return false;
          } else {
            this.openAdapter();
          }
          return false;
        }
      });
      return false;
    }
  },
  // 关闭蓝牙
  closeAdapter: async function() {
    try {
      // 关闭搜索
      await this.stopDiscovery();
      // 关闭适配器
      let dd = await Taro.closeBluetoothAdapter();
      this.open = false;
      console.log("closeBluetoothAdapter success:", dd);
      console.log("closeAdapter dd", dd);
      return true;
    } catch (error) {
      console.log("closeBluetoothAdapter fail:", error);
      // global.$utils.toast.error("关闭蓝牙失败");
      return false;
    }
  },
  // 开始搜索设备
  startDiscovery: async function(config = {}) {
    try {
      let dd = await Taro.startBluetoothDevicesDiscovery(config);
      console.log("startBluetoothDevicesDiscovery success:", dd);
      console.log("startDiscovery dd", dd);
      Taro.onBluetoothDeviceFound(res => {
        let devices = res.devices;
        console.log("new device list has founded");
        console.dir(devices);
      });
      return true;
    } catch (error) {
      console.log("startDiscovery fail:", error);
      // global.$utils.toast.error("开始搜寻失败");
      return false;
    }
  },
  // 停止搜索设备
  stopDiscovery: async function() {
    try {
      let dd = await Taro.stopBluetoothDevicesDiscovery();
      console.log("stopBluetoothDevicesDiscovery success:", dd);
      console.log("stopDiscovery dd", dd);
      return true;
    } catch (error) {
      console.log("stopDiscovery fail:", error);
      // global.$utils.toast.error("停止搜寻失败");
      return false;
    }
  },
  // 获取蓝牙设备
  getDevices: async function() {
    try {
      // // 延迟执行
      // let sleep = 0;
      // let interval = setInterval(() => {
      //   sleep = sleep + 500;
      //   if (sleep > 2000) {
      //     clearInterval(interval);
      //   }
      // }, 500);
      let dd = await Taro.getBluetoothDevices();
      // console.log("getBluetoothDevices success:", dd);
      // console.log("getDevices dd", dd);
      let ll = dd.devices || [];
      let ddll = [];
      function fenGeString(str, num, istr = " ") {
        //每num位就添加一个字符
        //先将str转换为数组
        let strToArr = str.split("");
        let sumlen = str.length;
        for (let i = num; i < sumlen; ) {
          strToArr.splice(i, 0, istr);
          i = i + num + 1;
          sumlen = sumlen + 1;
        }
        return strToArr.join("");
      }
      for (let index = 0; index < ll.length; index++) {
        let ccc = ll[index];
        let sx = "";
        let mac_hex = "";
        if (ccc.advertisData) {
          // 格式化数据包
          sx = this.ab2hex(ccc.advertisData);
          ccc.advertisDataHex = sx;
          // 筛选mac地址
          mac_hex = this.get_len_hex(sx, 2 * 2, 2 * 7 + 1).toUpperCase();
          mac_hex = fenGeString(mac_hex, 2, ":");
          ccc.mac_hex = mac_hex;
        }
        ddll.push(ccc);
        // console.log(index + ": device_info: ---------", ccc, sx, mac_hex);
      }
      return ddll || [];
    } catch (error) {
      console.log("getDevices fail:", error);
      // global.$utils.toast.error("附近无蓝牙设备");
      return [];
    }
  },
  // 获取蓝牙设备所有服务
  getDeviceServices: async function(deviceId) {
    try {
      let dd = await Taro.getBLEDeviceServices({ deviceId: deviceId });
      console.log("getBLEDeviceServices success:", dd);
      console.log("getDeviceServices dd", dd);
      return dd.services || [];
    } catch (error) {
      console.log("getDeviceServices fail:", error);
      // global.$utils.toast.error("该设备无服务");
      if (error.errCode == 10004 || error.errCode == 10005) {
        // 重启适配器
        await this.closeAdapter();
        await this.openAdapter();
      }
      return [];
    }
  },
  // 获取蓝牙设备特征值
  getDeviceCharacs: async function(deviceId, serviceId) {
    try {
      let dd = await Taro.getBLEDeviceCharacteristics({
        deviceId: deviceId,
        serviceId: serviceId
      });
      console.log("getBLEDeviceCharacteristics success:", dd);
      console.log("getDeviceCharacs dd", dd);
      return dd.characteristics || [];
    } catch (error) {
      console.log("getDeviceCharacs fail:", error);
      // global.$utils.toast.error("该设备无特征值");
      if (error.errCode == 10004 || error.errCode == 10005) {
        // 重启适配器
        await this.closeAdapter();
        await this.openAdapter();
      }
      return [];
    }
  },

  // 重新扫描服务，ios必须得走全部蓝牙连接流程
  reScanService: async function(deviceId) {
    // ios进行扫描
    const sinfo = Taro.getSystemInfoSync();
    if (sinfo.platform === "ios") {
      // 获取服务
      let xx2 = await this.getDeviceServices(deviceId);
      let serviceId = "";
      for (let index = 0; index < xx2.length; index++) {
        const service_info = xx2[index];
        if (service_info.uuid) {
          if (service_info.uuid.indexOf("FEE7") >= 0) {
            serviceId = service_info.uuid;
            break;
          }
        }
      }
      if (serviceId) {
        await this.getDeviceCharacs(deviceId, serviceId);
      }
    }
  },

  // 连接蓝牙设备
  createDeviceConnect: async function(deviceId) {
    try {
      console.log("createBLEConnection recount:", this._reConnect);
      let dd = await Taro.createBLEConnection({
        deviceId: deviceId,
        timeout: 15000
      });
      console.log("createBLEConnection success:", dd);
      console.log("createDeviceConnect dd", dd);
      Taro.onBLEConnectionStateChange(res => {
        // 该方法回调中可以用于处理连接意外断开等异常情况
        console.log(
          `device ${res.deviceId} state has changed, connected: ${res.connected}`
        );
      });
      // 重新扫描
      await this.reScanService(deviceId);
      return true;
    } catch (err) {
      console.log("createBLEConnection fail:", err);
      // global.$utils.toast.error("连接蓝牙失败");
      // 已经连接可再扫描
      if (
        err.errCode == -1 ||
        err.errMsg == "createBLEConnection:fail:already connect"
      ) {
        // 重新扫描
        await this.reScanService(deviceId);
        return true;
      }

      if (err.errCode != -1 && err.errCode != 10000) {
        if (
          err.errCode == 10006 ||
          err.errCode == 10003 ||
          err.errCode == 10012
        ) {
          console.log("正在重连...", this._reConnect);
          //这里加一个
          // await this.closeDeviceConnect(deviceId);
          await this.closeAdapter();
          await this.openAdapter();
          console.log("重连之前，重启蓝牙适配器成功!");
          if (this._reConnect >= 5) {
            await this.startDiscovery();
          } else {
            this._reConnect++;
            let xx = await this.createDeviceConnect(deviceId);
            if (xx) {
              return true;
            }
          }
        }
      } else if (err.errMsg.indexOf("not init") > -1) {
        //入口之一，判断无初始化直接执行
        await this.closeAdapter();
        await this.openAdapter();
        if (this._reConnect >= 5) {
          await this.startDiscovery();
        } else {
          this._reConnect++;
          let xx = await this.createDeviceConnect(deviceId);
          if (xx) {
            return true;
          }
        }
      }
      return false;
    }
  },
  // 断开蓝牙连接
  closeDeviceConnect: async function(deviceId) {
    try {
      let dd = await Taro.closeBLEConnection({ deviceId: deviceId });
      console.log("closeBLEConnection success:", dd);
      console.log("closeDeviceConnect dd", dd);
      return true;
    } catch (error) {
      console.log("closeBLEConnection fail:", error);
      // global.$utils.toast.error("断开蓝牙失败");
      return false;
    }
  },

  // 直接连接蓝牙设备
  lineDeviceConnect: async function(deviceId) {
    try {
      // Taro.showLoading({
      //   title: "车辆开锁中"
      // });
      await this.closeAdapter();
      // 开启蓝牙
      let od = await this.openAdapter();
      if (!od) {
        Taro.hideLoading();
        return Promise.resolve(false);
      }
      // 搜索蓝牙
      let sd = await this.startDiscovery();
      if (!sd) {
        Taro.hideLoading();
        return Promise.resolve(false);
      }

      // 获取搜索蓝牙设备
      let sstimestamp = new Date().valueOf();
      let advertisDataHex = "";
      let mac_hex = "";
      do {
        // 超时5s
        if (new Date().valueOf() - sstimestamp > 5000) {
          // 搜索失败，取消连接
          Taro.hideLoading();
          return Promise.resolve(false);
        }
        // 获取蓝牙设备
        let xx1 = await this.getDevices();
        for (let index = 0; index < xx1.length; index++) {
          const device_info = xx1[index];
          if (device_info.deviceId == deviceId) {
            advertisDataHex = device_info.advertisDataHex || "";
            mac_hex = device_info.mac_hex || "";
            break;
          } else {
            if (device_info.mac_hex == deviceId) {
              advertisDataHex = device_info.advertisDataHex || "";
              mac_hex = device_info.mac_hex || "";
              deviceId = device_info.deviceId; // ios设备mac地址无法直接获取
              break;
            }
          }
        }
      } while (!mac_hex);

      // 连接设备
      let xcon = false;
      let xstimestamp = new Date().valueOf();
      do {
        // 超时5s
        if (new Date().valueOf() - xstimestamp > 5000) {
          // 连接失败，取消连接
          Taro.hideLoading();
          return Promise.resolve(false);
        }
        this._reConnect = 0;
        xcon = await this.createDeviceConnect(deviceId);
      } while (!xcon);

      // 关闭搜索蓝牙
      await this.stopDiscovery();
      // 获取服务
      let xx2 = await this.getDeviceServices(deviceId);
      let serviceId = "";
      for (let index = 0; index < xx2.length; index++) {
        const service_info = xx2[index];
        if (service_info.uuid) {
          if (service_info.uuid.indexOf("FEE7") >= 0) {
            serviceId = service_info.uuid;
            break;
          }
        }
      }
      // 获取特征值
      let xx3 = await this.getDeviceCharacs(deviceId, serviceId);
      let write_uuidId = "";
      let read_uuidId = "";
      let notify_uuidId = "";
      for (let index = 0; index < xx3.length; index++) {
        const charac_info = xx3[index];
        if (charac_info.uuid) {
          if (charac_info.uuid.indexOf("36F5") >= 0) {
            write_uuidId = charac_info.uuid;
            continue;
          }
          if (charac_info.uuid.indexOf("36F6") >= 0) {
            read_uuidId = charac_info.uuid;
            notify_uuidId = charac_info.uuid;
            continue;
          }
        }
      }
      // 返回蓝牙数据
      let dd = {};
      dd.advertisDataHex = advertisDataHex;
      dd.mac_hex = mac_hex;
      dd.deviceId = deviceId;
      dd.serviceId = serviceId;
      dd.write_uuidId = write_uuidId;
      dd.read_uuidId = read_uuidId;
      dd.notify_uuidId = notify_uuidId;
      console.log("设备数据：lineDeviceConnect dd", dd);
      setTimeout(function() {
        Taro.hideLoading();
      }, 6000);
      // 关闭连接
      // await this.closeDeviceConnect(deviceId);
      return dd;
    } catch (error) {
      console.log("lineDeviceConnect fail:", error);
      global.$utils.toast.error("直连设备失败");
      setTimeout(function() {
        Taro.hideLoading();
      }, 500);
      return {};
    }
  },

  // 向蓝牙设备发送数据
  writeData: async function(deviceId, serviceId, uuidId, data) {
    try {
      // 转化数据
      let buffer = this.hex2ab(data);
      console.log("writeData buffer", buffer, data);
      let dd = await Taro.writeBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: uuidId,
        value: buffer
      });
      console.log("writeBLECharacteristicValue success:", dd);
      console.log("writeData dd", dd);
      return true;
    } catch (error) {
      console.log("writeData fail:", error);
      // global.$utils.toast.error("写入数据失败");
      return false;
    }
  },

  // 从蓝牙设备订阅特征值变化数据
  notifyData: async function(deviceId, serviceId, uuidId) {
    try {
      let dd = await Taro.notifyBLECharacteristicValueChange({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: uuidId,
        state: true
        // type: 'notification'
      });
      console.log("notifyBLECharacteristicValueChange success:", dd);
      console.log("notifyData dd", dd);
      return true;
    } catch (error) {
      console.log("notifyData fail:", error);
      // global.$utils.toast.error("通知数据失败");
      if (error.errCode == 10004 || error.errCode == 10005) {
        // // 重启适配器
        // await this.closeAdapter();
        // await this.openAdapter();
        if (this._reConnect >= 10) {
          return false;
        } else {
          this._reConnect++;
          let xx = await this.notifyData(deviceId, serviceId, uuidId);
          if (xx) {
            return true;
          }
        }
      }
      return false;
    }
  },

  // 从蓝牙设备读取数据, 回调返回数据
  readData: async function(deviceId, serviceId, uuidId, callback) {
    try {
      // 订阅特征值
      await this.notifyData(deviceId, serviceId, uuidId);
      await Taro.onBLECharacteristicValueChange(async res => {
        console.log(
          `onBLECharacteristicValueChange ${res.characteristicId} has changed, now is ${res.value}`
        );
        let data = this.ab2hex(res.value);
        console.log("readData data", data);
        // 回调特征值返回数据
        callback(data);
      });
      let dd = await Taro.readBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: uuidId
      });
      console.log("readBLECharacteristicValue success:", dd);
      console.log("readData dd", dd);
      return true;
    } catch (error) {
      console.log("readData fail:", error);
      // global.$utils.toast.error("读取数据失败");
      return false;
    }
  },

  // 发送数据，并从蓝牙设备读取数据, 回调返回数据
  sendData: async function(
    deviceId,
    serviceId,
    write_uuidId,
    read_uuidId,
    data,
    key,
    callback
  ) {
    try {
      // 连接设备
      this._reConnect = 0;
      let xcon = await this.createDeviceConnect(deviceId);
      if (!xcon) {
        await this.closeDeviceConnect(deviceId);
        callback(false);
        return false;
      }
      // 订阅特征值
      await this.notifyData(deviceId, serviceId, read_uuidId);
      Taro.onBLECharacteristicValueChange(res => {
        console.log(
          `onBLECharacteristicValueChange ${res.characteristicId} has changed, now is ${res.value}`
        );
        let dt = this.ab2hex(res.value);
        console.log("readData data", dt);
        // 解密
        let hexstr = this.aes_decrypt(dt, key);
        console.log("hexstr:", hexstr);
        if (hexstr) {
          // 回调特征值返回数据
          callback(hexstr);
        }
      });
      // 发送数据
      setTimeout(async () => {
        console.log("发送数据明文：", data);
        data = this.aes_encrypt(data, key);
        console.log("发送数据密文：", data);
        let datas = this.aes_decrypt(data, key);
        console.log("发送数据解密：", datas);
        await this.writeData(deviceId, serviceId, write_uuidId, data);
      }, 1500);
      console.log("sendData dd", true);
      return true;
    } catch (error) {
      console.log("sendData fail:", error);
      global.$utils.toast.error("发送数据失败");
      return false;
    }
  },

  // 获取token
  sendDataGetToken: async function(
    deviceId,
    serviceId,
    write_uuidId,
    read_uuidId,
    key,
    callback
  ) {
    // 连接设备
    this._reConnect = 0;
    let xcon = await this.createDeviceConnect(deviceId);
    if (!xcon) {
      await this.closeDeviceConnect(deviceId);
      callback(false);
      return false;
    }
    // token令牌
    let data = this.packet_data("0000", "FF");
    this.sendData(
      deviceId,
      serviceId,
      write_uuidId,
      read_uuidId,
      data,
      key,
      async res => {
        // 获取tokek
        let token = this.get_len_hex(res, 6, 13);
        token = token.toUpperCase();
        console.log("token:", token);
        if (token) {
          callback(token);
          return true;
        } else {
          callback(false);
          return false;
        }
      }
    );
  },

  // 字符串转换成16进制字符串
  str2hex: function(str) {
    let strbuf = "";
    for (var i = 0; i < str.length; i++) {
      if (strbuf == "") strbuf = str.charCodeAt(i).toString(16);
      else strbuf += str.charCodeAt(i).toString(16);
    }
    // console.log(strbuf);
    return strbuf;
  },

  // 16进制字符串转换成ArrayBuffer
  hex2ab: function(str) {
    let strbuf = "";
    // for (var i = 0; i < str.length; i++) {
    //   if (strbuf == "") strbuf = str.charCodeAt(i).toString(16);
    //   else strbuf += str.charCodeAt(i).toString(16);
    // }
    strbuf = str;
    let buffer = new ArrayBuffer(100);
    let hex = strbuf; //  前面 和 后面的  是 蓝牙 接收 消息的 格式(协议里面有)
    let typedArray = new Uint8Array(
      hex.match(/[\da-f]{2}/gi).map(function(h) {
        return parseInt(h, 16);
      })
    );
    buffer = typedArray.buffer;
    // console.log(buffer);
    return buffer;
  },

  // ArrayBuffer转16进制字符串
  ab2hex: function(buffer) {
    let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function(
      bit
    ) {
      return ("00" + bit.toString(16)).slice(-2);
    });
    return hexArr.join("");
    // return String.fromCharCode.apply(null, new Uint8Array(buf));
  },
  /**
   * 加密
   */
  aes_encrypt: function(data, key) {
    let keyHex = CryptoJS.enc.Hex.parse(key);
    let dataHex = CryptoJS.enc.Hex.parse(data);
    let encrypted = CryptoJS.AES.encrypt(dataHex, keyHex, {
      // iv: [],
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding
    });

    let encryptData = encrypted.ciphertext.toString().toUpperCase(); // hex
    // let encryptData = encrypted.toString().toUpperCase(); // base64
    console.log("aes_encrypt:", encryptData);
    return encryptData;

    // var byteKey = jm.CryptoJS.enc.Hex.parse(key);
    // var byteData = jm.CryptoJS.enc.Hex.parse(data);
    // var encrypt = jm.CryptoJS.AES.encrypt(byteData, byteKey, { mode: jm.CryptoJS.mode.ECB, padding: jm.CryptoJS.pad.NoPadding });
    // var encryptedStr = encrypt.ciphertext.toString();
    // return encryptedStr;
  },
  /**
   * 解密
   */
  aes_decrypt: function(decodedData, key) {
    let byteKey = CryptoJS.enc.Hex.parse(key);
    let byteData = CryptoJS.enc.Hex.parse(decodedData);
    byteData = CryptoJS.enc.Base64.stringify(byteData);
    let decrypt = CryptoJS.AES.decrypt(byteData, byteKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Hex);
    console.log("aes_decrypt:", decryptedStr);
    return decryptedStr.toString();

    // let keyHex = CryptoJS.enc.Hex.parse(key);
    // let decrypted = CryptoJS.AES.decrypt(
    //   {
    //     ciphertext: CryptoJS.enc.Hex.parse(decodedData)
    //     // ciphertext: CryptoJS.enc.Base64.parse(decodedData) // base64
    //   },
    //   keyHex,
    //   {
    //     // iv: [],
    //     mode: CryptoJS.mode.ECB,
    //     padding: CryptoJS.pad.NoPadding
    //   }
    // );

    // let decryptedData = decrypted.toString(CryptoJS.enc.Hex);
    // console.log("aes_decrypt:", decryptedData);
    // return decryptedData;
  },
  // 蓝牙数据包
  packet_data: function(cmdhex = "", strhex = "", tokenhex = "") {
    let str = "";
    console.log("cmd:", cmdhex, "  strhex:", strhex);
    // 序0-1, 2, 3-n, (n+1)-(n+4), (n+5)-15
    str = this.hex_left_pad(cmdhex, 2 * 2);
    console.log("str: ", str);
    str += this.hex_left_pad(
      "" + parseInt(strhex.length / 2).toString(16),
      1 * 2
    );
    console.log("str: ", str);
    str += strhex;
    console.log("str: ", str);
    str += this.hex_left_pad(tokenhex, 4 * 2);
    console.log("str: ", str);
    let sstr = "";
    let xlen = 16 - 2 - 1 - 4 - strhex.length / 2;
    if (xlen) {
      // 填充随机数
      sstr = this.hex_left_pad("", xlen * 2);
    }
    str += sstr;
    console.log("str: ", str);
    return str;
  },
  //截取右N位，不足的位数前面补0
  hex_left_pad: function(str, num) {
    let i = str.length;
    if (i >= num) {
      str = str;
    } else {
      let str0 = "0000000000000000000000000";
      str = str0.substring(0, num - i) + str;
    }
    // console.log(i, str);
    return str;
  },
  // 从指定位读取16进制字符串
  get_len_hex: function(str, start, end) {
    let strbuf = "";
    for (let i = 0; i < str.length; i++) {
      if (i >= start && i <= end) {
        strbuf += str.charAt(i);
        // console.log(i, strbuf);
      }
    }
    // console.log("get_len_hex:", str, start, end, strbuf);
    return strbuf;
  },

  // 开锁
  sendOpenLockLotd: function(
    device_no,
    deviceId,
    serviceId,
    write_uuidId,
    read_uuidId,
    key,
    bluetooth_pass,
    callback
  ) {
    try {
      Taro.showLoading({
        title: "开锁中"
      });
      console.log("sendOpenLockLotd", deviceId, key, bluetooth_pass);
      // 获取token
      this.sendDataGetToken(
        deviceId,
        serviceId,
        write_uuidId,
        read_uuidId,
        key,
        token => {
          if (!token) {
            Taro.hideLoading();
            callback(false);
            return false;
          }
          console.log("token", token);
          let xxdd =
            this.hex_left_pad(
              this.str2hex(bluetooth_pass),
              bluetooth_pass.length * 2
            ) + "000001";
          let data = this.packet_data("0300", xxdd, token);
          // 发送数据
          this.sendData(
            deviceId,
            serviceId,
            write_uuidId,
            read_uuidId,
            data,
            key,
            res => {
              console.log("开锁：发送数据读取数据：", res);
              if (res === false) {
                Taro.hideLoading();
                callback(false);
                return false;
              }
              let xxx = this.get_len_hex(res, 6, 7);
              if (xxx) {
                // 关闭连接
                this.closeDeviceConnect(deviceId);
                Taro.hideLoading();
              }
              let isok = false;
              let isokmsg = "";
              switch (xxx) {
                case "00": // 开锁成功
                  global.$utils.toast.success("开锁成功");
                  isok = true;
                  isokmsg = "开锁成功";
                  callback(true);
                  break;
                case "01": // 指令或密码错误
                  global.$utils.toast.error("指令或密码错误");
                  isok = false;
                  isokmsg = "指令或密码错误";
                  callback(false);
                  break;
                case "02": // 未检测到开关
                  global.$utils.toast.error("未检测到开关");
                  isok = false;
                  isokmsg = "未检测到开关";
                  callback(false);
                  break;
                case "03": // 开锁超时
                  global.$utils.toast.error("开锁超时");
                  isok = false;
                  isokmsg = "开锁超时";
                  callback(false);
                  break;
                case "04": // 电量低禁止开锁
                  global.$utils.toast.error("电量低禁止开锁");
                  isok = false;
                  isokmsg = "电量低禁止开锁";
                  callback(false);
                  break;
                default:
                  break;
              }
              // 上报消息
              let d = {};
              d.deviceId = deviceId;
              d.cmd_data = data;
              d.msg_data = res;
              d.msg_ok = isok;
              d.msg_okmsg = isokmsg;
              this.upMsgReceive("OPEN_LOCK", device_no, d);
            }
          );
        }
      );
      setTimeout(function() {
        Taro.hideLoading();
      }, 6000);
    } catch (error) {
      console.log("sendOpenLockLotd fail:", error);
      setTimeout(function() {
        Taro.hideLoading();
      }, 500);
      return false;
    }
  },

  // gprs上报
  sendGprsLockUpLotd: function(
    device_no,
    deviceId,
    serviceId,
    write_uuidId,
    read_uuidId,
    key,
    bluetooth_pass,
    callback
  ) {
    try {
      console.log("sendGprsLockUpLotd", deviceId, key, bluetooth_pass);
      // 获取token
      this.sendDataGetToken(
        deviceId,
        serviceId,
        write_uuidId,
        read_uuidId,
        key,
        token => {
          if (!token) {
            callback(false);
            return false;
          }
          console.log("token", token);
          let data = this.packet_data("0310", "01", token);
          // 发送数据
          this.sendData(
            deviceId,
            serviceId,
            write_uuidId,
            read_uuidId,
            data,
            key,
            res => {
              console.log("开锁GPRS上报：发送数据读取数据：", res);
              if (res === false) {
                callback(false);
                return false;
              }
              let xxx = this.get_len_hex(res, 6, 7);
              if (xxx) {
                // 关闭连接
                this.closeDeviceConnect(deviceId);
              }
              let isok = false;
              let isokmsg = "";
              switch (xxx) {
                case "00": // 接收处理
                  isok = true;
                  isokmsg = "接收处理";
                  callback(true);
                  break;
                case "01": // 拒绝接收
                  isok = false;
                  isokmsg = "拒绝接收";
                  callback(false);
                  break;
                default:
                  break;
              }
              // 上报消息
              let d = {};
              d.deviceId = deviceId;
              d.cmd_data = data;
              d.msg_data = res;
              d.msg_ok = isok;
              d.msg_okmsg = isokmsg;
              this.upMsgReceive("GPRS_UP", device_no, d);
            }
          );
        }
      );
    } catch (error) {
      console.log("sendGprsLockUpLotd fail:", error);
      callback(false);
      return false;
    }
  },

  // 激活锁
  sendRunLockLotd: function(
    device_no,
    deviceId,
    serviceId,
    write_uuidId,
    read_uuidId,
    key,
    bluetooth_pass,
    callback
  ) {
    try {
      Taro.showLoading({
        title: "激活中"
      });
      console.log("sendRunLockLotd", deviceId, key, bluetooth_pass);
      // 获取token
      this.sendDataGetToken(
        deviceId,
        serviceId,
        write_uuidId,
        read_uuidId,
        key,
        token => {
          if (!token) {
            Taro.hideLoading();
            callback(false);
            return false;
          }
          let data = this.packet_data("0800", "00", token);
          // 发送数据
          this.sendData(
            deviceId,
            serviceId,
            write_uuidId,
            read_uuidId,
            data,
            key,
            res => {
              console.log("激活锁：发送数据读取数据：", res);
              if (res === false) {
                Taro.hideLoading();
                callback(false);
                return false;
              }
              let xxx = this.get_len_hex(res, 6, 7);
              if (xxx) {
                // 关闭连接
                this.closeDeviceConnect(deviceId);
                Taro.hideLoading();
              }
              let isok = false;
              let isokmsg = "";
              switch (xxx) {
                case "00": // 操作成功
                  global.$utils.toast.success("操作成功");
                  isok = true;
                  isokmsg = "操作成功";
                  callback(true);
                  break;
                case "01": // 指令或密码错误
                  global.$utils.toast.error("操作失败");
                  isok = false;
                  isokmsg = "操作失败";
                  callback(false);
                  break;
                default:
                  break;
              }
              // 上报消息
              let d = {};
              d.deviceId = deviceId;
              d.cmd_data = data;
              d.msg_data = res;
              d.msg_ok = isok;
              d.msg_okmsg = isokmsg;
              this.upMsgReceive("RUN_LOCK", device_no, d);
            }
          );
        }
      );
      setTimeout(function() {
        Taro.hideLoading();
      }, 6000);
    } catch (error) {
      console.log("sendRunLockLotd fail:", error);
      setTimeout(function() {
        Taro.hideLoading();
      }, 500);
      callback(false);
      return false;
    }
  },
  // 检查mqtt锁
  sendCheckLockMqttLotd: function(
    device_no,
    deviceId,
    serviceId,
    write_uuidId,
    read_uuidId,
    key,
    bluetooth_pass,
    callback
  ) {
    try {
      Taro.showLoading({
        title: "检查中"
      });
      console.log("sendCheckLockMqttLotd", deviceId, key, bluetooth_pass);
      // 获取token
      this.sendDataGetToken(
        deviceId,
        serviceId,
        write_uuidId,
        read_uuidId,
        key,
        token => {
          if (!token) {
            Taro.hideLoading();
            callback(false);
            return false;
          }
          let data = this.packet_data("1800", "01", token);
          // 发送数据
          this.sendData(
            deviceId,
            serviceId,
            write_uuidId,
            read_uuidId,
            data,
            key,
            res => {
              console.log("检查MQTT锁：发送数据读取数据：", res);
              if (res === false) {
                Taro.hideLoading();
                callback(false);
                return false;
              }
              let xxx = this.get_len_hex(res, 6, 7);
              if (xxx) {
                // 关闭连接
                this.closeDeviceConnect(deviceId);
                Taro.hideLoading();
              }
              let isok = false;
              let isokmsg = "";
              switch (xxx) {
                case "00": // mqtt连接成功
                  global.$utils.toast.success("MQTT连接成功");
                  isok = true;
                  isokmsg = "MQTT连接成功";
                  callback(true);
                  break;
                case "01": // 网络连接成功
                  global.$utils.toast.success("网络连接成功");
                  isok = true;
                  isokmsg = "网络连接成功";
                  callback(true);
                  break;
                case "02": // mqtt连接失败
                  global.$utils.toast.error("MQTT连接失败");
                  isok = false;
                  isokmsg = "MQTT连接失败";
                  callback(false);
                  break;
                default:
                  break;
              }
              // 上报消息
              let d = {};
              d.deviceId = deviceId;
              d.cmd_data = data;
              d.msg_data = res;
              d.msg_ok = isok;
              d.msg_okmsg = isokmsg;
              this.upMsgReceive("CHECK_MQTT", device_no, d);
            }
          );
        }
      );
      setTimeout(function() {
        Taro.hideLoading();
      }, 6000);
    } catch (error) {
      console.log("sendCheckLockMqttLotd fail:", error);
      setTimeout(function() {
        Taro.hideLoading();
      }, 500);
      callback(false);
      return false;
    }
  },

  // 重启锁
  sendRestartLockLotd: function(
    device_no,
    deviceId,
    serviceId,
    write_uuidId,
    read_uuidId,
    key,
    bluetooth_pass,
    callback
  ) {
    try {
      Taro.showLoading({
        title: "重启中"
      });
      console.log("sendRestartLockLotd", deviceId, key, bluetooth_pass);
      // 获取token
      this.sendDataGetToken(
        deviceId,
        serviceId,
        write_uuidId,
        read_uuidId,
        key,
        token => {
          if (!token) {
            Taro.hideLoading();
            callback(false);
            return false;
          }
          let data = this.packet_data("0800", "02", token);
          // 发送数据
          this.sendData(
            deviceId,
            serviceId,
            write_uuidId,
            read_uuidId,
            data,
            key,
            res => {
              console.log("重启锁：发送数据读取数据：", res);
              if (res === false) {
                Taro.hideLoading();
                callback(false);
                return false;
              }
              let xxx = this.get_len_hex(res, 6, 7);
              if (xxx) {
                // 关闭连接
                this.closeDeviceConnect(deviceId);
                Taro.hideLoading();
              }
              let isok = false;
              let isokmsg = "";
              switch (xxx) {
                case "00": // 操作成功
                  global.$utils.toast.success("操作成功");
                  isok = true;
                  isokmsg = "操作成功";
                  callback(true);
                  break;
                case "01": // 指令或密码错误
                  global.$utils.toast.error("操作失败");
                  isok = false;
                  isokmsg = "操作失败";
                  callback(false);
                  break;
                default:
                  break;
              }
              // 上报消息
              let d = {};
              d.deviceId = deviceId;
              d.cmd_data = data;
              d.msg_data = res;
              d.msg_ok = isok;
              d.msg_okmsg = isokmsg;
              this.upMsgReceive("RESTART", device_no, d);
            }
          );
        }
      );
      setTimeout(function() {
        Taro.hideLoading();
      }, 6000);
    } catch (error) {
      console.log("sendRunLockLotd fail:", error);
      setTimeout(function() {
        Taro.hideLoading();
      }, 500);
      callback(false);
      return false;
    }
  },

  // 上报消息数据
  upMsgReceive: function(
    action,
    device_no,
    data = {},
    order_id = "",
    scene = ""
  ) {
    let d = {};
    d.action = action;
    d.device_no = device_no;
    d.data = data;
    d.order_id = order_id;
    d.scene = scene;
    global.$utils.api
      .load("msgReceive", d, "post", {
        toast: false,
        toasterror: false,
        toastlogin: false,
        login: false,
        loading: false
      })
      .then(result => {
        console.log("上报消息数据 upMsgReceive:", d, result);
      });
  }
};

export default bluetooth;
