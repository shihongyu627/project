// initial state
const baseName = "/api/device";
const repairName = "/api/repair";
const advertName = "/api/advert";
const msgName = "/api/msg";

const deviceCheck = baseName + "/checkDevice";
const deviceInfo = baseName + "/info";
const deviceOpenLock = baseName + "/openlock";
const deviceRepair = repairName + "/create";
const deviceRecord = repairName + "/addrecord";

const devicebanner = advertName + "/banner";

const deviceLists = baseName + "/lists";
const deviceListsBylnglat = baseName + "/listsBylnglat";

const deviceStoreStopLists = baseName + "/storeStopLists";
const deviceStoreRunLists = baseName + "/storeRunLists";

const msgReceive = msgName + "/receive";

export {
  deviceCheck,
  deviceOpenLock,
  deviceInfo,
  deviceRepair,
  deviceRecord,
  devicebanner,
  deviceLists,
  deviceListsBylnglat,
  msgReceive,
  deviceStoreStopLists,
  deviceStoreRunLists
};
