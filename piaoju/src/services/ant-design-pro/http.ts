const base_host = '';
export const urls = {
  /** 票据订单表-分页列表查询 */
  pjOrderList: `${base_host}/admin/ticket/pjOrder/list`,
  /** 票据套餐表-无分页列表查询  */
  pjComboNoPageList: `${base_host}/admin/ticket/pjCombo/noPageList`,
  /** 票据套餐表-分页列表查询  */
  pjCombolist: `${base_host}/admin/ticket/pjCombo/list`,
  /** 票据套餐表-id查询  */
  pjComboqueryById: `${base_host}/admin/ticket/pjCombo/queryById`,
  /** 票据套餐表-编辑  */
  pjComboedit: `${base_host}/admin/ticket/pjCombo/edit`,
  /** 票据订单表-通过id删除*/
  pjOrderDelete: `${base_host}/admin/ticket/pjOrder/delete`,
  /** 票据订单表-通过id查询*/
  pjOrderInfo: `${base_host}/admin/ticket/pjOrder/queryById`,
  /** 订单创建 POST */
  pjOrderAdd: `${base_host}/admin/ticket/pjOrder/add`,
  /** 订单编辑 */
  pjOrderEdit: `${base_host}/admin/ticket/pjOrder/edit`,
  /** 票据客户表-不分页列表查询 */
  pjClientList: `${base_host}/admin/ticket/pjClient/noPageList`,
  //客户删除
  PjClientDelete: `${base_host}/admin/ticket/pjClient/delete`,
  /** 票据订单表出口明细-导出excel */
  pjOrderExportXls: `${base_host}/admin/ticket/pjOrder/exportXls`,
  /** 票据订单表退明细-导出excel */
  pjOrderExportDrawback: `${base_host}/admin/ticket/pjOrder/exportDrawback`,
  //订单备案是否收集表
  pjOrderkeepRecord: `${base_host}/admin/ticket/pjOrder/exportReference`,
  //订单导出成本转结单
  pjcostTransferOrder: `${base_host}/admin/ticket/pjOrder/exportCostTransferOrder`,
  /** 票据订单表-列表页批量修改时间 */
  pjOrderEditDate: `${base_host}/admin/ticket/pjOrder/editDate`,
  /** 列表查询通用接口 POST /admin/ticket/pjOrder/edit */
  getList: `${base_host}/admin/get`,
  //列表通用删除
  deleteList: `${base_host}/admin/delete`,
  //列表通用新增
  addList: `${base_host}/admin/post`,
  //列表通用编辑
  editList: `${base_host}/admin/put`,
  //套餐记录无分页
  pjComboLogNoPageList: `${base_host}/admin/ticket/pjComboLog/noPageList`,
  //修改套餐
  pjComboLogedit: `${base_host}/admin/ticket/pjClient/edit`,
  //新增套餐
  pjComboLogadd: `${base_host}/admin/ticket/pjComboLog/add`,
  //客户用户新增
  sysUseraddClient: `${base_host}/admin/sys/user/addClient`,
  //票据客户表-通过id查询
  pjClientqueryById: `${base_host}/admin/ticket/pjClient/queryById`,
  //票据客户表-编辑
  pjClientedit: `${base_host}/admin/ticket/pjClient/edit`,
  //票据客户表-add
  pjClientadd: `${base_host}/admin/ticket/pjClient/add`,
  /** 订单编辑客户无分页  */
  userNoPageList: `${base_host}/admin/sys/user/noPageList`,
  /** 订单操作日志 */
  pjOrderLogList: `${base_host}/admin/ticket/pjOrderLog/noPageList`,
  /** 订单商品列表 */
  pjGoodsList: `${base_host}/admin/ticket/pjGoods/list`,
  /** 订单商品列表 不分页 */
  pjGoodsNoPageList: `${base_host}/admin/ticket/pjGoods/noPageList`,
  /** 订单商品编辑 */
  pjGoodsEdit: `${base_host}/admin/ticket/pjGoods/edit`,
  /** 票据文件表-无分页列表查询 */
  pjFileNoPageList: `${base_host}/admin/ticket/pjFile/noPageList`,
  /** 票据文件表-添加 */
  pjFileAdd: `${base_host}/admin/ticket/pjFile/add`,
  /** 票据文件表-编辑 */
  pjFileEdit: `${base_host}/admin/ticket/pjFile/edit`,
  /** 票据文件表-批量删除 */
  pjFileDeleteBatch: `${base_host}/admin/ticket/pjFile/deleteBatch`,
  /** 阿里云OCR识别发票 */
  ocrChange: `${base_host}/admin/ticket/ocr/change`,
  /** 智能识别报关单 */
  // ocrCustoms: `${base_host}/admin/ticket/ocr/customs`,
  ocrCustoms: `${base_host}/admin/ticket/ocr/soleCustoms`,
  /** 智能识别报关单结果 */
  // ocrGetFileParseResult: `${base_host}/admin/ticket/ocr/getFileParseResult`,
  ocrGetFileParseResult: `${base_host}/admin/ticket/ocr/getSoleFileParseResult`,
  /** 部门列表 */
  sysDepartList: `${base_host}/admin/sys/sysDepart/queryTreeAll`,
  /** 部门列表删除 */
  sysDepartDelete: `${base_host}/admin/sys/sysDepart/delete`,
  /** 部门列表新增 */
  sysDepartadd: `${base_host}/admin/sys/sysDepart/add`,
  /** 部门不分页 */
  sysDepartnoPageList: `${base_host}/admin/sys/sysDepart/noPageList`,
  /** 部门id查询 */
  sysDepartData: `${base_host}/admin/sys/sysDepart/getById`,
  /** 部门编辑 */
  sysDepartedit: `${base_host}/admin/sys/sysDepart/edit`,
  /** 角色列表 */
  sysRoleList: `${base_host}/admin/sys/role/list`,
  /** 角色删除 */
  sysRoleDelete: `${base_host}/admin/sys/role/delete`,
  /** 角色权限树下拉 */
  sysRoleTreeList: `${base_host}/admin/sys/role/queryTreeList`,
  /** 角色详情 */
  sysRoleData: `${base_host}/admin/sys/role/queryById`,
  /** 权限详情 */
  sysRoleRolePermission: `${base_host}/admin/sys/permission/queryRolePermission`,
  /** 角色新增 */
  sysRoleadd: `${base_host}/admin/sys/role/add`,
  /** 角色编辑 */
  sysRoleedit: `${base_host}/admin/sys/role/edit`,
  /** 用户列表 */
  sysUserList: `${base_host}/admin/sys/user/list`,
  /** 用户列表删除 */
  sysUserDelete: `${base_host}/admin/sys/user/delete`,
  /** 冻结解冻 */
  frozenBatch: `${base_host}/admin/sys/user/frozenBatch`,
  /** 角色不分页 */
  sysrolenoPageList: `${base_host}/admin/sys/role/noPageList`,
  /** 用户详情 */
  sysUserData: `${base_host}/admin/sys/user/queryById`,
  /** 用户新增 */
  sysUseradd: `${base_host}/admin/sys/user/add`,
  /** 用户编辑 */
  sysUseredit: `${base_host}/admin/sys/user/edit`,
  /** 修改 */
  changePassword: `${base_host}/admin/sys/user/changePassword`,
  /** 重置密码 */
  updatePassword: `${base_host}/admin/sys/user/resetPassword`,
  /** 报关单确认 */
  editState: `${base_host}/admin/ticket/pjOrder/editState`,
  /** 商品批量分配发票 */
  pjBillingAddBatch: `${base_host}/admin/ticket/pjBilling/addBatch`,
  /** 商品发票无分页 */
  pjBillingNoPageList: `${base_host}/admin/ticket/pjBilling/noPageList`,
  /** 工厂发票无分页 */
  pjBillingnoPageFactoryList: `${base_host}/admin/ticket/pjBilling/noPageFactoryList`,
  /** 票据文件表-批量处理 */
  pjFileAddBatch: `${base_host}/admin/ticket/pjFile/changeBatch`,
  /** 票据文件详情 */
  pjFileQueryById: `${base_host}/admin/ticket/pjFile/queryById`,
  /** 出口发票校验 */
  pjOrderCheckExport: `${base_host}/admin/ticket/pjOrder/checkExport`,
  /** 开票信息删除 */
  pjBillingDelete: `${base_host}/admin/ticket/pjBilling/batch`,
  //文件上传
  upload: `${base_host}/admin/sys/common/upload`,
  //出口发票批量校验
  pjOrdercheckExportBatch: `${base_host}/admin/ticket/pjOrder/checkExportBatch`,
  //进项发票批量校验
  pjOrdercheckBatch: `${base_host}/admin/ticket/pjOrder/checkBatch`,
  //进项发票批量校验（不改状态）
  pjOrdercheckBatchtow: `${base_host}/admin/ticket/pjOrder/verifyBatch`,
  //发票文件删除
  pjFiledelete: `${base_host}/admin/ticket/pjFile/delete`,
  //订单数据统计
  pjOrderstatistics: `${base_host}/admin/ticket/pjOrder/statistics`,
  //客户不分页
  pjClientNoPageList: `${base_host}/admin/ticket/pjClient/noPageList`,
  //工作台数据
  pjOrderworkbench: `${base_host}/admin/ticket/pjOrder/workbench`,
  //客服不分页统计
  noPageClient: `${base_host}/admin/sys/user/noPageClient`,
  //客户不分页统计
  noPageClientList: `${base_host}/admin/ticket/pjClient/noPageClientList`,
  //开票通知查询客户信息
  getClientData: `${base_host}/admin/ticket/pjBilling/getClientData`,
  //获取所有开票信息
  noPageGkList: `${base_host}/admin/ticket/pjBilling/noPageGkList`,
  noPageOrderFactoryList: `${base_host}/admin/ticket/pjBilling/noPageOrderFactoryList`,
  //进项发票文件
  invoiceCheckList: `${base_host}/admin/ticket/pjFile/invoiceCheckList`,
  //订单状态
  pjOrdereditState: `${base_host}/admin/ticket/pjOrder/editState`,
  //查询开票信息添加工厂（补全）
  pjMiddlenoPageList: `${base_host}/admin/ticket/pjMiddle/noPageList`,
  //查询工厂删除（补全）
  factoryDelete: `${base_host}/admin/ticket/pjMiddle/delete`,
  //重新分配客服并处理客户订单
  changeAllot: `${base_host}/admin/ticket/pjClient/changeAllot`,
  //腾讯云ocr
  tencentOcr: `${base_host}/admin/ticket/tencentOcr/mixedInvoice`,
  //客户管理列表分页
  pjClientlist: `${base_host}/admin/ticket/pjClient/list`,
  //商品开票编辑
  pjBillingedit: `${base_host}/admin/ticket/pjBilling/edit`,
  //商品开票详情
  pjBillinginfo: `${base_host}/admin/ticket/pjBilling/queryById`,
  //登录接口
  login: `${base_host}/admin/sys/login`,
  /** 轮播图无分页列表查询*/
  loginlist: `${base_host}/admin/ticket/pjCarousel/noPageList`,
  // 试用客户添加
  PjFirmadd: `${base_host}/admin/ticket/pjFirm/add`,
  //腾讯云短信
  tencentOcrsms: `${base_host}/admin/ticket/tencentOcr/sms`,
  //获取权限
  permission: `${base_host}/admin/sys/permission/getUserPermissionByToken`,
  // 通过名称校验是否重复
  checkIsName: `${base_host}/admin/ticket/pjClient/checkIsName`,
  // 通过id和名称校验是否重复
  checkIdName: `${base_host}/admin/ticket/pjClient/checkIdName`,
  // 票据轮播图表-分页列表查询
  PjCarousel: `${base_host}/admin/ticket/pjCarousel/list`,
  // 票据轮播图表-删除
  PjCarouselDelete: `${base_host}/admin/ticket/pjCarousel/delete`,
  // 票据轮播图表-编辑
  PjCarouseledit: `${base_host}/admin/ticket/pjCarousel/edit`,
  // 票据轮播图表-通过id查询详情
  PjCarouselData: `${base_host}/admin/ticket/pjCarousel/queryById`,
  // 票据轮播图表-添加
  PjCarouseladd: `${base_host}/admin/ticket/pjCarousel/add`,
  // 汇率表-分页列表查询
  PjExchangeRate: `${base_host}/admin/ticket/pjExchangeRate/list`,
  // 汇率表-删除
  PjExchangeRateDelete: `${base_host}/admin/ticket/pjExchangeRate/delete`,
  // 汇率表-id查询
  PjExchangeRateData: `${base_host}/admin/ticket/pjExchangeRate/queryById`,
  // 汇率表-编辑
  PjExchangeRateedit: `${base_host}/admin/ticket/pjExchangeRate/edit`,
  // 汇率表-新增
  PjExchangeRateadd: `${base_host}/admin/ticket/pjExchangeRate/add`,
  // 票据试用客户表-分页列表查询
  PjFirm: `${base_host}/admin/ticket/pjFirm/list`,
  // 票据试用客户表-id查询
  PjFirmData: `${base_host}/admin/ticket/pjFirm/queryById`,
  // 票据试用客户表-编辑
  PjFirmedit: `${base_host}/admin/ticket/pjFirm/edit`,
  // 票据商品开票表-批次处理开票通知、采购合同地址
  pjBillingcheckBatch: `${base_host}/admin/ticket/pjBilling/checkBatch`,
  // 一键下载开票、合同
  pjBillingoneKeyGenerate: `${base_host}/admin/ticket/pjBilling/oneKeyGenerate`,
  //开票品类管理-无分页列表查询
  pjCategory: `${base_host}/admin/ticket/pjCategory/noPageList`,
  //通过订单ID查询开票、合同信息
  getBillAll: `${base_host}/admin/ticket/pjBilling/getBillAll`,
  //工厂开票编辑
  pjBillingcheckFactory: `${base_host}/admin/ticket/pjBilling/checkFactory`,
  //识别记录
  pjScanLog: `${base_host}/admin/ticket/pjScanLog/list`,
  //充值记录
  pjRechargeLog: `${base_host}/admin/ticket/pjRechargeLog/list`,
  //租户
  pjTenant: `${base_host}/admin/ticket/pjTenant/list`,
  //租户id查询
  pjTenantqueryById: `${base_host}/admin/ticket/pjTenant/queryById`,
  //租户add
  pjTenantadd: `${base_host}/admin/ticket/pjTenant/add`,
  //租户edit
  pjTenantedit: `${base_host}/admin/ticket/pjTenant/edit`,
  //delete
  pjTenantdelete: `${base_host}/admin/ticket/pjTenant/delete`,
  //checkNum充值
  pjTenantcheckNum: `${base_host}/admin/ticket/pjTenant/checkNum`,
  //充值记录无分页
  pjRechargeLognoPagelist: `${base_host}/admin/ticket/pjRechargeLog/noPagelist`,
  //租户无分页
  pjTenantnoPageList: `${base_host}/admin/ticket/pjTenant/noPagelist`,
  //用户绑定租户
  usercheckTenant: `${base_host}/admin/sys/user/checkTenant`,
  //租户新增用户
  useraddTenant: `${base_host}/admin/sys/user/addTenant`,
  //企业用户
  selectDetails: `${base_host}/admin/ticket/pjClient/selectDetails`,
  //租户客户
  adminSelectDetails: `${base_host}/admin/ticket/pjClient/adminSelectDetails`,
  //租户用户
  UserselectDetails: `${base_host}/admin/sys/user/selectDetails`,
  //外商无分页
  pjForeign: `${base_host}/admin/ticket/pjForeign/noPageList`,
  //外商分页
  pjForeignlist: `${base_host}/admin/ticket/pjForeign/list`,
  //外商详情
  pjForeignqueryById: `${base_host}/admin/ticket/pjForeign/queryById`,
  //外商编辑
  pjForeignedit: `${base_host}/admin/ticket/pjForeign/edit`,
  //外商新增
  pjForeignadd: `${base_host}/admin/ticket/pjForeign/add`,
  //外商删除
  pjForeignDelete: `${base_host}/admin/ticket/pjForeign/delete`,
  //登出
  loginOut: `${base_host}/admin/sys/logout`,
  //规则
  pjRule: `${base_host}/admin/ticket/pjRule/noPageList`,
  //服务配置
  configuration: `${base_host}/admin/ticket/configuration/configuration`,
  //服务配置编辑
  configurationedit: `${base_host}/admin/ticket/configuration/change`,
  //消息列表
  messageList: `${base_host}/admin/ticket/announcementSend/getMyAnnouncementSend`,
  //阅读状态
  editByAnntIdAndUserId: `${base_host}/admin/ticket/announcementSend/editByAnntIdAndUserId`,
  //查询所有消息
  announcementSend: `${base_host}/admin/ticket/announcementSend/list`,
  //合同模板列表
  pjModel: `${base_host}/admin/ticket/pjModel/list`,
  //合同模板列表删除
  pjModelDelete: `${base_host}/admin/ticket/pjModel/delete`,
  //合同模板列表新增
  pjModeladd: `${base_host}/admin/ticket/pjModel/add`,
  //合同模板列表详情
  pjModelData: `${base_host}/admin/ticket/pjModel/queryById`,
  //合同模板列表编辑
  pjModeledit: `${base_host}/admin/ticket/pjModel/edit`,
  //合同无分页数据
  pjModelnoPageList: `${base_host}/admin/ticket/pjModel/noPageList`,
  //处理商品和工厂合同模板
  checkModel: `${base_host}/admin/ticket/pjBilling/checkModel`,
  //默认合同模板更改
  pjModeldefaultStatus: `${base_host}/admin/ticket/pjModel/defaultStatus`,
  //合同模板管理-生效-失效
  pjModeleditStatus: `${base_host}/admin/ticket/pjModel/editStatus`,
  //常见问题列表
  pjIssue: `${base_host}/admin/ticket/pjIssue/noPageList`,
  //新手指导列表
  pjGuide: `${base_host}/admin/ticket/pjGuide/noPageList`,
};
