<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: 'shopAccountRecords',
        key: 'id',
        url: {},
        output: false,
      },
      menus: [],
      actions: [],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '资金记录', 0), auth: '/admin/shopaccountrecords/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '资金记录', 1), auth: '/admin/shopaccountrecords/lists' },
      ],
      query: {
        uid: '',
      },
      filters: [
        { label: '交易时间', name: 'create_time', value: '', type: 'datetimerange' },
        {
          label: '交易场景',
          name: 'from_type',
          value: '',
          multiple: true,
          type: 'select',
          dropList: [
            { value: 1, name: '订单支付' },
            { value: 2, name: '订单退还' },
            { value: 8, name: '提现' },
            { value: 9, name: '提现退还' },
            { value: 16, name: '订单结算' },
            { value: 17, name: '订单结算退还' },
          ],
        },
      ],
      tableCols: [
        {
          type: 'selection',
          width: 60,
        },
        {
          title: '商家',
          key: 'shop',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            const row = params.row
            const text = row.shop && row.shop.shop_name
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '账户类型',
          key: 'account_type',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let text = row.account_type_name
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '交易场景',
          key: 'from_type',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.from_type_name
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '交易金额',
          key: 'number',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            const row = params.row
            const text = row.number + '元'
            return <span style={{ color: row.number > 0 ? 'green' : 'red', 'font-weight': 'bold', 'font-size': '14px' }}>{text}</span>
          },
        },
        { title: '交易内容', key: 'text', minWidth: 180 },
        { title: '创建时间', align: 'center', key: 'create_time', width: 170 },
      ],
    }
  },
  created() {
    let query = this.$route.query
    this.title = query.title
    // 设置查询参数
    this.query.shop_id = query.shop_id
  },
  methods: {},
}
</script>
