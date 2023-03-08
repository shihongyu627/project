import * as DeviceTypes from "../constants/deviceTypes";

function setQrcodeDeviceNo(device_no) {
  console.log("store action setQrcodeDeviceNo", device_no);
  return {
    type: DeviceTypes.SET_QRCODE_DEVICE_NO,
    device_no: device_no
  };
}

function delQrcodeDeviceNo() {
  console.log("store action delQrcodeDeviceNo", {});
  return {
    type: DeviceTypes.DEL_QRCODE_DEVICE_NO,
  };
}

export { setQrcodeDeviceNo, delQrcodeDeviceNo };
