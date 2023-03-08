import Taro, { Component } from "@tarojs/taro";
import { View, Checkbox, CheckboxGroup } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  state = {
    store_list: [],
    store_arr: []
  };
  componentDidMount() {
    this.devopsStoreDrop();
  }
  componentDidShow() {}

  // 区域下拉
  devopsStoreDrop = () => {
    let q = {};
    global.$utils.api.load("devopsopstorelists", q).then(res => {
      console.log(res);
      if (res.code > 0) {
        let v = res.data;
        let store_list = [];
        // 默认全部
        let ddx = {};
        ddx.value = "";
        ddx.text = "全部";
        ddx.checked = true;
        store_list.push(ddx);
        v.map(item => {
          let dd = {};
          dd.value = item.store_id + "";
          dd.text = item.store_name;
          dd.checked = false;
          store_list.push(dd);
        });
        console.log("store_list", store_list);
        this.setState(
          {
            store_list
          },
          () => {
            console.log("store_list", this.state.store_list);
          }
        );
      }
    });
  };
  // 门店选择
  onChangeStore = e => {
    let { store_list } = this.state;
    let store_arr = e.detail.value || [];
    let store_ll = store_list || [];
    console.log("onChangeStore", e.detail.value);
    // 取数组最后一条数据
    let last = store_arr[store_arr.length - 1];
    console.log("last:", last);
    // 判断是否是全部
    if (last == "") {
      store_arr = [""];
    } else {
      // 判断第一个是否是全部
      if (store_arr) {
        if (store_arr[0] == "") {
          store_arr.shift();
        }
      }
    }
    store_ll.map(item => {
      if (store_arr.includes(item.value)) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    console.log("onChangeStore", store_arr, store_ll);
    this.setState({
      store_arr: store_arr,
      store_list: store_ll
    });
  };
  //重置
  onClickReset = () => {
    this.setState(
      {
        store_arr: []
      },
      () => {
        this.devopsStoreDrop();
      }
    );
  };
  render() {
    let { store_list, store_arr } = this.state;
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
              let store_id_arr = [];
              let store_name_arr = [];
              // #全部区域
              if (!store_arr || store_arr.length == 0 || store_arr[0] == "") {
                store_list.map(item => {
                  if (item.value) {
                    store_id_arr.push(item.value);
                  }
                });
              } else {
                store_arr.map(item => {
                  if (item) {
                    store_id_arr.push(item);
                  }
                });
              }
              store_list.map(item => {
                if (store_arr.includes(item.value)) {
                  store_name_arr.push(item.text);
                }
              });
              let store_name = store_name_arr.join(",") || "全部区域";
              let store_id = store_id_arr.join(",") || "";
              let dd = {};
              dd.store_id = store_id;
              dd.store_name = store_name;
              console.log("确认筛选条件：", dd);
              this.props.onChangeFilter(dd, true);
            }}
          >
            确认
          </View>
        </View>
        <View className='FilterModalBox-title'>区域名称</View>
        <View className='FilterModalBox-product'>
          <CheckboxGroup
            style='flex-direction: column;display: flex;'
            onChange={e => {
              this.onChangeStore(e);
            }}
          >
            {store_list.map((item, i) => {
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
      </View>
    );
  }
}
