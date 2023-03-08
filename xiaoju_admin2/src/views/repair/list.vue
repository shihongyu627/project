<script>
import baseList from '@/views/components/base/baseList.vue'
import { Tag, Button } from 'view-design'
import Vue from 'vue'
import Info from './info.vue'
import Deal from './deal'
Vue.component('deal', Deal)
export default {
  extends: baseList,
  components: {
    info: Info,
  },
  data() {
    return {
      table: {
        mname: 'repair',
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
        //   auth: '/admin/repair/add',
        // },
      ],
      query: {},
      filters: [
        {
          label: '处理状态',
          name: 'status',
          value: '',
          type: 'select',
          dropList: [
            { value: 1, name: '待处理' },
            { value: 2, name: '处理中' },
            { value: 10, name: '已处理' },
          ],
        },
        {
          label: '故障部件',
          name: 'title',
          value: '',
          type: 'select',
          dropList: [
            { value: '刹车异常', name: '刹车异常' },
            { value: '方向盘故障', name: '方向盘故障' },
            { value: '轮胎没气', name: '轮胎没气' },
            { value: '链条脱落', name: '链条脱落' },
            { value: '车锁破坏', name: '车锁破坏' },
            { value: '二维码损坏', name: '二维码损坏' },
            { value: '车座损坏', name: '车座损坏' },
            { value: '脚踏损坏', name: '脚踏损坏' },
            { value: '车锁打不开', name: '车锁打不开' },
            { value: '车没电了', name: '车没电了' },
            { value: '车辆不走', name: '车辆不走' },
            { value: '付款锁没开', name: '付款锁没开' },
            { value: '无法关锁', name: '无法关锁' },
            { value: '关锁后订单还在计费', name: '关锁后订单还在计费' },
            { value: '其他部位', name: '其他部位' },
          ],
        },
        { label: '故障内容', name: 'content', value: '', type: 'input' },
        { label: '车辆编号', name: 'device_no', value: '', type: 'input' },
        { label: '订单编号', name: 'order_no', value: '', type: 'input' },
        { label: '区域', name: 'store_id', value: '', type: 'select', dropList: [] },
        { label: '商家', name: 'shop_id', value: '', type: 'select', dropList: [], onChange: this.shopChange.bind(this) },
      ],
      menus: [
        { label: '用户报障车辆', name: 'repair_list', auth: '/admin/repair/lists' },
        { label: '异常车辆', name: 'exception_list', auth: '/admin/exception/lists' },
      ],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '用户报障车辆', 0), auth: '/admin/device/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '用户报障车辆', 1), auth: '/admin/device/lists' },
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
          title: '故障部件',
          key: 'title',
          minWidth: 150,
          render: (h, params) => {
            const row = params.row
            const text = row.title || ''
            const t_arr = text.split(',') || []
            return t_arr.map((item) => <Tag color="red">{item}</Tag>)
          },
        },
        {
          title: '故障内容',
          key: 'content',
          minWidth: 150,
          render: (h, params) => {
            const row = params.row
            const text = row.content
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '报修地点',
          minWidth: 120,
          key: 'address_info',
          render: (h, params) => {
            const row = params.row
            const text = row.address_info
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '截图',
          key: 'gallery',
          minWidth: 120,
          align: 'center',
          viewimages: true,
        },
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
          title: '处理进度',
          align: 'center',
          key: 'action_name',
          width: 120,
        },
        {
          title: '状态',
          align: 'center',
          key: 'status_name',
          fixed: 'right',
          width: 100,
        },
        {
          title: '提交时间',
          align: 'center',
          key: 'create_time',
          width: 170,
        },
        {
          title: '关联订单号',
          width: 180,
          align: 'center',
          copy: true,
          key: 'order_no',
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
          handle: [
            (vm, h, currentRow, param) => {
              const row = param.row
              let directives = [{ name: 'auth', value: '/admin/repair/deal' }]
              return row.status != 10 ? (
                <Button {...{ directives }} size="small" onClick={this.dealModel.bind(this, row)} type="warning" style={{ margin: '4px 5px' }}>
                  处理
                </Button>
              ) : (
                ''
              )
            },
            'info',
          ],
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
    dealModel(row) {
      let vvvv = ''
      let aaaa = ''
      this.$Modal.confirm({
        render: (h) => {
          return (
            <Deal
              style={{ margin: '0', color: '#19be6b' }}
              onGetAction={(val) => {
                vvvv = val
                console.log('getAction', vvvv)
              }}
              onGetcontent={(val) => {
                aaaa = val
                console.log('getcontent', aaaa)
              }}
            ></Deal>
          )
        },
        onOk: () => {
          this.confirm(row.id, vvvv, aaaa)
        },
      })
    },
    confirm(id, action, content) {
      console.log(id, action, '1111')
      let q = {}
      q.repair_id = id
      q.action = action
      q.text = content
      console.log(q)
      if (q.repair_id == '' || q.action == '' || q.text == '') {
        return $utils.toast.error('请求数据错误')
      }
      $utils.api
        .load('repairRecordAdd', q)
        .then((res) => {
          $utils.toast.text(res.message)
          if (res.status) {
            this.search()
          }
        })
        .catch((e) => {
          console.log(e)
          this.$set(this.pass, 'sloading', false)
          $utils.toast.error('数据异常')
        })
    },
    // 商家选择改变-设置区域下拉列表
    shopChange(val) {
      console.log(val)
      this.loadFiltersFieldDrop('shop_store', 'store_id', { shop_id: val })
    },
  },
}
</script>
