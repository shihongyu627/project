<script>
import baseList from '@/views/components/base/baseList.vue'
import MapLocation from './mapLocation'
import Battery from './battery'
import BoxControl from './boxControl.vue'
import { Tag, Button, Input, Tooltip, Poptip } from 'view-design'
export default {
  extends: baseList,
  components: {
    Battery,
    MapLocation,
    BoxControl,
  },
  data() {
    return {
      table: {
        mname: 'device',
        key: 'id',
        url: {},
        output: false,
      },
      recharge_money: 0,
      recharge_content: '',
      currentRow: null,
      menus: [
        { label: '车辆列表', name: 'device_list', auth: '/admin/device/lists' },
        { label: '产品列表', name: 'product_list', auth: '/admin/product/lists' },
        // { label: '产品分类', name: 'product_class_list', auth: '/admin/productclass/lists' },
        { label: '操作记录', name: 'msg_list', auth: '/admin/msg/lists' },
      ],
      actions: [
        { label: '新建车辆', icon: 'md-add', onClick: this.toAdd, auth: '/admin/device/add' },
        { label: '车辆投放', icon: 'logo-dropbox', type: 'success', onClick: this.toSwap, auth: '/admin/device/edit' },
        { label: '远程控制', icon: 'md-paper-plane', type: 'info', onClick: this.toControl, auth: '/admin/device/edit' },
        { label: '固件升级', icon: 'md-cloud-download', type: 'warning', onClick: this.toUpdate, auth: '/admin/device/edit' },
        { label: '同步车辆', icon: 'md-refresh', type: 'error', onClick: this.toRefresh, auth: '/admin/device/edit' },
        { label: '同步MQTT', icon: 'md-refresh', type: 'error', onClick: this.toRefreshMqtt, auth: '/admin/device/edit' },
      ],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '车辆数据', 0), auth: '/admin/device/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '车辆数据', 1), auth: '/admin/device/lists' },
      ],
      query: {},
      filters: [
        { label: '车辆编号', name: 'device_no', value: '', type: 'input' },
        { label: '设备号', name: 'imei', value: '', type: 'input' },
        // { label: '区域名称', name: 'shop_store_name', value: '', type: 'input' },
        { label: '区域', name: 'store_id', value: '', type: 'select', dropList: [] },
        { label: '商家', name: 'shop_id', value: '', type: 'select', dropList: [], onChange: this.shopChange.bind(this) },
        { label: '产品', name: 'product_id', value: '', type: 'select', dropList: [] },
        {
          label: '车辆类型',
          name: 'type',
          value: '',
          type: 'select',
          dropList: [
            { value: 1, name: '单车常规款' },
            { value: 3, name: '单车智能款' },
            { value: 2, name: '电动车智能款' },
          ],
          noshow: 'shop',
        },
        {
          label: '中控类型',
          name: 'lot_name',
          value: '',
          type: 'select',
          dropList: [
            { value: 'lot_a', name: '天津安中-单车' },
            { value: 'lot_c', name: '深圳泰比特' },
            { value: 'lot_d', name: '深圳云咖' },
            { value: 'lot_e', name: '武汉小安' },
          ],
        },
        {
          label: '骑行状态',
          name: 'run_status',
          value: '',
          type: 'select',
          dropList: [
            { value: '0', name: '未骑行' },
            { value: '1', name: '骑行中' },
          ],
        },
        {
          label: '超区状态',
          name: 'in_run_area',
          value: '',
          type: 'select',
          dropList: [
            { value: '1', name: '未超区' },
            { value: '0', name: '已超区' },
          ],
        },
        {
          label: '车锁状态',
          name: 'lock_status',
          value: '',
          type: 'select',
          dropList: [
            { value: '0', name: '关锁' },
            { value: '1', name: '开锁' },
          ],
        },
        {
          label: '在线状态',
          name: 'online_status',
          value: '',
          type: 'select',
          dropList: [
            { value: '0', name: '离线' },
            { value: '1', name: '在线' },
          ],
        },
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
          title: '车辆编号',
          minWidth: 100,
          key: 'device_no',
          copy: true,
        },
        {
          title: '车辆型号',
          minWidth: 120,
          key: 'product_name',
        },
        {
          title: '车辆类型',
          width: 125,
          align: 'left',
          key: 'type_name',
        },
        {
          title: '商家名称',
          minWidth: 100,
          key: 'shop_name',
          render: (h, params) => {
            const row = params.row
            const text = row.shop && row.shop.shop_name
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '投放区域',
          minWidth: 120,
          key: 'store_name',
          render: (h, params) => {
            const row = params.row
            const text = row.store && row.store.store_name
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '设备号',
          minWidth: 120,
          align: 'center',
          key: 'imei',
          copy: true,
        },
        {
          title: '二维码',
          key: 'device_qrcode_img',
          width: 130,
          align: 'center',
          viewimage: true,
        },
        {
          title: '骑行次数',
          minWidth: 120,
          align: 'center',
          key: 'order_count',
          // sortable: 'custom',
        },
        {
          title: '车锁状态',
          key: 'lock_status',
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            const row = params.row
            let color = row.lock_status !== 1 ? '#eee' : 'success'
            let status = row.lock_status !== 1 ? '#eee' : 'success'
            let text = row.lock_status === 0 ? '关闭' : row.lock_status === 1 ? '打开' : ''
            if (row.lock_status == 0) {
              color = 'warning'
              status = 'warning'
            }
            if (row.lock_status == 1) {
              color = 'success'
              status = 'success'
            }
            if (row.lock_status == 10) {
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
          title: '车辆编号',
          minWidth: 100,
          key: 'device_no',
          copy: true,
        },
        {
          title: '车辆位置',
          minWidth: 220,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let lnglat = ''
            if (row.lng && row.lat) {
              lnglat = row.lng + ',' + row.lat
            }
            const l1 = `GPS信号: ${row.gps_s || ''}`
            const l2 = `经纬度值: ${lnglat}`
            const l3 = `末次定位: ${row.location_time || ''}`
            const l4 = `当前位置: ${row.address || ''}`
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
          title: '中控信息',
          key: 'battery_iv',
          minWidth: 220,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let b_ir = ''
            if (row.battery_ir || row.battery_iv) {
              b_ir = (parseFloat(row.battery_ir) ? row.battery_ir + '' : '') + '  -   ' + (parseFloat(row.battery_iv) ? row.battery_iv + 'V' : '')
            }
            let b_or = ''
            if (row.battery_or || row.battery_ov) {
              b_or = (parseFloat(row.battery_or) ? row.battery_or + '' : '') + '  -   ' + (parseFloat(row.battery_ov) ? row.battery_ov + 'V' : '')
            }
            const l1 = ` 电量内置: ${b_ir || ''}`
            const l2 = ` 电量外接: ${b_or || ''}`
            const l3 = ` 剩余里程: ${(row.mileage ? row.mileage + 'km' : row.mileage) || '-'}`
            const l4 = ` 软件版本: ${row.software_version || ''}`
            const l5 = ` 硬件版本: ${row.hardware_version || ''}`
            return (
              <div onClick={() => this.toBattery(row)} style={{ cursor: 'pointer', margin: '4px 0', 'font-size': '12px', 'text-align': 'left' }}>
                <div style={{ margin: '0', color: '#19be6b' }}>{l1}</div>
                <div style={{ margin: '0', color: '#ff9900' }}>{l2}</div>
                <div style={{ margin: '0', color: '#ff6600' }}>{l3}</div>
                <div style={{ margin: '0', color: '#ff2200' }}>{l4}</div>
                <div style={{ margin: '0', color: '#324563' }}>{l5}</div>
              </div>
            )
          },
        },
        {
          title: '车辆时间',
          key: 'ping_time',
          minWidth: 220,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const l1 = ` 心跳时间: ${row.ping_time || ''}`
            const l2 = ` 绑定时间: ${row.bind_time || ''}`
            const l3 = ` 解绑时间: ${row.unbind_time || ''}`
            const l4 = ` 创建时间: ${row.create_time || ''}`
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
          title: '在线状态',
          key: 'online_status',
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            const row = params.row
            let color = row.online_status !== 1 ? '#eee' : 'success'
            let status = row.online_status !== 1 ? '#eee' : 'success'
            let text = row.online_status_name
            let offline_reason = row.device_mqtt_offline_reason || '' // 离线原因
            let offline_time = row.device_mqtt_offline_time || '' // 离线原因
            if (row.online_status == 0) {
              color = 'error'
              status = 'error'
            }
            if (row.online_status == 1) {
              color = 'success'
              status = 'success'
            }
            if (row.online_status == 2) {
              color = 'warning'
              status = 'warning'
            }
            return (
              <Tooltip placement={'top'} disabled={offline_reason ? false : true}>
                <div slot="content">
                  <p>离线原因：{offline_reason}</p>
                  <p>离线时间：{offline_time}</p>
                </div>
                <Tag type="dot" color={color} text={text} status={status}>
                  {text}
                </Tag>
              </Tooltip>
            )
            // return h(
            //   'Tag',
            //   {
            //     props: {
            //       type: 'dot',
            //       text: text,
            //       color: color,
            //       status: status,
            //     },
            //   },
            //   text
            // )
          },
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 80,
          switch: true,
          disabled: false,
          auth: '/admin/order/edit',
        },
        {
          title: '客户端ID',
          minWidth: 150,
          copy: true,
          key: 'client_id',
        },

        {
          title: '车辆名称',
          key: 'name',
          minWidth: 150,
          align: 'left',
        },
        {
          title: '车辆图片',
          key: 'image',
          width: 120,
          align: 'center',
          viewimage: true,
        },
        {
          title: '中控类型',
          key: 'lot_name_name',
          minWidth: 140,
          align: 'center',
        },
        {
          title: 'BMS检测',
          key: 'is_bms',
          minWidth: 140,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            return <span>{row.is_bms ? '是' : '-'}</span>
          },
        },
        {
          title: '是否骑行',
          key: 'run_status',
          width: 100,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            return <span>{row.run_status ? '是' : '-'}</span>
          },
        },
        {
          title: '是否超区',
          key: 'in_run_area',
          width: 100,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            return <span>{row.in_run_area ? '-' : '是'}</span>
          },
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          key: 'handle',
          fixed: 'right',
          handle: [
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/order/lists' }]
              return (
                <Button {...{ directives }} size="small" onClick={() => this.toOrder(currentRow)} type="warning" style={{ margin: '4px 5px' }}>
                  订单
                </Button>
              )
            },
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/device/edit' }]
              return (
                <Button {...{ directives }} size="small" onClick={() => this.toUpdate(currentRow)} type="error" style={{ margin: '4px 5px' }}>
                  升级
                </Button>
              )
            },
            'sync',
            'edit',
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/device/edit' }]
              return (
                <Button {...{ directives }} size="small" onClick={() => this.controlBtn(currentRow)} type="info" style={{ margin: '4px 5px' }}>
                  控制
                </Button>
              )
            },
            (vm, h, currentRow, param) => {
              let directives = [{ name: 'auth', value: '/admin/msg/lists' }]
              return (
                <Button {...{ directives }} size="small" onClick={() => this.toMsg(currentRow)} type="warn" style={{ margin: '4px 5px' }}>
                  记录
                </Button>
              )
            },
            // "delete",
          ],
          auth: {
            del: '/admin/device/del',
            edit: '/admin/device/edit',
            sync: '/admin/device/sync',
          },
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
    toSwap(row = {}) {
      $utils.url.push({ name: 'device_swap', query: {} })
    },
    toUpdate(row = {}) {
      $utils.url.push({ name: 'device_update', query: {} })
    },
    toControl(row = {}) {
      $utils.url.push({ name: 'device_control', query: {} })
    },
    toOrder(row = {}) {
      let device_no = row.device_no
      $utils.url.push({ name: 'order_list', query: { device_no: device_no } })
    },
    toMsg(row = {}) {
      let device_no = row.device_no
      let routeData = this.$router.resolve({ name: 'msg_list', query: { device_no: device_no } })
      window.open(routeData.href, '_blank')
    },
    toRefresh() {
      //刷新车辆
      this.$Modal.confirm({
        title: '同步车辆数据',
        content: '同步所有车辆的数据，耗时比较久，大约需要两分钟，请不要频繁刷新使用',
        onOk: () => {
          let d = {}
          $utils.toast.warn('正在刷新，请等待')
          // $utils.api.load('refreshDevice', d, 'post', { toast: true, toasterror: false })
        },
      })
    },
    toRefreshMqtt() {
      //刷新车辆
      this.$Modal.confirm({
        title: '同步MQTT通讯数据',
        content: '同步MQTT通讯车辆的数据，耗时比较久，请不要频繁刷新使用',
        onOk: () => {
          let d = {}
          $utils.toast.warn('正在刷新，请等待')
          $utils.api.load('refreshMqttDevice', d, 'post', { toast: true, toasterror: false })
        },
      })
    },
    controlBtn(row) {
      let isMqtt = row.lot_tcp == 'mqtt' ? true : false
      let mqttClientId = row.imei || ''
      let device_no = row.device_no || ''
      // 弹窗进行操作控制
      this.$Modal.info({
        title: device_no + '设备控制',
        okText: '关闭',
        render: (h) => {
          return <BoxControl device_ids={row.id} device_no={device_no} isMqtt={isMqtt} mqttClientId={mqttClientId}></BoxControl>
        },
      })
    },
    toUpDevice(row) {
      let d = {}
      d.device_id = row.id
      d.lat = row.lng
      d.lng = row.lat
      d.location_time = row.location_time
      $utils.api.load('mapUpLocation', d, 'post', { toast: true, toasterror: false })
    },
    // 商家选择改变-设置区域下拉列表
    shopChange(val) {
      console.log(val)
      this.loadFiltersFieldDrop('shop_store', 'store_id', { shop_id: val })
    },
    toMap(row) {
      // TO_DO弹窗处理
      this.$Modal.info({
        title: '车辆' + row.device_no + '末次定位位置',
        width: 720,
        render: (h) => {
          return <MapLocation lng={row.lng} lat={row.lat} device_no={row.device_no} store_id={row.store_id} style={{ margin: '0', color: '#19be6b' }}></MapLocation>
        },
      })
    },
    toBattery(row) {
      // TO_DO弹窗处理
      let title = '车辆' + row.device_no + ' 电量曲线'
      this.$Modal.info({
        title: title,
        width: 720,
        render: (h) => {
          return <Battery device_id={row.id} device_no={row.device_no} device_type={row.type} title={title} style={{ margin: '0', color: '#19be6b' }}></Battery>
        },
      })
    },
  },
}
</script>
