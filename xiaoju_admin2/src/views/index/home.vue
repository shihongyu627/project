<template>
  <div class="home-main">
    <Row :gutter="10">
      <Col span="24">
        <Row type="flex" class="user-infor">
          <Col span="4">
            <Row class-name="made-child-con-middle" type="flex" align="middle">
              <img class="avator-img" :src="avatorPath" />
            </Row>
          </Col>
          <Col span="16" style="padding-left:6px;">
            <Row class-name="made-child-con-middle" type="flex" align="middle">
              <div>
                <h3 class="card-user-infor-name" v-if="shopName">{{ shopName }}</h3>
                <h3 class="card-user-infor-name" v-if="userName">{{ userName }}</h3>
                <p>上次登录时间:{{ last_login_time || '' }}</p>
              </div>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
    <AnalysisSimple></AnalysisSimple>
    <template >
      <Row v-for="(v, k) in (items||[])" :key="k">
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
    </template>
  </div>
</template>

<script>
import AnalysisSimple from '@/views/analysis/dashboard/simple'

export default {
  name: 'home',
  components: {
    AnalysisSimple: AnalysisSimple,
  },
  data() {
    return {
      simple_info: {},
      items: [
        {
          label: '产品类型',
          desc: '多样化产品介绍',
          color: '#2d8cf0',
          type: 'select',
          list: [
            { label: '平台订单', desc: '平台订单管理', url: 'order_list', icon: 'md-paper', color: '', hot: true, auth: '/admin/order/lists' },
            { label: '商家订单', desc: '商家订单管理', url: 'order_simple', icon: 'md-paper', color: '', hot: true, auth: '/admin/order/simple' },
            { label: '交易', desc: '交易管理', url: 'payment_list', icon: 'md-stats', color: '', hot: true, auth: '/admin/payment/lists' },
            { label: '分析', desc: '分析统计', url: 'analysis_index', icon: 'md-pie', color: '', hot: true, auth: '/admin/analysis/index' },
            { label: '车辆', desc: '车辆管理', url: 'device_list', icon: 'md-cube', color: '', hot: true, auth: '/admin/device/lists' },
            { label: '维修', desc: '维修管理', url: 'repair_list', icon: 'md-build', color: '', hot: true, auth: '/admin/repair/lists' },
            { label: '商家', desc: '商家管理', url: 'shop_list', icon: 'md-contacts', color: '', hot: true, auth: '/admin/shop/lists' },
          ],
        },
      ],
    }
  },
  computed: {
    userName() {
      return $utils.data.get('auth', 'uname') || ''
    },
    shopName() {
      return $utils.data.get('auth', 'shop_name') || ''
    },
    avatorPath() {
      return $utils.data.get('auth', 'avatar')
    },
    last_login_time() {
      return $utils.data.get('auth', 'last_login_time') || ''
    },
    isSystem() {
      return $utils.data.get('auth', 'is_system') || false
    },
    isAllOrder() {
      return $utils.data.get('auth', 'is_all_order') || false
    },
  },
  created() {},
  methods: {},
}
</script>
<style lang="less">
@import '../../styles/common.less';

.user-infor {
  height: 135px;
}
.avator-img {
  display: block;
  width: 80%;
  max-width: 100px;
  height: auto;
}
.card-user-infor-name {
  font-size: 1.5em;
  color: #2d8cf0;
}
.card-title {
  color: #abafbd;
}
.made-child-con-middle {
  height: 100%;
}
</style>
