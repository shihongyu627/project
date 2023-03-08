<script>
import dayjs from 'dayjs'
import baseList from '@/views/components/base/baseList.vue'
import { Poptip, Button } from 'view-design'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      menu_name: '',
      table: {
        mname: 'shopStoreTag',
        key: 'id',
        url: {},
        output: false,
        order: 'id desc',
      },
      menus: [{ label: '排除标记', name: 'shop_store_tag_list', auth: '/admin/shopstoretag/lists' }],
      actions: [{ label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/shopstoretag/add' }],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '车辆排除标记数据', 0), auth: '/admin/shopstoretag/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '车辆排除标记数据', 1), auth: '/admin/shopstoretag/lists' },
      ],
      query: {},
      filters: [
        { label: '车辆编号', name: 'device_no', value: '', type: 'input' },
        { label: '区域', name: 'store_id', value: '', type: 'select', dropList: [] },
        { label: '商家', name: 'shop_id', value: '', type: 'select', dropList: [], onChange: this.shopChange.bind(this) },
        { label: '产品', name: 'product_id', value: '', type: 'select', dropList: [] },
      ],
      tableCols: [
        {
          type: 'selection',
          width: 60,
        },
        { title: 'ID', key: 'id', width: 80, align: 'center' },
        { title: '类型', key: 'type_name', minWidth: 120 },
        { title: '车辆编号', key: 'device_no', minWidth: 150 },
        { title: '车辆型号', key: 'product_name', minWidth: 150 },
        { title: '关联商家', key: 'shop_name', minWidth: 150 },
        { title: '关联区域', key: 'store_name', minWidth: 150 },
        { title: '开始时间', align: 'center', key: 'start_time', width: 170 },
        {
          title: '结束时间',
          align: 'center',
          key: 'end_time',
          width: 170,
          render: (h, params) => {
            const row = params.row
            const text = row.end_time
            if (!text) {
              return text
            }
            let isBefore = false
            // 判断是否已经过期
            if (dayjs(text).isBefore(dayjs())) {
              isBefore = true
            }
            return <span style={{ 'font-size': '14px', color: isBefore ? 'red' : 'green' }}>{text}</span>
          },
        },
        // { title: '状态', align: 'center', key: 'status', width: 80, switch: true, disabled: false },
        {
          title: '状态',
          align: 'center',
          key: 'is_close',
          fixed: 'right',
          width: 100,
          render: (h, params) => {
            const row = params.row
            const text = row.is_close ? '关闭' : '开启'
            return <span style={{ 'font-size': '14px', color: row.is_close ? 'red' : 'green' }}>{text}</span>
          },
        },
        { title: '创建时间', align: 'center', key: 'create_time', width: 170 },
        { title: '关闭时间', align: 'center', key: 'close_time', width: 170 },
        {
          title: '操作',
          align: 'right',
          width: 150,
          key: 'handle',
          fixed: 'right',
          handle: [
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/shopstoretag/edit' }]
              let isshow = currentRow.is_close ? false : true
              this.currentRow = currentRow
              return isshow ? (
                <Poptip {...{ directives }} confirm={true} title="关闭后该标记则直接结束不可修改，确认关闭？" {...{ on: { 'on-ok': () => this.toClose(currentRow.id) } }}>
                  <Button {...{ directives }} type="error" size="small" style={{ margin: '4px 5px' }}>
                    关闭
                  </Button>
                </Poptip>
              ) : null
            },
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/shopstoretag/edit' }]
              let isshow = currentRow.is_close ? false : true
              this.currentRow = currentRow
              return isshow ? (
                <Button {...{ directives }} size="small" onClick={() => this.toEdit(currentRow)} type="primary" style={{ margin: '4px 5px' }}>
                  编辑
                </Button>
              ) : null
            },
          ],
        },
      ],
    }
  },
  async created() {
    let query = this.$route.query
    await this.loadFiltersFieldDrop('product', 'product_id')
    await this.loadFiltersFieldDrop('shop', 'shop_id')
    if (query.product_id) {
      // 设置查询参数
      this.product_id = query.product_id
      this.query.product_id = query.product_id
    }
    if (query.shop_id) {
      // 设置查询参数
      this.shop_id = query.shop_id
      this.query.shop_id = query.shop_id
    }
    if (query.store_id) {
      // 设置查询参数
      this.store_id = query.store_id
      this.query.store_id = query.store_id
    }
    console.log('query', this.query)
  },
  methods: {
    // 商家选择改变-设置区域下拉列表
    shopChange(val) {
      console.log(val)
      this.loadFiltersFieldDrop('shop_store', 'store_id', { shop_id: val })
    },
    toEdit(row) {
      let id = row.id
      $utils.url.push({ name: 'shop_store_tag_edit', query: { action: 'edit', kv: id } })
    },
    toClose(id) {
      let d = {}
      d.kv = id
      $utils.api.load('shopStoreTagClose', d, 'post', { toast: true, toasterror: true })
      setTimeout(() => {
        this.search()
      }, 500)
    },
  },
}
</script>
