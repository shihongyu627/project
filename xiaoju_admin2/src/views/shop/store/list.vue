<script>
import baseList from '@/views/components/base/baseList.vue'
import { Button } from 'view-design'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: 'shopStore',
        key: 'store_id',
        url: {},
        output: false,
      },
      currentRow: null,
      menus: [
        { label: '商家列表', name: 'shop_list', auth: '/admin/shop/lists' },
        { label: '商家区域', name: 'shop_store_list', auth: '/admin/shopstore/lists' },
      ],
      actions: [{ label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/shopstore/add' }],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '商家区域数据', 0), auth: '/admin/shopstore/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '商家区域数据', 1), auth: '/admin/shopstore/lists' },
      ],
      query: {},
      filters: [
        { label: '区域名称', name: 'store_name', value: '', type: 'input' },
        { label: '省市区', name: 'address', value: '', type: 'distpicker' },
      ],
      tableCols: [
        {
          type: 'selection',
          width: 60,
        },
        // {
        //     title: 'ID',
        //     key: 'store_id',
        //     width: 80,
        //     align: 'center',
        // },
        {
          title: '商家名称',
          key: 'shop_name',
          minWidth: 120,
          render: (h, params) => {
            const row = params.row
            const text = row.shop && row.shop.shop_name
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '区域名称',
          minWidth: 120,
          key: 'store_name',
        },
        {
          title: '区域图片',
          key: 'store_logo',
          width: 120,
          align: 'center',
          viewimage: true,
        },
        {
          title: "实际订单量",
          minWidth: 120,
          align: "center",
          key: "order_count_real",
        },
        {
          title: "车辆数量",
          minWidth: 150,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const l1 = `在线车辆: ${row.device_count_online || "-"}`;
            const l2 = `离线车辆: ${row.device_count_offline || "-"}`;
            const l3 = `骑行车辆: ${row.device_count_run || "-"}`;
            const l4 = `总计车辆: ${row.device_count || "-"}`;
            return (
              <div style={{ margin: "4px 0", "font-size": "12px", "text-align": "left" }}>
                <div style={{ margin: "0", color: "#19be6b" }}>{l1}</div>
                <div style={{ margin: "0", color: "#ff9900" }}>{l2}</div>
                <div style={{ margin: "0", color: "#ff2200" }}>{l3}</div>
                <div style={{ margin: "0", color: "#324563" }}>{l4}</div>
              </div>
            );
          },
        },
        {
          title: '省市区',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const l1 = `省份：${row.province_name || '  '}`
            const l2 = `市级：${row.city_name||''}`
            const l3 = `区县：${row.district_name||''}`
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
          title: '状态',
          align: 'center',
          key: 'status',
          width: 80,
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
          title: '强制运营状态',
          align: 'center',
          key: 'run_status',
          width: 150,
          switch: true,
          disabled: false,
        },
        {
          title: '操作',
          align: 'center',
          width: 230,
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
              let directives = [{ name: 'auth', value: '/admin/shopstorefee/lists' }]
              this.currentRow = currentRow
              return (
                <Button {...{ directives }} size="small" onClick={() => this.toFee(currentRow)} type="success" style={{ margin: '4px 5px' }}>
                  计费
                </Button>
              )
            },
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/shopstoretime/lists' }]
              this.currentRow = currentRow
              return (
                <Button {...{ directives }} size="small" onClick={() => this.toTime(currentRow)} type="success" style={{ margin: '4px 5px' }}>
                  营运
                </Button>
              )
            },
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/shopstorearea/lists' }]
              this.currentRow = currentRow
              return (
                <Button {...{ directives }} size="small" onClick={() => this.toArea(currentRow)} type="error" style={{ margin: '4px 5px' }}>
                  区域
                </Button>
              )
            },
            'edit',
            // 'sync',
            // 'del',
          ],
          auth: {
            del: '/admin/shopstore/del',
            edit: '/admin/shopstore/edit',
            sync: '/admin/shopstore/sync',
          },
        },
      ],
    }
  },
  created() {},
  methods: {
    toOrder(row) {
      let store_id = row.store_id
      console.log('toOrder', store_id)
      $utils.url.push({ name: 'order_list', query: { store_id: store_id } })
    },
    toDevice(row) {
      let store_id = row.store_id
      console.log('toDevice', store_id)
      $utils.url.push({ name: 'device_list', query: { store_id: row.store_id } })
    },
    toFee(row) {
      let store_id = row.store_id
      let title = row.store_name
      console.log('toFee', store_id)
      $utils.url.push({ name: 'shop_store_fee_list', query: { store_id: row.store_id, title: title } })
    },
    toTime(row) {
      let store_id = row.store_id
      let title = row.store_name
      console.log('toTime', store_id)
      $utils.url.push({ name: 'shop_store_time_list', query: { store_id: row.store_id, title: title } })
    },
    toArea(row) {
      let store_id = row.store_id
      let title = row.store_name
      console.log('toArea', store_id)
      $utils.url.push({ name: 'shop_store_area_list', query: { store_id: row.store_id, title: title } })
    },
    onAddressChange(val){
        console.log('onAddressChange', val)
        this.query.province_code =  val.province.code 
        this.query.city_code =  val.city.code 
        this.query.district_code =  val.area.code 
    },
  },
}
</script>
