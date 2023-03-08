<script>
import baseList from '@/views/components/base/baseList.vue'

export default {
  extends: baseList,
  components: {},
  props: {
    order_id: {
      type: String,
      value: '',
    },
  },
  data() {
    return {
      table: {
        mname: 'paymentRefund',
        key: 'order_id',
        url: {},
        output: false,
      },
      menus: [],
      actions: [],
      query: {},
      tableCols: [
        {
          title: '支付单编号',
          minWidth: 130,
          key: 'out_trade_no',
          align: 'center',
          copy: true,
        },
        {
          title: '交易号',
          minWidth: 150,
          key: 'trade_no',
          align: 'center',
          copy: true,
        },
        {
          title: '退款方式',
          width: 100,
          align: 'center',
          key: 'refund_ment_name',
        },
        {
          title: '退款类型',
          align: 'center',
          key: 'refund_type_name',
          width: 120,
        },
        {
          title: '退款金额',
          align: 'center',
          width: 100,
          key: 'refund_money',
        },
        {
          title: '退款描述',
          minWidth: 250,
          align: 'center',
          minWidth: 120,
          key: 'refund_text',
        },

        {
          title: '退款备注',
          minWidth: 220,
          align: 'center',
          minWidth: 120,
          key: 'refund_remark',
        },
        {
          title: '退款号',
          minWidth: 180,
          key: 'refund_no',
          align: 'center',
          copy: true,
        },
        {
          title: '退款完成时间',
          minWidth: 170,
          align: 'center',
          key: 'refund_success_time',
        },
        {
          title: '退款申请时间',
          minWidth: 170,
          align: 'center',
          key: 'create_time',
        },
      ],
    }
  },
  created() {
    let query = this.$route && this.$route.query
    if ((query && query.order_id) || this.order_id) {
      // 设置查询参数
      this.query.order_id = (query && query.order_id) || this.order_id
    }
  },
  mounted() {},
  methods: {},
}
</script>
