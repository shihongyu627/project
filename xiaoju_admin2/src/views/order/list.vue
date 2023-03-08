<script>
import baseList from '@/views/components/base/baseList.vue'
import { Poptip, Button, InputNumber, Input, Select, Option,Row,Modal } from 'view-design'
import Info from './info.vue'
import RideRrack from './rideRrack'
import RefundRecord from './refund'

export default {
  extends: baseList,
  components: {
    info: Info,
    RideRrack,
    RefundRecord,
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
      actions: [
        // {label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/order/add'},
      ],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '订单数据', 0), auth: '/admin/order/export' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '订单数据', 1), auth: '/admin/order/export' },
      ],
      query: {
        is_all_order: 1
      },
      filters: [
        { label: '订单号', name: 'order_no', value: '', type: 'input' },
        { label: '车辆编号', name: 'device_no', value: '', type: 'input', noshow: 'shop' },
        { label: '用户昵称', name: 'user_nick', value: '', type: 'input', noshow: 'shop' },
        { label: '手机号', name: 'user_mobile', value: '', type: 'input' },
        // { label: '区域名称', name: 'store_name', value: '', type: 'input', noshow: 'shop' },
        { label: '区域', name: 'store_id', value: '', type: 'select', multiple: true, dropList: [] },
        { label: '商家', name: 'shop_id', value: '', type: 'select', multiple: false, dropList: [], onChange: this.shopChange.bind(this) },
        { label: '车辆类型', name: 'device_type', value: '', type: 'select', dropList: [
          { value: 1, name: '单车常规款' },
          { value: 3, name: '单车智能款' },
          { value: 2, name: '电动车智能款' },
        ], noshow: 'shop' },
        { label: '产品', name: 'product_id', value: '', type: 'select', dropList: [], noshow: 'shop' },
        {
          label: '用车角色',
          name: 'uid_type',
          value: '',
          type: 'select',
          noshow: 'shop',
          dropList: [
            { value: 1, name: '普通用户' },
            { value: 5, name: '运营人员' },
            { value: 10, name: '白名单用户' },
          ],
        },
        {
          label: '退款状态',
          name: 'refund_status',
          value: '',
          type: 'select',
          noshow: 'shop',
          dropList: [
            { value: 1, name: '已退款' },
            { value: 5, name: '退款中' },
            { value: 0, name: '未退款' },
            { value: 10, name: '无需退款' },
          ],
        },
        {
          label: '支付状态',
          name: 'pay_status',
          value: '',
          type: 'select',
          noshow: 'shop',
          dropList: [
            { value: 1, name: '已支付' },
            { value: 0, name: '未支付' },
          ],
        },
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
        { label: '省市区', name: 'address', value: '', type: 'distpicker', noshow: 'shop' },
      ],
      tableColsV: [
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
          title: '车辆编号',
          minWidth: 100,
          align: 'center',
          key: 'device_no',
          copy: true,
          noshow: 'shop',
        },
        {
          title: '车辆类型',
          width: 125,
          align: 'left',
          key: 'device_type_name',
        },
        {
          title: '骑行费用',
          minWidth: 155,
          align: 'center',
          noshow: 'shop',
          render: (h, params) => {
            const row = params.row
            const l1 = `总骑行时长: ${row.time || ' - '}`
            const l3 = `骑行订单费: ${parseFloat(row.order_device_money).toFixed(2)}元`
            const l4 = `非定点还车: ${parseFloat(row.order_dispatch_money).toFixed(2)}元`
            const l41 =`超区调度费: ${parseFloat(row.order_dispatch_outrun_money).toFixed(2)}元`
            const l5 = `总骑行消费: ${parseFloat(row.order_money).toFixed(2)}元`
            return (
              <div style={{ margin: '4px 0', 'font-size': '12px', 'text-align': 'left' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{l1}</div>
                <div style={{ margin: '0', color: '#ff2200' }}>{l3}</div>
                <div style={{ margin: '0', color: '#324563' }}>{l4}</div>
                <div style={{ margin: '0', color: '#304563' }}>{l41}</div>
                <div style={{ margin: '0', color: '#19be6b' }}>{l5}</div>
              </div>
            )
          },
        },
        {
          title: '退款费用',
          minWidth: 200,
          align: 'center',
          noshow: 'shop',
          render: (h, params) => {
            const row = params.row
            const l1 = `预付款退款金额: ${parseFloat(row.refund_order_pay).toFixed(2)}`
            const l2 = `骑行订单退款金额: ${parseFloat(row.refund_order_device_money).toFixed(2)}元`
            const l3 = `非定点还车退款金额: ${parseFloat(row.refund_order_dispatch_money).toFixed(2)}元`
            const l4 = `超区调度费退款金额: ${parseFloat(row.refund_order_dispatch_outrun_money).toFixed(2)}元`
            const l5 = `总退款金额: ${parseFloat(row.refund_money).toFixed(2)}元`
            return (
              <div style={{ margin: '4px 0', 'font-size': '12px', 'text-align': 'left' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{l1}</div>
                <div style={{ margin: '0', color: '#ff9900' }}>{l2}</div>
                <div style={{ margin: '0', color: '#ff2200' }}>{l3}</div>
                <div style={{ margin: '0', color: '#324563' }}>{l4}</div>
                <div style={{ margin: '0', color: '#19be6b' }}>{l5}</div>
              </div>
            )
          },
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
          title: '支付费用',
          minWidth: 200,
          align: 'center',
          noshow: 'shop',
          render: (h, params) => {
            const row = params.row
            const l1 = `预付金: ${parseFloat(row.order_pay).toFixed(2)}元`
            const l2 = `实际订单总消费金额: ${parseFloat(row.order_real_money).toFixed(2)}元`
            const l3 = `订单超额费: ${parseFloat(row.order_money_out).toFixed(2)}元`
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
          title: '退款状态',
          key: 'refund_status',
          width: 130,
          align: 'center',
          noshow: 'shop',
          render: (h, params) => {
            const row = params.row
            let color = row.refund_status !== 10 ? '#eee' : 'success'
            let status = row.refund_status !== 10 ? '#eee' : 'success'
            let text = row.refund_status_name
            if (row.status == 0) {
              color = 'warning'
              status = 'warning'
            }
            if (row.status == 5) {
              color = 'primary'
              status = 'primary'
            }
            if (row.status == 1) {
              color = 'success'
              status = 'success'
            }
            if (row.order_pay <= 0) {
              text = '无需退款'
              color = '#eee'
              status = '#eee'
            }
            if((row.refund_status == 1) && (row.refund_money == 0)) {
              text = '无需退款'
              color = '#eee'
              status = '#eee'
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
          title: '骑行用户',
          key: 'user_nick',
          width: 140,
          noshow: 'shop',
        },
        {
          title: '手机号',
          key: 'user_mobile',
          minWidth: 150,
          copy: true,
        },
        {
          title: '骑行角色',
          key: 'uid_type_name',
          width: 120,
          noshow: 'shop',
        },
        {
          title: '计费规则',
          minWidth: 130,
          align: 'center',
          noshow: 'shop',
          render: (h, params) => {
            const row = params.row
            let fee_rule = row.fee_rule || {}
            if (!fee_rule) {
              return ''
            }
            const l0 = `容错时长: ${fee_rule.min_free}分`
            const l1 = `起步时长: ${fee_rule.min_base}分`
            const l2 = `起步价格: ${fee_rule.fee_base}元`
            const l3 = `阶梯时长: ${fee_rule.min_next}分`
            const l4 = `阶梯价格: ${fee_rule.fee_next_min}元`
            const l5 = `调度费用: ${fee_rule.fee_dispatch}元`
            const l6 = `超区费用: ${fee_rule.fee_dispatch_outrun}元`
            return (
              <div style={{ margin: '4px 0', 'font-size': '12px', 'text-align': 'left' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{l0}</div>
                <div style={{ margin: '0', color: '#19be6b' }}>{l1}</div>
                <div style={{ margin: '0', color: '#ff9900' }}>{l2}</div>
                <div style={{ margin: '0', color: '#ff2200' }}>{l3}</div>
                <div style={{ margin: '0', color: '#324563' }}>{l4}</div>
                <div style={{ margin: '0', color: '#324563' }}>{l5}</div>
                <div style={{ margin: '0', color: '#324563' }}>{l6}</div>
              </div>
            )
          },
        },
        {
          title: '省市区',
          minWidth: 150,
          align: 'center',
          noshow: 'shop',
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
          title: '退款操作',
          align: 'center',
          minWidth: 120,
          key: 'handle',
          fixed: 'right',
          noshow: 'shop',
          handle: [
            (vm, h, currentRow, param) => {
              let isshow = currentRow.status == 1 ? true : false
              let directives = [{ name: 'auth', value: '/admin/order/end' }]
              return isshow ? (
                <Poptip {...{ directives }} confirm={true} title="确认结束订单吗？请先检查车已关锁" {...{ on: { 'on-ok': () => this.orderComplete(currentRow.order_id) } }}>
                  <Button {...{ directives }} type="error" size="small" style={{ margin: '4px 5px' }}>
                    结束订单
                  </Button>
                </Poptip>
              ) : null
            },
            (vm, h, currentRow, param) => {
              let isshow = currentRow.refund_status == 0 && currentRow.status == 10 && currentRow.order_pay > 0 ? true : false
              let directives = [{ name: 'auth', value: '/admin/order/refund' }]
              return isshow ? (
                <Poptip {...{ directives }} confirm={true} title="确认进行订单退款？" {...{ on: { 'on-ok': () => this.orderRefund(currentRow.order_id) } }}>
                  <Button {...{ directives }} type="error" size="small" style={{ margin: '4px 5px' }}>
                    订单退款
                  </Button>
                </Poptip>
              ) : null
            },
            (vm, h, currentRow, param) => {
              // 超过7天不显示退款
              let tover = $utils.time.timestamp(currentRow.start_time) > (Date.parse(new Date()) / 1000) * 7 * 24 * 60 * 60 ? true : false
              let isshow = !tover && currentRow.refund_status == 1 && currentRow.status == 10 && currentRow.order_pay > 0 && currentRow.order_pay > currentRow.refund_money ? true : false
              let directives = [{ name: 'auth', value: '/admin/order/linerefund' }]
              return isshow ? (
                <Button {...{ directives }} type="error" size="small" onClick={this.orderRefundLine.bind(this, currentRow)} style={{ margin: '4px 5px' }}>
                  再次退款
                </Button>
              ) : null
            },
            (vm, h, currentRow, param) => {
              let isshow = currentRow.status == 10 ? true : false
              return isshow ? (
                <Button type="success" size="small" onClick={this.lookRecord.bind(this, currentRow)} style={{ margin: '4px 5px' }}>
                  退款记录
                </Button>
              ) : null
            },
          ],
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
  computed: {
    tableCols() {
      let ll = []
      if (this.tableColsV) {
        for (let index = 0; index < this.tableColsV.length; index++) {
          const el = this.tableColsV[index]
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
      console.log('tableCols', ll)
      return ll
    },
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
    delete this.tableCols
    this.initFilters()
  },
  methods: {
    initFilters() {
      let ll = []
      console.log('filters', this.filters)
      if (this.filters) {
        for (let index = 0; index < this.filters.length; index++) {
          const el = this.filters[index]
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
      console.log('filters', ll)
      this.filters = ll
      this.$forceUpdate()
    },
    lookRecord(row) {
      console.log(row)
      // $utils.url.push({ name: 'order_refund', query: { order_id: row.order_id } })
      let vvvv = ''
      let aaaa = ''
      this.$Modal.info({
        title: '订单退款记录',
        width: '900px',
        render: (h) => {
          return <RefundRecord style={{ margin: '0', color: '#19be6b' }} order_id={row.order_id}></RefundRecord>
        },
      })
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
    orderComplete(order_id) {
      console.log(order_id)
      let d = {}
      d.order_id = order_id
      $utils.api.load('orderComplete', d, 'post', { toast: true, toasterror: true })
    },
    orderRefund(order_id) {
      console.log(order_id)
      let d = {}
      d.order_id = order_id
      $utils.api.load('orderRefund', d, 'post', { toast: true, toasterror: true })
    },
    orderRefundLine(currentRow) {
      let order_id = currentRow.order_id
      let order_money = currentRow.order_money
      let order_device_money = currentRow.order_device_money
      let order_real_money = currentRow.order_real_money
      let order_pay = currentRow.order_pay
      let refund_total_money = currentRow.refund_money
      let refund_type= 1
      let refund_money= ''
      let refund_remark= ''
      this.$Modal.warning({
        title: '订单再次退款',
        okText: '取消退款',
        closable: true,
        render: (h) => {
          return (<div style={{padding: '0px'}}>
            <Row style={{margin: '5px'}}>{`实际支付金额: ${order_pay} 元`}</Row>
            <Row style={{margin: '5px'}}>{`总骑行费用: ${order_device_money} 元`}</Row>
            <Row style={{margin: '5px'}}>{`实际总消费金额: ${order_real_money} 元`}</Row>
            <Row style={{margin: '5px'}}>{`已退款总金额: ${refund_total_money} 元`}</Row>
            <Row style={{margin: '5px'}}>{`退款类型:  `}
              <i-select value={refund_type} style={{width: '260px', 'margin-left': '5px'}} placeholder='请选择退款类型' {...{ on: { 'on-change': (val) => {refund_type = val} } }}>
                <i-option value={1}>{'预付金退款'}</i-option>
                <i-option value={2}>{'骑行订单退款'}</i-option>
                <i-option value={3}>{'非定点还车退款'}</i-option>
                <i-option value={4}>{'超区调度费退款'}</i-option>
              </i-select></Row>
            <Row style={{margin: '5px'}}>{`退款金额: `}<InputNumber style={{width: '260px', 'margin-left': '5px'}} value={refund_money} autofocus={true} placeholder='请输入退款金额' min={0} max={order_pay} {...{ on: { 'input': (val) => {refund_money = val} } }}></InputNumber></Row>
            <Row style={{margin: '5px'}}>{`退款备注: `}<Input style={{width: '260px', 'vertical-align': 'top', 'margin-left': '5px'}} value={refund_remark} type={'textarea'} placeholder='请输入退款备注内容'{...{ on: { 'input': (val) => {refund_remark = val} } }}></Input></Row>
            <Row style={{height: '20px'}}></Row>
            <Row style={{'flex-direction': 'row-reverse', 'margin-right':'-3px'}}>
            <Poptip confirm={true} title="确认退款吗？请核对退款信息" {...{ on: { 'on-ok': () => {
                  console.log('', refund_money, refund_type, refund_remark)
                  if (!refund_type) {
                    $utils.toast.error('请选择退款类型')
                    return false
                  }
                  if (refund_money <= 0 || refund_money > order_pay) {
                    $utils.toast.error('退款金额不正确')
                    return false
                  }
                  let q = {}
                  q.order_id = order_id
                  q.type = refund_type
                  q.money = refund_money
                  q.remark = refund_remark || ''
                  $utils.api
                    .load('orderRefundLine', q, 'post', { toast: true, toasterror: true })
                    .then((res) => {
                      // $utils.toast.text(res.message)
                      if (res.status) {
                        this.search()
                      }
                    })
                    .catch(() => {
                      $utils.toast.error('请求错误')
                    })
                  Modal.remove()
                }} }}>
                <Button type="error" style={{ margin: '4px 5px' }}>
                  确认退款
                </Button>
              </Poptip>
            </Row>
          </div>)
        },
      })
    },
    onAddressChange(val) {
      console.log('onAddressChange', val)
      this.query.province_code = val.province.code
      this.query.city_code = val.city.code
      this.query.district_code = val.area.code
    },
  },
}
</script>
