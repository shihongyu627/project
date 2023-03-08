<script>
import baseInfo from '@/views/components/base/baseInfo.vue'
export default {
  extends: baseInfo,
  components: {},
  data() {
    return {
      mname: 'order',
      items: [
        { label: '订单数据', desc: '订单的基本信息', type: 'header' },
        { label: '订单编号', name: 'order_no', value: '', type: 'label' },
        { label: '流水号', name: 'out_trade_no', value: '', type: 'label' },
        { label: '所属商家', name: 'shop_name', value: '', type: 'label' },
        { label: '所属区域', name: 'store_name', value: '', type: 'label' },
        { label: '订单状态', name: 'status_name', value: '', type: 'label' },
        { label: '订单费用', desc: '订单的骑行费用', value: '', type: 'header' },
        { label: '骑行时长', name: 'time', value: '', type: 'label' },
        { label: '骑行费金额', name: 'order_device_money', value: '', type: 'label' },
        { label: '骑行费退款', name: 'refund_order_device_money', value: '', type: 'label' },
        { label: '订单消费金额', name: 's_order_real_money', value: '', type: 'label' },
        { label: '骑行位置', desc: '订单的骑行位置', value: '', type: 'header' },
        { label: '起经纬度', name: 's_lnglat', value: '', type: 'label' },
        { label: '起点位置', name: 's_address', value: '', type: 'label' },
        { label: '终经纬度', name: 'e_lnglat', value: '', type: 'label' },
        { label: '终点位置', name: 'e_address', value: '', type: 'label' },
        { label: '骑行时间', desc: '订单的骑行时间', value: '', type: 'header' },
        { label: '开始时间', name: 'start_time', value: '', type: 'label' },
        { label: '结束时间', name: 'end_time', value: '', type: 'label' },
        { label: '下单时间', name: 'create_time', value: '', type: 'label' },
        { label: '支付时间', name: 'pay_time', value: '', type: 'label' },
        { label: '订单状态', name: 'status_name', value: '', type: 'label' },
        { label: '骑行用户', desc: '订单的骑行用户', value: '', type: 'header' },
        { label: '手机号', name: 'user_mobile', value: '', type: 'label' },
      ],
      info: {},
    }
  },
  computed: {},
  created() {},
  methods: {
    initData(kv) {
      this.initItems()
      // 加载详情数据
      this.info = {}
      $form.initData(this, {is_all_order: 0}, (res) => {
        if (res) {
          this.info = res
          console.log('initData info', this.info)
        }
      }, false)
    },
  },
}
</script>
