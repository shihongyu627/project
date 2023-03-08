<script>
import baseList from '@/views/components/base/baseList.vue'
import { Button } from 'view-design'
import Clipboard from 'clipboard'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: 'shop',
        key: 'shop_id',
        url: {},
        output: false,
      },
      menus: [
        { label: '商家列表', name: 'shop_list', auth: '/admin/shop/lists' },
        { label: '商家区域', name: 'shop_store_list', auth: '/admin/shopstore/lists' },
      ],
      actions: [{ label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/shop/add' }],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '商家数据', 0), auth: '/admin/shop/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '商家数据', 1), auth: '/admin/shop/lists' },
      ],
      query: {
        is_del: 0,
      },
      currentRow: null,
      filters: [
        { label: '商家名', name: 'shop_name', value: '', type: 'input' },
        { label: '省市区', name: 'address', value: '', type: 'distpicker' },
      ],
      tableCols: [
        {
          type: 'selection',
          width: 60,
        },
        // {
        //     title: 'ID',
        //     key: 'shop_id',
        //     width: 80,
        //     align: 'center',
        //     sortable: 'custom'
        // },
        {
          title: '商家名称',
          minWidth: 140,
          key: 'shop_name',
        },
        {
          title: '商家LOGO',
          key: 'shop_logo',
          width: 130,
          align: 'center',
          viewimage: true,
        },
        {
          title: '区域数',
          minWidth: 90,
          align: 'center',
          key: 'store_count',
        },
        {
          title: '实际订单量',
          minWidth: 120,
          align: 'center',
          key: 'order_count_real',
        },
        {
          title: '车辆数量',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const l1 = `在线车辆: ${row.device_count_online || '-'}`
            const l2 = `离线车辆: ${row.device_count_offline || '-'}`
            const l3 = `骑行车辆: ${row.device_count_run || '-'}`
            const l4 = `总计车辆: ${row.device_count || '-'}`
            return (
              <div style={{ margin: '4px 0', 'font-size': '12px', 'text-align': 'left' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{l1}</div>
                <div style={{ margin: '0', color: '#ff9900' }}>{l2}</div>
                <div style={{ margin: '0', color: '#ff2200' }}>{l3}</div>
                <div style={{ margin: '0', color: '#324563' }}>{l4}</div>
              </div>
            )
          },
        },
        {
          title: '省市区',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const l1 = `省份：${row.province_name || '  '}`
            const l2 = `市级：${row.city_name || ''}`
            const l3 = `区县：${row.district_name || ''}`
            return (
              <div style={{ margin: '4px 0', 'font-size': '12px', 'text-align': 'left' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{l1}</div>
                <div style={{ margin: '0', color: '#ff9900' }}>{l2}</div>
                <div style={{ margin: '0', color: '#ff2200' }}>{l3}</div>
              </div>
            )
          },
        },
        {
          title: '收入比例',
          minWidth: 110,
          align: 'center',
          key: 'income_scale',
        },
        // {
        //   title: '余额',
        //   minWidth: 100,
        //   align: 'center',
        //   key: 'user_balance',
        // },
        {
          title: '联系人',
          minWidth: 180,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const l1 = `联系人: ${row.linkman_name || ''}`
            const l2 = `联系电话: ${row.linkman_mobile || ''}`
            return (
              <div style={{ margin: '2px 0', 'font-size': '13px', 'text-align': 'left' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{l1}</div>
                <div style={{ margin: '0', color: '#ff9900' }}>{l2}</div>
              </div>
            )
          },
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 80,
          fixed: 'right',
          switch: true,
          disabled: false,
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'create_time',
          width: 170,
        },
        {
          title: '收入包含骑行费用',
          align: 'center',
          key: 'is_cal_order_device_money',
          minWidth: 120,
          switch: true,
          disabled: true,
        },
        {
          title: '收入包含非定点还车费',
          align: 'center',
          key: 'is_cal_order_dispatch_money',
          minWidth: 120,
          switch: true,
          disabled: true,
        },
        {
          title: '收入包含超区调度费',
          align: 'center',
          key: 'is_cal_order_dispatch_outrun_money',
          minWidth: 120,
          switch: true,
          disabled: true,
        },
        {
          title: '操作',
          align: 'center',
          width: 190,
          key: 'handle',
          fixed: 'right',
          handle: [
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/order/lists' }]
              this.currentRow = currentRow
              return (
                <Button {...{ directives }} size="small" onClick={() => this.toOrder(currentRow)} type="warning" style={{ margin: '4px 5px' }}>
                  订单
                </Button>
              )
            },
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/device/lists' }]
              this.currentRow = currentRow
              return (
                <Button {...{ directives }} size="small" onClick={() => this.toDevice(currentRow)} type="info" style={{ margin: '4px 5px' }}>
                  车辆
                </Button>
              )
            },
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/userAccountRecords/lists' }]
              this.currentRow = currentRow
              return (
                <Button {...{ directives }} size="small" onClick={() => this.toRecords(currentRow)} type="warning" style={{ margin: '4px 5px' }}>
                  交易
                </Button>
              )
            },
            'edit',
            'sync',
            // "delete",
          ],
          auth: {
            del: '/admin/shop/del',
            edit: '/admin/shop/edit',
            sync: '/admin/shop/sync',
          },
        },
      ],
    }
  },
  created() {},

  methods: {
    toRecords(row) {
      let title = row.shop_name
      let uid = row.uid
      $utils.url.push({ name: 'user_account_records_list', query: { uid: uid, title: title } })
    },
    toOrder(row) {
      let shop_id = row.shop_id
      $utils.url.push({ name: 'order_list', query: { shop_id: shop_id } })
    },
    toDevice(row) {
      let shop_id = row.shop_id
      $utils.url.push({ name: 'device_list', query: { shop_id: row.shop_id } })
    },
    onAddressChange(val) {
      console.log('onAddressChange', val)
      this.query.province_code = val.province.code || ''
      this.query.city_code = val.city.code || ''
      this.query.district_code = val.area.code || ''
    },
  },
}
</script>
