import Taro, { Component } from "@tarojs/taro";
import { View, Checkbox, CheckboxGroup } from "@tarojs/components";
import { AtRange } from "taro-ui";
import "./index.scss";

export default class Index extends Component {
  state = {
    product_list: [],
    product_arr: [],
    lock_status_arr: [],
    online_status_arr: [],
    other_status_arr: [],
    min_battery: 0,
    max_battery: 100,
    battery_disabled: false
  };
  componentDidMount() {
    this.devopsdeviceproductdrop();
  }
  componentDidShow() {}
  //产品下拉
  devopsdeviceproductdrop = () => {
    let q = {};
    global.$utils.api.load("devopsdeviceproductdrop", q).then(res => {
      console.log(res);
      if (res.code > 0) {
        let v = res.data;
        let product_list = [];
        v.map(item => {
          let dd = {};
          dd.value = item.product_id;
          dd.text = item.name;
          dd.checked = false;
          product_list.push(dd);
        });
        this.setState({
          product_list
        });
      }
    });
  };
  //产品选择
  onChangeProduct = e => {
    let { product_list } = this.state;
    product_list.map(item => {
      item.select = true;
    });
    console.log("onChangeProduct", e.detail.value);
    this.setState({
      product_arr: e.detail.value,
      product_list
    });
  };
  //选择车锁状态
  onChangeLockStatus = e => {
    console.log("onChangeLockStatus", e.detail.value);
    this.setState({
      lock_status_arr: e.detail.value
    });
  };
  //选择在线状态
  onChangeOnlineStatus = e => {
    console.log("onChangeOnlineStatus", e.detail.value);
    this.setState({
      online_status_arr: e.detail.value
    });
  };
  //选择其他状态
  onChangeOtherStatus = e => {
    console.log("onChangeOtherStatus", e.detail.value);
    // 判断是否零电车，零电车需要缩短电量选择，
    if (e.detail.value.indexOf("battery_status0", 0) >= 0) {
      this.setState({
        min_battery: 0,
        max_battery: 0,
        battery_disabled: true
      });
    } else {
      this.setState({
        min_battery: 0,
        max_battery: 100,
        battery_disabled: false
      });
    }
    this.setState({
      other_status_arr: e.detail.value
    });
  };

  //电量
  onChangeBattery = value => {
    console.log("onChangeBattery", value);
    this.setState({
      min_battery: value[0],
      max_battery: value[1]
    });
  };
  //重置
  onClickReset = () => {
    this.setState(
      {
        product_arr: [],
        lock_status_arr: [],
        online_status_arr: [],
        other_status_arr: [],
        min_battery: 0,
        max_battery: 100,
        battery_disabled: false
      },
      () => {
        this.devopsdeviceproductdrop();
      }
    );
  };
  render() {
    let {
      product_list,
      product_arr,
      lock_status_arr,
      online_status_arr,
      other_status_arr,
      min_battery,
      max_battery,
      battery_disabled
    } = this.state;
    return (
      <View className='FilterModalBox'>
        <View className='FilterModalBox-header'>
          <View
            className='FilterModalBox-header-reset'
            onClick={() => {
              this.onClickReset();
            }}
          >
            重置
          </View>
          <View
            className='FilterModalBox-header-confim'
            onClick={() => {
              let product_id = product_arr.join(",") || "";
              let lock_status = lock_status_arr.join(",") || "";
              let online_status = online_status_arr.join(",") || "";
              // 解析其他状态
              let run_status =
                other_status_arr.indexOf("run_status1", 0) == -1 ? "" : "1";
              let in_run_area =
                other_status_arr.indexOf("in_area_status0", 0) == -1 ? "" : "0";
              let dd = {};
              dd.product_id = product_id;
              dd.lock_status = lock_status;
              dd.online_status = online_status;
              dd.run_status = run_status;
              dd.in_run_area = in_run_area;
              dd.min_battery = min_battery;
              dd.max_battery = max_battery;
              console.log("确认筛选条件：", dd);
              this.props.onChangeFilter(dd, true);
            }}
          >
            确认
          </View>
        </View>
        <View className='FilterModalBox-title'>产品名称</View>
        <View className='FilterModalBox-product'>
          <CheckboxGroup
            onChange={e => {
              this.onChangeProduct(e);
            }}
          >
            {product_list.map((item, i) => {
              return (
                <Checkbox
                  className='FilterModalBox-product-item'
                  value={item.value}
                  checked={item.checked}
                  key={i}
                  color='#ffc821'
                >
                  {item.text}
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        </View>
        <View className='FilterModalBox-title'>车锁状态</View>
        <View className='FilterModalBox-lock'>
          <CheckboxGroup
            onChange={e => {
              this.onChangeLockStatus(e);
            }}
          >
            <Checkbox
              className='FilterModalBox-lock-item'
              value='1'
              checked={lock_status_arr.indexOf("1", 0) == -1 ? false : true}
              color='#ffc821'
            >
              打开
            </Checkbox>
            <Checkbox
              className='FilterModalBox-lock-item'
              value='0'
              checked={lock_status_arr.indexOf("0", 0) == -1 ? false : true}
              color='#ffc821'
            >
              关闭
            </Checkbox>
          </CheckboxGroup>
        </View>
        <View className='FilterModalBox-title'>在线状态</View>
        <View className='FilterModalBox-lock'>
          <CheckboxGroup
            onChange={e => {
              this.onChangeOnlineStatus(e);
            }}
          >
            <Checkbox
              className='FilterModalBox-lock-item'
              value='1'
              checked={online_status_arr.indexOf("1", 0) == -1 ? false : true}
              color='#ffc821'
            >
              在线
            </Checkbox>
            <Checkbox
              className='FilterModalBox-lock-item'
              value='0'
              checked={online_status_arr.indexOf("0", 0) == -1 ? false : true}
              color='#ffc821'
            >
              离线
            </Checkbox>
          </CheckboxGroup>
        </View>
        <View className='FilterModalBox-title'>车辆状态</View>
        <View className='FilterModalBox-lock'>
          <CheckboxGroup
            onChange={e => {
              this.onChangeOtherStatus(e);
            }}
          >
            <Checkbox
              className='FilterModalBox-lock-item'
              value='run_status1'
              checked={
                other_status_arr.indexOf("run_status1", 0) == -1 ? false : true
              }
              color='#ffc821'
            >
              骑行中
            </Checkbox>
            <Checkbox
              className='FilterModalBox-lock-item'
              value='in_area_status0'
              checked={
                other_status_arr.indexOf("in_area_status0", 0) == -1
                  ? false
                  : true
              }
              color='#ffc821'
            >
              超区车
            </Checkbox>
            <Checkbox
              className='FilterModalBox-lock-item'
              value='battery_status0'
              checked={
                other_status_arr.indexOf("battery_status0", 0) == -1
                  ? false
                  : true
              }
              color='#ffc821'
            >
              零电车
            </Checkbox>
          </CheckboxGroup>
        </View>
        <View className='FilterModalBox-title'>
          电量筛选（{min_battery}% - {max_battery}%）
        </View>
        <View className='FilterModalBox-SliderBox'>
          <AtRange
            value={[min_battery, max_battery]}
            min={0}
            max={100}
            disabled={battery_disabled}
            blockSize={24}
            onChange={this.onChangeBattery.bind(this)}
          />
        </View>
      </View>
    );
  }
}
