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
        { label: '车辆编号', name: 'device_no', value: '', type: 'label', noshow: 'shop' },
        { label: '订单状态', name: 'status_name', value: '', type: 'label' },
        { label: '订单费用', desc: '订单的骑行费用', value: '', type: 'header' },
        { label: '总时长', name: 'time', value: '', type: 'label' },
        { label: '订单费', name: 'order_money', value: '', type: 'label', noshow: 'shop' },
        { label: '调度费', name: 'order_dispatch_money', value: '', type: 'label', noshow: 'shop' },
        { label: '超区费', name: 'order_dispatch_outrun_money', value: '', type: 'label', noshow: 'shop' },
        { label: '骑行费', name: 'order_device_money', value: '', type: 'label' },
        { label: '实支付', name: 'order_pay', value: '', type: 'label', noshow: 'shop' },
        { label: '已退款', name: 'refund_money', value: '', type: 'label', noshow: 'shop' },
        { label: '实际总消费', name: 'order_real_money', value: '', type: 'label' },
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
        { label: '结算时间', name: 'cal_time', value: '', type: 'label' },
        { label: '订单状态', name: 'status_name', value: '', type: 'label' },
        { label: '退款状态', name: 'refund_status_name', value: '', type: 'label', noshow: 'shop' },
        { label: '骑行用户', desc: '订单的骑行用户', value: '', type: 'header' },
        { label: '用户昵称', name: 'user_nick', value: '', type: 'label' },
        { label: '手机号', name: 'user_mobile', value: '', type: 'label' },
        { label: '骑行角色', name: 'uid_type_name', value: '', type: 'label' },
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
      $form.initData(this, {is_all_order: 1}, (res) => {
        if (res) {
          this.info = res
          console.log('initData info', this.info)
        }
      }, false)
    },
    initItems() {
      let ll = []
      if (this.items) {
        for (let index = 0; index < this.items.length; index++) {
          const el = this.items[index]
          // 判断商家是否显示
          if (el.noshow == 'shop') {
            // 如果是商家，则不显示
            if (!this.isAllOrder) {
              continue
            }
          }
          if (el.show == 'shop') {
            // 如果是商家，则显示，否则不显示
            if (this.isAllOrder) {
              continue
            }
          }
          ll.push(el)
        }
      }
      console.log('items', ll)
      this.items = ll
      return this.items
    },
  },
}
</script>
