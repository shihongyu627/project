import $data from '../utils/data'
import _ from 'underscore'
import Main from '@/views/main.vue'
import Index from '@/views/index'
import Market from '@/views/market'
import Shop from '@/views/shop'
import User from '@/views/user'
import Order from '@/views/order'
import Device from '@/views/device'
import Product from '@/views/product'
import Repair from '@/views/repair'
import Operator from '@/views/operator'
import Map from '@/views/map'
import Msg from '@/views/msg'
import Payment from '@/views/payment'
import { SmsLog } from '@/views/record'
import Analysis from '@/views/analysis'
import Help from '@/views/help'
import Patrol from '@/views/patrol'
import { Tool, Notice, Banner, Auth, Feedback, Config } from '@/views/system'
// 不作为Main组件的子页面展示的页面单独写，如下
export let loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: '登录',
  },
  component: (resolve) => {
    require(['@/views/login.vue'], resolve)
  },
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
let _otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/index',
  component: Main,
  children: [{ path: 'index', title: '首页', name: 'index_index', component: Index.Index }],
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
let _appRouter = [
  {
    path: '/main',
    icon: 'md-speedometer',
    name: 'index',
    title: '平台概况',
    component: Main,
    children: [{ path: 'index', title: '首页', name: 'index_index', auth: '/admin/dashboard/main', component: Index.Index }],
  },
  {
    path: '/market',
    icon: 'md-help-buoy',
    name: 'market',
    title: '功能列表',
    component: Main,
    children: [{ path: 'main', title: '功能', name: 'market_main', auth: '/admin/market/index', component: Market.MarketMain }],
  },
  {
    path: '/map',
    icon: 'md-globe',
    name: 'map',
    title: '车辆分布',
    component: Main,
    children: [{ path: 'index', title: '车辆分布', name: 'map_index', auth: '/admin/map/index', component: Map.MapMain }],
  },

  // { path: '', name: 'blank', title: '', children: [{ path: '' }] }, // 空白条

  {
    path: '/auth',
    icon: 'md-lock',
    name: 'auth',
    title: '系统权限',
    component: Main,
    show: true,
    children: [
      { path: 'access', title: '用户权限', name: 'auth_access_list', auth: '/admin/authaccess/lists', component: Auth.AuthAccessList },
      { path: 'accessadd', title: '创建管理员', show: false, name: 'auth_access_add', auth: '/admin/authaccess/add', component: Auth.AuthAccessEdit },
      { path: 'accessedit', title: '编辑管理员', show: false, name: 'auth_access_edit', auth: '/admin/authaccess/edit', component: Auth.AuthAccessEdit },

      { path: 'group', title: '角色权限', name: 'auth_group_list', auth: '/admin/authgroup/lists', component: Auth.AuthGroupList },
      { path: 'groupadd', title: '创建权限组', show: false, name: 'auth_group_add', auth: '/admin/authgroup/add', component: Auth.AuthGroupEdit },
      { path: 'groupedit', title: '编辑权限组', show: false, name: 'auth_group_edit', auth: '/admin/authgroup/edit', component: Auth.AuthGroupEdit },

      { path: 'rule', title: '权限规则', show: false, name: 'auth_rule_list', auth: '/admin/authrule/lists', component: Auth.AuthRuleList },
      { path: 'rulemain', title: '权限规则', show: false, name: 'auth_rule_main', auth: '/admin/authrule/lists', component: Auth.AuthRuleMain },
      { path: 'add', title: '创建权限', show: false, name: 'auth_rule_add', auth: '/admin/authrule/add', component: Auth.AuthRuleEdit },
      { path: 'edit', title: '编辑权限', show: false, name: 'auth_rule_edit', auth: '/admin/authrule/edit', component: Auth.AuthRuleEdit },

      { path: 'type', title: '账户类型', show: false, name: 'auth_type_list', auth: '/admin/authtype/lists', component: Auth.AuthTypeList },
      { path: 'typeadd', title: '创建账户类型', show: false, name: 'auth_type_add', auth: '/admin/authtype/add', component: Auth.AuthTypeEdit },
      { path: 'typeedit', title: '编辑账户类型', show: false, name: 'auth_type_edit', auth: '/admin/authtype/edit', component: Auth.AuthTypeEdit },
    ],
  },

  {
    path: '/pp',
    icon: 'md-flower',
    name: 'pp',
    title: '配置管理',
    component: Main,
    show: true,
    children: [
      { path: 'shop_list', title: '商家列表', name: 'shop_list', auth: '/admin/shop/lists', component: Shop.ShopList },
      { path: 'shop_store_list', title: '区域列表', name: 'shop_store_list', auth: '/admin/shopstore/lists', component: Shop.ShopStoreList },
      { path: 'product_list', title: '产品列表', name: 'product_list', auth: '/admin/product/lists', component: Product.ProductList },
    ],
  },

  {
    path: '/shop',
    icon: 'md-contacts',
    name: 'shop',
    title: '商家管理',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '商家列表', name: 'shop_list', auth: '/admin/shop/lists', component: Shop.ShopList },

      { path: 'add', title: '创建商家', show: false, name: 'shop_add', auth: '/admin/shop/add', component: Shop.ShopEdit },
      { path: 'edit', title: '编辑商家', show: false, name: 'shop_edit', auth: '/admin/shop/edit', component: Shop.ShopEdit },
    ],
  },

  {
    path: '/shopstore',
    icon: 'md-person-add',
    name: 'shopstore',
    title: '商家区域',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '商家区域列表', name: 'shop_store_list', auth: '/admin/shopstore/lists', component: Shop.ShopStoreList },

      { path: 'add', title: '创建区域', show: false, name: 'shop_store_add', auth: '/admin/shopstore/add', component: Shop.ShopStoreEdit },
      { path: 'edit', title: '编辑区域', show: false, name: 'shop_store_edit', auth: '/admin/shopstore/edit', component: Shop.ShopStoreEdit },
    ],
  },

  {
    path: '/shopstorefee',
    icon: 'md-person-add',
    name: 'shopstorefee',
    title: '区域费用',
    component: Main,
    show: false,
    children: [
      { path: 'list', title: '区域费用列表', name: 'shop_store_fee_list', auth: '/admin/shopstorefee/lists', component: Shop.ShopStoreFeeList },

      { path: 'add', title: '创建费用', show: false, name: 'shop_store_fee_add', auth: '/admin/shopstorefee/add', component: Shop.ShopStoreFeeEdit },
      { path: 'edit', title: '编辑费用', show: false, name: 'shop_store_fee_edit', auth: '/admin/shopstorefee/edit', component: Shop.ShopStoreFeeEdit },
    ],
  },

  {
    path: '/shopstoretime',
    icon: 'md-person-add',
    name: 'shopstoretime',
    title: '区域营运',
    component: Main,
    show: false,
    children: [
      { path: 'list', title: '区域营运列表', name: 'shop_store_time_list', auth: '/admin/shopstoretime/lists', component: Shop.ShopStoreTimeList },

      { path: 'add', title: '创建营运', show: false, name: 'shop_store_time_add', auth: '/admin/shopstoretime/add', component: Shop.ShopStoreTimeEdit },
      { path: 'edit', title: '编辑营运', show: false, name: 'shop_store_time_edit', auth: '/admin/shopstoretime/edit', component: Shop.ShopStoreTimeEdit },
    ],
  },

  {
    path: '/shopstorearea',
    icon: 'md-person-add',
    name: 'shopstorearea',
    title: '围栏区域',
    component: Main,
    show: false,
    children: [
      { path: 'list', title: '围栏区域列表', name: 'shop_store_area_list', auth: '/admin/shopstorearea/lists', component: Shop.ShopStoreAreaList },

      { path: 'add', title: '创建围栏区域', show: false, name: 'shop_store_area_add', auth: '/admin/shopstorearea/add', component: Shop.ShopStoreAreaEdit },
      { path: 'edit', title: '编辑围栏区域', show: false, name: 'shop_store_area_edit', auth: '/admin/shopstorearea/edit', component: Shop.ShopStoreAreaEdit },
    ],
  },
  // {
  //     path: '/shopaccount',
  //     icon: 'md-person-add',
  //     name: 'shopaccount',
  //     title: '商家账号',
  //     component: Main,
  //     show: false,
  //     children: [
  //         { path: 'list', title: '商家子账号列表', name: 'shop_account_list', auth: '/admin/shopaccount/lists', component: Shop.ShopAccountList },

  //         { path: 'add', title: '创建账号', show: false, name: 'shop_account_add', auth: '/admin/shopaccount/add', component: Shop.ShopAccountEdit },
  //         { path: 'edit', title: '编辑账号', show: false, name: 'shop_account_edit', auth: '/admin/shopaccount/edit', component: Shop.ShopAccountEdit },

  //     ]
  // },

  // {
  //     path: '/real',
  //     icon: 'md-pulse',
  //     name: 'real',
  //     title: '实时数据',
  //     component: Main,
  //     show: true,
  //     children: [
  //         { path: 'realdatalist', title: '资金列表列表', name: 'real_data_list', auth: '/admin/realdata/lists', component: Shop.ShopRealDataList },

  //     ]
  // },
  {
    path: '/product',
    icon: 'md-bulb',
    name: 'product',
    title: '产品管理',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '产品列表', name: 'product_list', auth: '/admin/product/lists', component: Product.ProductList },

      { path: 'add', title: '创建产品', show: false, name: 'product_add', auth: '/admin/product/add', component: Product.ProductEdit },
      { path: 'edit', title: '编辑产品', show: false, name: 'product_edit', auth: '/admin/product/edit', component: Product.ProductEdit },
    ],
  },
  {
    path: '/productclass',
    icon: 'md-apps',
    name: 'product_class',
    title: '产品分类',
    component: Main,
    show: false,
    children: [
      { path: 'list', title: '分类列表', name: 'product_class_list', auth: '/admin/productclass/lists', component: Product.ProductClassList },

      { path: 'add', title: '创建分类', show: false, name: 'product_class_add', auth: '/admin/productclass/add', component: Product.ProductClassEdit },
      { path: 'edit', title: '编辑分类', show: false, name: 'product_class_edit', auth: '/admin/productclass/edit', component: Product.ProductClassEdit },
    ],
  },

  {
    path: '/order',
    icon: 'md-paper',
    name: 'order',
    title: '订单管理',
    component: Main,
    show: true,
    children: [
      { path: 'list', title: '订单列表', name: 'order_list', auth: '/admin/order/lists', component: Order.OrderList },
      { path: 'simple', title: '商家订单', name: 'order_simple', auth: '/admin/order/simple', component: Order.OrderSimple },
      { path: 'mapup', title: '位置上报', show: false, name: 'order_map_up', auth1: '/admin/order/mapup', component: Order.OrderMapUp },
      { path: 'paymentRefund', title: '退款记录', show: false, name: 'order_refund', auth: '/admin/paymentRefund/lists', component: Order.OrderRefund },
    ],
  },

  {
    path: '/user',
    icon: 'md-person',
    name: 'user',
    title: '用户管理',
    component: Main,
    children: [
      { path: 'list', title: '用户列表', name: 'user_list', auth: '/admin/user/lists', component: User.UserList },

      { path: 'add', title: '创建用户', show: false, name: 'user_add', auth: '/admin/user/add', component: User.UserEdit },
      { path: 'edit', title: '编辑用户', show: false, name: 'user_edit', auth: '/admin/user/edit', component: User.UserEdit },
    ],
  },

  {
    path: '/device',
    icon: 'md-cube',
    name: 'device',
    title: '车辆管理',
    component: Main,
    show: true,
    children: [
      { path: 'list', title: '车辆列表', name: 'device_list', auth: '/admin/device/lists', component: Device.DeviceList },
      { path: 'repair_list', title: '维修列表', name: 'repair_list', auth: '/admin/repair/lists', component: Repair.RepairList },
      { path: 'shopstoretag_list', title: '排除标记', name: 'shop_store_tag_list', auth: '/admin/shopstoretag/lists', component: Shop.ShopStoreTagList },
      { path: 'openrecord_list', title: '开锁记录', name: 'device_open_record_list', auth: '/admin/deviceopenrecord/lists', component: Device.DeviceOpenRecrod },
      { path: 'OpenRefund', title: '开锁记录详情', show: false, name: 'openrecord_refund', auth: '/admin/OpenRefund/lists', component: Device.OpenRefund },
      { path: 'msg', title: '操作记录', show: false, name: 'msg_list', auth: '/admin/msg/lists', component: Msg.MsgList },
      { path: 'add', title: '创建车辆', show: false, name: 'device_add', auth: '/admin/device/add', component: Device.DeviceEdit },
      { path: 'edit', title: '编辑车辆', show: false, name: 'device_edit', auth: '/admin/device/edit', component: Device.DeviceEdit },
      { path: 'control', title: '车辆控制', show: false, name: 'device_control', auth: '/admin/device/edit', component: Device.DeviceControl },
      { path: 'swap', title: '车辆投放', show: false, name: 'device_swap', auth: '/admin/device/edit', component: Device.DeviceSwap },
      { path: 'update', title: '车辆升级', show: false, name: 'device_update', auth: '/admin/device/edit', component: Device.DeviceUpdate },
    ],
  },

  // {
  //     path: '/monitor',
  //     icon: 'md-pulse',
  //     name: 'monitor',
  //     title: '监控数据',
  //     component: Main,
  //     show: true,
  //     children: [
  //         { path: 'list', title: '监控列表', name: 'monitor_list', auth: '/admin/monitor/lists', component: MonitorList },

  //     ]
  // },

  {
    path: '/rr',
    icon: 'md-build',
    name: 'rr',
    title: '运维管理',
    component: Main,
    show: true,
    children: [
      { path: 'operator_list', title: '运营人员', show: true, name: 'operator_list', auth: '/admin/operator/lists', component: Operator.OperatorList },
      { path: 'user_white_list', title: '白名单用户', name: 'user_white_list', auth: '/admin/userwhite/lists', component: User.UserWhiteList },
      { path: 'user_black_list', title: '黑名单用户', name: 'user_black_list', auth: '/admin/userblack/lists', component: User.UserBlackList },
      { path: 'list', title: '巡检列表', name: 'patrol_list', auth: '/admin/patrol/lists', component: Patrol.PatrolList },
    ],
  },

  {
    path: '/shopstoretag',
    icon: 'md-person-add',
    name: 'shopstoretag',
    title: '排除标记',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '排除标记列表', name: 'shop_store_tag_list', auth: '/admin/shopstoretag/lists', component: Shop.ShopStoreTagList },

      { path: 'add', title: '创建排除标记', show: false, name: 'shop_store_tag_add', auth: '/admin/shopstoretag/add', component: Shop.ShopStoreTagEdit },
      { path: 'edit', title: '编辑排除标记', show: false, name: 'shop_store_tag_edit', auth: '/admin/shopstoretag/edit', component: Shop.ShopStoreTagEdit },
    ],
  },

  {
    path: '/repair',
    icon: 'md-build',
    name: 'repair',
    title: '维修管理',
    component: Main,
    show: true,
    children: [
      // { path: 'list', title: '用户报障车辆', name: 'repair_list', auth: '/admin/repair/lists', component: Repair.RepairList },

      { path: 'add', title: '创建维修', show: false, name: 'repair_add', auth: '/admin/repair/add', component: Repair.RepairEdit },
      { path: 'edit', title: '编辑维修', show: false, name: 'repair_edit', auth: '/admin/repair/edit', component: Repair.RepairEdit },
    ],
  },
  {
    path: '/exception',
    icon: 'md-person-add',
    name: 'exception',
    title: '异常车辆',
    component: Main,
    show: false,
    children: [
      { path: 'list', title: '异常车辆列表', name: 'exception_list', auth: '/admin/exception/lists', component: Repair.ExceptionList },
      { path: 'add', title: '创建区域', show: false, name: 'exception_add', auth: '/admin/exception/add', component: Repair.ExceptionEdit },
      { path: 'edit', title: '编辑区域', show: false, name: 'exception_edit', auth: '/admin/exception/edit', component: Repair.ExceptionEdit },
    ],
  },
  {
    path: '/patrol',
    icon: 'ios-map',
    name: 'patrol',
    title: '巡检记录',
    component: Main,
    show: true,
    children: [
      // { path: 'list', title: '巡检列表', name: 'patrol_list', auth: '/admin/patrol/lists', component: Patrol.PatrolList }
    ],
  },

  // {path: '', name: 'blank', title: '',children: [ { path: '' }, ] },  // 空白条

  {
    path: '/yy',
    icon: 'md-cog',
    name: 'yy',
    title: '营销中心',
    component: Main,
    show: true,
    children: [
      { path: 'banner_list', title: '广告列表', name: 'banner_list', auth: '/admin/advert/lists', component: Banner.BannerList },
      { path: 'notice_list', title: '公告列表', name: 'notice_list', auth: '/admin/notice/lists', component: Notice.NoticeList },
      { path: 'help_list', title: '帮助列表', name: 'help_list', auth: '/admin/help/lists', component: Help.HelpList },
      { path: 'list', title: '反馈列表', name: 'feedback_list', auth: '/admin/feedback/lists', component: Feedback.FeedbackList },
      { path: 'base', title: '系统配置', name: 'config_name', icon: 'arrow-graph-up-right', auth: '/admin/config/lists', component: Config.ConfigBase },
    ],
  },

  {
    path: '/cc',
    icon: 'md-card',
    name: 'cc',
    title: '财务管理',
    component: Main,
    show: true,
    children: [
      { path: 'payment_list', title: '支付流水', name: 'payment_list', auth: '/admin/payment/lists', component: Payment.PaymentList },
      { path: 'user_withdraw_list', title: '提现申请', name: 'user_withdraw_list', auth: '/admin/userwithdraw/lists', component: User.UserWithdrawList },
      { path: 'shop_account_records_list', title: '资金记录', name: 'shop_account_records_list', auth: '/admin/shopaccountrecords/lists', component: Shop.ShopAccountRecordsList },
    ],
  },

  {
    path: '/analysis',
    icon: 'md-pie',
    name: 'analysis',
    title: '大数据看板',
    component: Main,
    show: true,
    children: [{ path: 'list', title: '大数据看板', name: 'analysis_index', auth: '/admin/analysis/index', component: Analysis.AnalysisIndex }],
  },

  {
    path: '/payment',
    icon: 'md-cash',
    name: 'payment',
    title: '支付流水',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '支付流水列表', name: 'payment_list', auth: '/admin/payment/lists', component: Payment.PaymentList }
    ],
  },
  {
    path: '/shopAccountRecords',
    icon: 'md-stats',
    name: 'shopAccountRecords',
    title: '资金记录',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '商家交易记录', name: 'shop_account_records_list', auth: '/admin/shopaccountrecords/lists', component: Shop.ShopAccountRecordsList }
    ],
  },

  // {
  //     path: '/userrecharge',
  //     icon: 'logo-yen',
  //     name: 'userrecharge',
  //     title: '充值记录',
  //     component: Main,
  //     show: true,
  //     children: [
  //         { path: 'list', title: '充值列表', name: 'user_recharge_list', auth: '/admin/userrecharge/lists', component: User.UserRechargeList },

  //         { path: 'add', title: '创建充值', show: false, name: 'user_recharge_add', auth: '/admin/userrecharge/add', component: User.UserRechargeEdit },
  //         { path: 'edit', title: '编辑充值', show: false, name: 'user_recharge_edit', auth: '/admin/userrecharge/edit', component: User.UserRechargeEdit },

  //     ]
  // },
  {
    path: '/withdraw',
    icon: 'md-swap',
    name: 'withdraw',
    title: '提现申请',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '提现申请', name: 'user_withdraw_list', auth: '/admin/userwithdraw/lists', component: User.UserWithdrawList },

      { path: 'add', title: '创建提现', show: false, name: 'user_withdraw_add', auth: '/admin/userwithdraw/add', component: User.UserWithdrawEdit },
      { path: 'edit', title: '编辑提现', show: false, name: 'user_withdraw_edit', auth: '/admin/userwithdraw/edit', component: User.UserWithdrawEdit },
    ],
  },
  {
    path: '/operator',
    icon: 'md-construct',
    name: 'device',
    title: '运营管理',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '运营人员', show: true, name: 'operator_list', auth: '/admin/operator/lists', component: Operator.OperatorList },
    ],
  },

  {
    path: '/userwhite',
    icon: 'md-cube',
    name: 'userwhite',
    title: '用户白名单',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '白名单', name: 'user_white_list', auth: '/admin/userwhite/lists', component: User.UserWhiteList },
      { path: 'add', title: '创建白名单', show: false, name: 'user_white_add', auth: '/admin/userwhite/add', component: User.UserWhiteEdit },
      { path: 'edit', title: '编辑白名单', show: false, name: 'user_white_edit', auth: '/admin/userwhite/edit', component: User.UserWhiteEdit },
    ],
  },
  {
    path: '/userblack',
    icon: 'md-cube',
    name: 'userblack',
    title: '用户黑名单',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '黑名单', name: 'user_black_list', auth: '/admin/userblack/lists', component: User.UserBlackList },
      { path: 'add', title: '创建黑名单', show: false, name: 'user_black_add', auth: '/admin/userblack/add', component: User.UserBlackEdit },
      { path: 'edit', title: '编辑黑名单', show: false, name: 'user_black_edit', auth: '/admin/userblack/edit', component: User.UserBlackEdit },
    ],
  },

  {
    path: '/userreal',
    icon: 'md-person',
    name: 'userreal',
    title: '用户实名',
    component: Main,
    show: false,
    children: [
      { path: 'list', title: '用户实名', name: 'user_real_list', auth: '/admin/userreal/lists', component: User.UserRealList },

      { path: 'add', title: '创建实名', show: false, name: 'user_real_add', auth: '/admin/userreal/add', component: User.UserRealEdit },
      { path: 'edit', title: '编辑实名', show: false, name: 'user_real_edit', auth: '/admin/userreal/edit', component: User.UserRealEdit },
    ],
  },

  {
    path: '/user/up',
    icon: 'md-person',
    name: 'user_up',
    title: '用户管理',
    component: Main,
    show: false,
    children: [{ path: 'uppassword', title: '修改密码', show: false, name: 'user_up_password', auth: '', component: User.UserEditPassword }],
  },

  {
    path: '/tool',
    icon: 'md-tool',
    name: 'tool',
    title: '工具集合',
    component: Main,
    show: false,
    children: [
      { path: 'shorturl', title: '短链接', name: 'tool_shorturl_list', auth: '/admin/shorturl/lists', icon: 'arrow-graph-up-right', component: Tool.ShorturlList },
      { path: 'upload', title: '上传文件', name: 'tool_upload_list', auth: '/admin/upload/lists', icon: 'ios-list-box', component: Tool.UploadList },

      { path: 'shorturladd', title: '创建短链接', show: false, name: 'shorturl_add', component: Tool.ShorturlEdit },
      { path: 'shorturledit', title: '编辑短链接', show: false, name: 'shorturl_edit', component: Tool.ShorturlEdit },
    ],
  },

  {
    path: '/help',
    icon: 'md-cube',
    name: 'help',
    title: '教程帮助',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '帮助列表', name: 'help_list', auth: '/admin/help/lists', component: Help.HelpList },
      { path: 'about', title: '关于内容', show: false, name: 'help_about', auth: '/admin/help/lists', component: Help.HelpAbout },
      { path: 'article', title: '文章内容', show: false, name: 'help_article', auth: '/admin/help/lists', component: Help.HelpArticle },

      { path: 'add', title: '创建帮助', show: false, name: 'help_add', auth: '/admin/help/add', component: Help.HelpEdit },
      { path: 'edit', title: '编辑帮助', show: false, name: 'help_edit', auth: '/admin/help/edit', component: Help.HelpEdit },
    ],
  },

  {
    path: '/helpclass',
    icon: 'md-cube',
    name: 'helpclass',
    title: '帮助分类',
    component: Main,
    show: false,
    children: [
      { path: 'list', title: '帮助分类列表', name: 'help_class_list', auth: '/admin/helpclass/lists', component: Help.HelpClassList },

      { path: 'add', title: '创建分类', show: false, name: 'help_class_add', auth: '/admin/helpclass/add', component: Help.HelpClassEdit },
      { path: 'edit', title: '编辑分类', show: false, name: 'help_class_edit', auth: '/admin/helpclass/edit', component: Help.HelpClassEdit },
    ],
  },
  {
    path: '/banner',
    icon: 'md-image',
    name: 'banner',
    title: '轮播广告',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '广告列表', name: 'banner_list', auth: '/admin/advert/lists', component: Banner.BannerList },

      { path: 'add', title: '创建广告', show: false, name: 'banner_add', auth: '/admin/advert/add', component: Banner.BannerEdit },
      { path: 'edit', title: '编辑广告', show: false, name: 'banner_edit', auth: '/admin/advert/edit', component: Banner.BannerEdit },
      { path: 'info', title: '广告详情', show: false, name: 'banner_info', auth: '/admin/advert/info', component: Banner.BannerInfo },
    ],
  },
  {
    path: '/notice',
    icon: 'ios-megaphone',
    name: 'notice',
    title: '系统公告',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '公告列表', name: 'notice_list', auth: '/admin/notice/lists', component: Notice.NoticeList },

      { path: 'add', title: '创建公告', show: false, name: 'notice_add', auth: '/admin/notice/add', component: Notice.NoticeEdit },
      { path: 'edit', title: '编辑公告', show: false, name: 'notice_edit', auth: '/admin/notice/edit', component: Notice.NoticeEdit },
    ],
  },

  {
    path: '/smslog',
    icon: 'md-paper-plane',
    name: 'smslog',
    title: '短信记录',
    component: Main,
    show: false,
    children: [{ path: 'list', title: '短信记录', name: 'smslog_list', auth: '/admin/smslog/lists', component: SmsLog.SmsLogList }],
  },
  {
    path: '/feedback',
    icon: 'md-mail-open',
    name: 'feedback',
    title: '反馈建议',
    component: Main,
    show: false,
    children: [
      // { path: 'list', title: '反馈列表', name: 'feedback_list', auth: '/admin/feedback/lists', component: Feedback.FeedbackList },

      { path: 'add', title: '创建反馈', show: false, name: 'feedback_add', auth: '/admin/feedback/add', component: Feedback.FeedbackEdit },
      { path: 'edit', title: '编辑反馈', show: false, name: 'feedback_edit', auth: '/admin/feedback/edit', component: Feedback.FeedbackEdit },
    ],
  },

  {
    path: '/config',
    icon: 'md-cog',
    name: 'config',
    title: '系统配置',
    component: Main,
    show: false,
    children: [
      // { path: 'base', title: '基本配置', name: 'config_name', icon: 'arrow-graph-up-right', auth: '/admin/config/lists', component: Config.ConfigBase }
    ],
  },
  // {
  //     path: '/error-page',
  //     icon: 'android-sad',
  //     title: '错误页面',
  //     name: 'errorpage',
  //     component: Main,
  //     children: [
  //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['@/views/error/error-page.vue'], resolve); } },
  //     ]
  // }
]

// 不作为Main组件的子页面展示的页面单独写，如下
export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在',
  },
  component: (resolve) => {
    require(['@/views/error/404.vue'], resolve)
  },
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足',
  },
  name: 'error-403',
  component: (resolve) => {
    require(['@//views/error/403.vue'], resolve)
  },
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误',
  },
  name: 'error-500',
  component: (resolve) => {
    require(['@/views/error/500.vue'], resolve)
  },
}

export const locking = {
  path: '/locking',
  name: 'locking',
  component: (resolve) => {
    require(['@/views/components/main/lockscreen/components/locking-page.vue'], resolve)
  },
}

Array.prototype.remove = function(val) {
  if (isNaN(val) || val > this.length) {
    return false
  }
  for (var i = 0, n = 0; i < this.length; i++) {
    if (this[i] != this[val]) {
      this[n++] = this[i]
    }
  }
  this.length -= 1
}

// 通过用户权限筛选路由  !仅处理2层路由
// 用户权限表
function _doRules(arr) {
  const rules = $data.get('auth', 'auths')
  const arr_temp = []
  const tt = _.compact(arr)
  for (let i = 0; i < tt.length; i++) {
    let item = tt[i]
    // 设置标题
    item.meta = item.meta || {}
    item.meta.title = item.meta.title || item.title || ''
    // 判断子路由
    if (item.children && item.children.length > 0) {
      item.children = _doRules(item.children)
    }
    // 判断自身
    if (true && item.auth && _.findIndex(rules, { url: item.auth }) < 0) {
      // 拒绝， 去除路由
      // console.log(item.auth, -1)
    } else {
      // 添加
      arr_temp.push(item)
    }
  }
  return arr_temp
}
// 处理appRouter、otherRouter
_appRouter = _doRules(_appRouter)
_otherRouter.children = _doRules(_otherRouter.children)
export const appRouter = _appRouter
export const otherRouter = _otherRouter
// console.log('routexxxxxxxx appRouter', appRouter);
// console.log('routexxxxxxxx otherRouter', otherRouter);

// 所有上面定义的路由都要写在下面的routers里
export const routers = [loginRouter, otherRouter, locking, ...appRouter, page500, page403, page404]
