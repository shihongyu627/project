// initial state
const baseName = "/maintainer/flat";
const flatnoPageList = baseName + "/noPageList"; //查询公寓列表:id=主键ID,name=公寓名称，无分页
const staffnoPageList = baseName + "/staff/noPageList"; //无分页：查询公寓员工（保洁/保安/维修员等）列表
const roomnoPageList = baseName + "/room/noPageList"; //房源列表：查询所有字段，无分页
const roomnoPage= baseName + "/room/noPage"; //房源列表：查询所有字段，无分页

const roomMakeList= baseName + "/contract/roomMakeList"; //管家ID查询用户列表


const transactionList = baseName + "/transaction/list"; //查询公寓账单列表
const signTemplateList = baseName + "/sign/list"; //查询公寓合同模板列表

const flatcontractList = baseName + "/contract/list"; //查询公寓合同列表
const flatcontractNolist = baseName + "/contract/nolist"; //我的客户查询房源管理
const contractRevocation = baseName + "/contract/revocation"; //公寓合同撤销
const contractAdd = baseName + "/contract"; //新增公寓合同
const contractEdit = baseName + "/contract/edit"; //管家：驳回合同调整（id=合同ID，state=待审核（0）其余修改值和新增一致）

const flatmakeList = baseName + "/make/list"; //管家：查询公寓看房预约列表
const flatMake = baseName + "/make"; //管家：公寓看房预约确认或拒绝

const messageList = baseName + "/message/list"; //查询公寓消息通知列表
const messageRead = baseName + "/message"; //查询公寓消息通知已读
const messageAll = baseName + "/message/all"; //查询公寓消息通知统计
const messageReadAll = baseName + "/message/readAll"; //消息一键已读接口:customer=用户接收，butler=管家接收，property=物业接收

const publicMakeList = baseName + "/publicMake/list"; //管家：查询公寓公用设施预约列表
const cleanList = baseName + "/clean/list"; //管家：查询公寓预约保洁列表
const repairsList = baseName + "/repairs/list"; //管家：查询公寓预约报修列表
const visitorList = baseName + "/visitor/list"; //管家：查询公寓访客列表

const propertyPublicList = baseName + "/publicMake/propertyList"; //物业：查询公寓公用设施预约列表
const propertyCleanList = baseName + "/clean/propertyList"; //物业：查询公寓预约保洁列表
const propertyRepairsList = baseName + "/repairs/propertyList"; //物业：查询公寓预约报修列表
const propertyVisitorList = baseName + "/visitor/propertyList"; //物业：查询公寓访客列表

const cleanPost = baseName + "/clean"; //管家：公寓预约保洁拒绝或确认
const repairsPost = baseName + "/repairs"; //管家：确认或拒绝公寓预约报修
const publicMakePost = baseName + "/publicMake"; //管家：确认或拒绝公寓公用设施预约
const visitorPost = baseName + "/visitor"; //管家：确认或拒绝公寓访客

const propertyCleanEdit = baseName + "/clean/propertyEdit"; //物业：公寓预约保洁拒绝或确认
const propertyRepairsEdit = baseName + "/repairs/propertyEdit"; //物业：确认或拒绝公寓预约报修
export {
  flatnoPageList,
  roomnoPageList,
  roomMakeList,
  roomnoPage,
  staffnoPageList,
  transactionList,
  signTemplateList,
  flatcontractList,
  flatcontractNolist,
  contractRevocation,
  contractAdd,
  contractEdit,
  flatmakeList,
  flatMake,
  messageList,
  messageRead,
  messageAll,
  messageReadAll,
  publicMakeList,
  cleanList,
  repairsList,
  visitorList,
  propertyPublicList,
  propertyCleanList,
  propertyRepairsList,
  propertyVisitorList,
  cleanPost,
  repairsPost,
  publicMakePost,
  visitorPost,
  propertyCleanEdit,
  propertyRepairsEdit
};
