<template>
  <div>
    <Row v-for="(v, k) in items" :key="k">
      <Col span="24">
        <card-header :name="v.label" :label="v.desc" :color="v.color"></card-header>
        <template v-for="(vv, kk) in v.list">
          <card-box
            v-auth="'' + vv.auth"
            :key="kk"
            :name="vv.label"
            :label="vv.desc"
            :url="vv.url"
            :icon="vv.icon"
            :color="vv.color || v.color"
            :hot="vv.hot === true ? 'Hot' : vv.hot ? vv.hot : ''"
          ></card-box>
        </template>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      index: 1,
      items: [
        {
          label: '产品类型',
          desc: '多样化产品介绍',
          color: '#2d8cf0',
          type: 'select',
          list: [
            { label: '订单管理', desc: '订单管理', url: 'order_list', icon: 'md-paper', color: '', hot: true, auth: '/admin/order/lists' },
            { label: '商家订单', desc: '商家订单', url: 'order_simple', icon: 'md-paper', color: '', hot: true, auth: '/admin/order/simple' },
            { label: '商家管理', desc: '商家管理', url: 'shop_list', icon: 'md-contacts', color: '', hot: true, auth: '/admin/shop/lists' },
            { label: '产品管理', desc: '产品管理', url: 'product_list', icon: 'md-bulb', color: '', hot: true, auth: '/admin/product/lists' },
            { label: '车辆管理', desc: '车辆管理', url: 'device_list', icon: 'md-cube', color: '', hot: true, auth: '/admin/device/lists' },
            { label: '报修管理', desc: '报修管理', url: 'repair_list', icon: 'md-build', color: '', hot: true, auth: '/admin/repair/lists' },
            { label: '运营管理', desc: '运营管理', url: 'operator_list', icon: 'md-construct', color: '', hot: true, auth: '/admin/operator/lists' },
          ],
        },
        {
          label: '数据资产',
          desc: '关联数据管理',
          color: '#2fce63',
          type: 'select',
          list: [
            { label: '数据统计', desc: '统计分析中心', url: 'analysis_index', icon: 'md-pie', color: '', hot: false, auth: '/admin/analysis/index' },
            { label: '交易记录', desc: '交易记录中心', url: 'payment_list', icon: 'ios-stats', color: '', hot: false, auth: '/admin/payment/lists' },
            { label: '提现申请', desc: '提现申请中心', url: 'user_widthdraw_list', icon: 'md-swap', color: '', hot: false, auth: '/admin/userwidthdraw/lists' },
            // {label: '充值', desc: '充值管理中心', url: 'user_recharge_list', icon: 'logo-yen', color: '', hot: false, auth: '/admin/userrecharge/lists'},
            { label: '用户数据', desc: '用户分析中心', url: 'user_list', icon: 'ios-person', color: '', hot: false, auth: '/admin/user/lists' },
          ],
        },
        {
          label: '营销功能',
          desc: '加速内容变现',
          color: '#fb6161',
          type: 'select',
          list: [
            { label: '系统公告', desc: '公告通知', url: 'notice_list', icon: 'md-barcode', color: '', hot: false, auth: '/admin/notice/lists' },
            { label: '轮播广告', desc: '广告轮播图Banner', url: 'banner_list', icon: 'md-barcode', color: '', hot: false, auth: '/admin/advert/lists' },
            // {label: '短信记录', desc: '短信发送记录', url: 'smslog_list', icon: 'md-paper-plane', color: '', hot: false, auth: '/admin/smslog/lists'},
          ],
        },
        {
          label: '工具集合',
          desc: '通用工具提高传播效率',
          color: '#c0aa6d',
          type: 'select',
          list: [
            { label: '上传管理', desc: '上传文件管理中心', url: 'tool_upload_list', icon: 'md-phone-portrait', color: '', hot: false, auth: '/admin/upload/lists' },
            // { label: '短链接', desc: '长链接进行压缩', url: 'tool_shorturl_list', icon: 'md-swap', color: '', hot: 'Beta', auth: '/admin/shorturl/lists' },
          ],
        },
        {
          label: '权限控制',
          desc: '分配权限/添加管理员',
          color: '#f60',
          type: 'select',
          list: [
            { label: '管理员', desc: '分配子账户', url: 'auth_access_list', icon: 'md-person', color: '', hot: false, auth: '/admin/authaccess/lists' },
            { label: '权限组', desc: '不同权限用户组理', url: 'auth_group_list', icon: 'md-people', color: '', hot: false, auth: '/admin/authgroup/lists' },
            { label: '权限规则', desc: '所有权限列表', url: 'auth_rule_main', icon: 'md-lock', color: '', hot: false, auth: '/admin/authrule/lists' },
          ],
        },
      ],
    }
  },
  created() {},
  methods: {},
}
</script>
<<style lang="less" scoped></style>
