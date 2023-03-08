// initial state
const baseName = "/customer/flat";
const systemName = "/customer/customer";

const announcementList = systemName + "/announcement/list"; //查询公告管理列表
const issueList = systemName + "/issue/list"; //查询常见问题列表
const feedback = systemName + "/feedback"; //新增反馈

const WifiEdit = baseName + "/wifi"; //修改wifi
const doorEdit = baseName + "/door"; //修改门锁
const doorAdd = baseName + "/doorLog"; //新增门锁
const doorList = baseName + "/door/list"; //查询门锁列表
const accountInfo = baseName + "/account/getInfo"; //获取公寓用户账户余额详细信息

const billList = baseName + "/bill/list"; //查询公寓账单列表
const transactionList = baseName + "/transaction/list"; //查询公寓交易流水列表
const transactionInvoice = baseName + "/transaction/invoiceList"; //用户端：发票中心查询公寓交易流水列表
const invoiceList = baseName + "/invoice/list"; //查询公寓发票列表
const invoiceAdd = baseName + "/invoice"; //新增公寓发票
const invoiceBatch = baseName + "/invoice/batch"; //用户端：批量选择新增公寓发票

const roomRelation = baseName + "/room/relation"; //用户端：联系管家列表

const advertiseType = baseName + "/advertiseType/list"; //查询公寓广告列表
const contractAdd = baseName + "/contract"; //用户端：确认签约公寓合同
const contractList = baseName + "/contract/list"; //查询公寓合同列表
const publicList = baseName + "/public/list"; //查询公寓公用设施列表

const flatnoPageList = baseName + "/flat/list"; //公寓列表:查询所有字段，无分页
const roomnoPageList = baseName + "/room/noPageList"; //房源列表：查询所有字段，无分页
const roomList = baseName + "/room/list"; //查询公寓房间列表
const homeList = baseName + "/room/homeList"; //查询公寓房间列表

const messageList = baseName + "/message/list"; //查询公寓消息通知列表
const messageRead = baseName + "/message"; //查询公寓消息通知已读
const messageAll = baseName + "/message/all"; //查询公寓消息通知统计
const messageReadAll = baseName + "/message/readAll"; //消息一键已读接口:customer=用户接收，butler=管家接收，property=物业接收
const CleanList = baseName + "/clean/list"; //查询公寓预约保洁列表
const CleanTypeList = baseName + "/type/list"; //查询公寓保洁类型列表
const CleanAdd = baseName + "/clean"; //预约保洁

const repairsTypeList = baseName + "/repairsType/list"; //查询公寓预约报修列表
const RepairsList = baseName + "/repairs/list"; //查询公寓预约报修列表
const RepairsAdd = baseName + "/repairs"; //预约报修

const makeAdd = baseName + "/make"; //用户端：新增公寓看房预约
const makeList = baseName + "/make/list"; //用户端：查询公寓看房预约列表

const visitorAdd = baseName + "/visitor"; //预约访客
const visitorList = baseName + "/visitor/list"; //查询公寓访客列表
const publicMakeAdd = baseName + "/publicMake"; //新增公寓公用设施预约
const publicMakeList = baseName + "/publicMake/list"; //新增公寓公用设施预约
const surrenderAdd = baseName + "/surrender"; //我要退租
const surrenderList = baseName + "/surrender/list"; //退租记录
const CleanEvaluate = baseName + "/evaluate"; //保洁评价
const repairsEvaluate = baseName + "/repairsEvaluate"; //报修评价

export {
  WifiEdit,
  doorEdit,
  doorList,
  accountInfo,
  roomRelation,
  announcementList,
  issueList,
  billList,
  transactionList,
  transactionInvoice,
  invoiceList,
  invoiceAdd,
  invoiceBatch,
  feedback,
  advertiseType,
  contractAdd,
  contractList,
  publicList,
  flatnoPageList,
  roomnoPageList,
  roomList,
  homeList,
  CleanTypeList,
  repairsTypeList,
  messageList,
  messageRead,
  messageAll,
  messageReadAll,
  CleanList,
  RepairsList,
  publicMakeList,
  surrenderAdd,
  surrenderList,
  visitorList,
  CleanAdd,
  RepairsAdd,
  visitorAdd,
  makeAdd,
  makeList,
  publicMakeAdd,
  CleanEvaluate,
  repairsEvaluate,
  doorAdd
};
