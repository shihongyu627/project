// initial state
const baseName = "/api/order";
const payName = "/api/pay";
const help = "/api/help";
const mapName = "/api/map";
const repairName = "/api/repair";

const orderNow = baseName + "/nowOrder"; // 当前订单
const orderCreate = baseName + "/createOrder"; // 创建订单
const orderEnd = baseName + "/endOrder"; // 结束订单
const orderInfo = baseName + "/orderinfo"; // 订单详情
const orderSendPush = baseName + "/sendPush"; // 订单设备操作
const getPushResult = baseName + "/getPushResult"; // 查询控制结果

const mapUpLocation = mapName + "/upLocation"; // 上报轨迹
const mapManagedevice = mapName + "/managedevice";

const orderPay = payName + "/unipay";
const orderHelpIndex = help + "/index";
const orderHelpList = help + "/classlists";
const orderHelpListClass = help + "/lists";

const orderHelpdetail = help + "/detail";

const repairRepairlist = repairName + "/repairlist";

export {
  orderNow,
  orderCreate,
  orderEnd,
  orderInfo,
  orderSendPush,
  getPushResult,
  orderPay,
  mapUpLocation,
  orderHelpIndex,
  orderHelpList,
  orderHelpdetail,
  orderHelpListClass,
  repairRepairlist,
  mapManagedevice
};
