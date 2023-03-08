<script>
import baseList from '@/views/components/base/baseList.vue'
import { Button } from 'view-design'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: 'msg',
        key: 'id',
        url: {},
        output: false,
      },
      menus: [
        { label: '车辆列表', name: 'device_list', auth: '/admin/device/lists' },
        { label: '产品列表', name: 'product_list', auth: '/admin/product/lists' },
        // { label: '产品分类', name: 'product_class_list', auth: '/admin/productclass/lists' },
        { label: '操作记录', name: 'msg_list', auth: '/admin/msg/lists' },
      ],
      currentRow: null,
      actions: [],
      query: {},
      filters: [
        { label: '订单号', name: 'order_no', value: '', type: 'input' },
        { label: '客户端ID', name: 'client_id', value: '', type: 'input' },
        { label: '指令码', name: 'action_name', value: '', type: 'input' },
        { label: '中控码', name: 'imei', value: '', type: 'input' },
        { label: '车辆编号', name: 'device_no', value: '', type: 'input' },
        {
          label: '操作动作',
          name: 'action_name',
          value: '',
          type: 'select',
          multiple: true,
          dropList: [
            { value: 'OPEN_LOCK,cmd_301,cmd_307', name: '开锁' },
            { value: 'CLOSE_LOCK,cmd_102', name: '关锁' },
            { value: 'cmd_102', name: '手动关锁' },
            { value: 'CHECK_LOCK,cmd_201', name: '检查锁状态' },
            { value: 'FIND_DEVICE', name: '语音寻车' },
            { value: 'UPDATE_FIRMWARE', name: '更新车辆固件' },
            { value: 'NOW_LOCATION,NOW_GPS', name: '立即定位' },
            { value: 'PAUSE_LOCK', name: '临时锁车' },
            { value: 'PAUSE_UNLOCK', name: '临时开锁' },
            { value: 'RELOGIN', name: '重新登录' },
            { value: 'RESTART', name: '重新启动' },
            { value: 'PLAY_VOICE_PRE_OUTZONE', name: '播报即将超区语音' },
            { value: 'PLAY_VOICE_OUTZONE', name: '播报超区语音' },

            { value: 'cmd_101,cmd_02,cmd_11', name: '定位' },
            { value: 'cmd_999,cmd_01', name: '登录' },
            { value: 'cmd_100,cmd_05', name: '心跳' },
            { value: 'cmd_04', name: '告警' },
          ],
        },
        {
          label: '过滤心跳',
          name: 'is_heartbeat',
          value: '',
          type: 'select',
          dropList: [
            { value: '', name: '全部显示' },
            { value: 1, name: '不显示心跳' },
          ],
        },
        {
          label: '指令方式',
          name: 'cmd_style',
          value: '',
          type: 'select',
          dropList: [
            { value: '', name: '全部方式' },
            { value: 1, name: '指令下发' },
            { value: 2, name: '设备上报' },
            { value: 3, name: 'APP上报' },
          ],
        },
      ],
      tableCols: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            const row = params.row
            const l0 = `指令名称: ${row.action_cmd || ''}`
            const l1 = `消息内容: ${row.data || ''}`
            const l2 = `内容字符: ${row.body_str || ''}`
            const l3 = `响应内容: ${row.responseData || ''}`
            const l4 = `备注内容: ${row.remark || ''}`
            return (
              <div style={{ margin: '4px 0', 'font-size': '12px', 'text-align': 'left' }}>
                <div style={{ margin: '0', color: '#cc9900' }}>{l0}</div>
                <div style={{ margin: '0', color: '#ff9900' }}>{l1}</div>
                {row.body_str ? <div style={{ margin: '0', color: '#ff4400' }}>{l2}</div> : ''}
                {row.responseData ? <div style={{ margin: '0', color: '#19be6b' }}>{l3}</div> : ''}
                {row.remark ? <div style={{ margin: '0', color: '#50be6b' }}>{l4}</div> : ''}
              </div>
            )
          },
        },
        {
          title: 'ID',
          width: 100,
          align: 'left',
          key: 'id',
        },
        {
          title: '操作动作',
          minWidth: 130,
          align: 'center',
          key: 'action_name',
        },
        {
          title: '指令方式',
          minWidth: 110,
          align: 'center',
          key: 'cmd_style_name',
          render: (h, params) => {
            const row = params.row
            let text = row.cmd_style_name
            let color = ''
            switch (row.cmd_style) {
              case 1:
                color = '#ff9900'
                break
              case 2:
                color = '#19be6b'
                break
              case 3:
                color = '#ff4400'
                break
              default:
                break
            }
            return <div style={{ margin: '0', color: color }}>{text}</div>
          },
        },
        {
          title: '车辆编号',
          minWidth: 110,
          align: 'center',
          copy: true,
          key: 'device_no',
        },
        {
          title: '操作时间',
          align: 'center',
          key: 'create_time',
          width: 170,
        },
        {
          title: '执行结果',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let l1 = `${row.msg1 || ''}`
            let l2 = `${row.msg2 || ''}`
            let l3 = `${row.msg3 || ''}`
            let l4 = `${row.msg4 || ''}`
            if (!row.msg1) {
              l1 = ''
            }
            if (!row.msg2) {
              l2 = ''
            }
            if (!row.msg3) {
              l3 = ''
            }
            if (!row.msg4) {
              l4 = ''
            }
            return (
              <div style={{ margin: '4px 0', 'font-size': '12px', 'text-align': 'left' }}>
                {row.msg1 ? <div style={{ margin: '0', color: '#19be6b' }}>{l1}</div> : ''}
                {row.msg2 ? <div style={{ margin: '0', color: '#ff9900' }}>{l2}</div> : ''}
                {row.msg3 ? <div style={{ margin: '0', color: '#19be6b' }}>{l3}</div> : ''}
                {row.msg4 ? <div style={{ margin: '0', color: '#ff9900' }}>{l4}</div> : ''}
              </div>
            )
          },
        },
        {
          title: '操作用户',
          key: 'user_nick',
          minWidth: 120,
        },
        {
          title: '关联订单号',
          width: 180,
          align: 'center',
          copy: true,
          key: 'order_no',
        },
        {
          title: '中控IMEI',
          minWidth: 160,
          copy: true,
          key: 'imei',
        },
        {
          title: '客户端ID',
          minWidth: 200,
          copy: true,
          key: 'client_id',
        },
        // {
        //   title: '操作用户手机',
        //   key: 'user_mobile',
        //   minWidth: 150,
        // },
        // {
        //   title: '消息内容',
        //   minWidth: 350,
        //   key: 'data',
        // },
        // {
        //   title: '响应内容',
        //   minWidth: 250,
        //   key: 'responseData',
        // },
        // {
        //   title: '内容字符串',
        //   minWidth: 300,
        //   key: 'body_str',
        // },
      ],
    }
  },
  created() {
    let query = this.$route.query
    if (query.uid) {
      // 设置查询参数
      this.query.uid = query.uid
    }
    if (query.device_no) {
      // 设置查询参数
      this.query.device_no = query.device_no
    }
    console.log('query', this.query)
  },
  methods: {
    toDevice(row) {
      let device_no = row.device_no
      $utils.url.push({ name: 'device_list', query: { device_no: row.device_no } })
    },
  },
}
</script>
