<script>
import baseList from '@/views/components/base/baseList.vue'
import { Tag, Button } from 'view-design'
import Info from './info.vue'
export default {
  extends: baseList,
  components: {
    info: Info,
  },
  data() {
    return {
      table: {
        mname: 'deviceTagsRecord',
        key: 'id',
        url: {},
        output: false,
      },
      content: '',
      row: '',
      actions: [
        // {
        //   label: '新增',
        //   icon: 'md-add',
        //   onClick: this.toAdd,
        //   auth: '/admin/exception/add',
        // },
      ],
      query: {},
      menus: [
        { label: '用户报障车辆', name: 'repair_list', auth: '/admin/repair/lists' },
        { label: '异常车辆', name: 'exception_list', auth: '/admin/exception/lists' },
      ],
      filters: [
        {
          label: '异常信息',
          name: 'tags',
          value: '',
          type: 'select',
          dropList: [
            { value: '0电车', name: '0电车' },
            { value: '未关锁', name: '未关锁' },
            { value: '损坏', name: '损坏' },
            { value: '失联', name: '失联' },
            { value: '无法骑行', name: '无法骑行' },
            { value: '超出运营区', name: '超出运营区' },
            { value: '长期未骑行', name: '长期未骑行' },
            { value: '电量不足', name: '电量不足' },
            { value: '小电池电量低', name: '小电池电量低' },
          ],
        },
        { label: '异常内容', name: 'content', value: '', type: 'input' },
        { label: '车辆编号', name: 'device_no', value: '', type: 'input' },
        { label: '区域', name: 'store_id', value: '', type: 'select', dropList: [] },
        { label: '商家', name: 'shop_id', value: '', type: 'select', dropList: [], onChange: this.shopChange.bind(this) },
      ],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '异常车辆', 0), auth: '/admin/device/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '异常车辆', 1), auth: '/admin/device/lists' },
      ],
      reply_content: '',
      tableCols: [
        {
          type: 'selection',
          width: 60,
        },
        {
            title: 'ID',
            key: 'id',
            width: 80,
            align: 'center',
            // sortable: 'custom'
        },
        {
          title: '异常信息',
          key: 'tags',
          minWidth: 150,
          render: (h, params) => {
            const row = params.row
            const text = row.tags || ''
            const t_arr = text.split(',') || []
            return t_arr.map((item) => <Tag color="red">{item}</Tag>)
          },
        },
        {
          title: '异常内容',
          key: 'content',
          minWidth: 150,
          render: (h, params) => {
            const row = params.row
            const text = row.content
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '异常地点',
          minWidth: 120,
          key: 'device_address',
          render: (h, params) => {
            const row = params.row
            const text = row.address_info
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        // {
        //   title: '截图',
        //   key: 'gallery',
        //   minWidth: 120,
        //   align: 'center',
        //   viewimages: true,
        // },
        // {
        //     title: '设备号',
        //     minWidth: 100,
        //     key: 'device',
        //     render: (h, params) => {
        //         const row = params.row;
        //         const text = row.device && row.device.imei
        //         return h('span', {
        //             style: {
        //                 'font-size': '14px'
        //             }
        //         }, text);
        //     }
        // },
        {
          title: '车辆编号',
          minWidth: 120,
          align: 'center',
          key: 'device_no',
          copy: true,
        },
        {
          title: '车辆二维码',
          key: 'qrcode_img',
          width: 120,
          align: 'center',
          viewimage: true,
        },
        {
          title: '提交者',
          key: 'user',
          align: 'center',
          width: 120,
          render: (h, params) => {
            const row = params.row
            const text = row.user && row.user.user_nick
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '提交时间',
          align: 'center',
          key: 'create_time',
          width: 170,
        },
        {
          title: '商家名称',
          minWidth: 100,
          key: 'shop_name',
          render: (h, params) => {
            const row = params.row
            const text = row.shop_name
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '投放区域',
          minWidth: 120,
          key: 'store_name',
          render: (h, params) => {
            const row = params.row
            const text = row.store_name
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          key: 'handle',
          fixed: 'right',
          handle: ['info', 'del'],
        },
      ],
    }
  },
    async created() {
    let query = this.$route.query
    await this.loadFiltersFieldDrop('shop', 'shop_id')
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
  },
}
</script>
