// initial state
const tagsName = "/devops/tags";
const authName = "/devops/auth";
const patrolName = "/devops/patrol";
const repairName = "/devops/repair";
const dispatchName = "/devops/dispatch";
const deviceName = "/devops/device";
const bindName = "/devops/bind";
const batteryName = "/devops/battery";
const orderName = "/devops/order";
const storeName = "/devops/store";
const analysisName = "/devops/analysis";
const devopsMap = "/devops/map";

//骑行轨迹
const devopsTrsearch = devopsMap + "/trsearch";

const devopsTagAdd = tagsName + "/add";
const devopsTagsList = tagsName + "/tagslists";
const devopscleartags = tagsName + "/cleartags";

const devopsAuthInfo = authName + "/info";

const devopsPatrolCreate = patrolName + "/create";

const devopsrepairCreate = repairName + "/create";
const devopsrepairLists = repairName + "/repairlists";
const devopsrepairAddrecord = repairName + "/addrecord";

const devopsdispatchlists = dispatchName + "/dispatchlists";
const devopsstartdispatch = dispatchName + "/startdispatch";
const devopsenddispatch = dispatchName + "/enddispatch";

const devopsdeviceLists = deviceName + "/lists";
const devopsdeviceListsBylnglat = deviceName + "/listsBylnglat";
const devopscheckdevice = deviceName + "/checkdevice";
const devopsdeviceinfo = deviceName + "/info";
const devopsDeviceCheckSendLock = deviceName + "/checkSendLock";
const devopsDeviceSendLockUp = deviceName + "/sendLockUp";
const devopsdevicesendLock = deviceName + "/sendLock";
const devopsdevicerefresh = deviceName + "/refresh";
const devopsdevicerelogin = deviceName + "/relogin";
const devopsdevicecheckrunarea = deviceName + "/checkrunarea";
const devopsdevicecheckstoparea = deviceName + "/checkstoparea";
const devopsdeviceproductdrop = deviceName + "/productdrop";

const devopsdevicecheckbind = bindName + "/checkbind";
const devopsdevicebind = bindName + "/bind";
const devopsdeviceunbind = bindName + "/unbind";
const devopsdevicetest = bindName + "/test";

const devopsbatteryinfo = batteryName + "/info";

const devopsorderlists = orderName + "/orderlists";
const devopscloseorder = orderName + "/closeorder";

const devopsopstorelists = storeName + "/opstorelists";
const devopsopstoreArealists = storeName + "/opStoreAreaLists";

const devopsopsimpleinfo = analysisName + "/opsimpleinfo";

export {
  devopsAuthInfo,
  devopsTrsearch,
  devopsTagAdd,
  devopsTagsList,
  devopscleartags,
  devopsPatrolCreate,
  devopsrepairCreate,
  devopsrepairLists,
  devopsrepairAddrecord,
  devopsdispatchlists,
  devopsstartdispatch,
  devopsenddispatch,
  devopsdeviceLists,
  devopsdeviceListsBylnglat,
  devopscheckdevice,
  devopsdeviceinfo,
  devopsDeviceCheckSendLock,
  devopsDeviceSendLockUp,
  devopsdevicesendLock,
  devopsdevicerefresh,
  devopsdevicerelogin,
  devopsdevicecheckrunarea,
  devopsdevicecheckstoparea,
  devopsdeviceproductdrop,
  devopsdevicecheckbind,
  devopsdevicebind,
  devopsdevicetest,
  devopsdeviceunbind,
  devopsbatteryinfo,
  devopsorderlists,
  devopscloseorder,
  devopsopstorelists,
  devopsopstoreArealists,
  devopsopsimpleinfo
};
