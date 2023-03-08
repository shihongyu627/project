<template>
  <Row v-auth="'/admin/order/lists'">
    <card-header name="数据概况" label="平台访问数据总览" color="#2d8cf0" ></card-header>
    <Col span="24">
      <Row :gutter="25">
        <!-- <Col :sm="12" :md="12" :lg="6" :xl="4">
                <box-sum title="总流水金额" :value="simple_info.payment_money_sum" label="今日" :label_v="simple_info.payment_money_day"></box-sum>
            </Col> -->
        <Col :sm="12" :md="12" :lg="6" :xl="4" v-auth="'/admin/order/lists'">
          <box-sum title="总消费金额" :value="simple_info.order_real_money_sum" label="今日" :label_v="simple_info.order_real_money_day"></box-sum>
        </Col>
        <Col :sm="12" :md="12" :lg="6" :xl="4" v-auth="'/admin/order/lists'">
          <box-sum title="总订单量" :value="simple_info.order_real_count_sum" label="今日" :label_v="simple_info.order_real_count_day"></box-sum>
        </Col>

        <Col :sm="12" :md="12" :lg="6" :xl="4" v-auth="'/admin/device/lists'">
          <box-sum
            title="车辆数"
            :value="simple_info.device_count_sum"
            label="在线/离线"
            :label_v="(simple_info.device_count_online || '-') + '/' + (simple_info.device_count_offline || '-')"
            
          ></box-sum>
        </Col>
        <Col :sm="12" :md="12" :lg="6" :xl="4" v-auth="'/admin/repair/lists'">
          <box-sum title="报修待处理" :value="simple_info.repair_nodeal_count_sum" label="今日" :label_v="simple_info.repair_nodeal_count_day"></box-sum>
        </Col>
        <Col :sm="12" :md="12" :lg="6" :xl="4" v-auth="'/admin/repair/lists'">
          <box-sum title="总报修数" :value="simple_info.repair_count_sum" label="今日" :label_v="simple_info.repair_count_day"></box-sum>
        </Col>
        <Col :sm="12" :md="12" :lg="6" :xl="4" v-auth="'/admin/shop/lists'">
          <box-sum title="商家数" :value="simple_info.shop_count_sum" label="今日" :label_v="simple_info.shop_count_day"></box-sum>
        </Col>
        <Col :sm="12" :md="12" :lg="6" :xl="4" v-auth="'/admin/shopstore/lists'">
          <box-sum title="区域数" :value="simple_info.store_count_sum" label="今日" :label_v="simple_info.store_count_day"></box-sum>
        </Col>
        <Col :sm="12" :md="12" :lg="6" :xl="4" v-auth="'/admin/user/lists'">
          <box-sum title="用户量" :value="simple_info.user_count_sum" label="今日" :label_v="simple_info.user_count_day"></box-sum>
        </Col>
        <!-- <Col :sm="12" :md="12" :lg="6" :xl="4" v-auth="'/admin/user/lists'">
          <box-sum title="总访问量" :value="simple_info.view_count_sum" label="日访问" :label_v="simple_info.view_count_day"></box-sum>
        </Col> -->
      </Row>
    </Col>
  </Row>
</template>
<script>
import BoxSum from './data/boxSum.vue'

export default {
  name: 'simple',
  components: {
    BoxSum,
  },
  data() {
    return {
      simple_info: {},
    }
  },
  computed: {
    isSystem() {
      return $utils.data.get('auth', 'is_system') || false
    },
  },
  created() {
    this.loadHomeData()
  },
  methods: {
    loadHomeData() {
      let q = {}
      $utils.api.load('analysisSimpleInfo', q).then((res) => {
        if (res.data) {
          this.simple_info = res.data
        }
      })
    },
  },
}
</script>
