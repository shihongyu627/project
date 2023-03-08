import * as DeviceTypes from "../constants/deviceTypes";

// 初始状态
const initState = {
  qrcode_device_no: ""
};

// 不同类别的事用不同的type处理
export default function user(state = initState, action) {
  let tstate = {};
  switch (action.type) {
    case DeviceTypes.SET_QRCODE_DEVICE_NO:
      tstate = {
        qrcode_device_no: action.device_no
      };
      return { ...state, ...tstate };
    case DeviceTypes.DEL_QRCODE_DEVICE_NO:
      tstate = {
        qrcode_device_no: "",
        ...initState
      };
      return { ...state, ...tstate };
    default:
      return state;
  }
}
