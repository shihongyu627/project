<script>
import baseList from '@/views/components/base/baseList.vue'
import { Poptip, Button, InputNumber, Input, Select, Option, Row, Modal } from 'view-design'
import Info from './simpleInfo.vue'
import RideRrack from './rideRrack'

export default {
  extends: baseList,
  components: {
    info: Info,
    RideRrack,
    InputNumber,
    Button,
    Poptip,
    Input,
    Select,
    Option,
    Row,
    Modal,
  },
  data() {
    return {
      table: {
        mname: 'order',
        key: 'order_id',
        url: {},
        output: false,
      },
      menus: [
        { label: '订单列表', name: 'order_list', auth: '/admin/order/lists' },
        { label: '商家订单', name: 'order_simple', auth: '/admin/order/simple' },
      ],
      actions: [],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '订单数据', 0), auth: '/admin/order/export' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '订单数据', 1), auth: '/admin/order/export' },
      ],
      query: {
        is_all_order: 0 
      },
      filters: [
        { label: '订单号', name: 'order_no', value: '', type: 'input' },
        { label: '手机号', name: 'user_mobile', value: '', type: 'input' },
        { label: '区域', name: 'store_id', value: '', type: 'select', multiple: true, dropList: [] },
        { label: '商家', name: 'shop_id', value: 1, type: 'select', multiple: false, disabled: false, dropList: [], onChange: this.shopChange.bind(this) },
        {
          label: '订单状态',
          name: 'status',
          value: '',
          type: 'select',
          dropList: [
            { value: 1, name: '骑行中' },
            { value: 10, name: '已完成' },
            { value: 0, name: '待支付' },
          ],
        },
        { label: '订单时间', name: 'start_time', value: '', type: 'datetimerange' },
      ],
      tableCols: [
        {
          type: 'selection',
          width: 60,
        },
        {
          title: '订单号',
          width: 180,
          key: 'order_no',
          copy: true,
        },
        {
          title: '所属商家',
          minWidth: 100,
          key: 'shop_name',
        },
        {
          title: '所属区域',
          minWidth: 120,
          key: 'store_name',
        },
        {
          title: '车辆类型',
          width: 125,
          key: 'device_type_name',
        },
        {
          title: '骑行位置',
          minWidth: 250,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const l1 = `起经纬度: ${row.s_lnglat || ''}`
            const l2 = `起点位置: ${row.s_address || ''}`
            const l3 = `终经纬度: ${row.e_lnglat || ''}`
            const l4 = `终点位置: ${row.e_address || ''}`
            return (
              <div onClick={() => this.toMap(row)} style={{ cursor: 'pointer', margin: '4px 0', 'font-size': '12px', 'text-align': 'left' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{l1}</div>
                <div style={{ margin: '0', color: '#ff9900' }}>{l2}</div>
                <div style={{ margin: '0', color: '#ff2200' }}>{l3}</div>
                <div style={{ margin: '0', color: '#324563' }}>{l4}</div>
              </div>
            )
          },
        },
        {
          title: '骑行时间',
          minWidth: 220,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const l1 = `开始时间: ${row.start_time || ''}`
            const l2 = `结束时间: ${row.end_time || ''}`
            const l3 = `下单时间: ${row.create_time || ''}`
            const l4 = `支付时间: ${row.pay_time || ''}`
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
          title: '骑行时长',
          minWidth: 140,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const l1 =  row.time || ' - '
            return (
              <div style={{ margin: '4px 0', 'font-size': '13px', 'text-align': 'center' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{'总时长:'}<span style="min-width:40px;display: inline-block;">{l1}</span></div>
              </div>
            )
          },
        },
        {
          title: '预付金',
          minWidth: 140,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let order_pay = row.order_pay
            const l3 = `预充值: ${order_pay}元`
            return (
              <div style={{ margin: '4px 0', 'font-size': '13px', 'text-align': 'center' }}>
                <div style={{ margin: '0', color: '#ff2200' }}>{l3}</div>
              </div>
            )
          },
        },
        // {
        //   title: '骑行费用',
        //   minWidth: 140,
        //   align: 'center',
        //   render: (h, params) => {
        //     const row = params.row
        //     let order_device_money = row.order_device_money
        //     const l3 = `骑行费用: ${order_device_money}元`
        //     return (
        //       <div style={{ margin: '4px 0', 'font-size': '13px', 'text-align': 'center' }}>
        //         <div style={{ margin: '0', color: '#19be6b' }}>{l3}</div>
        //       </div>
        //     )
        //   },
        // },
        {
          title: '骑行费用',
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            // 商家收入项
            let shop_info = row.shop || row.shop_info || {}
            let isOm = shop_info.is_cal_order_device_money  // 计算骑行费用
            let isDm = shop_info.is_cal_order_dispatch_money  // 计算非定点还车费用
            let isDOm = shop_info.is_cal_order_dispatch_outrun_money  // 计算超区调度费
            let order_device_money = row.order_device_money
            let order_dispatch_money = row.order_dispatch_money
            let order_dispatch_outrun_money = row.order_dispatch_outrun_money
            const l1 = isOm && (`骑行费用: ${order_device_money}元`)
            const l2 = isDOm && (`超区调度费: ${order_dispatch_outrun_money}元`)
            const l3 = isDm && (`非定点还车费: ${order_dispatch_money}元`)
            return (
              <div style={{ margin: '4px 0', 'font-size': '13px', 'text-align': 'center', width: '100%'}}>
                {(l1||l2||l3)?<div>
                {l1?<div style={{ margin: '0', color: '#19be6b' }}>{l1}</div>:null}
                {l2?<div style={{ margin: '0', color: '#19be6b' }}>{l2}</div>:null}
                {l3?<div style={{ margin: '0', color: '#19be6b' }}>{l3}</div>:null}
                </div>:''}
              </div>
            )
          },
        },
        {
          title: '退款费用',
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            const row = params.row
             // 商家收入项
            let shop_info = row.shop || row.shop_info || {}
            let isOm = shop_info.is_cal_order_device_money  // 计算骑行费用
            let isDm = shop_info.is_cal_order_dispatch_money  // 计算非定点还车费用
            let isDOm = shop_info.is_cal_order_dispatch_outrun_money  // 计算超区调度费
            let refund_order_device_money = row.refund_order_device_money
            let refund_order_dispatch_money = row.refund_order_dispatch_money
            let refund_order_dispatch_outrun_money = row.refund_order_dispatch_outrun_money
            const l1 = isOm && (`骑行订单退款金额: ${refund_order_device_money}元`)
            const l2 = isDOm && (`超区调度费退款金额: ${refund_order_dispatch_outrun_money}元`)
            const l3 = isDm && (`非定点还车退款金额: ${refund_order_dispatch_money}元`)
            return (
              <div style={{ margin: '4px 0', 'font-size': '13px', 'text-align': 'center', width: '100%' }}>
                {(l1||l2||l3)?<div>
                {l1?<div style={{ margin: '0', color: '#ff4400' }}>{l1}</div>:null}
                {l2?<div style={{ margin: '0', color: '#ff6600' }}>{l2}</div>:null}
                {l3?<div style={{ margin: '0', color: '#ff8800' }}>{l3}</div>:null}
                </div>:'-'}
              </div>
            )
          },
        },
        {
          title: '实际订单消费金额',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let s_order_real_money = row.s_order_real_money
            const l4 = `消费金额: ${s_order_real_money}元`
            return (
              <div style={{ margin: '4px 0', 'font-size': '13px', 'text-align': 'center' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{l4}</div>
              </div>
            )
          },
        },
        {
          title: '订单状态',
          key: 'status',
          width: 130,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let color = row.status !== 10 ? '#eee' : 'success'
            let status = row.status !== 10 ? '#eee' : 'success'
            let text = row.status_name
            if (row.status == -1) {
              color = 'processing'
              status = 'processing'
            }
            if (row.status == 0) {
              color = 'warning'
              status = 'warning'
            }
            if (row.status == 1) {
              color = 'primary'
              status = 'primary'
            }
            if (row.status == 7) {
              color = 'success'
              status = 'success'
            }
            if (row.status == 8) {
              color = 'error'
              status = 'error'
            }
            if (row.status == 9) {
              color = 'primary'
              status = 'primary'
            }
            if (row.status == 10) {
              color = 'success'
              status = 'success'
            }
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  text: text,
                  color: color,
                  status: status,
                },
              },
              text
            )
          },
        },
        {
          title: '手机号',
          key: 'user_mobile',
          minWidth: 150,
          copy: true,
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 120,
          key: 'handle',
          fixed: 'right',
          handle: ['info'],
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
    if (query.device_no) {
      // 设置查询参数
      this.device_no = query.device_no
      this.query.device_no = query.device_no
    }
    console.log('query', this.query)
  },
  mounted() {
    // 切换商家选择
    console.log('切换商家选择',this.shopId)
    if(this.shopId && (!this.isSystem)){
      this.query['shop_id'] = this.shopId
      this.filters[this.indexOfName('shop_id', this.filters)]['value'] = this.shopId
      this.filters[this.indexOfName('shop_id', this.filters)]['disabled'] = true
      this.shopChange(this.shopId)
    }
  },
  methods: {
    // 商家选择改变-设置区域下拉列表
    shopChange(val) {
      console.log(val)
      // 清空区域下拉
      this.query['store_id'] = []
      this.filters[this.indexOfName('store_id', this.filters)]['value'] = []
      this.filters[this.indexOfName('store_id', this.filters)]['dropList'] = []
      if (val) {
        this.loadFiltersFieldDrop('shop_store', 'store_id', { shop_id: val })
      }
    },
    toMap(row) {
      // 弹窗处理
      this.$Modal.info({
        title: '骑行轨迹',
        width: 720,
        render: (h) => {
          return (
            <RideRrack
              s_lnglat={row.s_lnglat}
              e_lnglat={row.e_lnglat}
              device_id={row.device_id}
              order_id={row.order_id}
              store_id={row.store_id}
              amap_trid={row.amap_trid}
              style={{ margin: '0', color: '#19be6b' }}
            ></RideRrack>
          )
        },
      })
    },
  },
}
</script>
